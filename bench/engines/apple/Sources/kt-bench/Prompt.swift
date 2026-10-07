// LLM instructions: bench/prompt.json if found, else embedded copy of PLAN §4.6 rules 1-5.
import Foundation

struct PromptFile: Codable { var system: String; var langNotes: [String: String] }

let embeddedPrompt = PromptFile(
    system: """
    당신은 웹페이지 텍스트를 한국어로 번역하는 번역가입니다.
    1. 자연스러운 한국어로 번역하세요. 직역투를 피하고 원문 어조(격식/구어/유머/커뮤니티 말투)를 유지하세요.
    2. 주어진 범위 전체를 읽고 용어·호칭·문체 일관성을 유지하세요.
    3. 한 블록의 슬롯(k=t)은 한 문장의 조각일 수 있습니다. 한국어 어순에 맞게 의미를 슬롯 사이에 재배분해도 됩니다. x 항목은 위치 고정이며 번역하지 않습니다. x 앞뒤 조사·어미가 자연스럽게 이어지게 하세요. (예: `Click [x:here] to continue` → t0 `계속하려면 `, t2 `을(를) 클릭하세요`)
    4. 고유명사·제품명·브랜드·코드·단위는 원문을 유지하세요. 숫자·URL은 바꾸지 마세요.
    5. 모든 슬롯 id를 반환하세요(빈 값 "" 허용). 지정된 JSON 형식만 출력하세요.
    """,
    langNotes: [
        "en": "",
        "ja": "경어 수준을 한국어 존댓말 수준에 대응시키세요.",
        "zh-Hans": "한자어 직역을 지양하고, 고유명사는 한국에서 통용되는 표기를 우선하세요.",
        "zh-Hant": "한자어 직역을 지양하고, 고유명사는 한국에서 통용되는 표기를 우선하세요.",
    ]
)

/// Returns (prompt, source description). Reloads from file whenever one is found.
func loadPrompt(explicit: String?, corpusPath: String) -> (PromptFile, String) {
    var cands: [String] = []
    if let explicit { cands.append(explicit) }
    let corpusDir = URL(fileURLWithPath: corpusPath).deletingLastPathComponent()
    cands.append(corpusDir.appendingPathComponent("../prompt.json").standardized.path)
    cands.append(FileManager.default.currentDirectoryPath + "/bench/prompt.json")
    cands.append(FileManager.default.currentDirectoryPath + "/prompt.json")
    for p in cands {
        if let d = FileManager.default.contents(atPath: p),
           let f = try? JSONDecoder().decode(PromptFile.self, from: d) {
            return (f, "file:\(p)")
        }
    }
    return (embeddedPrompt, "embedded")
}
