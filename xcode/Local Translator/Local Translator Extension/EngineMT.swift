// apple-mt: Translation framework, headless TranslationSession(installedSource:target:). Ported from bench MT.swift.
// Never downloads language packs: not-installed pairs return needs_language_pack.
import Foundation
import Translation

/// Custom attribute carrying the slot id (>=0 for t slots, -(n+1) for x items) through the translator.
enum SlotIDKey: AttributedStringKey {
    typealias Value = Int
    static let name = "kt.slotID"
}
typealias SkipKey = AttributeScopes.TranslationAttributes.SkipTranslationAttribute

enum MTVariant: String, Sendable { case attr, plain }

/// TranslationSession is not Sendable; it is only ever used by one translate() call at a time per engine call chain.
final class SessionBox: @unchecked Sendable {
    let session: TranslationSession
    init(_ s: TranslationSession) { session = s }
}

actor MTEngine {
    static let shared = MTEngine()
    private var sessions: [String: SessionBox] = [:]   // per source lang (target fixed ko)

    static func packStatus(_ lang: String) async -> String {
        let st = await LanguageAvailability().status(from: Locale.Language(identifier: lang),
                                                     to: Locale.Language(identifier: "ko"))
        switch st {
        case .installed: return "installed"
        case .supported: return "supported"
        case .unsupported: return "unsupported"
        @unknown default: return "unsupported"
        }
    }

    private func session(for lang: String) -> SessionBox {
        if let s = sessions[lang] { return s }
        let s = SessionBox(TranslationSession(installedSource: Locale.Language(identifier: lang),
                                              target: Locale.Language(identifier: "ko")))
        sessions[lang] = s
        return s
    }

    func translate(blocks: [ProtoBlock], requestLang: String?, variant: MTVariant) async throws -> [ProtoResult] {
        // Group by effective source language, keeping document order within each group.
        var byLang: [String: [ProtoBlock]] = [:]
        var order: [String] = []
        for b in blocks {
            guard let l = Langs.effective(block: b, requestLang: requestLang) else {
                throw EngineError(code: "unsupported_lang", message: "unsupported lang: \(b.lang ?? requestLang ?? "nil")")
            }
            if byLang[l] == nil { order.append(l) }
            byLang[l, default: []].append(b)
        }
        for l in order {
            switch await Self.packStatus(l) {
            case "installed": break
            case "supported": throw EngineError(code: "needs_language_pack", message: "language pack not installed: \(l)", lang: l)
            default: throw EngineError(code: "unsupported_lang", message: "unsupported pair: \(l)->ko", lang: l)
            }
        }
        var results: [ProtoResult] = []
        var firstError: Error?
        for l in order {
            let s = session(for: l)
            for b in byLang[l] ?? [] {
                do {
                    let slots = variant == .attr ? try await attrBlock(s, b) : try await plainBlock(s, b)
                    results.append(ProtoResult(id: b.id, slots: slots))
                } catch {
                    if case TranslationError.notInstalled = error {
                        sessions[l] = nil
                        throw EngineError(code: "needs_language_pack", message: "language pack not installed: \(l)", lang: l)
                    }
                    if firstError == nil { firstError = error }
                }
            }
        }
        // Per-block failures are omitted (JS keeps the original); total failure is an error.
        if results.isEmpty, !blocks.isEmpty, let e = firstError {
            throw EngineError(code: "unknown", message: "\(e)")
        }
        return results
    }

    // MARK: attributed translation with SlotID recovery

    private nonisolated func attrBlock(_ box: SessionBox, _ b: ProtoBlock) async throws -> [String: String] {
        let tItems = b.slotItems
        if !tItems.contains(where: { hasLetters($0.text) }) {
            return Dictionary(uniqueKeysWithValues: tItems.compactMap { it in it.i.map { (String($0), it.text) } })
        }
        var src = AttributedString()
        var xn = 0
        for it in b.items {
            var s = AttributedString(it.text)
            if it.k == "t", let i = it.i {
                s[SlotIDKey.self] = i
            } else {
                xn += 1
                s[SlotIDKey.self] = -xn
                s[SkipKey.self] = true
            }
            src.append(s)
        }
        let resp = try await box.session.translate(src)
        guard let target = resp.attributedTargetText else { return try await plainBlock(box, b) }
        var byId: [Int: String] = [:]
        for run in target.runs {
            if let id = run[SlotIDKey.self] { byId[id, default: ""] += String(target[run.range].characters) }
        }
        let targetStr = String(target.characters)
        let xKept = b.items.filter { $0.k != "t" }.allSatisfy { targetStr.contains($0.text) }
        let need = tItems.filter { hasLetters($0.text) }.compactMap { $0.i }
        let allSlots = need.allSatisfy { byId[$0] != nil }
        if allSlots && xKept {
            var slots: [String: String] = [:]
            for it in tItems { if let i = it.i { slots[String(i)] = byId[i] ?? it.text } }
            return slots
        }
        return try await plainBlock(box, b)   // run-splitting fallback
    }

    // MARK: plain: split at x items, translate each run of consecutive t slots

    private struct Run { var slots: [Int]; var text: String }

    private nonisolated func runs(of block: ProtoBlock) -> [Run] {
        var out: [Run] = []
        var cur = Run(slots: [], text: "")
        for it in block.items {
            if it.k == "t", let i = it.i {
                cur.slots.append(i); cur.text += it.text
            } else if !cur.slots.isEmpty {
                out.append(cur); cur = Run(slots: [], text: "")
            }
        }
        if !cur.slots.isEmpty { out.append(cur) }
        return out
    }

    private nonisolated func translateRun(_ box: SessionBox, _ text: String) async throws -> String {
        let lead = String(text.prefix(while: { $0.isWhitespace }))
        let trail = String(text.reversed().prefix(while: { $0.isWhitespace }).reversed())
        let core = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if core.isEmpty || !hasLetters(core) { return text }
        let r = try await box.session.translate(core)
        return lead + r.targetText + trail
    }

    private nonisolated func plainBlock(_ box: SessionBox, _ b: ProtoBlock) async throws -> [String: String] {
        var slots: [String: String] = [:]
        for run in runs(of: b) {
            let out = try await translateRun(box, run.text)
            for (n, s) in run.slots.enumerated() { slots[String(s)] = n == 0 ? out : "" }
        }
        return slots
    }
}
