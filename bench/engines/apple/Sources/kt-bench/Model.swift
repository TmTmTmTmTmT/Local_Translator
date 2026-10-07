// Corpus/result JSON types per bench/SPEC.md §1, §3 and shared batching/run-splitting helpers.
import Foundation

struct Item: Codable, Sendable {
    var k: String
    var i: Int?
    var text: String
}

struct Block: Codable, Sendable {
    var id: String
    var genre: String?
    var items: [Item]
    var chars: Int { items.reduce(0) { $0 + $1.text.count } }
    var slotItems: [Item] { items.filter { $0.k == "t" } }
}

struct Corpus: Codable, Sendable {
    struct Context: Codable, Sendable { var title: String?; var host: String? }
    var lang: String
    var context: Context?
    var blocks: [Block]
}

struct BlockResult: Encodable, Sendable {
    var id: String
    var ms: Double
    var slots: [String: String]?
    var error: String?
    enum CodingKeys: String, CodingKey { case id, ms, slots, error }
    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(id, forKey: .id)
        try c.encode(ms, forKey: .ms)
        try c.encode(slots, forKey: .slots)   // explicit null on failure (SPEC §3)
        try c.encode(error, forKey: .error)
    }
}

struct BatchResult: Encodable, Sendable {
    var blockIds: [String]
    var ms: Double
}

struct BatchLimit: Encodable, Sendable { var chars: Int; var blocks: Int }

struct Env: Encodable, Sendable {
    var keepAliveSec: Int?
    var notes: String
    var os: String
    enum CodingKeys: String, CodingKey { case keepAliveSec, notes, os }
    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(keepAliveSec, forKey: .keepAliveSec)
        try c.encode(notes, forKey: .notes)
        try c.encode(os, forKey: .os)
    }
}

struct RunResult: Encodable, Sendable {
    var engine: String
    var model: String
    var lang: String
    var run: Int
    var batchLimit: BatchLimit
    var coldMs: Double
    var totalMs: Double
    var blocks: [BlockResult]
    var batches: [BatchResult]
    var env: Env
    var error: String?   // top-level, only for unavailable / needs_language_pack (exit 0)
    enum CodingKeys: String, CodingKey {
        case engine, model, lang, run, batchLimit, coldMs, totalMs, blocks, batches, env, error
    }
    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(engine, forKey: .engine)
        try c.encode(model, forKey: .model)
        try c.encode(lang, forKey: .lang)
        try c.encode(run, forKey: .run)
        try c.encode(batchLimit, forKey: .batchLimit)
        try c.encode(coldMs, forKey: .coldMs)
        try c.encode(totalMs, forKey: .totalMs)
        try c.encode(blocks, forKey: .blocks)
        try c.encode(batches, forKey: .batches)
        try c.encode(env, forKey: .env)
        if let error { try c.encode(error, forKey: .error) }
    }
}

/// Consecutive blocks packed up to char/block limits (a single oversized block gets its own batch).
func makeBatches(_ blocks: [Block], maxChars: Int, maxBlocks: Int) -> [[Block]] {
    var out: [[Block]] = []
    var cur: [Block] = []
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

/// PLAN §4.4 fallback: split block at `x` items into runs of consecutive `t` slots.
struct Run { var slots: [Int]; var text: String }
func runs(of block: Block) -> [Run] {
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

func hasLetters(_ s: String) -> Bool {
    s.unicodeScalars.contains { CharacterSet.letters.contains($0) }
}

func ms(_ d: Duration) -> Double {
    let c = d.components
    return Double(c.seconds) * 1000 + Double(c.attoseconds) / 1e15
}

func osString() -> String { ProcessInfo.processInfo.operatingSystemVersionString }
