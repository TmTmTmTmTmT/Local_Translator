// --probe / --list-engines output.
import Foundation
import Translation
import FoundationModels

let mtBases = ["apple-mt-plain", "apple-mt-attr", "apple-mt-marker"]
let strategySuffixes = ["", "-highfidelity", "-lowlatency"]

func allEngineIds() -> [String] {
    var ids: [String] = []
    for b in mtBases { for s in strategySuffixes { ids.append(b + s) } }
    ids.append("apple-mt-marker-batch")
    ids.append("apple-fm")
    return ids
}

func printJSON(_ obj: Any) {
    let d = try! JSONSerialization.data(withJSONObject: obj, options: [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes])
    print(String(data: d, encoding: .utf8)!)
}

func runProbe() async {
    var out: [String: Any] = ["os": osString()]
    let la = LanguageAvailability()
    var pairs: [String: String] = [:]
    for l in ["en", "ja", "zh-Hans", "zh-Hant"] {
        let st = await la.status(from: Locale.Language(identifier: l), to: Locale.Language(identifier: "ko"))
        pairs["\(l)->ko"] = switch st { case .installed: "installed"; case .supported: "supported(not installed)"; case .unsupported: "unsupported"; @unknown default: "unknown" }
    }
    let ps = la.preferredStrategy
    let supported = await la.supportedLanguages
    out["translation"] = [
        "pairStatus": pairs,
        "defaultPreferredStrategy": ps == .highFidelity ? "highFidelity" : (ps == .lowLatency ? "lowLatency" : "other"),
        "strategyCases": ["highfidelity", "lowlatency"],
        "supportedLanguageCount": supported.count,
    ] as [String: Any]
    let m = SystemLanguageModel(useCase: .general, guardrails: .permissiveContentTransformations)
    var avail = "available"
    if case .unavailable(let r) = m.availability { avail = "unavailable(\(fmReasonString(r)))" }
    let langs = m.supportedLanguages.map { $0.maximalIdentifier }.sorted()
    out["foundationModels"] = [
        "availability": avail,
        "supportedLanguages": langs,
        "supportsKo": langSupported(m.supportedLanguages, code: "ko"),
        "supportsEn": langSupported(m.supportedLanguages, code: "en"),
        "supportsJa": langSupported(m.supportedLanguages, code: "ja"),
        "supportsZh": langSupported(m.supportedLanguages, code: "zh"),
    ] as [String: Any]
    printJSON(out)
}
