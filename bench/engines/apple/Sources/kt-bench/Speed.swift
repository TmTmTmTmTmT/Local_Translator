// --speed: latency experiments for Translation framework (see bench/apple-speed/FINDINGS.md).
import Foundation
import Translation

final class SBox: @unchecked Sendable { let s: TranslationSession; init(_ s: TranslationSession) { self.s = s } }

func blockText(_ b: Block) -> String { b.items.map(\.text).joined().trimmingCharacters(in: .whitespacesAndNewlines) }

func pct(_ a: [Double], _ p: Double) -> Double { let s = a.sorted(); return s.isEmpty ? 0 : s[min(s.count - 1, Int(Double(s.count) * p))] }
func fmt(_ a: [Double]) -> String { String(format: "n=%d min=%.0f p50=%.0f p90=%.0f max=%.0f mean=%.0f", a.count, a.min() ?? 0, pct(a, 0.5), pct(a, 0.9), a.max() ?? 0, a.reduce(0, +) / Double(max(a.count, 1))) }

func runSpeed(corpusDir: String, lang: String) async {
    guard let corpus = try? JSONDecoder().decode(Corpus.self, from: Data(contentsOf: URL(fileURLWithPath: "\(corpusDir)/\(lang).json"))) else { print("no corpus"); return }
    let clock = ContinuousClock()
    let texts = corpus.blocks.map(blockText).filter { hasLetters($0) }
    print("lang=\(lang) blocks=\(texts.count) chars: min=\(texts.map(\.count).min()!) max=\(texts.map(\.count).max()!) mean=\(texts.map(\.count).reduce(0,+)/texts.count)")
    let tgt = Locale.Language(identifier: "ko")
    func mk() -> SBox { SBox(TranslationSession(installedSource: Locale.Language(identifier: lang), target: tgt)) }

    // E1: per-request latency, sequential, first call vs warm
    let s1 = mk()
    var lat: [(Int, Double)] = []
    for t in texts {
        let t0 = clock.now
        _ = try? await s1.s.translate(t)
        lat.append((t.count, ms(clock.now - t0)))
    }
    print("E1 first call: \(Int(lat[0].1)) ms (\(lat[0].0) chars)")
    print("E1 seq all: total=\(Int(lat.map(\.1).reduce(0,+))) \(fmt(lat.dropFirst().map(\.1)))")
    let short = lat.dropFirst().filter { $0.0 < 80 }.map(\.1), long = lat.filter { $0.0 >= 200 }.map(\.1)
    print("E1 short(<80ch): \(fmt(short))")
    print("E1 long(>=200ch): \(fmt(long))")
    // second pass over same texts (warm, same session)
    var lat2: [(Int, Double)] = []
    for t in texts { let t0 = clock.now; _ = try? await s1.s.translate(t); lat2.append((t.count, ms(clock.now - t0))) }
    print("E1 pass2 same session: total=\(Int(lat2.map(\.1).reduce(0,+))) \(fmt(lat2.map(\.1)))")
    // fresh session first call
    let s1b = mk(); let t0b = clock.now; _ = try? await s1b.s.translate(texts[0]); print("E1 new session first call: \(Int(ms(clock.now - t0b))) ms")

    // E4: length dependence: repeat a sentence n times
    let base = texts.first { $0.count > 40 && $0.count < 120 } ?? texts[0]
    for rep in [1, 2, 4, 8, 16] {
        let t = Array(repeating: base, count: rep).joined(separator: " ")
        var d: [Double] = []
        for _ in 0..<2 { let t0 = clock.now; _ = try? await s1.s.translate(t); d.append(ms(clock.now - t0)) }
        print("E4 len=\(t.count) chars: \(d.map { String(format: "%.0f", $0) }.joined(separator: ", ")) ms")
    }
    for t in ["a", "Hello", "OK."] where lang == "en" { let t0 = clock.now; _ = try? await s1.s.translate(t); print("E4 tiny '\(t)': \(Int(ms(clock.now - t0))) ms") }

    // E5: AttributedString vs String (same text, sequential, first 10 blocks)
    let sub = Array(texts.prefix(10))
    var a = clock.now
    for t in sub { _ = try? await s1.s.translate(t) }
    let strMs = ms(clock.now - a)
    a = clock.now
    for t in sub { _ = try? await s1.s.translate(AttributedString(t)) }
    let attrMs = ms(clock.now - a)
    print("E5 10 blocks String=\(Int(strMs)) ms AttributedString=\(Int(attrMs)) ms")

    // E2: batch API
    let reqs = texts.enumerated().map { TranslationSession.Request(sourceText: $1, clientIdentifier: "\($0)") }
    let s2 = mk()
    var tb = clock.now
    do {
        let resp = try await s2.s.translations(from: reqs)
        let ids = resp.map { $0.clientIdentifier ?? "nil" }
        let ordered = ids == reqs.map { $0.clientIdentifier! }
        print("E2 translations(from:) cold-session total=\(Int(ms(clock.now - tb))) ms n=\(resp.count) inOrder=\(ordered)")
    } catch { print("E2 translations(from:) ERROR \(error)") }
    tb = clock.now
    do { let resp = try await s2.s.translations(from: reqs); print("E2 translations(from:) warm total=\(Int(ms(clock.now - tb))) ms n=\(resp.count)") } catch { print("E2 warm ERROR \(error)") }
    // streaming batch: time to first result
    do {
        let s3 = mk(); tb = clock.now
        var firstMs = -1.0, n = 0
        var ids: [String] = []
        for try await r in s3.s.translate(batch: reqs) {
            if firstMs < 0 { firstMs = ms(clock.now - tb) }
            n += 1; ids.append(r.clientIdentifier ?? "nil")
        }
        print("E2 translate(batch:) total=\(Int(ms(clock.now - tb))) ms first=\(Int(firstMs)) ms n=\(n) inOrder=\(ids == reqs.map { $0.clientIdentifier! })")
    } catch { print("E2 translate(batch:) ERROR \(error)") }
    // batch in chunks of 5 (time-to-first-screen)
    do {
        let s4 = mk(); tb = clock.now
        var first = -1.0
        for chunk in stride(from: 0, to: reqs.count, by: 5) {
            _ = try await s4.s.translations(from: Array(reqs[chunk..<min(chunk + 5, reqs.count)]))
            if first < 0 { first = ms(clock.now - tb) }
        }
        print("E2 chunks of 5: total=\(Int(ms(clock.now - tb))) ms first chunk=\(Int(first)) ms")
    } catch { print("E2 chunk ERROR \(error)") }

    // E3: concurrency, N sessions each doing sequential single translate over its share
    for n in [1, 2, 4] {
        let sessions = (0..<n).map { _ in mk() }
        let t0 = clock.now
        await withTaskGroup(of: Void.self) { g in
            for k in 0..<n {
                let box = sessions[k]
                let mine = texts.enumerated().filter { $0.offset % n == k }.map(\.element)
                g.addTask { for t in mine { _ = try? await box.s.translate(t) } }
            }
        }
        print("E3 \(n) sessions x sequential: total=\(Int(ms(clock.now - t0))) ms")
    }
    // one session, concurrent translate calls (4 in flight)
    do {
        let box = mk(); let t0 = clock.now
        await withTaskGroup(of: Void.self) { g in
            for t in texts { g.addTask { _ = try? await box.s.translate(t) } }
        }
        print("E3 1 session x all-concurrent: total=\(Int(ms(clock.now - t0))) ms")
    }
}
