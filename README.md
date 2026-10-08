# Local_Translator

지정한 사이트를 Safari에서 **항상 한국어로 자동 번역**하는 확장. **로컬 우선**(오프라인·무료), 링크 텍스트·코드 등은 원문 유지, 웹에서 연 PDF도 번역.

- 언어: en / ja / zh(간체·번체) → ko (언어 표 구조라 추가 가능)
- 번역 엔진: macOS 내장 번역(Translation) · Apple 온디바이스 AI · 로컬 모델 서버(Ollama / MLX / CTranslate2).
- 페이지에서 "더보기"·무한스크롤 등으로 추가된 내용도 자동 감지해 이어서 번역
- 번역은 텍스트 노드 값만 교체 → 링크·이벤트·레이아웃 보존, SPA 안전

## 요구 사항

- macOS 26.4 이상, Xcode 27 (Safari 확장 빌드)
- 시스템 설정 › 일반 › 언어 및 지역 › **번역 언어**: 영어·일본어·중국어(간체·번체)·한국어 다운로드
- (선택) Apple Intelligence 켜기 — 온디바이스 AI 엔진용
- (선택) Ollama / `mlx_lm` / CTranslate2 — 로컬 모델 엔진용

## 빌드·설치

```bash
xcodebuild -project "xcode/Local Translator/Local Translator.xcodeproj" \
  -scheme "Local Translator" -configuration Debug \
  CODE_SIGN_IDENTITY=- CODE_SIGN_STYLE=Manual DEVELOPMENT_TEAM= build
```

1. 빌드된 `Local Translator.app`을 한 번 실행 (확장 활성화 안내, 언어팩 상태·설치)
2. Safari › 설정 › 고급 › "메뉴 막대에서 개발자용 메뉴 보기" 켜고, 개발자용 › **서명되지 않은 확장 프로그램 허용** (Safari 재시작마다 다시 켜야 함. Apple Team으로 서명하면 불필요 — [xcode/README.md](xcode/README.md))
3. Safari › 설정 › 확장 프로그램 › Local Translator 켜고 웹사이트 접근 허용
4. 확장 옵션에서 번역할 사이트 추가 (예: `example.com`)

## 사용

- 지정 사이트에서 자동 번역. 팝업에서 사이트 토글, 원문/번역 전환
- PDF: 팝업 "이 PDF 번역해서 보기" (확장 자체 뷰어, 나란히 보기/번역만 보기)
- 제외: 링크 텍스트, `code/pre`, `translate="no"`, `.notranslate`, 입력 필드, 사이트별 사용자 셀렉터

## 고품질 번역 (선택)

기본 번역(Apple 번역)은 설치 없이 바로 쓸 수 있습니다. 더 자연스러운 번역을 원하면 로컬 모델 TranslateGemma 4B를 쓸 수 있습니다. 번역하는 동안 메모리를 약 3GB 쓰고, 5분 동안 쓰지 않으면 자동으로 해제됩니다.

1. [Ollama](https://ollama.com)를 설치하고 실행합니다.
2. 터미널에서 모델을 받습니다 (약 3GB).

   ```bash
   ollama pull translategemma:4b
   ```

3. 확장 옵션 › 엔진 › **고품질 번역 프리셋** 버튼을 누르고 **저장**합니다.

모든 번역은 이 Mac 안에서만 처리되고 외부로 전송되지 않습니다.

## 용어집

옵션에서 고정하고 싶은 번역 쌍을 등록할 수 있습니다 (예: `kerbs => 연석`, `safety car => 세이프티카`). 등록한 용어는 번역 결과에 그대로 쓰입니다.

## 라이선스

미정. `extension/vendor/pdfjs`는 Apache-2.0 (pdf.js).
