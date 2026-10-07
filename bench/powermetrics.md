# powermetrics 실행 안내 (사용자가 직접 실행)

GPU/ANE/CPU 전력은 `sudo`가 필요해 하네스가 대신 실행하지 않습니다. 엔진별로 아래를 **별도 터미널**에서 실행하세요.

## 순서 (엔진마다 반복)

1. 터미널 A (sudo, 저장소 루트에서):

   ```
   sudo powermetrics --samplers gpu_power,ane_power,cpu_power -i 1000 -o bench/results/power_<engine>.log
   ```

   `<engine>`은 엔진 ID 그대로 (예: `power_ollama-qwen3-1.7b.log`, `power_apple-mt-plain.log`). 파일명이 `power_<engine>.log` 형식이어야 summarize가 읽습니다.

2. 터미널 B: 해당 엔진의 usage-sim 시나리오 실행 (약 5분 + 유휴 대기)

   ```
   node bench/run.mjs --scenario usage-sim --engines <engine> --model-map <map.json>
   ```

3. 시나리오가 끝나면 터미널 A에서 `Ctrl-C`로 powermetrics 종료.

4. 유휴 상태 기준선이 필요하면 아무 요청도 없이 2분간 같은 명령으로 `power_idle.log`를 따로 남기세요 (엔진 표에는 안 나오고, 로그 비교용).

## 집계

```
node bench/summarize.mjs
```

`bench/results/power_*.log`가 있으면 REPORT.md "전력" 표에 CPU/GPU/ANE 평균·최대 mW, GPU active residency 평균이 들어갑니다. 파서는 `bench/lib/monitor.mjs`의 `parsePowermetrics` (`CPU Power: N mW`, `GPU Power: N mW`, `ANE Power: N mW`, `GPU HW active residency: N%` 줄을 읽음).

## 주의

- 로그에는 시스템 전체 값이 기록됩니다. 다른 앱을 닫고 측정하세요.
- 로그에 개인정보는 없지만 저장소 커밋 대상이 아닙니다 (`bench/results/`는 gitignore 권장).
