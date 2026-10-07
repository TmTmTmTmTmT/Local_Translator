// Safari extension entry point: JSON message <-> Codable ProtoRequest/ProtoResponse, dispatch to engine actors.
// Hardening: malformed input -> bad_response, per-request timeout, per-engine circuit breaker.
import SafariServices
import os.log

private final class ContextBox: @unchecked Sendable {
    let ctx: NSExtensionContext
    init(_ c: NSExtensionContext) { ctx = c }
}

private final class MessageBox: @unchecked Sendable {
    let value: Any?
    init(_ v: Any?) { value = v }
}

enum Dispatcher {
    static let mtBreaker = CircuitBreaker()
    static let fmBreaker = CircuitBreaker()

    /// Decodes an arbitrary JSON value from the browser; anything malformed yields bad_response, never a crash.
    static func handleRaw(_ message: Any?) async -> ProtoResponse {
        guard let message, JSONSerialization.isValidJSONObject(message),
              let data = try? JSONSerialization.data(withJSONObject: message),
              let req = try? JSONDecoder().decode(ProtoRequest.self, from: data) else {
            return .failure("bad_response", "invalid request")
        }
        return await handle(req)
    }

    static func handle(_ req: ProtoRequest) async -> ProtoResponse {
        switch req.type {
        case "status": return await status()
        case "translate": return await translate(req)
        default: return .failure("bad_response", "unknown type: \(req.type)")
        }
    }

    static func status() async -> ProtoResponse {
        var packs: [String: String] = [:]
        // fresh: the container app may have just installed a pack; status is the authoritative refresh point.
        for l in Langs.sources { packs[l] = await MTEngine.packStatus(l, fresh: true) }
        // "zh" (script unknown): installed if either script is installed; translate() stays authoritative.
        let h = packs["zh-Hans"] ?? "unsupported", t = packs["zh-Hant"] ?? "unsupported"
        packs["zh"] = (h == "installed" || t == "installed") ? "installed"
            : (h == "supported" || t == "supported") ? "supported" : "unsupported"
        let mtAvail = packs.filter { Langs.sources.contains($0.key) }.contains { $0.value != "unsupported" }
        let engines: [String: ProtoEngineStatus] = [
            "apple-mt": ProtoEngineStatus(available: mtAvail, reason: mtAvail ? nil : "unsupported_lang"),
            "apple-fm": FMEngine.status(),
        ]
        return ProtoResponse(ok: true, engines: engines, languagePacks: packs)
    }

    static func translate(_ req: ProtoRequest) async -> ProtoResponse {
        let name = req.engine ?? "apple-mt"
        let breaker: CircuitBreaker, timeout: Double
        switch name {
        case "apple-mt": breaker = mtBreaker; timeout = Limits.mtTimeout
        case "apple-fm": breaker = fmBreaker; timeout = Limits.fmTimeout
        default: return .failure("engine_unavailable", "unknown engine: \(name)")
        }
        if await breaker.isOpen() {
            return .failure("engine_unavailable", "\(name) temporarily disabled after repeated failures")
        }
        let blocks = req.blocks ?? []
        let resp: ProtoResponse
        do {
            let results: [ProtoResult] = try await withDeadline(seconds: timeout) {
                if name == "apple-mt" {
                    return try await MTEngine.shared.translate(blocks: blocks, requestLang: req.lang,
                                                               variant: MTVariant(rawValue: req.variant ?? "marker") ?? .marker)
                }
                return try await FMEngine.shared.translate(blocks: blocks, context: req.context, requestLang: req.lang)
            }
            resp = ProtoResponse(ok: true, results: results, engine: name)
        } catch let e as EngineError {
            resp = e.response
        } catch {
            resp = .failure("unknown", "\(error)")
        }
        if let code = resp.error?.code, CircuitBreaker.counts(code) {
            await breaker.recordFailure()
            await MTEngine.invalidateAvailability()
        } else {
            await breaker.recordSuccess()
        }
        return resp
    }
}

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem
        let msg = MessageBox(request?.userInfo?[SFExtensionMessageKey])
        let box = ContextBox(context)
        Task {
            let resp = await Dispatcher.handleRaw(msg.value)
            Self.complete(box, resp)
        }
    }

    private static func complete(_ box: ContextBox, _ resp: ProtoResponse) {
        var obj: Any = ["ok": false, "error": ["code": "unknown", "message": "encode failed"]]
        if let d = try? JSONEncoder().encode(resp), let o = try? JSONSerialization.jsonObject(with: d) { obj = o }
        let item = NSExtensionItem()
        item.userInfo = [SFExtensionMessageKey: obj]
        box.ctx.completeRequest(returningItems: [item], completionHandler: nil)
    }
}
