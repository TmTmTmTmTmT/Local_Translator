# xcode/ — Local Translator (Safari 확장 + 컨테이너 앱)

프로젝트: `xcode/Local Translator/Local Translator.xcodeproj` (스킴 `Local Translator`, 타깃 `Local Translator` 앱 + `Local Translator Extension` appex).
`xcrun safari-web-extension-packager`로 생성했고 웹 확장 리소스는 `../extension/`을 **참조**한다(복사 아님) — JS를 고치면 다시 빌드만 하면 된다.
Xcode 27의 새 프로젝트 형식(`project.xcproj`)이므로 Xcode 27 이상에서 연다. 배포 대상 macOS 26.4, Swift 6.

## 구성
- `Local Translator Extension/` — Swift 핸들러. `Protocol.swift`(Codable, PROTOCOL §4), `EngineMT.swift`(apple-mt: marker/attr/plain), `EngineFM.swift`(apple-fm, 온디바이스 전용), `SafariWebExtensionHandler.swift`(디스패치).
- `Local Translator/` — SwiftUI 컨테이너 앱 (확장 켜기 버튼, 언어팩 설치 `translationTask`+`prepareTranslation()`, Apple Intelligence 상태).
- 메시지 필드 `variant: "marker"|"attr"|"plain"` (apple-mt, 기본 `marker`).
- 하드닝(타임아웃 MT 45s/FM 90s, 엔진별 서킷브레이커, 30초 가용성 캐시, 세션 8개·60초 유휴 해제, 깨진 메시지 → `bad_response`)은 `extension/PROTOCOL.md` §4.
- 확장 프로세스는 언어팩을 다운로드하지 않는다. 미설치면 `{ok:false,error:{code:"needs_language_pack",lang}}`.

## 빌드
```sh
cd "xcode/Local Translator"
# 서명 없이 컴파일 확인
xcodebuild -project "Local Translator.xcodeproj" -scheme "Local Translator" -configuration Debug \
  -destination 'platform=macOS' CODE_SIGNING_ALLOWED=NO build
# Safari에서 로드할 빌드 (ad-hoc 서명, 샌드박스 entitlement 포함)
xcodebuild -project "Local Translator.xcodeproj" -scheme "Local Translator" -configuration Debug \
  -destination 'platform=macOS' CODE_SIGN_IDENTITY=- CODE_SIGN_STYLE=Manual DEVELOPMENT_TEAM= build
```
산출물은 `~/Library/Developer/Xcode/DerivedData/Local_Translator-*/Build/Products/Debug/Local Translator.app`.

## 서명 (사용자가 직접)
Apple Developer Team 서명은 이 환경에 없어 ad-hoc(`-`)로만 검증했다. Team으로 서명하려면 Xcode에서 프로젝트를 열고 두 타깃의 Signing & Capabilities에서 Team 선택(Automatic signing) 후 Run. 번들 ID는 `com.tmtmtmtmtmt.localtranslator`(앱), `com.tmtmtmtmtmt.localtranslator.Extension`(확장). 다른 Team이면 번들 ID 접두를 바꾸고, 컨테이너 앱 `ContentView.swift`의 `extensionID`도 같이 바꾼다.

## Safari에서 켜기
1. 앱을 한 번 실행한다(`open "…/Local Translator.app"`) — 확장이 시스템에 등록된다.
2. Safari > 설정 > 고급 > "메뉴 막대에서 개발자용 메뉴 보기" 체크.
3. 개발자용 > **서명되지 않은 확장 프로그램 허용**(Develop > Allow Unsigned Extensions). Safari를 재시작하면 매번 다시 켜야 한다.
4. Safari > 설정 > 확장 프로그램에서 Local Translator 체크, "모든 웹 사이트" 접근 허용. (앱의 "Safari 확장 설정 열기" 버튼으로도 이동)

## 언어팩 설치 안내 (한 줄)
언어팩은 컨테이너 앱의 [설치] 버튼으로만 받을 수 있습니다: 앱을 열고 미설치 언어 옆 "설치"를 눌러 시스템 다운로드 창에서 허용하세요.

## 한계
- 실제 Safari 안에서의 확장 로딩·`sendNativeMessage` 왕복은 이 환경에서 자동 검증하지 못했다(Safari GUI 필요). 엔진 로직은 같은 소스를 CLI로 컴파일해 apple-mt(attr/plain)/apple-fm/status/에러 경로를 실행해 확인했다.
- ad-hoc 서명 확장은 "서명되지 않은 확장 프로그램 허용" 켠 상태에서만 Safari가 로드한다.
