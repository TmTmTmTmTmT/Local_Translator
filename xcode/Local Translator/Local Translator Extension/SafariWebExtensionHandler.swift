// Safari extension entry point: JSON message <-> Codable ProtoRequest/ProtoResponse, dispatch to engine actors.
import SafariServices
import os.log

private final class ContextBox: @unchecked Sendable {
    let ctx: NSExtensionContext
    init(_ c: NSExtensionContext) { ctx = c }
}

enum Dispatcher {
    static func handle(_ req: ProtoRequest) async -> ProtoResponse {
        switch req.type {
        case "status": return await status()
        case "translate": return await translate(req)
        default: return .failure("bad_response", "unknown type: \(req.type)")
        }
    }

    static func status() async -> ProtoResponse {
        var packs: [String: String] = [:]
        for l in Langs.sources { packs[l] = await MTEngine.packStatus(l) }
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
        let blocks = req.blocks ?? []
        let name = req.engine ?? "apple-mt"
        do {
            let results: [ProtoResult]
            switch name {
            case "apple-mt":
                results = try await MTEngine.shared.translate(blocks: blocks, requestLang: req.lang,
                                                              variant: MTVariant(rawValue: req.variant ?? "attr") ?? .attr)
            case "apple-fm":
                results = try await FMEngine.shared.translate(blocks: blocks, context: req.context, requestLang: req.lang)
            default:
                return .failure("engine_unavailable", "unknown engine: \(name)")
            }
            return ProtoResponse(ok: true, results: results, engine: name)
        } catch let e as EngineError {
            return e.response
        } catch {
            return .failure("unknown", "\(error)")
        }
    }
}

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem
        let message = request?.userInfo?[SFExtensionMessageKey]
        let box = ContextBox(context)

        guard let message, JSONSerialization.isValidJSONObject(message),
              let data = try? JSONSerialization.data(withJSONObject: message),
              let req = try? JSONDecoder().decode(ProtoRequest.self, from: data) else {
            Self.complete(box, .failure("bad_response", "invalid request"))
            return
        }
        Task {
            let resp = await Dispatcher.handle(req)
            Self.complete(box, resp)
        }
    }

    private static func complete(_ box: ContextBox, _ resp: ProtoResponse) {
        var obj: Any = ["ok": false]
        if let d = try? JSONEncoder().encode(resp), let o = try? JSONSerialization.jsonObject(with: d) { obj = o }
        let item = NSExtensionItem()
        item.userInfo = [SFExtensionMessageKey: obj]
        box.ctx.completeRequest(returningItems: [item], completionHandler: nil)
    }
}
