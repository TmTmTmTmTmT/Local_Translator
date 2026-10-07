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

// MARK: hardening helpers (timeout, circuit breaker, availability cache)

/// Resumes exactly once, from whichever of the racing tasks finishes first.
private final class Once<T: Sendable>: @unchecked Sendable {
    private let lock = NSLock()
    private var cont: CheckedContinuation<T, Error>?
    init(_ c: CheckedContinuation<T, Error>) { cont = c }
    func finish(_ r: Result<T, Error>) {
        lock.lock(); let c = cont; cont = nil; lock.unlock()
        c?.resume(with: r)
    }
}

/// Runs `op`, failing with code `timeout` after `seconds`. Does not wait for `op` to honor cancellation
/// (framework calls may ignore it), so the caller is never stuck behind a hung session.
func withDeadline<T: Sendable>(seconds: Double, _ op: @escaping @Sendable () async throws -> T) async throws -> T {
    try await withCheckedThrowingContinuation { (c: CheckedContinuation<T, Error>) in
        let once = Once<T>(c)
        let work = Task {
            do { once.finish(.success(try await op())) } catch { once.finish(.failure(error)) }
        }
        Task {
            try? await Task.sleep(nanoseconds: UInt64(seconds * 1_000_000_000))
            work.cancel()
            once.finish(.failure(EngineError(code: "timeout", message: "timed out after \(Int(seconds))s")))
        }
    }
}

/// N consecutive failures within `window` open the breaker for `cooldown`; while open the framework is not invoked.
actor CircuitBreaker {
    let threshold: Int, window: Duration, cooldown: Duration
    private var failures: [ContinuousClock.Instant] = []
    private var openUntil: ContinuousClock.Instant?

    init(threshold: Int = 3, window: Duration = .seconds(60), cooldown: Duration = .seconds(30)) {
        self.threshold = threshold; self.window = window; self.cooldown = cooldown
    }

    func isOpen(now: ContinuousClock.Instant = .now) -> Bool {
        if let u = openUntil {
            if now < u { return true }
            openUntil = nil; failures.removeAll()
        }
        return false
    }

    func recordSuccess() { failures.removeAll(); openUntil = nil }

    func recordFailure(now: ContinuousClock.Instant = .now) {
        failures.append(now)
        failures.removeAll { $0 + window < now }
        if failures.count >= threshold { openUntil = now + cooldown; failures.removeAll() }
    }

    /// Codes that indicate a broken framework rather than a user-state answer (missing pack, unsupported language).
    static func counts(_ code: String) -> Bool {
        ["timeout", "engine_unavailable", "unknown", "bad_response"].contains(code)
    }
}

/// Per-key TTL cache of language-pack status; the whole cache is dropped on any engine error.
actor TTLCache<V: Sendable> {
    let ttl: Duration
    private var map: [String: (V, ContinuousClock.Instant)] = [:]
    init(ttl: Duration = .seconds(30)) { self.ttl = ttl }
    func get(_ k: String, now: ContinuousClock.Instant = .now) -> V? {
        guard let (v, t) = map[k], t + ttl > now else { map[k] = nil; return nil }
        return v
    }
    func set(_ k: String, _ v: V, now: ContinuousClock.Instant = .now) { map[k] = (v, now) }
    func invalidate() { map.removeAll() }
}

enum Limits {
    static let mtTimeout = 45.0
    static let fmTimeout = 90.0
    static let maxSessions = 8
    static let idleSeconds = 60
}
