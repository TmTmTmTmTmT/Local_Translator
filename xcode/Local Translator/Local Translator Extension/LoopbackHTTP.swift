// Native `http` message: loopback HTTP proxy so Ollama sees no browser Origin header (F21), plus https to the DeepL API hosts only (F24).
// Host restriction is enforced here independently of the JS side; bodies and headers (API key) are never logged.
import Foundation
import os.log

enum LoopbackHTTP {
    static let maxRequestBytes = 4 * 1024 * 1024
    static let maxResponseBytes = 8 * 1024 * 1024
    static let defaultTimeout = 120.0
    static let maxTimeout = 300.0
    static let allowedHosts: Set<String> = ["127.0.0.1", "localhost", "::1"]
    static let httpsHosts: Set<String> = ["api-free.deepl.com", "api.deepl.com"]
    private static let log = Logger(subsystem: "com.tmtmtmtmtmt.localtranslator", category: "http")

    /// Returns the validated URL, or nil unless it is http://<loopback>[:1-65535]/... or https://<DeepL host>[:443]/... without credentials.
    static func validate(_ raw: String?) -> URL? {
        guard let raw, let u = URL(string: raw), let c = URLComponents(url: u, resolvingAgainstBaseURL: false),
              c.user == nil, c.password == nil, let host = c.host?.lowercased()
        else { return nil }
        switch c.scheme?.lowercased() {
        case "http":
            guard allowedHosts.contains(host) || allowedHosts.contains(host.trimmingCharacters(in: ["[", "]"])) else { return nil }
            if let p = c.port, !(1...65535).contains(p) { return nil }
            return u
        case "https":
            guard httpsHosts.contains(host), c.port == nil || c.port == 443 else { return nil }
            return u
        default:
            return nil
        }
    }

    static func perform(_ req: ProtoRequest) async -> ProtoResponse {
        let method = (req.method ?? "POST").uppercased()
        guard method == "GET" || method == "POST" else { return .failure("bad_response", "http method not allowed") }
        guard let url = validate(req.url) else { return .failure("bad_response", "http target not allowed (loopback http or DeepL https only)") }
        let bodyData = req.body.map { Data($0.utf8) }
        if let b = bodyData, b.count > maxRequestBytes { return .failure("bad_response", "http request body too large") }
        let timeout = min(max(req.timeoutMs.map { $0 / 1000 } ?? defaultTimeout, 1), maxTimeout)

        let cfg = URLSessionConfiguration.ephemeral
        cfg.httpCookieStorage = nil
        cfg.httpShouldSetCookies = false
        cfg.httpCookieAcceptPolicy = .never
        cfg.urlCache = nil
        cfg.requestCachePolicy = .reloadIgnoringLocalCacheData
        cfg.timeoutIntervalForRequest = timeout
        cfg.timeoutIntervalForResource = timeout
        if url.scheme?.lowercased() == "http" { cfg.connectionProxyDictionary = [:] }  // never route loopback traffic through a system proxy
        let session = URLSession(configuration: cfg, delegate: NoRedirect(), delegateQueue: nil)
        defer { session.finishTasksAndInvalidate() }

        var r = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: timeout)
        r.httpMethod = method
        r.httpShouldHandleCookies = false
        for (k, v) in req.headers ?? [:] {
            let l = k.lowercased()
            if ["host", "cookie", "origin", "content-length"].contains(l) { continue }
            r.setValue(v, forHTTPHeaderField: k)
        }
        if method == "POST" { r.httpBody = bodyData }

        let started = ContinuousClock.now
        let path = url.path
        do {
            let (bytes, resp) = try await session.bytes(for: r)
            guard let http = resp as? HTTPURLResponse else { return .failure("bad_response", "non-HTTP response") }
            if http.expectedContentLength > Int64(maxResponseBytes) {
                return .failure("bad_response", "http response too large")
            }
            var data = Data()
            for try await b in bytes {
                data.append(b)
                if data.count > maxResponseBytes { return .failure("bad_response", "http response too large") }
            }
            let ms = started.duration(to: .now) / .milliseconds(1)
            log.notice("http \(method, privacy: .public) \(path, privacy: .public) status=\(http.statusCode) ms=\(ms)")
            var out = ProtoResponse(ok: true)
            out.status = http.statusCode
            out.body = String(decoding: data, as: UTF8.self)
            return out
        } catch let e as URLError {
            let ms = started.duration(to: .now) / .milliseconds(1)
            log.notice("http \(method, privacy: .public) \(path, privacy: .public) error=\(e.code.rawValue) ms=\(ms)")
            if e.code == .timedOut { return .failure("timeout", "http timed out") }
            if e.code == .cancelled { return .failure("bad_response", "http redirect refused") }
            return .failure("engine_unavailable", "http connection failed (\(e.code.rawValue))")
        } catch {
            return .failure("unknown", "http failed")
        }
    }

    /// Redirects could leave the allowlist; refuse them all.
    private final class NoRedirect: NSObject, URLSessionTaskDelegate, @unchecked Sendable {
        func urlSession(_ session: URLSession, task: URLSessionTask, willPerformHTTPRedirection response: HTTPURLResponse,
                        newRequest request: URLRequest, completionHandler: @escaping (URLRequest?) -> Void) {
            completionHandler(nil)
        }
    }
}
