// CLI entry: kt-bench --engine <id> --corpus <f> --out <f> [--run N] | --list-engines | --probe
import Foundation

@main
struct KTBench {
    static func main() async {
        var args: [String: String] = [:]
        var flags = Set<String>()
        let argv = Array(CommandLine.arguments.dropFirst())
        var i = 0
        while i < argv.count {
            let a = argv[i]
            if a.hasPrefix("--") {
                if i + 1 < argv.count, !argv[i + 1].hasPrefix("--") { args[a] = argv[i + 1]; i += 2; continue }
                flags.insert(a)
            }
            i += 1
        }
        if flags.contains("--list-engines") { allEngineIds().forEach { print($0) }; return }
        if flags.contains("--probe") { await runProbe(); return }
        guard let engine = args["--engine"], let corpusPath = args["--corpus"], let outPath = args["--out"] else {
            FileHandle.standardError.write(Data("usage: kt-bench --engine <id> --corpus <corpus.json> --out <result.json> [--run N] [--prompt <prompt.json>] [--fm-mode guided|text] | --list-engines | --probe\n".utf8))
            exit(2)
        }
        guard allEngineIds().contains(engine) else {
            FileHandle.standardError.write(Data("unknown engine \(engine)\n".utf8)); exit(2)
        }
        let corpus: Corpus
        do { corpus = try JSONDecoder().decode(Corpus.self, from: Data(contentsOf: URL(fileURLWithPath: corpusPath))) }
        catch { FileHandle.standardError.write(Data("cannot read corpus: \(error)\n".utf8)); exit(2) }
        let runNo = Int(args["--run"] ?? "1") ?? 1

        let result: RunResult
        if engine == "apple-fm" {
            result = await runFM(engine: engine, corpus: corpus, runNo: runNo, promptPath: args["--prompt"], corpusPath: corpusPath, mode: args["--fm-mode"] ?? "guided")
        } else {
            let mode: MTMode = engine.hasPrefix("apple-mt-attr") ? .attr : .plain
            let strat: StrategyChoice = engine.hasSuffix("-highfidelity") ? .highFidelity : engine.hasSuffix("-lowlatency") ? .lowLatency : .none
            result = await runMT(engine: engine, mode: mode, strategy: strat, corpus: corpus, runNo: runNo)
        }
        let enc = JSONEncoder()
        enc.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
        do {
            let url = URL(fileURLWithPath: outPath)
            try FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
            try enc.encode(result).write(to: url)
        } catch { FileHandle.standardError.write(Data("write failed: \(error)\n".utf8)); exit(1) }
        if let e = result.error { print("result error: \(e)") }
    }
}
