import SwiftUI
import SafariServices
@preconcurrency import Translation
import FoundationModels
import Security

private let extensionID = "com.tmtmtmtmtmt.localtranslator.Extension"

struct PackLang: Identifiable {
    let id: String      // BCP-47 source code
    let label: String
}

/// 앱·확장의 코드 서명 상태. 팀 서명(TeamIdentifier 있음, ad-hoc 아님)이어야 Safari 재시작 후에도 확장이 유지된다.
enum SigningState {
    case team(String), adhoc, unknown

    static func current() -> SigningState {
        func info(_ url: URL) -> (team: String?, adhoc: Bool)? {
            var code: SecStaticCode?
            guard SecStaticCodeCreateWithPath(url as CFURL, [], &code) == errSecSuccess, let code else { return nil }
            var cf: CFDictionary?
            guard SecCodeCopySigningInformation(code, SecCSFlags(rawValue: kSecCSSigningInformation), &cf) == errSecSuccess,
                  let d = cf as? [String: Any] else { return nil }
            let flags = (d[kSecCodeInfoFlags as String] as? UInt32) ?? 0
            return (d[kSecCodeInfoTeamIdentifier as String] as? String, flags & 0x2 != 0)
        }
        let app = Bundle.main.bundleURL
        let appex = app.appendingPathComponent("Contents/PlugIns/Local Translator Extension.appex")
        guard let a = info(app), let x = info(appex) else { return .unknown }
        if a.adhoc || x.adhoc || a.team == nil || x.team == nil { return .adhoc }
        return .team(a.team ?? "")
    }
}

private let packLangs = [
    PackLang(id: "en", label: "영어 (en)"),
    PackLang(id: "ja", label: "일본어 (ja)"),
    PackLang(id: "zh-Hans", label: "중국어 간체 (zh-Hans)"),
    PackLang(id: "zh-Hant", label: "중국어 번체 (zh-Hant)"),
]

struct ContentView: View {
    @State private var statuses: [String: LanguageAvailability.Status] = [:]
    @State private var config: TranslationSession.Configuration?
    @State private var installing: String?
    @State private var message = ""
    @State private var aiText = "확인 중…"
    @State private var signing = SigningState.current()

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Local Translator").font(.title2.bold())

            GroupBox("1. Safari 확장 켜기") {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Safari 설정 > 확장 프로그램에서 Local Translator를 체크하고, 모든 웹사이트 접근을 허용하세요.")
                        .fixedSize(horizontal: false, vertical: true)
                    Button("Safari 확장 설정 열기") {
                        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionID) { error in
                            if let error {
                                let ns = error as NSError
                                // SFErrorNoExtensionFound(1): Safari가 방금 설치·등록된 확장을 아직 모름
                                let text = (ns.domain == SFErrorDomain && ns.code == 1)
                                    ? "Safari가 아직 확장을 인식하지 못했습니다. Safari를 완전히 종료(⌘Q)했다가 다시 연 뒤 시도하세요."
                                    : "열기 실패: \(error.localizedDescription)"
                                Task { @MainActor in message = text }
                            }
                        }
                    }
                }.frame(maxWidth: .infinity, alignment: .leading).padding(4)
            }

            GroupBox("2. 언어팩 (→ 한국어)") {
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(packLangs) { l in
                        HStack {
                            Text(l.label)
                            Spacer()
                            statusView(statuses[l.id])
                            if statuses[l.id] == .supported {
                                Button(installing == l.id ? "설치 중…" : "설치") { install(l.id) }
                                    .disabled(installing != nil)
                            }
                        }
                    }
                    Button("상태 새로고침") { Task { await refresh() } }
                }.padding(4)
            }

            GroupBox("3. Apple Intelligence (선택, apple-fm 엔진)") {
                Text(aiText).frame(maxWidth: .infinity, alignment: .leading).padding(4)
            }

            signingView

            Text("사용법: 확장 팝업에서 번역할 사이트를 추가하면 해당 사이트가 자동으로 한국어로 번역됩니다. 언어팩은 이 앱에서만 설치할 수 있으며, 설치되지 않은 언어는 번역되지 않습니다.")
                .font(.callout).foregroundStyle(.secondary).fixedSize(horizontal: false, vertical: true)
            if !message.isEmpty { Text(message).foregroundStyle(.orange) }
        }
        .padding(20)
        .task { await refresh() }
        .translationTask(config) { session in
            do {
                try await session.prepareTranslation()
            } catch {
                message = "설치 실패 또는 취소: \(error.localizedDescription)"
            }
            installing = nil
            await refresh()
        }
    }

    @ViewBuilder private var signingView: some View {
        switch signing {
        case .team(let id):
            Label("팀 서명됨 (\(id)) — Safari를 다시 시작해도 확장이 유지됩니다.", systemImage: "checkmark.seal.fill").foregroundStyle(.green)
        case .adhoc:
            Label("서명 없음(ad-hoc) — Safari를 다시 시작할 때마다 개발자용 › '서명되지 않은 확장 프로그램 허용'을 켜야 합니다. scripts/install.sh로 다시 설치하세요.", systemImage: "exclamationmark.triangle.fill")
                .foregroundStyle(.orange).fixedSize(horizontal: false, vertical: true)
        case .unknown:
            Label("서명 상태를 확인하지 못했습니다.", systemImage: "questionmark.circle").foregroundStyle(.secondary)
        }
    }

    @ViewBuilder private func statusView(_ s: LanguageAvailability.Status?) -> some View {
        switch s {
        case .installed: Label("설치됨", systemImage: "checkmark.circle.fill").foregroundStyle(.green)
        case .supported: Label("미설치", systemImage: "arrow.down.circle").foregroundStyle(.orange)
        case .unsupported: Label("지원 안 함", systemImage: "xmark.circle").foregroundStyle(.secondary)
        default: Text("확인 중…").foregroundStyle(.secondary)
        }
    }

    private func install(_ id: String) {
        installing = id
        message = ""
        config = TranslationSession.Configuration(source: Locale.Language(identifier: id),
                                                  target: Locale.Language(identifier: "ko"))
        config?.invalidate()
    }

    private func refresh() async {
        let la = LanguageAvailability()
        for l in packLangs {
            statuses[l.id] = await la.status(from: Locale.Language(identifier: l.id), to: Locale.Language(identifier: "ko"))
        }
        switch SystemLanguageModel.default.availability {
        case .available: aiText = "사용 가능"
        case .unavailable(let r):
            switch r {
            case .deviceNotEligible: aiText = "이 기기는 Apple Intelligence를 지원하지 않습니다."
            case .appleIntelligenceNotEnabled: aiText = "시스템 설정에서 Apple Intelligence를 켜야 합니다."
            case .modelNotReady: aiText = "모델 준비 중입니다. 잠시 후 새로고침하세요."
            @unknown default: aiText = "사용 불가"
            }
        }
    }
}
