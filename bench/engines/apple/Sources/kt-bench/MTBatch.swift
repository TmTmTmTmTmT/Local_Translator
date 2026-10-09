// apple-mt-marker-batch: all blocks of a batch sent in ONE session.translations(from:) call (marker semantics per block).
import Foundation
import Translation

/// One request per marker block (whole block with ⟦n⟧) or per x-split run for blocks without x items.
private struct Pending { var block: Int; var kind: Kind; var text: String; var lead: String; var trail: String
    enum Kind { case marker, run([Int]) } }

func markerBatch(_ session: TranslationSession, _ blocks: [Block], lang: String, stats: MarkerStats) async throws -> [(String, [String: String]?, String?)] {
    var out = [[String: String]](repeating: [:], count: blocks.count)
    var pend: [Pending] = []
    var needFallback = Set<Int>()
    for (bi, b) in blocks.enumerated() {
        let k = b.items.filter { $0.k == "x" }.count
        let tItems = b.slotItems
        if !tItems.contains(where: { hasLetters($0.text) }) {
            out[bi] = Dictionary(uniqueKeysWithValues: tItems.compactMap { it in it.i.map { (String($0), it.text) } }); continue
        }
        if k == 0 || prefersRunSplitting(b, k) {
            stats.plainNoX += 1
            for run in runs(of: b) {
                let core = run.text.trimmingCharacters(in: .whitespacesAndNewlines)
                let lead = String(run.text.prefix(while: { $0.isWhitespace })), trail = String(run.text.reversed().prefix(while: { $0.isWhitespace }).reversed())
                if core.isEmpty || !hasLetters(core) { for (n, s) in run.slots.enumerated() { out[bi][String(s)] = n == 0 ? run.text : "" }; continue }
                pend.append(Pending(block: bi, kind: .run(run.slots), text: core, lead: lead, trail: trail))
            }
        } else {
            stats.blocks += 1
            let src = markerSource(b, style: markerEngineStyle)
            pend.append(Pending(block: bi, kind: .marker, text: src.trimmingCharacters(in: .whitespacesAndNewlines),
                                lead: String(src.prefix(while: { $0.isWhitespace })), trail: String(src.reversed().prefix(while: { $0.isWhitespace }).reversed())))
        }
    }
    let reqs = pend.enumerated().map { TranslationSession.Request(sourceText: $1.text, clientIdentifier: "\($0)") }
    var resp: [String: String] = [:]
    if !reqs.isEmpty {
        for r in try await session.translations(from: reqs) { if let id = r.clientIdentifier { resp[id] = r.targetText } }
    }
    for (pi, p) in pend.enumerated() {
        guard let tt = resp["\(pi)"] else { needFallback.insert(p.block); continue }
        let target = p.lead + tt + p.trail
        switch p.kind {
        case .run(let slots):
            for (n, s) in slots.enumerated() { out[p.block][String(s)] = n == 0 ? target : "" }
        case .marker:
            let b = blocks[p.block]
            let k = b.items.filter { $0.k == "x" }.count
            let segs = segments(of: b)
            if let pieces = splitAtMarkers(target, count: k, style: markerEngineStyle), pieces.count == segs.count,
               zip(pieces, segs).allSatisfy({ !$0.1.isEmpty || $0.0.trimmingCharacters(in: .whitespaces).isEmpty }) {
                for (pc, seg) in zip(pieces, segs) { for (n, s) in seg.enumerated() { out[p.block][String(s)] = n == 0 ? pc : "" } }
                stats.ok += 1
            } else { stats.fallback += 1; needFallback.insert(p.block) }
        }
    }
    var result: [(String, [String: String]?, String?)] = []
    for (bi, b) in blocks.enumerated() {
        if needFallback.contains(bi) {
            do { result.append((b.id, try await plainBlock(session, b, lang: lang), nil)) } catch { result.append((b.id, nil, "\(error)")) }
        } else { result.append((b.id, out[bi], nil)) }
    }
    return result
}
