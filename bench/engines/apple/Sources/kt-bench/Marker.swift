// apple-mt-marker: translate the whole block in ONE request with each x item replaced by an inline marker,
// then split the translation at the markers to recover slot texts. Plus --marker-probe (style comparison).
import Foundation
import Translation

enum MarkerStyle: String, CaseIterable, Sendable {
    case corner = "⟦n⟧", square = "[n]", brace = "{n}", xtag = "<xn/>", wrap = "<an>text</an>", guillemet = "«n»"
    func mark(_ n: Int) -> String {
        switch self {
        case .corner: return "⟦\(n)⟧"
        case .square: return "[\(n)]"
        case .brace: return "{\(n)}"
        case .xtag: return "<x\(n)/>"
        case .wrap: return "<a\(n)>"
        case .guillemet: return "«\(n)»"
        }
    }
    func close(_ n: Int) -> String { self == .wrap ? "</a\(n)>" : "" }
}

/// Style used by the apple-mt-marker engine (chosen from probe results, see bench/marker-probe/FINDINGS.md).
let markerEngineStyle: MarkerStyle = .corner

func markerSource(_ b: Block, style: MarkerStyle) -> String {
    var out = "", n = 0
    for it in b.items {
        if it.k == "t" { out += it.text } else {
            n += 1
            out += style == .wrap ? style.mark(n) + it.text + style.close(n) : style.mark(n)
        }
    }
    return out
}

func occurrences(_ s: String, _ sub: String) -> Int { s.components(separatedBy: sub).count - 1 }

/// Split target at markers 1..k. Returns k+1 pieces if every marker appears exactly once AND in order, else nil.
func splitAtMarkers(_ target: String, count k: Int, style: MarkerStyle) -> [String]? {
    var pieces: [String] = []
    var rest = Substring(target)
    for n in 1...max(k, 1) where k > 0 {
        let m = style.mark(n)
        guard occurrences(target, m) == 1, let r = rest.range(of: m) else { return nil }
        pieces.append(String(rest[rest.startIndex..<r.lowerBound]))
        rest = rest[r.upperBound...]
    }
    pieces.append(String(rest))
    return pieces
}

/// Slot ids of consecutive t items grouped into k+1 segments separated by x items.
func segments(of b: Block) -> [[Int]] {
    var segs: [[Int]] = [[]]
    for it in b.items {
        if it.k == "t", let i = it.i { segs[segs.count - 1].append(i) } else { segs.append([]) }
    }
    return segs
}

/// F20: link-heavy label-like lines (x >= 3, or x >= 2 with no lettered t segment >= 12 chars) go per-run, not marker.
func prefersRunSplitting(_ b: Block, _ k: Int) -> Bool {
    if k >= 3 { return true }
    if k >= 2 { return !b.items.contains { $0.k == "t" && hasLetters($0.text) && $0.text.count >= 12 } }
    return false
}

final class MarkerStats {
    var blocks = 0, plainNoX = 0, ok = 0, fallback = 0
}

func markerBlock(_ session: TranslationSession, _ b: Block, lang: String, stats: MarkerStats) async throws -> [String: String] {
    let k = b.items.filter { $0.k == "x" }.count
    if k == 0 || prefersRunSplitting(b, k) { stats.plainNoX += 1; return try await plainBlock(session, b, lang: lang) }
    let tItems = b.slotItems
    if !tItems.contains(where: { hasLetters($0.text) }) {
        return Dictionary(uniqueKeysWithValues: tItems.compactMap { it in it.i.map { (String($0), it.text) } })
    }
    stats.blocks += 1
    let src = markerSource(b, style: markerEngineStyle)
    let lead = String(src.prefix(while: { $0.isWhitespace }))
    let trail = String(src.reversed().prefix(while: { $0.isWhitespace }).reversed())
    let r = try await session.translate(src.trimmingCharacters(in: .whitespacesAndNewlines))
    let target = lead + r.targetText + trail
    let segs = segments(of: b)
    if let pieces = splitAtMarkers(target, count: k, style: markerEngineStyle), pieces.count == segs.count {
        // a piece landing in a segment with no t slot (x at block start/end or adjacent x) cannot be placed
        let placeable = zip(pieces, segs).allSatisfy { !$0.1.isEmpty || $0.0.trimmingCharacters(in: .whitespaces).isEmpty }
        if placeable {
            var slots: [String: String] = [:]
            for (p, seg) in zip(pieces, segs) {
                for (n, s) in seg.enumerated() { slots[String(s)] = n == 0 ? p : "" }
            }
            stats.ok += 1
            return slots
        }
    }
    stats.fallback += 1
    return try await plainBlock(session, b, lang: lang)
}

// MARK: probe

private func t(_ i: Int, _ s: String) -> Item { Item(k: "t", i: i, text: s) }
private func x(_ s: String) -> Item { Item(k: "x", i: nil, text: s) }

/// Extra link-style blocks (own wording) so each language has ~15 x-bearing blocks.
func extraProbeBlocks(_ lang: String) -> [Block] {
    func B(_ n: Int, _ items: [Item]) -> Block { Block(id: "\(lang)-extra-\(n)", genre: "link", items: items) }
    switch lang {
    case "en": return [
        B(1, [t(0, "For more information, read "), x("our privacy policy"), t(1, " before signing up.")]),
        B(2, [t(0, "You can "), x("download the latest release"), t(1, " or build it from source.")]),
        B(3, [t(0, "Please "), x("log in"), t(1, " to view your saved items.")]),
        B(4, [x("Contact support"), t(0, " if the problem persists.")]),
        B(5, [t(0, "This feature was added in "), x("version 3.2"), t(1, ", released last spring.")]),
        B(6, [t(0, "Visit "), x("the community forum"), t(1, " or "), x("the chat room"), t(2, " to ask questions.")]),
        B(7, [t(0, "The report is available as a "), x("PDF"), t(1, ".")]),
        B(8, [t(0, "Thanks to "), x("Maria Lopez"), t(1, " for reviewing the draft.")]),
    ]
    case "ja": return [
        B(1, [t(0, "詳しくは"), x("プライバシーポリシー"), t(1, "をお読みください。")]),
        B(2, [x("最新版をダウンロード"), t(0, "するか、ソースからビルドしてください。")]),
        B(3, [t(0, "保存した項目を見るには"), x("ログイン"), t(1, "してください。")]),
        B(4, [t(0, "問題が解決しない場合は"), x("サポートにお問い合わせ"), t(1, "ください。")]),
        B(5, [t(0, "この機能は昨年の春に公開された"), x("バージョン3.2"), t(1, "で追加されました。")]),
        B(6, [t(0, "質問は"), x("コミュニティフォーラム"), t(1, "または"), x("チャットルーム"), t(2, "でどうぞ。")]),
        B(7, [t(0, "レポートは"), x("PDF"), t(1, "でも入手できます。")]),
        B(8, [t(0, "草稿を確認してくれた"), x("田中さん"), t(1, "に感謝します。")]),
    ]
    default: return [
        B(1, [t(0, "注册前请先阅读"), x("隐私政策"), t(1, "。")]),
        B(2, [t(0, "你可以"), x("下载最新版本"), t(1, ",也可以从源码构建。")]),
        B(3, [t(0, "请先"), x("登录"), t(1, "以查看已保存的内容。")]),
        B(4, [t(0, "如果问题仍然存在,请"), x("联系支持团队"), t(1, "。")]),
        B(5, [t(0, "该功能是在去年春天发布的"), x("3.2 版"), t(1, "中加入的。")]),
        B(6, [t(0, "有问题可以去"), x("社区论坛"), t(1, "或"), x("聊天室"), t(2, "提问。")]),
        B(7, [t(0, "报告也提供"), x("PDF"), t(1, "格式。")]),
        B(8, [t(0, "感谢"), x("李明"), t(1, "审阅草稿。")]),
    ]
    }
}

struct ProbeRow: Encodable {
    var lang: String, blockId: String, style: String, source: String, target: String
    var survived: Bool, inOrder: Bool, spacingSane: Bool, linkTextKept: Bool?, ms: Double
}

func runMarkerProbe(corpusDir: String, outPath: String) async {
    var rows: [ProbeRow] = []
    let clock = ContinuousClock()
    for lang in ["en", "ja", "zh-Hans"] {
        guard let corpus = try? JSONDecoder().decode(Corpus.self, from: Data(contentsOf: URL(fileURLWithPath: "\(corpusDir)/\(lang).json"))) else {
            print("cannot read corpus \(lang)"); continue
        }
        guard await LanguageAvailability().status(from: Locale.Language(identifier: lang), to: Locale.Language(identifier: "ko")) == .installed else {
            print("pack not installed \(lang)"); continue
        }
        let session = makeSession(lang: lang, strategy: .none)
        let blocks = corpus.blocks.filter { $0.items.contains { $0.k == "x" } } + extraProbeBlocks(lang)
        for b in blocks {
            let k = b.items.filter { $0.k == "x" }.count
            for style in MarkerStyle.allCases {
                let src = markerSource(b, style: style)
                let t0 = clock.now
                let target: String
                do { target = try await session.translate(src).targetText } catch { target = "ERROR \(error)"; }
                let dt = ms(clock.now - t0)
                var survived = true, kept: Bool? = nil
                var inOrder = true
                if style == .wrap {
                    for n in 1...k { if occurrences(target, style.mark(n)) != 1 || occurrences(target, style.close(n)) != 1 { survived = false } }
                    let xs = b.items.filter { $0.k == "x" }.map(\.text)
                    kept = xs.enumerated().allSatisfy { target.contains("\(style.mark($0.offset + 1))\($0.element)\(style.close($0.offset + 1))") }
                } else {
                    for n in 1...k where occurrences(target, style.mark(n)) != 1 { survived = false }
                    inOrder = survived && splitAtMarkers(target, count: k, style: style) != nil
                }
                // spacing sane: no doubled spaces, no space just inside the output edges
                let sane = !target.contains("  ") && target == target.trimmingCharacters(in: .whitespaces)
                rows.append(ProbeRow(lang: lang, blockId: b.id, style: style.rawValue, source: src, target: target,
                                     survived: survived, inOrder: inOrder, spacingSane: sane, linkTextKept: kept, ms: dt))
            }
        }
        print("done \(lang): \(blocks.count) blocks")
    }
    let enc = JSONEncoder(); enc.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
    try? FileManager.default.createDirectory(at: URL(fileURLWithPath: outPath).deletingLastPathComponent(), withIntermediateDirectories: true)
    try? enc.encode(rows).write(to: URL(fileURLWithPath: outPath))
    for style in MarkerStyle.allCases {
        for lang in ["all", "en", "ja", "zh-Hans"] {
            let r = rows.filter { $0.style == style.rawValue && (lang == "all" || $0.lang == lang) }
            if r.isEmpty { continue }
            let p = { (c: Int) in String(format: "%.0f%%", 100.0 * Double(c) / Double(r.count)) }
            print("\(style.rawValue)\t\(lang)\tn=\(r.count)\tsurvive=\(p(r.filter(\.survived).count))\tinOrder=\(p(r.filter(\.inOrder).count))\tsane=\(p(r.filter(\.spacingSane).count))")
        }
    }
}
