# Phase 0 벤치마크 REPORT

생성: 2026-10-07T06:38:00.779Z · 엔진 7 · 언어 en, ja, zh-Hans, zh-Hant

## 1. 엔진 x 언어 요약

| 엔진 | 언어 | runs | coldMs(r1) | warm p50 | warm p95 | 문서 ms (N블록) | 자/초 | 슬롯 반환 | x 보존 | JSON 유효 | 숫자 | URL | 고유명사 | 한글비율 | 미번역 | 길이이상 | 반복/환각 | 오류블록 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| apple-fm | en | 1 | 29211 | 5018 | 5018 | 121149 (29) | 27 | 98% | - | - | 100% | 100% | 61% | 89% | 0 | 1 | 0 | 0 |
| apple-fm | ja | 1 | 116702 | 3480 | 3480 | 123663 (29) | 13 | 8% | - | - | 100% | - | 67% | 87% | 0 | 0 | 0 | 27 |
| apple-fm | zh-Hans | 1 | 108670 | -* | - | 108670 (29) | 11 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| apple-fm | zh-Hant | 1 | 99381 | -* | - | 99381 (29) | 12 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| apple-mt-attr | en | 1 | 64666 | 2230* | 2230 | 64666 (29) | 50 | 100% | - | - | 100% | 100% | 61% | 95% | 0 | 0 | 0 | 0 |
| apple-mt-attr | ja | 1 | 50165 | 1730* | 1730 | 50166 (29) | 31 | 100% | - | - | 97% | 100% | 95% | 93% | 0 | 0 | 0 | 0 |
| apple-mt-attr | zh-Hans | 1 | 53920 | 1859* | 1859 | 53920 (29) | 22 | 100% | - | - | 100% | 100% | 100% | 96% | 0 | 0 | 0 | 0 |
| apple-mt-attr | zh-Hant | 1 | 54642 | 1884* | 1884 | 54642 (29) | 22 | 100% | - | - | 100% | 100% | 100% | 96% | 0 | 0 | 0 | 0 |
| apple-mt-plain | en | 1 | 55227 | 1904* | 1904 | 55227 (29) | 59 | 100% | - | - | 100% | 100% | 61% | 95% | 0 | 0 | 0 | 0 |
| apple-mt-plain | ja | 1 | 48688 | 1679* | 1679 | 48688 (29) | 32 | 100% | - | - | 97% | 100% | 95% | 93% | 0 | 0 | 0 | 0 |
| apple-mt-plain | zh-Hans | 1 | 56417 | 1945* | 1945 | 56417 (29) | 21 | 100% | - | - | 100% | 100% | 100% | 96% | 0 | 0 | 0 | 0 |
| apple-mt-plain | zh-Hant | 1 | 76003 | 2621* | 2621 | 76003 (29) | 16 | 100% | - | - | 100% | 100% | 100% | 96% | 0 | 0 | 0 | 0 |
| apple-mt-plain-lowlatency | en | 1 | 232 | -* | - | 233 (29) | 13948 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| apple-mt-plain-lowlatency | ja | 1 | 217 | -* | - | 217 (29) | 7249 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| apple-mt-plain-lowlatency | zh-Hans | 1 | 242 | -* | - | 243 (29) | 4836 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| apple-mt-plain-lowlatency | zh-Hant | 1 | 236 | -* | - | 236 (29) | 5052 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-hy-mt2-1.8b-4bit | en | 1 | 81684 | -* | - | 81685 (29) | 40 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-hy-mt2-1.8b-4bit | ja | 1 | 90861 | -* | - | 90861 (29) | 17 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-hy-mt2-1.8b-4bit | zh-Hans | 1 | 71840 | -* | - | 71840 (29) | 16 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-hy-mt2-1.8b-4bit | zh-Hant | 1 | 86546 | -* | - | 86546 (29) | 14 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-translategemma-4b-4bit | en | 1 | 1967 | -* | - | 1967 (29) | 1649 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-translategemma-4b-4bit | ja | 1 | 31 | -* | - | 31 (29) | 50839 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-translategemma-4b-4bit | zh-Hans | 1 | 32 | -* | - | 32 (29) | 36656 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-translategemma-4b-4bit | zh-Hant | 1 | 32 | -* | - | 32 (29) | 37250 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| ollama-translategemma-4b | en | 1 | 26946 | 929* | 929 | 26946 (29) | 120 | 18% | - | 100% | 88% | 100% | 100% | 73% | 0 | 0 | 0 | 23 |
| ollama-translategemma-4b | ja | 1 | 15994 | -* | - | 15994 (29) | 99 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |

- warm = run 2+ 전체 + run 1의 첫 배치 제외 블록 (`*` = 표본 부족으로 콜드 포함). 블록 ms는 배치 시간/블록 수.
- x 보존: 결과에 `xPreserved`를 기록하는 엔진만 표시 (LLM 어댑터는 x를 출력하지 않아 `-`). JSON 유효 = 첫 시도 성공 배치 비율(JSON 계열만).
- 숫자/URL/고유명사: 원문 슬롯에 있던 토큰이 출력에 그대로 있는 비율. 고유명사는 휴리스틱(en: 중간 대문자·CamelCase·약어, ja/zh: 라틴 토큰).
- 길이이상: 출력/원문 비공백 길이비가 0.25~3.5 밖. 반복/환각: 동일 10자 구간 3회 이상 반복 또는 출력이 원문 3배+40자 초과.

## 2. 사용자 블라인드 평가

`results/ratings*.json` 없음 (rate.html 평가 후 저장).

## 3. 자원 시나리오

scenario 결과 없음.

모니터 CSV(`monitor__<engine>__<scenario>.csv`) 없음.

전력 로그(`power_<engine>.log`) 없음 — `bench/powermetrics.md` 참고.

## 4. 하드 조건 (PLAN 5.5)

기준: warm p50 <= 500ms, 슬롯/x 보존 >= 95%, 추가 메모리 <= 1.5GB, 스왑 증가 없음, 유휴 시 언로드, 오프라인 동작(로컬 127.0.0.1/온디바이스 — 수동 확인).

| 엔진 | 언어 | p50 | 슬롯/x | 메모리 | 스왑 | 언로드 | 종합 |
|---|---|---|---|---|---|---|---|
| apple-fm | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-fm | ja | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| apple-fm | zh-Hans | N/A | FAIL | N/A | N/A | N/A | FAIL |
| apple-fm | zh-Hant | N/A | FAIL | N/A | N/A | N/A | FAIL |
| apple-mt-attr | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-attr | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-attr | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-attr | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-plain | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-plain | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-plain | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-plain | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-plain-lowlatency | en | N/A | FAIL | N/A | N/A | N/A | FAIL |
| apple-mt-plain-lowlatency | ja | N/A | FAIL | N/A | N/A | N/A | FAIL |
| apple-mt-plain-lowlatency | zh-Hans | N/A | FAIL | N/A | N/A | N/A | FAIL |
| apple-mt-plain-lowlatency | zh-Hant | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-hy-mt2-1.8b-4bit | en | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-hy-mt2-1.8b-4bit | ja | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-hy-mt2-1.8b-4bit | zh-Hans | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-hy-mt2-1.8b-4bit | zh-Hant | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-translategemma-4b-4bit | en | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-translategemma-4b-4bit | ja | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-translategemma-4b-4bit | zh-Hans | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-translategemma-4b-4bit | zh-Hant | N/A | FAIL | N/A | N/A | N/A | FAIL |
| ollama-translategemma-4b | en | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| ollama-translategemma-4b | ja | N/A | FAIL | N/A | N/A | N/A | FAIL |

PENDING = 측정 데이터 없는 항목(N/A)이 있음. 메모리·스왑·언로드는 usage-sim(없으면 resident) 모니터 기준.

## 5. 나란히 비교 (사람 읽기용, run 1 기준)

### en

**en-tech-01** (tech)

- 원문: To install the CLI, run [npm install -g fernctl] and then check the version with [fernctl --version]. Version 2.4.1 or later is required.
- **apple-fm**: CLI 설치하려면 [npm install -g fernctl]npm install -g fernctl[fernctl --version]. 버전 2.4.1 이상이 필요합니다.
- **apple-mt-attr**: CLI를 설치하려면 실행한[npm install -g fernctl]을  후 으로 버전을 확인하십시오[fernctl --version]. 버전 2.4.1 이상이 필요합니다.
- **apple-mt-plain**: CLI를 설치하려면 실행하세요 [npm install -g fernctl] 그리고 버전을 확인하세요 [fernctl --version]. 버전 2.4.1 이상이 필요합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: CLI를 설치하려면 다음 명령을 실행하세요[npm install -g fernctl]npm install -g fernctl[fernctl --version](누락)

**en-tech-02** (tech)

- 원문: The [timeout] option accepts a value in milliseconds; the default is 30000 (30 seconds), and setting it to 0 disables the limit entirely.
- **apple-fm**: 시간 제한 옵션은 밀리초 단위의 값을 허용합니다. 기본값은 30000(30초)이며, 0으로 설정하면 제한이 완전히 해제됩니다.[timeout]
- **apple-mt-attr**: 그 [timeout] 옵션은 밀리초 단위의 값을 받아들입니다; 기본값은 30000(30초)이며, 이를 0으로 설정하면 제한이 완전히 비활성화됩니다.
- **apple-mt-plain**: 그 [timeout] 옵션은 밀리초 단위의 값을 받아들입니다; 기본값은 30000(30초)이며, 이를 0으로 설정하면 제한이 완전히 비활성화됩니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: timeout 옵션은 밀리초 단위의 값을 허용합니다. 기본값은 30000(30초)이며, 이를 0으로 설정하면 제한을 완전히 비활성화합니다.[timeout](누락)

**en-tech-03** (tech)

- 원문: Before upgrading from v1.x, back up your configuration directory because the migration script rewrites every file in place and cannot be undone.
- **apple-fm**: v1.x에서 업그레이드하기 전에 설정 디렉터리를 백업하세요.이러한 이유는 이 이식 스크립트가 모든 파일을 현장에서 수정하고 되돌릴 수 없기 때문입니다.
- **apple-mt-attr**: v1.x에서 업그레이드하기 전에, 백업하십시오구성 디렉토리를 이식 스크립트가 기존의 모든 파일을 다시 작성하고 되돌릴 수 없기 때문에 .
- **apple-mt-plain**: v1.x에서 업그레이드하기 전에, 이식 스크립트가 기존의 모든 파일을 다시 작성하고 되돌릴 수 없기 때문에 구성 디렉토리를 백업하십시오.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: v1.x에서 업그레이드하기 전에, 설정 디렉토리를 백업하세요(누락)

**en-tech-04** (tech)

- 원문: If the daemon fails to start, make sure port 8443 is not already bound by another process. You can inspect the logs at http://localhost:8443/debug/logs.
- **apple-fm**: 데몬이 시작되지 않으면 포트 8443이 다른 프로세스에 이미 할당되어 있는지 확인하세요. http://localhost:8443/debug/logs 에서 로그를 확인할 수 있습니다.
- **apple-mt-attr**: 데아몬이 시작되지 않으면 8443 포트가 이미 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain**: 데아몬이 시작되지 않으면 8443 포트가 이미 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: 데몬이 시작되지 않으면, 8443번 포트가 다른 프로세스에 의해 사용되지 않는지 확인하세요. 로그를 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.

**en-tech-05** (tech)

- 원문: Each worker thread keeps its own cache of roughly 64 MB, so a machine with 8 GB of RAM should not run more than eight workers.
- **apple-fm**: 각 작업 스레드는 약 64MB의 캐시를 유지하므로 8GB 메모리를 사용하는 기기는 최대 8개의 작업만 실행해야 합니다.
- **apple-mt-attr**: 각 작업자 스레드는 약 64MB의 자체 캐시를 유지하므로 8GB의 RAM을 갖춘 기계에서는 8명의 작업자 이상을 실행해서는 안 됩니다.
- **apple-mt-plain**: 각 작업자 스레드는 약 64MB의 자체 캐시를 유지하므로 8GB의 RAM을 갖춘 기계에서는 8명의 작업자 이상을 실행해서는 안 됩니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: 각 워커 스레드는 약 64MB의 캐시를 가지고 있으므로, 8GB의 RAM을 가진 머신에는 최대 8개의 워커를 실행할 수 있습니다.

**en-tech-06** (tech)

- 원문: Requests are retried up to three times with exponential backoff; if all attempts fail, the error is surfaced to the caller as a [TransientError].
- **apple-fm**: 요청은 최대 3회까지 지수적 백오프로 재시도되며, 모든 시도가 실패하면 오류는 호출자에게 [TransientError]TransientError
- **apple-mt-attr**: 요청은 지수적 백오프를 사용하여 최대 세 번까지 재시도됩니다. 모든 시도가 실패하면 오류는 임시 오류(로 호출자에게 표시됩니다[TransientError]).
- **apple-mt-plain**: 요청은 지수적 백오프를 적용하여 최대 세 번까지 재시도됩니다; 모든 시도가 실패하면 오류가 호출자에게 다음과 같이 표시됩니다. [TransientError].
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: 요청은 3번까지 재시도되며, 모든 시도가 실패하면, 호출자에게 [TransientError]TransientError

**en-news-01** (news)

- 원문: The city council voted 7 to 2 on Tuesday to extend bus service into the eastern suburbs, a move that supporters say will cut commute times by up to 25 percent.
- **apple-fm**: 시애틀 시의회는 화요일 7대 2로 투표하여 동부 교외 지역까지 버스 서비스를 확대하기로 했습니다. 지지자들은 이로 인해 통근 시간이 최대 25% 줄어들 것이라고 말합니다.
- **apple-mt-attr**: 시 의회는 화요일에 버스 서비스를 동부 교외로 연장하기 위해 7대 2로 투표했으며, 지지자들은 이 조치가 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 말한다.
- **apple-mt-plain**: 시 의회는 화요일에 버스 서비스를 동부 교외로 연장하기 위해 7대 2로 투표했으며, 지지자들은 이 조치가 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 말한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-news-02** (news)

- 원문: Researchers at the Halvorsen Institute reported that a new type of battery retained 90 percent of its capacity after 2,000 charge cycles, roughly double that of current commercial cells.
- **apple-fm**: 헬보렌 연구소의 연구원들은 새로운 유형의 배터리가 2,000회 충전 사이클 후 약 90%의 용량을 유지한다는 보고를 했습니다. 이는 현재 상업용 셀의 두 배에 가까운 수치입니다.
- **apple-mt-attr**: 할로브센 연구소의 연구원들은 새로운 유형의 배터리가 2,000회 충전 사이클 후 용량의 90%를 유지했으며, 이는 현재 상업용 셀의 약 두 배에 달한다고 보고했다.
- **apple-mt-plain**: 할로브센 연구소의 연구원들은 새로운 유형의 배터리가 2,000회 충전 사이클 후 용량의 90%를 유지했으며, 이는 현재 상업용 셀의 약 두 배에 달한다고 보고했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-news-03** (news)

- 원문: Critics, however, point out that the results have not yet been peer reviewed and that the prototype costs about $340 per kilowatt-hour to produce.
- **apple-fm**: 그러나 비평가들은 해당 결과가 아직 동료 검토를 받지 않았으며 프로토타입 제작 비용이 kWh당 약 340달러에 달한다고 지적합니다.
- **apple-mt-attr**: 그러나 비평가들은 결과가 아직 동료 검토를 받지 않았으며 프로토타입을 생산하는 데 약 킬로와트시당 340달러가 소요된다고 지적한다.
- **apple-mt-plain**: 그러나 비평가들은 결과가 아직 동료 검토를 받지 않았으며 프로토타입을 생산하는 데 약 킬로와트시당 340달러가 소요된다고 지적한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-news-04** (news)

- 원문: Heavy rain is expected across the northern coast through Thursday, with gusts of up to 70 km/h and temperatures hovering around 12 degrees Celsius.
- **apple-fm**: 금요일까지 북부 해안에 강설량이 예상되며 최대 시속 70km의 강풍과 12도 근처의 기온이 예상됩니다.
- **apple-mt-attr**: 목요일까지 북부 해안 전체에 강한 비가 내릴 것으로 예상되며, 최대 시속 70km의 돌풍이 불고 기온은 섭씨 12도 정도를 유지할 것으로 예상된다.
- **apple-mt-plain**: 목요일까지 북부 해안 전체에 강한 비가 내릴 것으로 예상되며, 최대 시속 70km의 돌풍이 불고 기온은 섭씨 12도 정도를 유지할 것으로 예상된다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-news-05** (news)

- 원문: In a statement released Monday, the company said it would delay the launch of its flagship phone until early next year, citing ongoing supply-chain problems.
- **apple-fm**: 월요일에 발표된 성명에서 회사 측은 다음을 발표했습니다.대표폰 출시를 연기할 것이라고 했습니다.내년 초까지 공급망 문제로 인해
- **apple-mt-attr**: 월요일에 발표된 성명에서, 회사는 것이라고 밝혔다플래그십 폰 출시를 연기할 지속되는 공급망 문제를 근거로 내년 초까지 .
- **apple-mt-plain**: 월요일에 발표된 성명에서, 회사는 지속되는 공급망 문제를 근거로 플래그십 폰 출시를 내년 초까지 연기할 것이라고 밝혔다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-news-06** (news)

- 원문: Why do so many small bakeries close within five years? Economists say the answer has less to do with bread than with rent, staffing and thin margins.
- **apple-fm**: 5년 이내에 작은 베이커리들이 왜 문을 닫는지 궁금하군요. 경제학자들은 답이 빵보다는 임대료와 관련이 많다고 합니다.직원 배치그리고 얇은 이익
- **apple-mt-attr**: 왜 많은 소규모 베이커리가 5년 이내에 문을 닫는 걸까요? 경제학자들은 그 답이 빵보다는 임대료, 있다고 말합니다인력 부족, 그리고 얇은 마진과 더 관련이 .
- **apple-mt-plain**: 왜 많은 소규모 베이커리가 5년 이내에 문을 닫는 걸까요? 경제학자들은 그 답이 빵보다는 임대료, 인력 부족, 그리고 얇은 마진과 더 관련이 있다고 말합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-community-01** (community)

- 원문: ok so I finally got my Raspberry Pi to boot and it immediately caught fire. well, not literally. but my soul did.
- **apple-fm**: 알겠습니다. 드디어 제 Raspberry Pi를 부팅했는데, 즉시 불이 났습니다. 물론 문자 그대로가 아니고요. 하지만 제 영혼이 불탔습니다.
- **apple-mt-attr**: 좋아, 그래서 나는 마침내 내 라즈베리 피를 부팅시켰는데 그것은 즉시 불이 났어. 음, 문자 그대로는 아니지만. 하지만 내 영혼은 그랬어.
- **apple-mt-plain**: 좋아, 그래서 나는 마침내 내 라즈베리 피를 부팅시켰는데 그것은 즉시 불이 났어. 음, 문자 그대로는 아니지만. 하지만 내 영혼은 그랬어.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-community-02** (community)

- 원문: Hot take: tabs are fine, spaces are fine, and anyone who argues about it at 2 a.m. needs a snack and a nap.
- **apple-fm**: 핫한 의견: 탭은 괜찮고, 공백도 괜찮고, 새벽 2시에 그걸로 논쟁하는 사람은 간식과 낮잠이 필요합니다.
- **apple-mt-attr**: 핫 테이크: 탭은 괜찮고, 공백도 괜찮으며, 새벽 2시에 이에 대해 논쟁하는 사람은 간식과 낮잠이 필요합니다.
- **apple-mt-plain**: 핫 테이크: 탭은 괜찮고, 공백도 괜찮으며, 새벽 2시에 이에 대해 논쟁하는 사람은 간식과 낮잠이 필요합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-community-03** (community)

- 원문: lol I've been staring at this error for three hours and it was a missing semicolon. a SEMICOLON. I'm going to go live in the woods now.
- **apple-fm**: 웃긴 건, 이 오류에 3시간 동안 몰두했는데, 사실 분수 기호가 누락된 겁니다. 분수 기호가요. 이제 저는 숲속에서 라이브 방송을 할 겁니다.
- **apple-mt-attr**: ㅋㅋㅋ 이 오류를 세 시간이나 보고 있었는데 분리표가 빠져 있었어요. 분리표요. 이제 숲에서 라이브 방송을 할게요.
- **apple-mt-plain**: ㅋㅋㅋ 이 오류를 세 시간이나 보고 있었는데 분리표가 빠져 있었어요. 분리표요. 이제 숲에서 라이브 방송을 할게요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-community-04** (community)

- 원문: Not gonna lie, that update broke literally everything on my setup. Rolled back, touched grass, will try again tomorrow.
- **apple-fm**: 솔직히 말하자면, 그 업데이트가 제 설정에서 완전히 망가졌습니다.실제로 모든 게 망가졌습니다.제게
- **apple-mt-attr**: 솔직히 말해서, 그 업데이트가 실제로 모든 것을 망쳤어요제 설정에서 . 되돌렸고, 잔디를 만졌고, 내일 다시 시도할게요.
- **apple-mt-plain**: 솔직히 말해서, 그 업데이트가 제 설정에서 실제로 모든 것을 망쳤어요. 되돌렸고, 잔디를 만졌고, 내일 다시 시도할게요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-community-05** (community)

- 원문: Can confirm. My cat has been sitting on the router for a week and honestly the wifi has never been better. Don't question it.
- **apple-fm**: 확인해 드릴게요. 제 고양이가 일주일 동안 라우터 위에 있었는데, 솔직히 와이파이가 더 좋아졌습니다. 의심하지 마세요.
- **apple-mt-attr**: 확인할 수 있어요. 제 고양이가 라우터 위에 일주일 동안 앉아 있었는데 솔직히 와이파이가 지금까지보다 더 좋았어요. 의심하지 마세요.
- **apple-mt-plain**: 확인할 수 있어요. 제 고양이가 라우터 위에 일주일 동안 앉아 있었는데 솔직히 와이파이가 지금까지보다 더 좋았어요. 의심하지 마세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-community-06** (community)

- 원문: Y'all, I just spent $60 on a keyboard that sounds like rain. Zero regrets, my coworkers on the other hand... TBD.
- **apple-fm**: 여러분, 저는 $60짜리 비 오는 소리가 나는 키보드를 샀는데, 후회하는 건 하나도 없습니다. 제 동료들은 다릅니다...미정.
- **apple-mt-attr**: 여러분, 저는 방금 비 소리가 나는 키보드에 60달러를 썼어요. 전혀 후회 없어요. 반면 제 동료들은... 아직 알 수 없네요.
- **apple-mt-plain**: 여러분, 저는 방금 비 소리가 나는 키보드에 60달러를 썼어요. 전혀 후회 없어요. 반면 제 동료들은... 아직 알 수 없네요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-ui-01** (ui)

- 원문: Save changes
- **apple-fm**: 변경 사항을 저장하세요
- **apple-mt-attr**: 변경 사항 저장하기
- **apple-mt-plain**: 변경 사항 저장하기
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-ui-02** (ui)

- 원문: Something went wrong. Please try again later.
- **apple-fm**: 오류가 발생했습니다. 나중에 다시 시도하세요.
- **apple-mt-attr**: 무언가가 잘못되었습니다. 나중에 다시 시도해 주세요.
- **apple-mt-plain**: 무언가가 잘못되었습니다. 나중에 다시 시도해 주세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-ui-03** (ui)

- 원문: You have 3 unread messages
- **apple-fm**: 오류가 없는 메시지가 3개 있습니다.
- **apple-mt-attr**: 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-plain**: 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-link-01** (link)

- 원문: Click [here] to continue.
- **apple-fm**: 여기 클릭하세요[here]계속하려면
- **apple-mt-attr**: 클릭하세요[here]계속하려면 기를 .
- **apple-mt-plain**: 클릭 [here] 계속하기 위해.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-link-02** (link)

- 원문: See [the installation guide] for details on supported platforms.
- **apple-fm**: 설치 가이드[the installation guide]지원 플랫폼에 대한 자세한 정보
- **apple-mt-attr**: 참조하십시오[the installation guide]지원되는 플랫폼에 대한 자세한 내용은 .
- **apple-mt-plain**: 보다 [the installation guide] 지원되는 플랫폼에 대한 자세한 내용은.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-link-03** (link)

- 원문: If you run into trouble, [open an issue on the tracker] and include your log file.
- **apple-fm**: 문제에 부딪혔다면[open an issue on the tracker]그리고 로그 파일을 포함하세요
- **apple-mt-attr**: 문제가 발생하면 [open an issue on the tracker]보고하고 로그 파일을 포함하십시오.
- **apple-mt-plain**: 만약 당신이 곤경에 처한다면, [open an issue on the tracker] 그리고 로그 파일을 포함하십시오.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-seq-01** (seq)

- 원문: Last spring I decided to turn an old laptop into a home server for my family's photos.
- **apple-fm**: 지난여름, 저는 오래된 노트북을 가족의 사진을 위한 가정용 서버로 바꾸기로 했습니다.
- **apple-mt-attr**: 작년 봄에 나는 오래된 노트북을 가족의 사진을 위한 가정용 서버로 바꾸기로 결정했다.
- **apple-mt-plain**: 작년 봄에 나는 오래된 노트북을 가족의 사진을 위한 가정용 서버로 바꾸기로 결정했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-seq-02** (seq)

- 원문: The laptop, a 2014 ThinkBook with 8 GB of RAM, turned out to be perfect for the job.
- **apple-fm**: 2014년형 노트북, ThinkBook8GB RAM(누락)
- **apple-mt-attr**: 2014년형 노트북은 ThinkBook으로 8GB의 RAM을 탑재한 이 일에 완벽하게 적합한 것으로 밝혀졌다.
- **apple-mt-plain**: 2014년형 ThinkBook으로 8GB의 RAM을 탑재한 노트북은 이 일에 완벽하게 적합한 것으로 밝혀졌다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-seq-03** (seq)

- 원문: First, I installed [Debian 12] and set up a small web app called Fernbox to browse the pictures.
- **apple-fm**: 먼저 저는 [Debian 12]Debian 12
- **apple-mt-attr**: 먼저, 저는 를 설치하고[Debian 12] 사진을 둘러보기 위해 Fernbox라는 작은 웹 앱을 설정했습니다.
- **apple-mt-plain**: 먼저, 저는 설치했습니다. [Debian 12] 그리고 사진을 둘러보기 위해 Fernbox라는 작은 웹 앱을 설정합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-seq-04** (seq)

- 원문: My sister was skeptical at first, but after a week she admitted that Fernbox was faster than any cloud service she had used.
- **apple-fm**: 형은 처음에는 회의적이었습니다. 하지만 일주일 후에는 Fernbox가 사용한 어떤 클라우드 서비스보다 빠르다고 인정했습니다.
- **apple-mt-attr**: 내 여동생은 처음에는 의심했지만, 일주일 후 그녀는 Fernbox가 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다고 인정했다.
- **apple-mt-plain**: 내 여동생은 처음에는 의심했지만, 일주일 후 그녀는 Fernbox가 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다고 인정했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

**en-seq-05** (seq)

- 원문: Now the old laptop sits quietly on a shelf, and Fernbox has become the first thing my whole family opens after a trip.
- **apple-fm**: 이제 오래된 노트북은 선반 위에 조용히 놓여 있고, Fernbox가족 모두가 여행 후 가장 먼저 열게 되는 첫 번째 물건이 되었습니다.
- **apple-mt-attr**: 이제 오래된 노트북은 선반 위에 조용히 놓여 있고, Fernbox는 여행 후 우리 가족 전체가 가장 먼저 열어보는 첫 번째 물건이 되었습니다.
- **apple-mt-plain**: 이제 오래된 노트북은 선반 위에 조용히 놓여 있고, Fernbox는 여행 후 우리 가족 전체가 가장 먼저 열어보는 첫 번째 물건이 되었습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: block missing in output)

### ja

**ja-tech-01** (tech)

- 원문: CLIをインストールするには [npm install -g fernctl] を実行し、続けて [fernctl --version] でバージョンを確認してください。バージョン2.4.1以降が必要です。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: CLI를 설치하려면 [npm install -g fernctl]실행하고, 계속해서 [fernctl --version]으로 버전을 확인하십시오. 버전 2.4.1 이상이 필요합니다.
- **apple-mt-plain**: CLI를 설치하려면 [npm install -g fernctl] 을 실행하고, 계속해서 [fernctl --version] 에서 버전을 확인해 주세요. 버전 2.4.1 이후가 필요합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-tech-02** (tech)

- 원문: [timeout] オプションはミリ秒単位で指定する。デフォルトは30000(30秒)で、0を指定すると制限が完全に無効になる。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: [timeout]옵션은 밀리초 단위로 지정한다. 기본값은 30000(30초)이며, 0을 지정하면 제한이 완전히 무효가 된다.
- **apple-mt-plain**: [timeout] 옵션은 밀리초 단위로 지정한다. 기본값은 30000(30초)이며, 0을 지정하면 제한이 완전히 무효가 된다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-tech-03** (tech)

- 원문: v1.xからアップグレードする前に、設定ディレクトリのバックアップを取ってください。移行スクリプトはすべてのファイルをその場で書き換えるため、元に戻せません。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: v1.x에서 업그레이드하기 전에 설정 디렉토리의 백업을 해 주세요. 이월 스크립트는 모든 파일을 그 자리에서 다시 작성하기 때문에, 되돌릴 수 없습니다.
- **apple-mt-plain**: v1.x에서 업그레이드하기 전에 설정 디렉토리의 백업을 해 주세요. 이월 스크립트는 모든 파일을 그 자리에서 다시 작성하기 때문에, 되돌릴 수 없습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-tech-04** (tech)

- 원문: デーモンが起動しない場合は、ポート8443が別のプロセスに使われていないか確認します。ログは http://localhost:8443/debug/logs で見られます。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 데이몬이 시작되지 않는 경우, 포트 8443이 다른 프로세스에 사용되지 않았는지 확인합니다. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain**: 데이몬이 시작되지 않는 경우, 포트 8443이 다른 프로세스에 사용되지 않았는지 확인합니다. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-tech-05** (tech)

- 원문: 各ワーカースレッドは約64MBの独自キャッシュを持つので、RAM 8GBのマシンではワーカーを8つ以上動かさないほうがよい。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 각 워커스레드는 약 64MB의 독자 캐시를 가지고 있으므로, RAM 8GB의 머신에서는 워커를 8개 이상 실행하지 않는 것이 좋다.
- **apple-mt-plain**: 각 워커스레드는 약 64MB의 독자 캐시를 가지고 있으므로, RAM 8GB의 머신에서는 워커를 8개 이상 실행하지 않는 것이 좋다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-tech-06** (tech)

- 원문: リクエストは指数バックオフで最大3回まで再試行される。すべて失敗した場合は [TransientError] として呼び出し元に返される。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 요청은 지수 백오프로 최대 3회까지 재시도된다. 모두 실패한 경우 [TransientError]로 호출元에 반환된다.
- **apple-mt-plain**: 요청은 지수 백오프로 최대 3회까지 재시도된다. 모두 실패한 경우 [TransientError] 로서 호출원에게 반환된다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-news-01** (news)

- 원문: 市議会は火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 시의회는 화요일, 동부 교외로의 버스 노선 연장을 찬성 7, 반대 2로 의결했다. 찬성파는 출퇴근 시간이 최대 25% 단축된다고 말하고 있다.
- **apple-mt-plain**: 시의회는 화요일, 동부 교외로의 버스 노선 연장을 찬성 7, 반대 2로 의결했다. 찬성파는 출퇴근 시간이 최대 25% 단축된다고 말하고 있다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-news-02** (news)

- 원문: ハルボルセン研究所の研究チームは、新型電池が2,000回の充放電後も容量の90%を維持したと発表した。これは現行の市販品の約2倍にあたる。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 하루볼센 연구소의 연구팀은, 신형 배터리가 2,000회의 충전방전 후에도 용량의 90%를 유지했다고 발표했다. 이는 현행의 시판품의 약 2배에 해당한다.
- **apple-mt-plain**: 하루볼센 연구소의 연구팀은, 신형 배터리가 2,000회의 충전방전 후에도 용량의 90%를 유지했다고 발표했다. 이는 현행의 시판품의 약 2배에 해당한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-news-03** (news)

- 원문: 一方で、この結果はまだ査読を受けておらず、試作品の製造コストは1キロワット時あたり約340ドルに上るとの指摘も出ている。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 한편, 이 결과는 아직 검토를 받지 않았으며, 시제품의 제조 비용은 1킬로와트시당 약 340달러에 이를 것이라는 지적도 나오고 있다.
- **apple-mt-plain**: 한편, 이 결과는 아직 검토를 받지 않았으며, 시제품의 제조 비용은 1킬로와트시당 약 340달러에 이를 것이라는 지적도 나오고 있다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-news-04** (news)

- 원문: 北部の沿岸地域では木曜日にかけて大雨となる見込みで、最大風速は70km/h、気温は12度前後で推移するでしょう。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 북부의 해안 지역에서는 목요일까지 대우가 될 전망이며, 최대 풍속은 70km/h, 기온은 12도 전후로 변동할 것입니다.
- **apple-mt-plain**: 북부의 해안 지역에서는 목요일까지 대우가 될 전망이며, 최대 풍속은 70km/h, 기온은 12도 전후로 변동할 것입니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-news-05** (news)

- 원문: 同社は月曜日に発表した声明で、サプライチェーンの問題が続いていることを理由に、主力スマートフォンの発売を来年初めまで延期すると明らかにした。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 동사는 월요일에 발표한 성명에서, 공급망의 문제가 지속되고 있다는 이유로, 주력 스마트폰의 출시를 내년 초까지 연기한다고 밝혔다.
- **apple-mt-plain**: 동사는 월요일에 발표한 성명에서, 공급망의 문제가 지속되고 있다는 이유로, 주력 스마트폰의 출시를 내년 초까지 연기한다고 밝혔다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-news-06** (news)

- 원문: なぜ小さなパン屋は5年以内に閉店してしまうのか。経済学者によれば、答えはパンそのものよりも、家賃や人手、そして薄い利益率にあるという。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 왜 작은 빵집은 5년 이내에 문을 닫게 되는가. 경제학자들에 따르면, 답은 빵 그 자체보다 임대료와 인건비, 그리고 낮은 이익률에 있다고 한다.
- **apple-mt-plain**: 왜 작은 빵집은 5년 이내에 문을 닫게 되는가. 경제학자들에 따르면, 답은 빵 그 자체보다 임대료와 인건비, 그리고 낮은 이익률에 있다고 한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-community-01** (community)

- 원문: やっとRaspberry Piが起動したと思ったら、秒で火を噴いた。いや、実際には燃えてないけど、俺の心は燃えた。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 드디어 Raspberry Pi가 부팅된 줄 알았더니, 초 단위로 불을 뿜었다. 아니, 실제로 불타지는 않았지만, 내 마음은 불탔다.
- **apple-mt-plain**: 드디어 Raspberry Pi가 부팅된 줄 알았더니, 초 단위로 불을 뿜었다. 아니, 실제로 불타지는 않았지만, 내 마음은 불탔다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-community-02** (community)

- 원문: ぶっちゃけ、タブでもスペースでもどっちでもいいと思うんだよね。深夜2時に論争してる人は、おやつ食べて寝たほうがいい(笑)
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 솔직히, 탭이든 스페이스든 둘 다 괜찮다고 생각해. 자정 2시에 논쟁하고 있는 사람은 간식 먹고 자는 게 좋겠어(웃음)
- **apple-mt-plain**: 솔직히, 탭이든 스페이스든 둘 다 괜찮다고 생각해. 자정 2시에 논쟁하고 있는 사람은 간식 먹고 자는 게 좋겠어(웃음)
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-community-03** (community)

- 원문: 3時間エラーとにらめっこして、原因がセミコロン1個だったwww セミコロンだぞ?もう山に籠もるわ…
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 3시간 동안 오류와 눈싸움을 하고, 원인이 세미콜론 1개였어www 세미콜론이지? 이제 산에 틀어박힐게…
- **apple-mt-plain**: 3시간 동안 오류와 눈싸움을 하고, 원인이 세미콜론 1개였어www 세미콜론이지? 이제 산에 틀어박힐게…
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-community-04** (community)

- 원문: 正直、あのアップデートで環境が全部壊れたんだが。ロールバックして外の空気吸ってきた。また明日やるわ。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 솔직히, 저 업데이트로 환경이 다 망가졌는데.롤백해서 밖의 공기를 마셨어.내일 다시 할게.
- **apple-mt-plain**: 솔직히, 저 업데이트로 환경이 다 망가졌는데.롤백해서 밖의 공기를 마셨어.내일 다시 할게.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-community-05** (community)

- 원문: うちの猫がルーターの上に1週間居座ってるんだけど、なぜかWi-Fiの調子が過去最高。理由は聞かないでくれ。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 우리 고양이가 라우터 위에 일주일 동안 머물고 있는데, 이상하게도 Wi-Fi 상태가 역대 최고야. 이유는 물어보지 마.
- **apple-mt-plain**: 우리 고양이가 라우터 위에 일주일 동안 머물고 있는데, 이상하게도 Wi-Fi 상태가 역대 최고야. 이유는 물어보지 마.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-community-06** (community)

- 원문: キーボードに6,000円も使ってしまった。雨音みたいな打鍵音で最高。同僚の反応は…まあ、お察しですw
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 키보드에 6,000엔이나 썼다. 비소리 같은 누르기 소리로 최고. 동료의 반응은...음, 이해합니다w
- **apple-mt-plain**: 키보드에 6,000엔이나 썼다. 비소리 같은 누르기 소리로 최고. 동료의 반응은...음, 이해합니다w
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-ui-01** (ui)

- 원문: 変更を保存
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 변경을 저장
- **apple-mt-plain**: 변경을 저장
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-ui-02** (ui)

- 원문: 問題が発生しました。しばらくしてからもう一度お試しください。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 문제가 발생했습니다. 잠시 후에 다시 한번 시도해 주세요.
- **apple-mt-plain**: 문제가 발생했습니다. 잠시 후에 다시 한번 시도해 주세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-ui-03** (ui)

- 원문: 未読メッセージが3件あります
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 미독 메시지가 3건 있습니다
- **apple-mt-plain**: 미독 메시지가 3건 있습니다
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-link-01** (link)

- 원문: 続行するには[こちら]をクリックしてください。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 계속하려면 [こちら]기를 클릭하십시오.
- **apple-mt-plain**: 계속하려면[こちら]를 클릭해 주세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-link-02** (link)

- 원문: 対応プラットフォームの詳細については、[インストールガイド]をご覧ください。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 지원 플랫폼의 자세한 내용은, [インストールガイド]참조하십시오.
- **apple-mt-plain**: 대응 플랫폼의 자세한 내용은,[インストールガイド]를 보십시오.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-link-03** (link)

- 원문: 問題が解決しない場合は、[トラッカーでイシューを作成]し、ログファイルを添付してください。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 문제가 해결되지 않는 경우, [トラッカーでイシューを作成]하고, 로그 파일을 첨부해 주세요.
- **apple-mt-plain**: 문제가 해결되지 않는 경우,[トラッカーでイシューを作成]그리고, 로그 파일을 첨부해 주세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-seq-01** (seq)

- 원문: 去年の春、家族の写真を保存するために、古いノートPCを自宅サーバーにすることにしました。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 작년 봄, 가족의 사진을 저장하기 위해, 오래된 노트북 PC를 집 서버에 하는 것을 결정했습니다.
- **apple-mt-plain**: 작년 봄, 가족의 사진을 저장하기 위해, 오래된 노트북 PC를 집 서버에 하는 것을 결정했습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-seq-02** (seq)

- 원문: 2014年製のThinkBook(RAM 8GB)は、この用途にはぴったりでした。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 2014년식 ThinkBook(RAM 8GB)은, 이 용도에는 딱 맞았습니다.
- **apple-mt-plain**: 2014년식 ThinkBook(RAM 8GB)은, 이 용도에는 딱 맞았습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-seq-03** (seq)

- 원문: まず [Debian 12] をインストールし、写真を閲覧するための小さなWebアプリ、Fernboxを設定しました。
- **apple-fm**: (오류: Content contains 4097 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 먼저 [Debian 12]을 설치하고, 사진을 감상하기 위한 작은 Web앱, Fernbox를 설정했습니다.
- **apple-mt-plain**: 먼저 [Debian 12] 을 설치하고, 사진을 조회하기 위한 작은 Web앱, Fernbox를 설정했습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-seq-04** (seq)

- 원문: 妹は最初は半信半疑でしたが、1週間後には「今まで使ったどのクラウドサービスよりもFernboxのほうが速い」と認めてくれました。
- **apple-fm**: 아이는 처음에는 의심스럽다고 했지만, 1주일 뒤에는 "지금까지 사용한 어떤 클라우드 서비스보다 Fernbox가 더 빠르다"고 인정해줬어요.
- **apple-mt-attr**: 여동생은 처음에는 반신반의했지만, 1주일 후에는 "지금까지 사용한 어떤 클라우드 서비스보다 Fernbox가 더 빠르다"고 인정해 주었습니다.
- **apple-mt-plain**: 여동생은 처음에는 반신반의했지만, 1주일 후에는 "지금까지 사용한 어떤 클라우드 서비스보다 Fernbox가 더 빠르다"고 인정해 주었습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

**ja-seq-05** (seq)

- 원문: 今では古いノートPCは棚の上で静かに動いており、Fernboxは旅行から帰ったあと、家族全員が最初に開くアプリになっています。
- **apple-fm**: 지금은 오래된 노트북이 선반 위에 조용히 있고, Fernbox여행에서 돌아온 뒤 가족 모두가 가장 먼저 사용하는 앱이 됐어요.
- **apple-mt-attr**: 지금은 오래된 노트북은 선반 위에서 조용히 움직이고 있으며, Fernbox는 여행에서 돌아온 뒤, 가족 모두가 가장 먼저 열는 앱이 되었습니다.
- **apple-mt-plain**: 지금은 오래된 노트북은 선반 위에서 조용히 움직이고 있으며, Fernbox는 여행에서 돌아온 뒤, 가족 모두가 가장 먼저 열는 앱이 되었습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )

### zh-Hans

**zh-Hans-tech-01** (tech)

- 원문: 要安装命令行工具,请运行 [npm install -g fernctl],然后用 [fernctl --version] 检查版本。需要 2.4.1 或更高版本。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 명령줄 도구를 설치하려면 을 실행한 [npm install -g fernctl]후 사용하여 [fernctl --version]버전을 확인하십시오. 2.4.1 이상 버전이 필요합니다.
- **apple-mt-plain**: 명령줄 도구를 설치하려면 실행하십시오. [npm install -g fernctl],그런 다음 사용한다 [fernctl --version] 버전 확인. 2.4.1 이상 버전이 필요합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-tech-02** (tech)

- 원문: [timeout] 选项的单位是毫秒,默认值为 30000(30 秒),设为 0 则完全不限制超时。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: [timeout]옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 초과 시간을 전혀 제한하지 않습니다.
- **apple-mt-plain**: [timeout] 옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 초과 시간을 전혀 제한하지 않습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-tech-03** (tech)

- 원문: 从 v1.x 升级之前,请先备份配置目录。迁移脚本会直接改写所有文件,而且无法撤销。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: v1.x로 업그레이드하기 전에, 먼저 백업해 주세요구성 디렉토리를 . 이식 스크립트는 모든 파일을 직접 수정하며, 취소할 수 없습니다.
- **apple-mt-plain**: v1.x로 업그레이드하기 전에, 먼저 구성 디렉토리를 백업해 주세요. 이식 스크립트는 모든 파일을 직접 수정하며, 취소할 수 없습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-tech-04** (tech)

- 원문: 如果守护进程无法启动,请确认端口 8443 没有被其他进程占用。日志可以在 http://localhost:8443/debug/logs 查看。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 보호 프로세스를 시작할 수 없는 경우, 포트 8443이 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain**: 보호 프로세스를 시작할 수 없는 경우, 포트 8443이 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-tech-05** (tech)

- 원문: 每个工作线程都有各自约 64 MB 的缓存,因此内存为 8 GB 的机器最多运行八个工作线程。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 각 작업 스레드는 각각 약 64 MB의 캐시를 가지고 있으므로, 메모리가 8 GB인 기계는 최대로 여덟 개의 작업 스레드를 실행할 수 있습니다.
- **apple-mt-plain**: 각 작업 스레드는 각각 약 64 MB의 캐시를 가지고 있으므로, 메모리가 8 GB인 기계는 최대로 여덟 개의 작업 스레드를 실행할 수 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-tech-06** (tech)

- 원문: 请求最多会以指数退避的方式重试三次;如果全部失败,错误会以 [TransientError] 的形式返回给调用方。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 요청은 최대 지수적 후퇴 방식으로 세 번 다시 시도할 수 있다; 만약 모두 실패하면, 오류는 [TransientError]의 형태로 호출자에게 반환된다.
- **apple-mt-plain**: 요청은 최대 지수적 후퇴 방식으로 세 번까지 재시도할 수 있다; 만약 모두 실패하면, 오류는 [TransientError] 의 형태가 호출자에게 반환된다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-news-01** (news)

- 원문: 市议会周二以 7 票对 2 票通过了将公交线路延伸至东部郊区的方案,支持者认为这将使通勤时间最多缩短 25%。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 시 의회는 화요일에 7대 2의 표 차이로 버스 노선을 동부 교외로 연장하는 계획을 승인했으며, 지지자들은 이것이 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 생각한다.
- **apple-mt-plain**: 시 의회는 화요일에 7대 2의 표 차이로 버스 노선을 동부 교외로 연장하는 계획을 승인했으며, 지지자들은 이것이 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 생각한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-news-02** (news)

- 원문: 哈尔沃森研究所的研究人员报告称,一种新型电池在经过 2000 次充放电循环后仍保持了 90% 的容量,约为目前市售电池的两倍。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 하르보손 연구소의 연구원들은 새로운 배터리가 2000회 충전-방전 사이클을 거친 후에도 여전히 90%의 용량을 유지하고 있으며, 이는 현재 시중에 나와 있는 배터리의 약 두 배에 달한다고 보고했다.
- **apple-mt-plain**: 하르보손 연구소의 연구원들은 새로운 배터리가 2000회 충전-방전 사이클을 거친 후에도 여전히 90%의 용량을 유지하고 있으며, 이는 현재 시중에 나와 있는 배터리의 약 두 배에 달한다고 보고했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-news-03** (news)

- 원문: 不过,批评者指出,这一结果尚未经过同行评审,而且样品的生产成本约为每千瓦时 340 美元。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 하지만, 비판자들은 이 결과가 아직 동료 심사를 받지 않았고, 샘플의 생산비용이 약 킬로와트시당 340달러에 달한다고 지적했다.
- **apple-mt-plain**: 하지만, 비판자들은 이 결과가 아직 동료 심사를 받지 않았고, 샘플의 생산비용이 약 킬로와트시당 340달러에 달한다고 지적했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-news-04** (news)

- 원문: 北部沿海地区预计到周四都有大雨,阵风可达每小时 70 公里,气温在 12 摄氏度左右。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 북부 해안 지역은 목요일까지 큰 비가 내릴 것으로 예상되며, 돌풍은 시속 70km에 달할 수 있고 기온은 12도 정도일 것으로 예상된다.
- **apple-mt-plain**: 북부 해안 지역은 목요일까지 큰 비가 내릴 것으로 예상되며, 돌풍은 시속 70km에 달할 수 있고 기온은 12도 정도일 것으로 예상된다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-news-05** (news)

- 원문: 该公司周一发表声明称,由于供应链问题持续,将把旗舰手机的发布推迟到明年年初。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 이 회사는 월요일에 성명을 발표하면서, 공급망 문제로 지속되면서,   것이라고 플래그십 스마트폰의 출시를내년 초로 연기할밝혔다.
- **apple-mt-plain**: 이 회사는 월요일에 성명을 발표하면서, 공급망 문제로 지속되면서, 플래그십 스마트폰의 출시를 내년 초로 연기할 것이라고 밝혔다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-news-06** (news)

- 원문: 为什么这么多小面包店开不过五年?经济学家认为,原因与面包本身关系不大,更多在于房租、人手和微薄的利润。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 왜 이렇게 많은 작은 빵집이 5년도 안 돼서 문을 닫는 걸까? 경제학자들은 그 이유는 빵 자체와는 별로 관련이 없으며, 오히려 임대료, 더 크게  본다인건비, 그리고 적은 이익에 기인한다고.
- **apple-mt-plain**: 왜 이렇게 많은 작은 빵집이 5년도 안 돼서 문을 닫는 걸까? 경제학자들은 그 이유는 빵 자체와는 별로 관련이 없으며, 오히려 임대료, 인건비, 그리고 적은 이익에 더 크게 기인한다고 본다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-community-01** (community)

- 원문: 好家伙,树莓派终于能开机了,结果一上电就冒烟。好吧,也不是真冒烟,但我的心态已经崩了。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 와, 딸기 파이가 드디어 켜질 수 있었는데, 전원을 켜자마자 연기가 피어올랐다. 음, 진짜 연기는 아니지만, 내 마음가짐은 이미 무너졌다.
- **apple-mt-plain**: 와, 딸기 파이가 드디어 켜질 수 있었는데, 전원을 켜자마자 연기가 피어올랐다. 음, 진짜 연기는 아니지만, 내 마음가짐은 이미 무너졌다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-community-02** (community)

- 원문: 说句得罪人的话:用制表符还是空格都行,凌晨两点还在为这个吵架的人,该去吃点东西然后睡觉了。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 불쾌하게 하는 말 하나 하자면: 기호표시를 쓰든 공백을 쓰든 상관없어, 새벽 두 시에 아직도 이 일 때문에 싸우는 사람은, 뭔가 먹고 자러 가야 해.
- **apple-mt-plain**: 불쾌하게 하는 말 하나 하자면: 기호표시를 쓰든 공백을 쓰든 상관없어, 새벽 두 시에 아직도 이 일 때문에 싸우는 사람은, 뭔가 먹고 자러 가야 해.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-community-03** (community)

- 원문: 笑死,盯着报错看了三个小时,结果是少了一个分号。一个分号啊!我要去山里隐居了。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 웃겨 죽겠어, 오류 메시지를 3시간 동안 쳐다보다가, 결과가 분기호 하나가 빠진 거야. 분기호 하나야! 나는 산으로 은둔하러 갈 거야.
- **apple-mt-plain**: 웃겨 죽겠어, 오류 메시지를 3시간 동안 쳐다보다가, 결과가 분기호 하나가 빠진 거야. 분기호 하나야! 나는 산으로 은둔하러 갈 거야.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-community-04** (community)

- 원문: 说实话,那次更新直接把我的环境搞崩了。已经回滚,出去透了口气,明天再战。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 솔직히, 그 업데이트가 제 환경을 완전히 망쳐버렸어요. 이미 백업을 취했고, 밖에 나가서 숨을 푹 들이마셨어요. 내일 다시 도전할게요.
- **apple-mt-plain**: 솔직히, 그 업데이트가 제 환경을 완전히 망쳐버렸어요. 이미 백업을 취했고, 밖에 나가서 숨을 푹 들이마셨어요. 내일 다시 도전할게요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-community-05** (community)

- 원문: 确实。我家猫在路由器上趴了一个星期,Wi-Fi 居然比以前还稳。别问,问就是玄学。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 맞아요. 우리 고양이가 라우터 위에 일주일 동안 누워 있었는데, Wi-Fi가 오히려 예전보다 더 안정적이었어요. 물어보지 마세요, 물어보는 건 점술이에요.
- **apple-mt-plain**: 맞아요. 우리 고양이가 라우터 위에 일주일 동안 누워 있었는데, Wi-Fi가 오히려 예전보다 더 안정적이었어요. 물어보지 마세요, 물어보는 건 점술이에요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-community-06** (community)

- 원문: 家人们,我花了 400 块买了个敲起来像下雨的键盘,一点都不后悔,同事们嘛……就不一定了。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 가족 여러분, 저는 비가 오는 소리 나는 키보드를 사는데 400위안을 썼는데 전혀 후회하지 않아요. 동료들은 어때요……그건 다를 수 있어요.
- **apple-mt-plain**: 가족 여러분, 저는 비가 오는 소리 나는 키보드를 사는데 400위안을 썼는데 전혀 후회하지 않아요. 동료들은 어때요……그건 다를 수 있어요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-ui-01** (ui)

- 원문: 保存更改
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 변경 저장
- **apple-mt-plain**: 변경 저장
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-ui-02** (ui)

- 원문: 出错了,请稍后重试。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 오류가 발생했습니다, 잠시 후에 다시 시도해 주세요.
- **apple-mt-plain**: 오류가 발생했습니다, 잠시 후에 다시 시도해 주세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-ui-03** (ui)

- 원문: 您有 3 条未读消息
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 귀하에게는 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-plain**: 귀하에게는 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-link-01** (link)

- 원문: 点击[此处]继续。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 기를 클릭하여[此处] 계속하세요.
- **apple-mt-plain**: 클릭[此处]계속해.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-link-02** (link)

- 원문: 有关支持的平台,请参阅[安装指南]了解详情。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 지원되는 플랫폼에 대해서는 참조하여 [安装指南]자세히 알아보세요.
- **apple-mt-plain**: 지원되는 플랫폼에 대해서는 참조하십시오.[安装指南]자세히 알아보기.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-link-03** (link)

- 원문: 如果遇到问题,请[在问题追踪页面提交反馈],并附上日志文件。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 문제가 발생하면, 주세요[在问题追踪页面提交反馈]하고, 로그 파일을 첨부해 .
- **apple-mt-plain**: 문제가 생기면, 제발[在问题追踪页面提交反馈], 그리고 로그 파일을 첨부한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-seq-01** (seq)

- 원문: 去年春天,我决定把一台旧笔记本改造成家用服务器,用来存放家人的照片。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 작년 봄, 나는 오래된 노트북을 가정용 서버로 개조하여 가족들의 사진을 보관하기로 결정했다.
- **apple-mt-plain**: 작년 봄, 나는 오래된 노트북을 가정용 서버로 개조하여 가족들의 사진을 보관하기로 결정했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-seq-02** (seq)

- 원문: 这台 2014 年的ThinkBook配有 8 GB 内存,用来干这个活儿正合适。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 이 2014년형 ThinkBook은 8GB 메모리를 장착하고 있어서 이 일을 하기에 딱 맞습니다.
- **apple-mt-plain**: 이 2014년형 ThinkBook은 8GB 메모리를 장착하고 있어서 이 일을 하기에 딱 맞습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-seq-03** (seq)

- 원문: 我先装了 [Debian 12],又搭了一个叫 Fernbox 的小型网页应用来浏览照片。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 나는 먼저 를 설치하고[Debian 12], 사진을 보려면 Fernbox라는 작은 웹 애플리케이션을 설치했다.
- **apple-mt-plain**: 제가 먼저 설치했어요. [Debian 12],또 Fernbox라는 소형 웹사이트 애플리케이션을 이용해 사진을 둘러보았다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-seq-04** (seq)

- 원문: 妹妹一开始半信半疑,但一周后她承认,Fernbox 比她用过的任何云服务都快。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 여동생은 처음에는 반신반의했지만, 일주일 후 그녀는 인정했다, Fernbox는 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다.
- **apple-mt-plain**: 여동생은 처음에는 반신반의했지만, 일주일 후 그녀는 인정했다, Fernbox는 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hans-seq-05** (seq)

- 원문: 现在,那台旧笔记本安安静静地待在架子上,而Fernbox已经成了全家人旅行回来后第一个打开的应用。
- **apple-fm**: (오류: Content contains 4098 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 지금, 그 오래된 노트북은 조용히 선반에 놓여 있고, Fernbox는 이미 가족이 여행에서 돌아온 후 첫 번째로 열리는 애플리케이션이 되었다.
- **apple-mt-plain**: 지금, 그 오래된 노트북은 조용히 선반에 놓여 있고, Fernbox는 이미 가족이 여행에서 돌아온 후 첫 번째로 열리는 애플리케이션이 되었다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

### zh-Hant

**zh-Hant-tech-01** (tech)

- 원문: 若要安裝命令列工具,請執行 [npm install -g fernctl],接著用 [fernctl --version] 檢查版本。需要 2.4.1 或更新的版本。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 명령줄 도구를 설치하려면 을 실행한 [npm install -g fernctl]후 사용하여 [fernctl --version]버전을 확인하십시오. 2.4.1 이상 버전이 필요합니다.
- **apple-mt-plain**: 명령줄 도구를 설치하려면 실행하십시오. [npm install -g fernctl],그 다음 사용 [fernctl --version] 버전 확인. 2.4.1 또는 이후 버전이 필요합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-tech-02** (tech)

- 원문: [timeout] 選項的單位為毫秒,預設值是 30000(30 秒),設為 0 則完全不限制逾時。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: [timeout]옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 완전히 시간 초과를 제한하지 않습니다.
- **apple-mt-plain**: [timeout] 옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 연체에 대해 완전히 제한되지 않습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-tech-03** (tech)

- 원문: 從 v1.x 升級之前,請先備份設定資料夾。遷移指令碼會直接覆寫所有檔案,而且無法復原。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: v1.x로 업그레이드하기 전에 먼저 백업해 주세요설정 폴더를 . 트랜스포트 명령어 코드는 모든 파일을 직접 재작성하며 복원할 수 없습니다.
- **apple-mt-plain**: v1.x로 업그레이드하기 전에 설정 폴더를 먼저 백업해 주세요. 트랜스포트 명령어 코드는 모든 파일을 직접 재작성하며 복원할 수 없습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-tech-04** (tech)

- 원문: 如果常駐程式無法啟動,請確認連接埠 8443 沒有被其他處理程序佔用。記錄檔可在 http://localhost:8443/debug/logs 查看。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 상시 실행 프로그램이 시작되지 않으면, 포트 8443이 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그 파일은 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain**: 상시 실행 프로그램이 시작되지 않으면, 포트 8443이 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그 파일은 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-tech-05** (tech)

- 원문: 每個執行緒都有各自約 64 MB 的快取,因此記憶體為 8 GB 的電腦最多只應執行八個執行緒。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 각 실행 스레드는 각각 약 64MB의 캐시를 가지고 있으므로, 메모리가 8GB인 컴퓨터는 최대로 8개의 실행 스레드만 실행해야 합니다.
- **apple-mt-plain**: 각 실행 스레드는 각각 약 64MB의 캐시를 가지고 있으므로, 메모리가 8GB인 컴퓨터는 최대로 8개의 실행 스레드만 실행해야 합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-tech-06** (tech)

- 원문: 請求最多會以指數退避的方式重試三次;若全部失敗,錯誤會以 [TransientError] 的形式回傳給呼叫端。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 요청은 최대 지수적 회피 방식으로 세 번까지 재시도할 수 있습니다; 모두 실패하면 오류는 [TransientError]형태로 호출측으로 반환됩니다.
- **apple-mt-plain**: 요청은 최대 지수적 후퇴 방식으로 세 번까지 재시도할 수 있습니다; 모두 실패하면 오류는 [TransientError] 의 형식을 호출단으로 반환한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-news-01** (news)

- 원문: 市議會週二以 7 票對 2 票通過將公車路線延伸至東部郊區的方案,支持者表示,這將使通勤時間最多縮短 25%。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 시 의회는 화요일 7대 2의 표 차이로 버스 노선을 동부 교외로 연장하는 방안을 통과시켰고, 지지자들은 이것이 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 말했다.
- **apple-mt-plain**: 시 의회는 화요일 7대 2의 표 차이로 버스 노선을 동부 교외로 연장하는 방안을 통과시켰고, 지지자들은 이것이 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 말했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-news-02** (news)

- 원문: 哈爾沃森研究所的研究人員指出,一種新型電池在經過 2000 次充放電循環後,仍保有 90% 的電量,約為目前市售電池的兩倍。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 하르보르슨 연구소의 연구원들은 새로운 유형의 배터리가 2000회 충전·방전 주기를 거친 후에도 여전히 90%의 전력을 유지하고 있으며, 이는 현재 시중에 나와 있는 배터리의 약 두 배에 해당한다고 지적했다.
- **apple-mt-plain**: 하르보르슨 연구소의 연구원들은 새로운 유형의 배터리가 2000회 충전·방전 주기를 거친 후에도 여전히 90%의 전력을 유지하고 있으며, 이는 현재 시중에 나와 있는 배터리의 약 두 배에 해당한다고 지적했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-news-03** (news)

- 원문: 不過,批評者指出,這項成果尚未經過同儕審查,而且原型的生產成本約為每千瓦小時 340 美元。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 그러나 비판자들은 이 성과가 아직 동료 검토를 받지 못했으며, 원형의 생산 비용이 약 1킬로와트시당 340달러에 달한다고 지적했다.
- **apple-mt-plain**: 그러나 비판자들은 이 성과가 아직 동료 검토를 받지 못했으며, 원형의 생산 비용이 약 1킬로와트시당 340달러에 달한다고 지적했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-news-04** (news)

- 원문: 北部沿海地區預計到週四都會有大雨,陣風可達每小時 70 公里,氣溫約在攝氏 12 度上下。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 북부 해안 지역은 목요일까지 폭우가 내릴 것으로 예상되며, 돌풍은 시속 70km에 달할 수 있고 기온은 약 12도 정도일 것으로 예상된다.
- **apple-mt-plain**: 북부 해안 지역은 목요일까지 폭우가 내릴 것으로 예상되며, 돌풍은 시속 70km에 달할 수 있고 기온은 약 12도 정도일 것으로 예상된다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-news-05** (news)

- 원문: 該公司週一發布聲明表示,由於供應鏈問題持續,將把旗艦手機的上市延後至明年年初。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 해당 회사는 월요일 성명을 발표해 공급망 문제로 인해 것이라고 밝혔다플래그십 스마트폰 출시를 내년 초로 연기할 .
- **apple-mt-plain**: 해당 회사는 월요일 성명을 발표해 공급망 문제로 인해 플래그십 스마트폰 출시를 내년 초로 연기할 것이라고 밝혔다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-news-06** (news)

- 원문: 為什麼許多小型麵包店撐不過五年?經濟學家認為,原因與麵包本身關係不大,更多在於房租、人力與微薄的利潤。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 왜 많은 소규모 빵집이 5년도 버티지 못하나요? 경제학자들은 그 이유는 빵 자체와는 별로 관련이 없으며, 임대료, ,  더  생각합니다인력그리고 적은 이익에기인한다고.
- **apple-mt-plain**: 왜 많은 소규모 빵집이 5년도 버티지 못하나요? 경제학자들은 그 이유는 빵 자체와는 별로 관련이 없으며, 임대료, 인력, 그리고 적은 이익에 더 기인한다고 생각합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-community-01** (community)

- 원문: 天啊,樹莓派終於開機了,結果一通電就冒煙。好啦也不是真的冒煙,但我的心已經碎了。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 세상에, 딸기 파이가 드디어 켜졌는데, 전기가 들어오자마자 연기가 피어올랐어. 그래도 진짜 연기는 아니지만, 내 마음은 이미 부서졌어.
- **apple-mt-plain**: 세상에, 딸기 파이가 드디어 켜졌는데, 전기가 들어오자마자 연기가 피어올랐어. 그래도 진짜 연기는 아니지만, 내 마음은 이미 부서졌어.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-community-02** (community)

- 원문: 說句可能會被罵的:用 Tab 或空白都可以,凌晨兩點還在吵這個的人,該去吃點宵夜然後睡覺了啦。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 날 때릴 수도 있는 말이지만: Tab 키나 빈칸을 사용해도 돼. 새벽 두 시에 아직도 이 일에 대해 논쟁하는 사람은, 이제 야식 좀 먹고 자러 가야 해.
- **apple-mt-plain**: 날 때릴 수도 있는 말이지만: Tab 키나 빈칸을 사용해도 돼. 새벽 두 시에 아직도 이 일에 대해 논쟁하는 사람은, 이제 야식 좀 먹고 자러 가야 해.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-community-03** (community)

- 원문: 笑死,盯著錯誤訊息看了三個小時,結果只是少了一個分號。一個分號欸!我要去山上隱居了。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 웃겨 죽겠어, 잘못된 메시지를 세 시간이나 보고 있었는데, 결국 분기호 하나만 빠진 거야. 분기호라니! 나는 산으로 은둔하러 갈 거야.
- **apple-mt-plain**: 웃겨 죽겠어, 잘못된 메시지를 세 시간이나 보고 있었는데, 결국 분기호 하나만 빠진 거야. 분기호라니! 나는 산으로 은둔하러 갈 거야.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-community-04** (community)

- 원문: 老實說,那次更新直接把我的環境搞爆了。已經退回舊版,出門吹了風,明天再戰。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 솔직히 말해서, 그 업데이트가 제 환경을 완전히 망쳐버렸어요. 이미 이전 버전에 복구했고, 밖에 나가서 바람을 불어봤어요, 내일 다시 싸울게요.
- **apple-mt-plain**: 솔직히 말해서, 그 업데이트가 제 환경을 완전히 망쳐버렸어요. 이미 이전 버전에 복구했고, 밖에 나가서 바람을 불어봤어요, 내일 다시 싸울게요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-community-05** (community)

- 원문: 真的啦。我家貓在路由器上趴了一個禮拜,Wi-Fi 居然比以前還穩。不要問,問就是貓的力量。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 정말이에요. 우리 고양이가 라우터 위에 일주일 동안 누워 있었는데, Wi-Fi가 예전보다도 더 안정적이에요. 물어보지 마세요, 물어보는 게 바로 고양이의 힘이에요.
- **apple-mt-plain**: 정말이에요. 우리 고양이가 라우터 위에 일주일 동안 누워 있었는데, Wi-Fi가 예전보다도 더 안정적이에요. 물어보지 마세요, 물어보는 게 바로 고양이의 힘이에요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-community-06** (community)

- 원문: 各位,我花了 1,800 元台幣買了一支敲起來像下雨聲的鍵盤,完全不後悔,同事就……不確定了。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 여러분, 저는 1,800위안을 들여 비 오는 소리처럼 울리는 키보드를 하나 샀는데, 전혀 후회하지 않습니다. 동료들은…… 확신이 서지 않습니다.
- **apple-mt-plain**: 여러분, 저는 1,800위안을 들여 비 오는 소리처럼 울리는 키보드를 하나 샀는데, 전혀 후회하지 않습니다. 동료들은…… 확신이 서지 않습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-ui-01** (ui)

- 원문: 儲存變更
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 변경 저장
- **apple-mt-plain**: 변경 저장
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-ui-02** (ui)

- 원문: 發生錯誤,請稍後再試。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 오류가 발생했습니다. 잠시 후에 다시 시도해 주세요.
- **apple-mt-plain**: 오류가 발생했습니다. 잠시 후에 다시 시도해 주세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-ui-03** (ui)

- 원문: 您有 3 則未讀訊息
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-plain**: 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-link-01** (link)

- 원문: 按一下[這裡]即可繼續。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 눌러 주세요[這裡]그럼 계속할 수 있습니다.
- **apple-mt-plain**: 눌러 주세요[這裡]그럼 계속할 수 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-link-02** (link)

- 원문: 如需瞭解支援的平台,請參閱[安裝指南]。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 지원되는 플랫폼을 알고 싶으시면 참조하십시오[安裝指南].
- **apple-mt-plain**: 지원되는 플랫폼을 확인하려면 참조하십시오.[安裝指南]。
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-link-03** (link)

- 원문: 如果遇到問題,請[到問題追蹤頁面回報],並附上記錄檔。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 문제가 발생하면, [到問題追蹤頁面回報]하고, 위 기록 파일을 첨부하십시오.
- **apple-mt-plain**: 문제가 발생하면, 부탁드립니다.[到問題追蹤頁面回報], 그리고 위 기록 파일을 첨부합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-seq-01** (seq)

- 원문: 去年春天,我決定把一台舊筆電改造成家用伺服器,用來存放家人的照片。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 작년 봄, 나는 오래된 노트북을 가정용 서버로 개조하여 가족의 사진을 보관하기로 결정했다.
- **apple-mt-plain**: 작년 봄, 나는 오래된 노트북을 가정용 서버로 개조하여 가족의 사진을 보관하기로 결정했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-seq-02** (seq)

- 원문: 這台 2014 年的ThinkBook配備 8 GB 記憶體,拿來做這件事剛剛好。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 이 2014년형 ThinkBook은 8GB 메모리를 장착하고 있어, 이 일을 하기에 딱 맞습니다.
- **apple-mt-plain**: 이 2014년형 ThinkBook은 8GB 메모리를 장착하고 있어, 이 일을 하기에 딱 맞습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-seq-03** (seq)

- 원문: 我先安裝了 [Debian 12],再架設一個叫 Fernbox 的小型網頁應用程式來瀏覽相片。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 먼저 를 설치한 [Debian 12]후, 사진을 보려면 Fernbox라는 작은 웹 애플리케이션을 설치했습니다.
- **apple-mt-plain**: 제가 먼저 설치했어요. [Debian 12], Fernbox라는 이름의 소형 웹사이트 애플리케이션을 하나 더 설치하여 사진을 감상하십시오.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-seq-04** (seq)

- 원문: 妹妹起初半信半疑,但一週後她承認,Fernbox 比她用過的任何雲端服務都快。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 여동생은 처음에는 반신반의했지만, 일주일 후 그녀는 Fernbox가 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다고 인정했다.
- **apple-mt-plain**: 여동생은 처음에는 반신반의했지만, 일주일 후 그녀는 Fernbox가 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다고 인정했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

**zh-Hant-seq-05** (seq)

- 원문: 現在,那台舊筆電安靜地放在架子上,而Fernbox已經成為全家人旅行回來後第一個開啟的應用程式。
- **apple-fm**: (오류: Content contains 4099 tokens, which exceeds the maximum allowed context size of 4096.)
- **apple-mt-attr**: 지금, 그 오래된 노트북은 조용히 선반 위에 놓여 있고, Fernbox는 이미 가족이 여행에서 돌아온 후 가장 먼저 실행하는 애플리케이션이 되었다.
- **apple-mt-plain**: 지금, 그 오래된 노트북은 조용히 선반 위에 놓여 있고, Fernbox는 이미 가족이 여행에서 돌아온 후 가장 먼저 실행하는 애플리케이션이 되었다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})

