# manifest.json 메모

JSON은 주석을 허용하지 않아 결정 사항을 여기에 기록한다.

- `content_scripts` 없음. 지정 사이트에만 background가 `scripting.registerContentScripts`로 동적 등록한다 (PLAN §2, §4.1). 등록 파일 순서: `content/text.js`, `content/filter.js`, `content/segmenter.js`, `content/apply.js`, `content/main.js`.
- `background.scripts` 배열 + `persistent: false`. Safari는 scripts 배열을 받으며 `type`은 지정하지 않는다 (클래식 스크립트, 위 순서대로 로드).
- `declarativeNetRequest` 권한은 생략. PDF 자동 진입에 DNR redirect를 쓰기로 Phase 1에서 확정되면 추가한다 (권한 변경이므로 Opus 확인 필요).
- `web_accessible_resources`는 `viewer/viewer.html`만.
- `default_locale` 없음. 버전 0.1.0.
- 아이콘은 `icons/make-icons.mjs`로 생성 (`node extension/icons/make-icons.mjs`).
