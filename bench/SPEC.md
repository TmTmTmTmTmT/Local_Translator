# bench/SPEC.md — 벤치마크 공통 인터페이스 (Phase 0)

상위 문서: `../PLAN.md` §4.3, §4.6, §5. 모든 도구는 이 명세의 JSON 형식을 따른다. 형식 변경 필요 시 구현 중단 후 STATUS "Opus 확인 필요".

## 1. 코퍼스 `bench/corpus/<lang>.json`  (lang = en | ja | zh-Hans | zh-Hant)

```json
{
  "lang": "en",
  "context": { "title": "Short page/article title in source language", "host": "example.com" },
  "blocks": [
    {
      "id": "en-tech-01",
      "genre": "tech | news | community | ui | link | seq",
      "items": [
        { "k": "t", "i": 0, "text": "Click " },
        { "k": "x", "text": "here" },
        { "k": "t", "i": 1, "text": " to continue." }
      ]
    }
  ]
}
```
- `t` = 번역 슬롯(i는 블록 내 0부터 연속), `x` = 고정 항목(링크/코드 등, 번역 금지).
- genre `seq` = 같은 글의 연속 문맥 세트(블록 순서가 문서 순서, 용어·호칭 일관성 확인용). 나머지 장르는 독립 블록.
- 슬롯 텍스트의 앞뒤 공백은 보존한다(위 예시처럼).

## 2. 엔진 어댑터 CLI (공통)

```
<adapter> --engine <engineId> --corpus <corpus.json> --out <result.json> [--model <name>] [--keep-alive <sec>]
```
- 하나의 코퍼스 파일 = 하나의 "문서". 블록은 문서 순서대로 **연속 블록 묶음(배치)** 으로 번역한다: 한 배치 ≤ 6000자 / 40블록 (엔진이 더 작은 한도 필요 시 하향, `batchLimit`에 기록).
- 엔진별 입력 구성: LLM 계열은 `prompt` 지시문(PLAN §4.6 1~5 + 언어별 보충) + `context.title` + 배치 블록 JSON → 출력 JSON `{"blocks":[{"id":"..","t":{"0":"..","1":".."}}]}`. 전용 MT/Apple 평문 계열은 PLAN §4.4 대체 규칙(x 경계 구간 단위 번역, 구간 내 슬롯 여러 개면 첫 슬롯에 전체·나머지 "").
- 엔진 지시문 파일: `bench/prompt.json` (`{"system": "...", "langNotes": {"ja":"...","zh-Hans":"...","zh-Hant":"...","en":""}}`) — Node·Swift 어댑터 모두 이 파일을 읽는다. (소유: Node 어댑터 담당)

## 3. 결과 `bench/results/<engineId>__<lang>__r<N>.json`

```json
{
  "engine": "ollama-qwen3-1.7b",
  "model": "qwen3:1.7b",
  "lang": "en",
  "run": 1,
  "batchLimit": { "chars": 6000, "blocks": 40 },
  "coldMs": 1234,
  "totalMs": 8000,
  "blocks": [
    { "id": "en-tech-01", "ms": 310, "slots": { "0": "계속하려면 ", "1": "을(를) 클릭하세요." }, "error": null }
  ],
  "env": { "keepAliveSec": 300, "notes": "" }
}
```
- `ms` = 해당 블록이 속한 배치 시간을 배치 내 블록 수로 나눈 값(배치 단위 측정이면 동일 값). 배치별 시간은 `batches: [{blockIds:[...], ms}]`로 추가 기록.
- `slots`: 모든 슬롯 id → 번역문. 실패/누락이면 해당 키 생략, 블록 전체 실패면 `slots: null` + `error` 문자열.
- `x` 항목은 결과에 포함하지 않는다(원문 그대로 사용하므로).
- `coldMs` = 첫 배치 요청 시간(모델 로드 포함), 이후 요청은 웜.

## 4. 엔진 ID 규칙
`<family>-<name>[-variant]` 소문자: `apple-mt-plain`, `apple-mt-attr`, `apple-fm`, `ollama-<model>`, `mlx-<model>`, `ct2-<model>`.

## 5. 공통 규칙
- 모든 네트워크 호출은 `127.0.0.1` 한정. 모델 다운로드·pip 설치는 하지 말 것(사용자 승인 후 별도 단계).
- 외부 사이트 문장 복사 금지(코퍼스는 직접 작성).
- 결과·로그에 개인정보 없음.
