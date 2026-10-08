// apple-mt: Translation framework, headless TranslationSession(installedSource:target:). Ported from bench MT.swift.
// Never downloads language packs: not-installed pairs return needs_language_pack.
import Foundation
import Translation

/// Custom attribute carrying the slot id (>=0 for t slots, -(n+1) for x items) through the translator.
@available(macOS 26.4, *)
enum SlotIDKey: AttributedStringKey {
    typealias Value = Int
    static let name = "kt.slotID"
}
@available(macOS 26.4, *)
typealias SkipKey = AttributeScopes.TranslationAttributes.SkipTranslationAttribute

enum MTVariant: String, Sendable { case attr, plain, marker }

/// TranslationSession is not Sendable; it is only ever used by one translate() call at a time per engine call chain.
final class SessionBox: @unchecked Sendable {
    let session: TranslationSession
    init(_ s: TranslationSession) { session = s }
}

actor MTEngine {
    static let shared = MTEngine()
    private struct Entry { var box: SessionBox; var lastUse: ContinuousClock.Instant }
    private var sessions: [String: Entry] = [:]   // per source lang (target fixed ko), bounded by Limits.maxSessions
    private var idleTask: Task<Void, Never>?
    private static let availability = TTLCache<String>(ttl: .seconds(30))

    static func invalidateAvailability() async { await availability.invalidate() }

    /// Cached for 30s unless `fresh`; `fresh` still refreshes the cache entry.
    static func packStatus(_ lang: String, fresh: Bool = false) async -> String {
        if !fresh, let c = await availability.get(lang) { return c }
        let v = await queryPackStatus(lang)
        await availability.set(lang, v)
        return v
    }

    private static func queryPackStatus(_ lang: String) async -> String {
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
        let now = ContinuousClock.now
        if var e = sessions[lang] { e.lastUse = now; sessions[lang] = e; return e.box }
        if sessions.count >= Limits.maxSessions, let oldest = sessions.min(by: { $0.value.lastUse < $1.value.lastUse })?.key {
            sessions[oldest] = nil
        }
        let s = SessionBox(TranslationSession(installedSource: Locale.Language(identifier: lang),
                                              target: Locale.Language(identifier: "ko")))
        sessions[lang] = Entry(box: s, lastUse: now)
        startIdleReaper()
        return s
    }

    private func startIdleReaper() {
        guard idleTask == nil else { return }
        idleTask = Task { [weak self] in await self?.reapLoop() }
    }

    private func reapLoop() async {
        while !Task.isCancelled {
            try? await Task.sleep(nanoseconds: 5 * 1_000_000_000)
            let now = ContinuousClock.now
            sessions = sessions.filter { $0.value.lastUse.duration(to: now) < .seconds(Limits.idleSeconds) }
            if sessions.isEmpty { idleTask = nil; return }
        }
    }

    func releaseAllSessions() { sessions.removeAll() }

    func translate(blocks: [ProtoBlock], requestLang: String?, variant: MTVariant,
                   progress: ProgressBox? = nil) async throws -> [ProtoResult] {
        do {
            return try await translateInner(blocks: blocks, requestLang: requestLang, variant: variant, progress: progress)
        } catch is CancellationError {
            throw CancellationError()
        } catch {
            await Self.invalidateAvailability()
            throw error
        }
    }

    private func translateInner(blocks: [ProtoBlock], requestLang: String?, variant: MTVariant,
                                progress: ProgressBox?) async throws -> [ProtoResult] {
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
                try Task.checkCancellation()   // deadline hit: stop; completed blocks are in `progress`
                do {
                    let slots: [String: String]
                    switch variant {
                    case .attr:
                        // attr는 26.4+ 전용 API. 그 아래 버전에서는 기본 경로(marker)로 폴백 (PLAN §12.1).
                        if #available(macOS 26.4, *) { slots = try await attrBlock(s, b) }
                        else { slots = try await markerBlock(s, b) }
                    case .plain: slots = try await plainBlock(s, b)
                    case .marker: slots = try await markerBlock(s, b)
                    }
                    let r = ProtoResult(id: b.id, slots: slots)
                    results.append(r)
                    progress?.append(r)
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

    @available(macOS 26.4, *)
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

    // MARK: marker: whole block in one request, x items replaced by ⟦n⟧, split translation at the markers

    private nonisolated func markerBlock(_ box: SessionBox, _ b: ProtoBlock) async throws -> [String: String] {
        let k = b.items.filter { $0.k != "t" }.count
        if k == 0 { return try await plainBlock(box, b) }
        let tItems = b.slotItems
        if !tItems.contains(where: { hasLetters($0.text) }) {
            return Dictionary(uniqueKeysWithValues: tItems.compactMap { it in it.i.map { (String($0), it.text) } })
        }
        var src = "", n = 0
        var segs: [[Int]] = [[]]
        for it in b.items {
            if it.k == "t" {
                src += it.text
                if let i = it.i { segs[segs.count - 1].append(i) }
            } else {
                n += 1; src += "\u{27E6}\(n)\u{27E7}"; segs.append([])
            }
        }
        let lead = String(src.prefix(while: { $0.isWhitespace }))
        let trail = String(src.reversed().prefix(while: { $0.isWhitespace }).reversed())
        let r = try await box.session.translate(src.trimmingCharacters(in: .whitespacesAndNewlines))
        let target = lead + r.targetText + trail
        // every marker exactly once, in source order
        var pieces: [String] = []
        var rest = Substring(target)
        var valid = true
        for m in 1...k {
            let mk = "\u{27E6}\(m)\u{27E7}"
            guard target.components(separatedBy: mk).count == 2, let rg = rest.range(of: mk) else { valid = false; break }
            pieces.append(String(rest[rest.startIndex..<rg.lowerBound]))
            rest = rest[rg.upperBound...]
        }
        if valid {
            pieces.append(String(rest))
            // a non-blank piece in a segment without t slots cannot be placed
            let placeable = zip(pieces, segs).allSatisfy { !$0.1.isEmpty || $0.0.trimmingCharacters(in: .whitespaces).isEmpty }
            if placeable {
                var slots: [String: String] = [:]
                for (p, seg) in zip(pieces, segs) {
                    for (j, s) in seg.enumerated() { slots[String(s)] = j == 0 ? p : "" }
                }
                return slots
            }
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
