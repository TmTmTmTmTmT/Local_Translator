// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "kt-bench",
    platforms: [.macOS("26.4")],
    products: [.executable(name: "kt-bench", targets: ["kt-bench"])],
    targets: [
        .executableTarget(name: "kt-bench", path: "Sources/kt-bench")
    ],
    swiftLanguageModes: [.v6]
)
