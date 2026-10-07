// apple-fm: on-device SystemLanguageModel only (NEVER PrivateCloudComputeLanguageModel). Ported from bench FM.swift.
// Policy (PLAN §4.7): one request at a time, <=1500 chars/batch, sessions released after 60s idle, no prewarm.
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

// Wording mirrors extension/engines/prompt.js (SYSTEM_PROMPT + LANG_NOTES); keep in sync.
enum FMPrompt {
    static let system = [
        "당신은 웹페이지 번역가입니다. 입력으로 주어진 외국어 웹페이지 조각을 자연스러운 한국어로 번역합니다.",
        "",
        "[규칙]",
        "1. 자연스러운 한국어로 번역합니다. 직역투를 피하고, 원문의 어조(격식체/구어체/유머/커뮤니티 말투)를 유지합니다.",
        "2. 주어진 범위 전체를 먼저 읽고, 용어·호칭·문체를 일관되게 유지합니다. context.title은 글의 제목이며 번역 대상이 아닙니다.",
        "3. 한 블록의 슬롯(k=\"t\")들은 하나의 문장을 쪼갠 조각일 수 있습니다. 한국어 어순에 맞게 의미를 슬롯들 사이에 다시 배분해도 됩니다. k=\"x\" 항목(링크·코드 등)은 위치가 고정이며 번역·수정하지 않습니다. x 앞뒤의 조사·어미가 자연스럽게 이어지도록 슬롯을 작성합니다. 예: [t0 \"Click \", x \"here\", t1 \" to continue\"] 이면 t0=\"계속하려면 \", t1=\"을(를) 클릭하세요\". 슬롯 앞뒤 공백도 문장이 이어지도록 맞춥니다.",
        "4. 고유명사·제품명·브랜드명·코드·단위는 원문 그대로 둡니다. 숫자와 URL은 절대 바꾸지 않습니다.",
        "5. 입력된 모든 블록의 모든 슬롯 번호를 빠짐없이 반환합니다. 내용이 없으면 빈 문자열 \"\" 을 반환할 수 있습니다. x 항목은 출력에 포함하지 않습니다.",
        "",
        "[입력 형식]",
        "{\"lang\":\"원문 언어\",\"context\":{\"title\":\"...\",\"host\":\"...\"},\"blocks\":[{\"id\":\"블록id\",\"items\":[{\"k\":\"t\",\"i\":0,\"text\":\"...\"},{\"k\":\"x\",\"text\":\"...\"},{\"k\":\"t\",\"i\":1,\"text\":\"...\"}]}]}",
        "",
        "[출력 형식]",
        "구조화 출력 스키마(blocks[].id, blocks[].t[].i/text)로만 응답합니다. 블록 id는 입력과 동일해야 하고, t[].i는 입력 슬롯의 i 값입니다.",
    ].joined(separator: "\n")

    static let notes: [String: String] = [
        "en": "",
        "ja": "[일본어 보충] 일본어 경어 수준(です・ます / 丁寧語 / 敬語 / 常体)을 한국어 존댓말 수준(합쇼체·해요체·반말)에 대응시켜 번역합니다. 인터넷 슬랭과 줄임말은 한국어에서 비슷한 어감으로 옮깁니다.",
        "zh-Hans": "[중국어 간체 보충] 한자어를 그대로 직역하지 말고 자연스러운 한국어 표현으로 풀어 씁니다. 고유명사(인명·지명·기관명)는 한국에서 통용되는 표기를 우선합니다.",
        "zh-Hant": "[중국어 번체 보충] 한자어를 그대로 직역하지 말고 자연스러운 한국어 표현으로 풀어 씁니다. 고유명사(인명·지명·기관명)는 한국에서 통용되는 표기를 우선합니다. 대만·홍콩식 용어는 한국어 일반 용어로 옮깁니다.",
    ]

    static func instructions(lang: String) -> String {
        let n = notes[lang] ?? ""
        return n.isEmpty ? system : system + "\n\n" + n
    }
}

actor FMEngine {
    static let shared = FMEngine()
    static let maxChars = 1500
    static let maxCharsCJK = 600
    static let maxBlocks = 8
    static let idleSeconds = Limits.idleSeconds

    private var sessions: [String: LanguageModelSession] = [:]   // per source lang
    private let gate = AsyncGate()
    private var lastUse = ContinuousClock.now
    private var idleTask: Task<Void, Never>?

    private static func model() -> SystemLanguageModel {
        SystemLanguageModel(useCase: .general, guardrails: .permissiveContentTransformations)
    }

    static func reasonString(_ r: SystemLanguageModel.Availability.UnavailableReason) -> String {
        switch r {
        case .deviceNotEligible: return "deviceNotEligible"
        case .appleIntelligenceNotEnabled: return "appleIntelligenceNotEnabled"
        case .modelNotReady: return "modelNotReady"
        @unknown default: return "unknown"
        }
    }

    static func status() -> ProtoEngineStatus {
        switch model().availability {
        case .available: return ProtoEngineStatus(available: true, reason: nil)
        case .unavailable(let r): return ProtoEngineStatus(available: false, reason: reasonString(r))
        }
    }

    private static func langSupported(_ set: Set<Locale.Language>, _ code: String) -> Bool {
        let want = Locale.Language(identifier: code)
        return set.contains { $0.languageCode == want.languageCode }
    }

    func translate(blocks: [ProtoBlock], context: ProtoContext?, requestLang: String?) async throws -> [ProtoResult] {
        let model = Self.model()
        switch model.availability {
        case .available: break
        case .unavailable(let r):
            throw EngineError(code: "engine_unavailable", message: "Apple Intelligence unavailable: \(Self.reasonString(r))")
        }
        var byLang: [String: [ProtoBlock]] = [:]
        var order: [String] = []
        for b in blocks {
            guard let l = Langs.effective(block: b, requestLang: requestLang) else {
                throw EngineError(code: "unsupported_lang", message: "unsupported lang: \(b.lang ?? requestLang ?? "nil")")
            }
            if byLang[l] == nil { order.append(l) }
            byLang[l, default: []].append(b)
        }
        let sup = model.supportedLanguages
        guard Self.langSupported(sup, "ko") else { throw EngineError(code: "unsupported_lang", message: "model does not support ko", lang: "ko") }
        for l in order where !Self.langSupported(sup, l) {
            throw EngineError(code: "unsupported_lang", message: "model does not support \(l)", lang: l)
        }

        await gate.acquire()
        do {
            let r = try await run(model: model, order: order, byLang: byLang, context: context, total: blocks.count)
            await gate.release()
            return r
        } catch {
            await gate.release()
            throw error
        }
    }

    private func run(model: SystemLanguageModel, order: [String], byLang: [String: [ProtoBlock]], context: ProtoContext?, total: Int) async throws -> [ProtoResult] {
        touch()
        var results: [ProtoResult] = []
        var firstError: Error?
        for l in order {
            let limit = (l == "ja" || l.hasPrefix("zh")) ? Self.maxCharsCJK : Self.maxChars   // CJK는 토큰 밀도가 높아 4096토큰 초과가 잦음
            for batch in makeBatches(byLang[l] ?? [], maxChars: limit, maxBlocks: Self.maxBlocks) {
                do {
                    let map = try await respond(model: model, lang: l, context: context, batch: batch)
                    for b in batch {
                        guard var s = map[b.id] else { continue }
                        let valid = Set(b.slotItems.compactMap { $0.i.map(String.init) })
                        s = s.filter { valid.contains($0.key) }
                        results.append(ProtoResult(id: b.id, slots: s))
                    }
                } catch {
                    if firstError == nil { firstError = error }
                }
                touch()
            }
        }
        if results.isEmpty, total > 0, let e = firstError {
            if let ee = e as? EngineError { throw ee }
            throw EngineError(code: "unknown", message: "\(e)")
        }
        return results
    }

    private func newSession(model: SystemLanguageModel, lang: String) -> LanguageModelSession {
        LanguageModelSession(model: model, instructions: FMPrompt.instructions(lang: lang))
    }

    // 배치마다 새 세션(트랜스크립트 누적 방지). 컨텍스트 초과 시 배치를 반으로 나눠 재시도, 단일 블록도 초과면 에러.
    private func respond(model: SystemLanguageModel, lang: String, context: ProtoContext?, batch: [ProtoBlock]) async throws -> [String: [String: String]] {
        let text = Self.promptText(lang: lang, context: context, batch: batch)
        let session = newSession(model: model, lang: lang)
        sessions[lang] = session
        defer { sessions[lang] = nil }
        do {
            let r = try await session.respond(to: Prompt(text), generating: FMOutput.self)
            var map: [String: [String: String]] = [:]
            for b in r.content.blocks {
                map[b.id] = Dictionary(b.t.map { (String($0.i), $0.text) }, uniquingKeysWith: { a, _ in a })
            }
            return map
        } catch {
            let d = "\(error)"
            let overflow = d.contains("exceededContextWindowSize") || d.contains("contextSizeExceeded") || d.contains("context size")
            if overflow && batch.count > 1 {
                let mid = batch.count / 2
                var merged = try await respond(model: model, lang: lang, context: context, batch: Array(batch[..<mid]))
                for (k, v) in try await respond(model: model, lang: lang, context: context, batch: Array(batch[mid...])) { merged[k] = v }
                return merged
            }
            throw EngineError(code: overflow ? "bad_response" : "unknown", message: d)
        }
    }

    private static func promptText(lang: String, context: ProtoContext?, batch: [ProtoBlock]) -> String {
        let blocks: [[String: Any]] = batch.map { b in
            ["id": b.id, "items": b.items.map { it -> [String: Any] in
                it.k == "t" ? ["k": "t", "i": it.i ?? 0, "text": it.text] : ["k": "x", "text": it.text]
            }]
        }
        let obj: [String: Any] = [
            "lang": lang,
            "context": ["title": context?.title ?? "", "host": context?.host ?? ""],
            "blocks": blocks,
        ]
        let data = (try? JSONSerialization.data(withJSONObject: obj, options: [.sortedKeys, .withoutEscapingSlashes])) ?? Data()
        return "다음 블록을 한국어로 번역하세요. 모든 블록 id와 모든 t 슬롯 i를 반환하세요.\n" + (String(data: data, encoding: .utf8) ?? "")
    }

    // MARK: idle release

    private func touch() {
        lastUse = ContinuousClock.now
        if idleTask == nil {
            idleTask = Task { [weak self] in await self?.idleLoop() }
        }
    }

    private func idleLoop() async {
        while !Task.isCancelled {
            try? await Task.sleep(nanoseconds: 5 * 1_000_000_000)
            if lastUse.duration(to: .now) >= .seconds(Self.idleSeconds) {
                sessions.removeAll()
                idleTask = nil
                return
            }
        }
    }
}
