# Local_Translator

지정한 사이트를 Safari에서 **항상 한국어로 자동 번역**하는 확장. **로컬 우선**(오프라인·무료), 링크 텍스트·코드 등은 원문 유지, 웹에서 연 PDF도 번역.

- 언어: en / ja / zh(간체·번체) → ko (언어 표 구조라 추가 가능)
- 번역 엔진: macOS 내장 번역(Translation) · Apple 온디바이스 AI · 로컬 모델 서버(Ollama / MLX / CTranslate2). 기본 엔진은 `bench/`의 벤치마크 후 결정 ([DECISIONS.md](DECISIONS.md))
- 페이지에서 "더보기"·무한스크롤 등으로 추가된 내용도 자동 감지해 이어서 번역
- 번역은 텍스트 노드 값만 교체 → 링크·이벤트·레이아웃 보존, SPA 안전

문서: [PLAN.md](PLAN.md) · [GUIDELINES.md](GUIDELINES.md) · [STATUS.md](STATUS.md) · [DECISIONS.md](DECISIONS.md)

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

## 개발

```bash
npm install
npm test            # node --test (jsdom)
```

- `extension/` 웹 확장 소스(번들러 없음), `xcode/` 컨테이너 앱+네이티브 핸들러, `bench/` 엔진 벤치마크
- 벤치 실행: [bench/SPEC.md](bench/SPEC.md), `node bench/orchestrate.mjs --help`, 블라인드 평가 `node bench/rate/build.mjs --lang en`

## 라이선스

미정 ([DECISIONS.md](DECISIONS.md) D9). `extension/vendor/pdfjs`는 Apache-2.0 (pdf.js).
