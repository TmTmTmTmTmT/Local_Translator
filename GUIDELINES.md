# GUIDELINES — ko-translator 코딩 가이드

## 일반
- 언어: plain JavaScript (ES2022). TypeScript·번들러·프레임워크 금지. 런타임 의존성 0.
- 브라우저 API: `browser.*` 네임스페이스 사용 (Safari 지원). Promise 기반.
- content 스크립트: 각 파일은 IIFE로 감싸고 `globalThis.KT = globalThis.KT || {}`에 함수 노출. 테스트에서 재사용 가능하도록 DOM 의존 함수는 `document`/`Node`를 인자로 받거나 전역을 그대로 사용(jsdom 호환).
- 순수 로직(필터 판정, 직렬화, 재구성, 패턴 매칭, 캐시, 배치 분할)은 DOM/브라우저 API 호출과 분리해 단위 테스트 가능하게 작성.
- 주석은 "왜"만. 파일 상단에 1~2줄 역할 설명.
- 이름: camelCase 함수/변수, UPPER_SNAKE 상수. 메시지 타입은 문자열 상수 객체로 한 곳(`background.js` 상단 및 main.js에서 동일 문자열)에 정의.

## 보안
- 페이지 DOM 변경은 텍스트 노드 `nodeValue` 교체와 블록 `lang`/`data-kt` 속성만 허용. 요소 생성·이동·삭제, `innerHTML`/`outerHTML`/`insertAdjacentHTML` 금지 (PLAN §4.4).
- DeepL HTML 응답 파싱은 `DOMParser` 비활성 문서에서 텍스트 읽기 용도로만.
- API 키는 background와 options에서만 접근. content 스크립트로 전달 금지. 로그 출력 금지.
- 페이지 텍스트 전송 대상: 네이티브 핸들러, `localhost`/`127.0.0.1` local-llm만. 외부 도메인 전송 금지 (클라우드 엔진은 Phase 3에서 별도 승인).
- apple-llm은 온디바이스 `SystemLanguageModel`만. `PrivateCloudComputeLanguageModel` 사용 금지.
- 옵션 페이지 키 입력은 `type="password"`.

## 성능
- 비지정 사이트 주입 금지(동적 등록). 지정 사이트에서도 페이지 전체 순회는 초기 1회 + 변경 블록만.
- `TreeWalker` 사용, `querySelectorAll('*')` 금지.
- 레이아웃 강제 읽기(`getBoundingClientRect`, `offsetHeight`) 루프 금지 — 가시성은 IntersectionObserver로만.
- DOM 쓰기는 `requestAnimationFrame` 안에서 배치 적용.
- 캐시 영속 쓰기는 디바운스 일괄.

## 번역 품질
- 슬롯 모델(PLAN §4.3) 고정: 블록 = 슬롯(텍스트 노드) + 고정 항목(x). 요청은 문서 순서 연속 블록 묶음 → 문맥 유지.
- 공백 보존: `withOuterWhitespace(original, translated)`로 원문 앞뒤 공백 유지.
- 중간 표현·DeepL 태그(`<t i="N">`, `<x>`) 형식 변경 시 PLAN 수정 필요(Opus).
- Claude 프롬프트는 `providers/claude.js` 상수 하나로 관리. PLAN §4.7의 지시 1~5 모두 포함. 출력은 JSON만.

## PDF 뷰어
- PDF.js는 공식 배포본 고정 버전을 `extension/vendor/pdfjs/`에 그대로 포함(수정 금지), LICENSE·버전 기록. CDN·원격 로드 금지.
- 뷰어 페이지 외 다른 곳에서 PDF.js 로드 금지.
- PDF에서 얻은 텍스트도 DOM 삽입은 `textContent`만.

## Swift (확장 핸들러·컨테이너 앱)
- Swift 6, async/await. 외부 패키지 없음. 배포 대상 macOS 26.4.
- 핸들러 메시지 형식은 JS `providers/native.js`와 1:1. 타입은 `Codable` 구조체.
- 세션(TranslationSession, LanguageModelSession) 언어쌍/엔진별 캐시. 확장 프로세스 메모리 고려해 LLM 세션은 유휴 시 해제.
- 확장 프로세스에서 다운로드·UI 시도 금지 → 에러 코드 반환.
- LLM 지시문은 `prompt.js`와 문구 동일 유지(변경 시 둘 다).

## 에러 처리
- 프로바이더 실패 시 해당 세그먼트는 원문 유지 + `data-kt="error"`, 페이지 깨짐 없어야 함.
- 인증 오류(401/403)는 배지 `!` + 팝업 메시지, 재시도 안 함. 429/5xx만 백오프 재시도(최대 2회).

## 테스트
- `node --test tests/` + jsdom(devDependency). 네트워크 호출은 `globalThis.fetch` 모킹.
- 필수 케이스: 링크·code 텍스트 노드 미변경(노드 identity·이벤트 유지), 적용 후 DOM 요소 수/구조 불변, 원문 토글 왕복 시 `nodeValue` 원복, 앞뒤 공백 보존, `<script>` 문자열 포함 응답이 텍스트로만 들어감, 슬롯 누락 처리(일부/절반 이상), 적용 전 페이지가 바꾼 노드 건너뜀, 한글 비율 ≥50% 블록 스킵, isNonlinguistic(URL/이메일/숫자·기호), 호스트 패턴(서브도메인/정확), 캐시 LRU 제거, DeepL Free/Pro 엔드포인트·`t` 밖 텍스트 귀속, Claude JSON 파싱 실패 재시도.
- 동적 콘텐츠 필수 케이스(jsdom): 노드 추가 후 해당 블록만 번역 요청, 이미 번역된 블록 재요청 없음, 숨김→표시 블록 번역, 원문 되돌림 재적용 3회 제한, 교체 노드 캐시 적용, 제거 노드 결과 폐기, 대량 추가 시 틱당 처리량 제한.
- 장시간·반복 실행은 `sim-runner` 위임.

## Git
- 기본 브랜치 `main`. 작업 단위(T0~T8)마다 커밋. Conventional Commits.
- 커밋 메시지 말미:
  `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` (실행 모델 기준)
- API 키·`xcuserdata`·`node_modules` 커밋 금지.

## 계획 이탈
- PLAN에 없는 설계 변경(플레이스홀더 형식, 저장 구조, 프로바이더 추가, 권한 변경 등) 필요 시 직접 변경하지 말고 `STATUS.md`의 "Opus 확인 필요"에 기록 후 중단.
