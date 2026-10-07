// apple-fm: on-device SystemLanguageModel only (never PrivateCloudComputeLanguageModel).
import Foundation
import FoundationModels

@Generable
struct FMSlot {
    @Guide(description: "slot index i of the input t item")
    var i: Int
    @Guide(description: "Korean translation of that slot; empty string allowed")
    var text: String
}

@Generable
struct FMBlock {
    @Guide(description: "block id copied from input")
    var id: String
    var t: [FMSlot]
}

@Generable
struct FMOutput {
    var blocks: [FMBlock]
}

func fmReasonString(_ r: SystemLanguageModel.Availability.UnavailableReason) -> String {
    switch r {
    case .deviceNotEligible: return "deviceNotEligible"
    case .appleIntelligenceNotEnabled: return "appleIntelligenceNotEnabled"
    case .modelNotReady: return "modelNotReady"
    @unknown default: return "unknown"
    }
}

func langSupported(_ set: Set<Locale.Language>, code: String) -> Bool {
    let want = Locale.Language(identifier: code)
    return set.contains { $0.languageCode == want.languageCode }
}

func batchPromptText(corpus: Corpus, batch: [Block], mode: String) -> String {
    var blocks: [[String: Any]] = []
    for b in batch {
        let items: [[String: Any]] = b.items.map { it in
            it.k == "t" ? ["k": "t", "i": it.i ?? 0, "text": it.text] : ["k": "x", "text": it.text]
        }
        blocks.append(["id": b.id, "items": items])
    }
    let obj: [String: Any] = ["blocks": blocks]
    let data = (try? JSONSerialization.data(withJSONObject: obj, options: [.sortedKeys, .withoutEscapingSlashes])) ?? Data()
    var s = "문서 제목: \(corpus.context?.title ?? "")\n원문 언어: \(corpus.lang)\n다음 블록을 한국어로 번역하세요. 모든 블록 id와 모든 t 슬롯 i를 반환하세요.\n"
    if mode == "text" {
        s += "출력 형식(JSON만): {\"blocks\":[{\"id\":\"..\",\"t\":[{\"i\":0,\"text\":\"..\"}]}]}\n"
    }
    s += String(data: data, encoding: .utf8) ?? ""
    return s
}

func parseFMText(_ raw: String) -> FMOutputPlain? {
    var s = raw
    if let a = s.firstIndex(of: "{"), let b = s.lastIndex(of: "}"), a < b { s = String(s[a...b]) }
    return try? JSONDecoder().decode(FMOutputPlain.self, from: Data(s.utf8))
}
struct FMOutputPlain: Decodable {
    struct B: Decodable { var id: String; var t: [S] }
    struct S: Decodable { var i: Int; var text: String }
    var blocks: [B]
}

func runFM(engine: String, corpus: Corpus, runNo: Int, promptPath: String?, corpusPath: String, mode: String) async -> RunResult {
    let lang = corpus.lang
    let isCJK = (lang == "ja" || lang.hasPrefix("zh"))
    let limit = BatchLimit(chars: isCJK ? 600 : 1500, blocks: 40)
    var result = RunResult(engine: engine, model: "apple-foundation-models-ondevice", lang: lang, run: runNo, batchLimit: limit,
                           coldMs: 0, totalMs: 0, blocks: [], batches: [],
                           env: Env(keepAliveSec: nil, notes: "", os: osString()), error: nil)
    let model = SystemLanguageModel(useCase: .general, guardrails: .permissiveContentTransformations)
    switch model.availability {
    case .available: break
    case .unavailable(let r): result.error = "unavailable(\(fmReasonString(r)))"; return result
    }
    let sup = model.supportedLanguages
    if !langSupported(sup, code: "ko") { result.error = "unsupported_language:ko"; return result }
    if !langSupported(sup, code: lang) { result.error = "unsupported_language:\(lang)"; return result }

    let (pf, psrc) = loadPrompt(explicit: promptPath, corpusPath: corpusPath)
    var instr = pf.system
    if let n = pf.langNotes[lang], !n.isEmpty { instr += "\n" + n }
    func newSession() -> LanguageModelSession { LanguageModelSession(model: model, instructions: instr) }
    var session = newSession()
    var resets = 0

    let clock = ContinuousClock()
    let total = clock.now
    var first = true
    for batch in makeBatches(corpus.blocks, maxChars: limit.chars, maxBlocks: limit.blocks) {
        session = newSession()   // 배치마다 새 세션: 트랜스크립트 누적으로 4096토큰 초과 방지
        let text = batchPromptText(corpus: corpus, batch: batch, mode: mode)
        var map: [String: [String: String]] = [:]
        var batchError: String?
        let t0 = clock.now
        var attempt = 0
        while attempt < 2 {
            attempt += 1
            do {
                if mode == "text" {
                    let r = try await session.respond(to: Prompt(text))
                    if let o = parseFMText(r.content) {
                        for b in o.blocks { map[b.id] = Dictionary(uniqueKeysWithValues: b.t.map { (String($0.i), $0.text) }) }
                    } else { batchError = "json_parse_failed" }
                } else {
                    let r = try await session.respond(to: Prompt(text), generating: FMOutput.self)
                    for b in r.content.blocks {
                        map[b.id] = Dictionary(b.t.map { (String($0.i), $0.text) }, uniquingKeysWith: { a, _ in a })
                    }
                }
                break
            } catch {
                let d = "\(error)"
                if attempt == 1 && (d.contains("contextSizeExceeded") || d.contains("exceededContextWindowSize") || d.contains("context size")) {
                    session = newSession(); resets += 1; continue
                }
                batchError = d
                break
            }
        }
        let bms = ms(clock.now - t0)
        if first { result.coldMs = bms; first = false }
        result.batches.append(BatchResult(blockIds: batch.map(\.id), ms: bms))
        for b in batch {
            let per = bms / Double(batch.count)
            if let e = batchError, map[b.id] == nil {
                result.blocks.append(BlockResult(id: b.id, ms: per, slots: nil, error: e))
            } else if var s = map[b.id] {
                let valid = Set(b.slotItems.compactMap { $0.i.map(String.init) })
                s = s.filter { valid.contains($0.key) }
                result.blocks.append(BlockResult(id: b.id, ms: per, slots: s, error: nil))
            } else {
                result.blocks.append(BlockResult(id: b.id, ms: per, slots: nil, error: "missing_in_output"))
            }
        }
    }
    result.totalMs = ms(clock.now - total)
    result.env.notes = "on-device SystemLanguageModel(guardrails: permissiveContentTransformations); mode=\(mode == "text" ? "plain-json-text" : "guided(@Generable)"); new session per batch, contextResets=\(resets); prompt=\(psrc); batch<=\(limit.chars) chars, 1 request at a time; no prewarm."
    return result
}
