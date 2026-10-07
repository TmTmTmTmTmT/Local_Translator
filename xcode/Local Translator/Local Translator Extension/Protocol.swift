// PROTOCOL.md §4 native message types (Codable) and language mapping shared by the engines.
import Foundation

struct ProtoItem: Codable, Sendable {
    var k: String
    var i: Int?
    var text: String
}

struct ProtoBlock: Codable, Sendable {
    var id: String
    var lang: String?
    var items: [ProtoItem]
    var slotItems: [ProtoItem] { items.filter { $0.k == "t" && $0.i != nil } }
    var chars: Int { items.reduce(0) { $0 + $1.text.count } }
}

struct ProtoContext: Codable, Sendable {
    var title: String?
    var host: String?
}

struct ProtoRequest: Codable, Sendable {
    var type: String
    var engine: String?
    var lang: String?
    var variant: String?
    var context: ProtoContext?
    var blocks: [ProtoBlock]?
}

struct ProtoResult: Codable, Sendable {
    var id: String
    var slots: [String: String]
}

struct ProtoError: Codable, Sendable {
    var code: String
    var message: String
    var lang: String?
}

struct ProtoEngineStatus: Codable, Sendable {
    var available: Bool
    var reason: String?
}

struct ProtoResponse: Codable, Sendable {
    var ok: Bool
    var results: [ProtoResult]?
    var engine: String?
    var error: ProtoError?
    var engines: [String: ProtoEngineStatus]?
    var languagePacks: [String: String]?

    static func failure(_ code: String, _ message: String, lang: String? = nil) -> ProtoResponse {
        ProtoResponse(ok: false, error: ProtoError(code: code, message: message, lang: lang))
    }
}

/// Engine-level failure carrying a PROTOCOL error code.
struct EngineError: Error, Sendable {
    var code: String
    var message: String
    var lang: String?
    var response: ProtoResponse { .failure(code, message, lang: lang) }
}

enum Langs {
    /// Supported source languages (target is always ko).
    static let sources = ["en", "ja", "zh-Hans", "zh-Hant"]

    /// en->en, ja->ja, zh/zh-Hans->zh-Hans, zh-Hant->zh-Hant; nil if unsupported.
    static func source(_ raw: String?) -> String? {
        guard let raw else { return nil }
        let l = raw.lowercased().replacingOccurrences(of: "_", with: "-")
        switch l {
        case "en": return "en"
        case "ja": return "ja"
        case "zh", "zh-hans", "zh-cn", "zh-sg": return "zh-Hans"
        case "zh-hant", "zh-tw", "zh-hk", "zh-mo": return "zh-Hant"
        default:
            if l.hasPrefix("en-") { return "en" }
            if l.hasPrefix("ja-") { return "ja" }
            if l.hasPrefix("zh-hans") { return "zh-Hans" }
            if l.hasPrefix("zh-hant") { return "zh-Hant" }
            return nil
        }
    }

    /// Effective source language of a block: its own lang if mappable, else the request lang.
    static func effective(block: ProtoBlock, requestLang: String?) -> String? {
        if let own = source(block.lang) { return own }
        return source(requestLang)
    }
}

func hasLetters(_ s: String) -> Bool {
    s.unicodeScalars.contains { CharacterSet.letters.contains($0) }
}

/// Consecutive blocks packed up to char/block limits (an oversized single block gets its own batch).
func makeBatches(_ blocks: [ProtoBlock], maxChars: Int, maxBlocks: Int) -> [[ProtoBlock]] {
    var out: [[ProtoBlock]] = []
    var cur: [ProtoBlock] = []
    var chars = 0
    for b in blocks {
        if !cur.isEmpty && (chars + b.chars > maxChars || cur.count >= maxBlocks) {
            out.append(cur); cur = []; chars = 0
        }
        cur.append(b); chars += b.chars
    }
    if !cur.isEmpty { out.append(cur) }
    return out
}

/// Serializes async work (FM: one request at a time) across actor reentrancy.
actor AsyncGate {
    private var busy = false
    private var waiters: [CheckedContinuation<Void, Never>] = []
    func acquire() async {
        if !busy { busy = true; return }
        await withCheckedContinuation { waiters.append($0) }
    }
    func release() {
        if waiters.isEmpty { busy = false } else { waiters.removeFirst().resume() }
    }
}
