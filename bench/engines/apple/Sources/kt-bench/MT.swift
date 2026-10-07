// apple-mt-plain / apple-mt-attr: Translation framework via TranslationSession(installedSource:target:), no UI.
import Foundation
import Translation

enum MTMode: Sendable { case plain, attr }
enum StrategyChoice: String, Sendable { case none = "", highFidelity = "highfidelity", lowLatency = "lowlatency" }

struct NeedsLanguagePack: Error { var lang: String }

/// Custom attribute carrying the slot id (>=0 for t slots, -(n+1) for x items) through the translator.
enum SlotIDKey: AttributedStringKey {
    typealias Value = Int
    static let name = "kt.slotID"
}
typealias SkipKey = AttributeScopes.TranslationAttributes.SkipTranslationAttribute

func makeSession(lang: String, strategy: StrategyChoice) -> TranslationSession {
    let src = Locale.Language(identifier: lang)
    let tgt = Locale.Language(identifier: "ko")
    switch strategy {
    case .none: return TranslationSession(installedSource: src, target: tgt)
    case .highFidelity: return TranslationSession(installedSource: src, target: tgt, preferredStrategy: .highFidelity)
    case .lowLatency: return TranslationSession(installedSource: src, target: tgt, preferredStrategy: .lowLatency)
    }
}

final class MTStats {
    var attrBlocks = 0, attrSlotIDSeen = 0, attrAllSlots = 0, attrXSkipSeen = 0, attrXTextKept = 0, attrFallback = 0
    var attrTargetNil = 0
    var firstFailure = ""
}

func translateRun(_ session: TranslationSession, _ text: String, lang: String) async throws -> String {
    let lead = String(text.prefix(while: { $0.isWhitespace }))
    let trail = String(text.reversed().prefix(while: { $0.isWhitespace }).reversed())
    let core = text.trimmingCharacters(in: .whitespacesAndNewlines)
    if core.isEmpty || !hasLetters(core) { return text }
    let r = try await session.translate(core)
    return lead + r.targetText + trail
}

func plainBlock(_ session: TranslationSession, _ b: Block, lang: String) async throws -> [String: String] {
    var slots: [String: String] = [:]
    for run in runs(of: b) {
        let out = try await translateRun(session, run.text, lang: lang)
        for (n, s) in run.slots.enumerated() { slots[String(s)] = n == 0 ? out : "" }
    }
    return slots
}

func attrBlock(_ session: TranslationSession, _ b: Block, lang: String, stats: MTStats) async throws -> [String: String] {
    let tItems = b.slotItems
    if !tItems.contains(where: { hasLetters($0.text) }) {
        return Dictionary(uniqueKeysWithValues: tItems.compactMap { it in it.i.map { (String($0), it.text) } })
    }
    stats.attrBlocks += 1
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
    let resp = try await session.translate(src)
    guard let target = resp.attributedTargetText else {
        stats.attrTargetNil += 1; stats.attrFallback += 1
        return try await plainBlock(session, b, lang: lang)
    }
    var byId: [Int: String] = [:]
    var skipSeen = false
    for run in target.runs {
        if let id = run[SlotIDKey.self] {
            byId[id, default: ""] += String(target[run.range].characters)
        }
        if run[SkipKey.self] == true { skipSeen = true }
    }
    if byId.keys.contains(where: { $0 >= 0 }) || byId.keys.contains(where: { $0 < 0 }) { stats.attrSlotIDSeen += 1 }
    if skipSeen { stats.attrXSkipSeen += 1 }
    let targetStr = String(target.characters)
    let xItems = b.items.filter { $0.k == "x" }
    let xKept = xItems.allSatisfy { targetStr.contains($0.text) }
    if xKept { stats.attrXTextKept += 1 }
    let need = tItems.filter { hasLetters($0.text) }.compactMap { $0.i }
    let allSlots = need.allSatisfy { byId[$0] != nil }
    if allSlots { stats.attrAllSlots += 1 }
    if allSlots && xKept {
        var slots: [String: String] = [:]
        for it in tItems { if let i = it.i { slots[String(i)] = byId[i] ?? it.text } }
        return slots
    }
    stats.attrFallback += 1
    if stats.firstFailure.isEmpty {
        stats.firstFailure = "block \(b.id): slotIds=\(byId.keys.sorted()) xKept=\(xKept) target=\(targetStr.prefix(80))"
    }
    return try await plainBlock(session, b, lang: lang)
}

func runMT(engine: String, mode: MTMode, strategy: StrategyChoice, corpus: Corpus, runNo: Int) async -> RunResult {
    let lang = corpus.lang
    let limit = BatchLimit(chars: 6000, blocks: 40)
    var result = RunResult(engine: engine, model: "apple-translation", lang: lang, run: runNo, batchLimit: limit,
                           coldMs: 0, totalMs: 0, blocks: [], batches: [],
                           env: Env(keepAliveSec: nil, notes: "", os: osString()), error: nil)
    let avail = await LanguageAvailability().status(from: Locale.Language(identifier: lang), to: Locale.Language(identifier: "ko"))
    switch avail {
    case .installed: break
    case .supported: result.error = "needs_language_pack:\(lang)"; return result
    case .unsupported: result.error = "unsupported_pair:\(lang)"; return result
    @unknown default: result.error = "unknown_availability:\(lang)"; return result
    }
    let session = makeSession(lang: lang, strategy: strategy)
    let stats = MTStats()
    let clock = ContinuousClock()
    let total = clock.now
    var first = true
    for batch in makeBatches(corpus.blocks, maxChars: limit.chars, maxBlocks: limit.blocks) {
        var partial: [(String, [String: String]?, String?)] = []
        let t0 = clock.now
        for b in batch {
            do {
                let s = mode == .plain ? try await plainBlock(session, b, lang: lang)
                                       : try await attrBlock(session, b, lang: lang, stats: stats)
                partial.append((b.id, s, nil))
            } catch {
                if case TranslationError.notInstalled = error {
                    result.error = "needs_language_pack:\(lang)"
                }
                partial.append((b.id, nil, "\(error)"))
            }
        }
        let bms = ms(clock.now - t0)
        if first { result.coldMs = bms; first = false }
        result.batches.append(BatchResult(blockIds: batch.map(\.id), ms: bms))
        for p in partial {
            result.blocks.append(BlockResult(id: p.0, ms: bms / Double(batch.count), slots: p.1, error: p.2))
        }
        if result.error != nil { break }
    }
    result.totalMs = ms(clock.now - total)
    var notes = "headless TranslationSession(installedSource:target:) used, no SwiftUI/translationTask; strategy=\(strategy == .none ? "default" : strategy.rawValue)."
    if mode == .attr {
        notes += " attr: blocks=\(stats.attrBlocks) customAttrSeen=\(stats.attrSlotIDSeen) allSlotsRecovered=\(stats.attrAllSlots) skipAttrSeenInTarget=\(stats.attrXSkipSeen) xTextKept=\(stats.attrXTextKept) targetAttrNil=\(stats.attrTargetNil) fallbackToRunSplit=\(stats.attrFallback)."
        if !stats.firstFailure.isEmpty { notes += " firstFallback: \(stats.firstFailure)" }
    } else {
        notes += " plain: x-split run translation (PLAN 4.4)."
    }
    result.env.notes = notes
    return result
}
