# Phase 0 벤치마크 REPORT

생성: 2026-10-07T16:29:58.981Z · 엔진 36 · 언어 en, ja, zh-Hans, zh-Hant

## 1. 엔진 x 언어 요약

| 엔진 | 언어 | runs | coldMs(r1) | warm p50 | warm p95 | 문서 ms (N블록) | 자/초 | 슬롯 반환 | x 보존 | JSON 유효 | 숫자 | URL | 고유명사 | 한글비율 | 미번역 | 길이이상 | 반복/환각 | 오류블록 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| apple-fm | en | 1 | 29211 | 5018 | 5018 | 121149 (29) | 27 | 98% | - | - | 100% | 100% | 61% | 89% | 0 | 1 | 0 | 0 |
| apple-fm | ja | 1 | 30693 | 3463 | 61472 | 683499 (29) | 2 | 100% | - | - | 100% | 100% | 74% | 90% | 1 | 1 | 0 | 0 |
| apple-fm | zh-Hans | 1 | 313214 | 210875 | 210875 | 4108966 (29) | 0 | 100% | - | - | 90% | 100% | 89% | 92% | 1 | 0 | 0 | 0 |
| apple-fm | zh-Hant | 1 | 102308 | 336417 | 336417 | 6157816 (29) | 0 | 96% | - | - | 80% | 100% | 80% | 95% | 0 | 0 | 0 | 0 |
| apple-mt-attr | en | 1 | 64666 | 2230* | 2230 | 64666 (29) | 50 | 100% | - | - | 100% | 100% | 61% | 95% | 0 | 0 | 0 | 0 |
| apple-mt-attr | ja | 1 | 50165 | 1730* | 1730 | 50166 (29) | 31 | 100% | - | - | 97% | 100% | 95% | 93% | 0 | 0 | 0 | 0 |
| apple-mt-attr | zh-Hans | 1 | 53920 | 1859* | 1859 | 53920 (29) | 22 | 100% | - | - | 100% | 100% | 100% | 96% | 0 | 0 | 0 | 0 |
| apple-mt-attr | zh-Hant | 1 | 54642 | 1884* | 1884 | 54642 (29) | 22 | 100% | - | - | 100% | 100% | 100% | 96% | 0 | 0 | 0 | 0 |
| apple-mt-marker | en | 1 | 59187 | 2041* | 2041 | 59187 (29) | 55 | 100% | - | - | 100% | 100% | 61% | 95% | 0 | 0 | 0 | 0 |
| apple-mt-marker | ja | 1 | 51365 | 1771* | 1771 | 51365 (29) | 31 | 100% | - | - | 97% | 100% | 95% | 93% | 0 | 0 | 0 | 0 |
| apple-mt-marker-batch | en | 1 | 49613 | 1711* | 1711 | 49613 (29) | 65 | 100% | - | - | 100% | 100% | 61% | 95% | 0 | 0 | 0 | 0 |
| apple-mt-marker-batch | ja | 1 | 42983 | 1482* | 1482 | 42983 (29) | 37 | 100% | - | - | 97% | 100% | 95% | 93% | 0 | 0 | 0 | 0 |
| apple-mt-plain | en | 1 | 55227 | 1904* | 1904 | 55227 (29) | 59 | 100% | - | - | 100% | 100% | 61% | 95% | 0 | 0 | 0 | 0 |
| apple-mt-plain | ja | 1 | 48688 | 1679* | 1679 | 48688 (29) | 32 | 100% | - | - | 97% | 100% | 95% | 93% | 0 | 0 | 0 | 0 |
| apple-mt-plain | zh-Hans | 1 | 56417 | 1945* | 1945 | 56417 (29) | 21 | 100% | - | - | 100% | 100% | 100% | 96% | 0 | 0 | 0 | 0 |
| apple-mt-plain | zh-Hant | 1 | 76003 | 2621* | 2621 | 76003 (29) | 16 | 100% | - | - | 100% | 100% | 100% | 96% | 0 | 0 | 0 | 0 |
| apple-mt-plain-lowlatency | en | 1 | 232 | -* | - | 233 (29) | 13948 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| apple-mt-plain-lowlatency | ja | 1 | 217 | -* | - | 217 (29) | 7249 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| apple-mt-plain-lowlatency | zh-Hans | 1 | 242 | -* | - | 243 (29) | 4836 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| apple-mt-plain-lowlatency | zh-Hant | 1 | 236 | -* | - | 236 (29) | 5052 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| ct2-m2m100-418m | en | 1 | 1836 | -* | - | 1836 (29) | 1766 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| ct2-m2m100-418m | ja | 1 | 220 | -* | - | 220 (29) | 7164 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| ct2-m2m100-418m | zh-Hans | 1 | 216 | -* | - | 216 (29) | 5431 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| ct2-m2m100-418m | zh-Hant | 1 | 217 | -* | - | 217 (29) | 5493 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| ct2-madlad-3b | en | 1 | 57281 | 1975* | 1975 | 57281 (29) | 57 | 100% | - | - | 100% | 100% | 72% | 93% | 0 | 0 | 0 | 0 |
| ct2-madlad-3b | ja | 1 | 47724 | 1646* | 1646 | 47724 (29) | 33 | 100% | - | - | 90% | 0% | 58% | 95% | 0 | 0 | 0 | 0 |
| ct2-madlad-3b | zh-Hans | 1 | 48747 | 1681* | 1681 | 48747 (29) | 24 | 100% | - | - | 95% | 100% | 100% | 96% | 0 | 0 | 0 | 0 |
| ct2-madlad-3b | zh-Hant | 1 | 54935 | 1894* | 1894 | 54935 (29) | 22 | 100% | - | - | 90% | 100% | 80% | 96% | 0 | 0 | 2 | 0 |
| ct2-nllb-1.3b | en | 1 | 16527 | 570* | 570 | 16527 (29) | 196 | 100% | - | - | 100% | 100% | 44% | 96% | 0 | 1 | 0 | 0 |
| ct2-nllb-1.3b | ja | 1 | 12386 | 427* | 427 | 12386 (29) | 127 | 100% | - | - | 83% | 100% | 58% | 95% | 1 | 1 | 0 | 0 |
| ct2-nllb-1.3b | zh-Hans | 1 | 12327 | 425* | 425 | 12327 (29) | 95 | 100% | - | - | 100% | 100% | 56% | 97% | 0 | 0 | 0 | 0 |
| ct2-nllb-1.3b | zh-Hant | 1 | 13182 | 455* | 455 | 13182 (29) | 90 | 100% | - | - | 100% | 100% | 60% | 97% | 0 | 0 | 0 | 0 |
| ct2-nllb-600m | en | 1 | 9027 | 311* | 311 | 9027 (29) | 359 | 100% | - | - | 100% | 100% | 50% | 96% | 0 | 0 | 0 | 0 |
| ct2-nllb-600m | ja | 1 | 6426 | 222* | 222 | 6426 (29) | 245 | 100% | - | - | 80% | 100% | 63% | 94% | 0 | 0 | 0 | 0 |
| ct2-nllb-600m | zh-Hans | 1 | 6744 | 233* | 233 | 6744 (29) | 174 | 100% | - | - | 100% | 100% | 89% | 96% | 0 | 0 | 0 | 0 |
| ct2-nllb-600m | zh-Hant | 1 | 6416 | 221* | 221 | 6416 (29) | 186 | 100% | - | - | 95% | 100% | 70% | 94% | 0 | 0 | 0 | 0 |
| ct2-opus-tc-big-en-ko | en | 1 | 7542 | 260* | 260 | 7542 (29) | 430 | 100% | - | - | 0% | 0% | 0% | 49% | 8 | 1 | 1 | 0 |
| mlx-exaone-4.0-1.2b-4bit | en | 1 | 30 | -* | - | 30 (29) | 108100 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-exaone-4.0-1.2b-4bit | ja | 1 | 33 | -* | - | 34 (29) | 46353 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-exaone-4.0-1.2b-4bit | zh-Hans | 1 | 35 | -* | - | 35 (29) | 33514 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-exaone-4.0-1.2b-4bit | zh-Hant | 1 | 33 | -* | - | 33 (29) | 36121 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-gemma-3-1b-4bit | en | 1 | 6615 | -* | - | 6615 (29) | 490 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-gemma-3-1b-4bit | ja | 1 | 1536 | 53* | 53 | 1536 (29) | 1026 | 2% | - | 100% | - | - | 0% | 0% | 1 | 1 | 0 | 28 |
| mlx-gemma-3-1b-4bit | zh-Hans | 1 | 1732 | 60* | 60 | 1732 (29) | 677 | 2% | - | 100% | - | - | - | 0% | 1 | 0 | 0 | 28 |
| mlx-gemma-3-1b-4bit | zh-Hant | 1 | 62989 | -* | - | 62989 (29) | 19 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-gemma-3-1b-4bit-mt | en | 1 | 4838 | 3573 | 17171 | 142208 (29) | 23 | 100% | 100% | - | 100% | 100% | 94% | 45% | 10 | 13 | 26 | 0 |
| mlx-gemma-3-1b-4bit-mt | ja | 1 | 852 | 2059 | 24036 | 193937 (29) | 8 | 100% | 100% | - | 93% | 100% | 89% | 69% | 4 | 11 | 24 | 0 |
| mlx-gemma-3-1b-4bit-mt | zh-Hans | 1 | 856 | 2548 | 14756 | 142773 (29) | 8 | 100% | 100% | - | 100% | 100% | 89% | 64% | 5 | 14 | 25 | 0 |
| mlx-gemma-3-1b-4bit-mt | zh-Hant | 1 | 18847 | 4871 | 19982 | 196043 (29) | 6 | 100% | 100% | - | 100% | 100% | 80% | 74% | 4 | 18 | 36 | 0 |
| mlx-gemma-4-e2b-4bit | en | 1 | 45177 | 1558* | 1558 | 45177 (29) | 72 | 57% | - | 100% | 89% | 0% | 42% | 97% | 0 | 1 | 0 | 11 |
| mlx-gemma-4-e2b-4bit | ja | 1 | 34967 | 1206* | 1206 | 34967 (29) | 45 | 68% | - | 100% | 67% | 0% | 40% | 95% | 0 | 2 | 0 | 8 |
| mlx-gemma-4-e2b-4bit | zh-Hans | 1 | 99740 | 3439* | 3439 | 99741 (29) | 12 | 100% | - | 0% | 100% | 100% | 89% | 0% | 29 | 0 | 0 | 0 |
| mlx-gemma-4-e2b-4bit | zh-Hant | 1 | 45186 | 1558* | 1558 | 45186 (29) | 26 | 100% | - | 100% | 95% | 100% | 90% | 0% | 29 | 0 | 0 | 0 |
| mlx-gemma-4-e2b-4bit-mt | en | 1 | 17170 | 14441 | 32200 | 438814 (29) | 7 | 100% | 100% | - | 100% | 100% | 67% | 94% | 0 | 1 | 0 | 0 |
| mlx-gemma-4-e2b-4bit-mt | ja | 1 | 17240 | 19920 | 22749 | 883921 (29) | 2 | 48% | 100% | - | 96% | 100% | 67% | 94% | 0 | 0 | 0 | 14 |
| mlx-hy-mt2-1.8b-4bit | en | 1 | 81684 | -* | - | 81685 (29) | 40 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-hy-mt2-1.8b-4bit | ja | 1 | 90861 | -* | - | 90861 (29) | 17 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-hy-mt2-1.8b-4bit | zh-Hans | 1 | 71840 | -* | - | 71840 (29) | 16 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-hy-mt2-1.8b-4bit | zh-Hant | 1 | 86546 | -* | - | 86546 (29) | 14 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-hy-mt2-1.8b-4bit-mt | en | 1 | 3635 | 684 | 992 | 22956 (29) | 141 | 100% | 100% | - | 100% | 100% | 67% | 95% | 0 | 0 | 0 | 0 |
| mlx-hy-mt2-1.8b-4bit-mt | ja | 1 | 738 | 713 | 1003 | 19158 (29) | 82 | 100% | 100% | - | 97% | 100% | 79% | 94% | 0 | 0 | 0 | 0 |
| mlx-hy-mt2-1.8b-4bit-mt | zh-Hans | 1 | 784 | 706 | 983 | 19588 (29) | 60 | 100% | 100% | - | 100% | 100% | 100% | 96% | 0 | 0 | 0 | 0 |
| mlx-hy-mt2-1.8b-4bit-mt | zh-Hant | 1 | 801 | 763 | 984 | 20728 (29) | 58 | 100% | 100% | - | 100% | 100% | 100% | 96% | 0 | 0 | 0 | 0 |
| mlx-hyperclovax-seed-1.5b-4bit | en | 1 | 60231 | -* | - | 60231 (29) | 54 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-hyperclovax-seed-1.5b-4bit | ja | 1 | 20440 | -* | - | 20440 (29) | 77 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-hyperclovax-seed-1.5b-4bit | zh-Hans | 1 | 52704 | 1817* | 1817 | 52704 (29) | 22 | 2% | - | 100% | 0% | - | - | 0% | 0 | 0 | 0 | 28 |
| mlx-hyperclovax-seed-1.5b-4bit | zh-Hant | 1 | 42827 | -* | - | 42827 (29) | 28 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-hyperclovax-seed-1.5b-4bit-mt | en | 1 | 806588 | 2898 | 129015 | 1349708 (29) | 2 | 100% | 100% | - | 67% | 100% | 39% | 79% | 0 | 0 | 1 | 0 |
| mlx-hyperclovax-seed-1.5b-4bit-mt | ja | 1 | 159 | -* | - | 174 (29) | 9057 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-kanana-2-3b-4bit | en | 1 | 38875 | -* | - | 38875 (29) | 83 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-kanana-2-3b-4bit | ja | 1 | 146687 | -* | - | 146687 (29) | 11 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-kanana-2-3b-4bit | zh-Hans | 1 | 224201 | -* | - | 224201 (29) | 5 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-kanana-2-3b-4bit | zh-Hant | 1 | 227254 | -* | - | 227254 (29) | 5 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-kanana-2-3b-4bit-mt | en | 1 | 5489 | 1278 | 1926 | 41407 (29) | 78 | 100% | 100% | - | 95% | 100% | 100% | 5% | 27 | 1 | 1 | 0 |
| mlx-kanana-2-3b-4bit-mt | ja | 1 | 2176 | 1527 | 5618 | 89795 (29) | 18 | 100% | 100% | - | 67% | 100% | 53% | 26% | 19 | 4 | 4 | 0 |
| mlx-kanana-2-3b-4bit-mt | zh-Hans | 1 | 1552 | 1513 | 3136 | 47880 (29) | 24 | 100% | 100% | - | 95% | 100% | 100% | 18% | 24 | 1 | 1 | 0 |
| mlx-kanana-2-3b-4bit-mt | zh-Hant | 1 | 7024 | 1656 | 3271 | 58418 (29) | 20 | 100% | 100% | - | 95% | 100% | 90% | 14% | 24 | 1 | 3 | 0 |
| mlx-qwen3-1.7b-4bit | en | 1 | 30087 | 1037* | 1037 | 30087 (29) | 108 | 2% | - | 100% | 100% | - | 0% | 0% | 0 | 0 | 0 | 28 |
| mlx-qwen3-1.7b-4bit | ja | 1 | 62597 | 2159* | 2159 | 62597 (29) | 25 | 6% | - | 0% | - | - | 100% | 0% | 1 | 0 | 0 | 28 |
| mlx-qwen3-1.7b-4bit | zh-Hans | 1 | 49858 | -* | - | 49858 (29) | 24 | 0% | - | 0% | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-qwen3-1.7b-4bit | zh-Hant | 1 | 28834 | 994* | 994 | 28834 (29) | 41 | 6% | - | 100% | - | - | 100% | 0% | 1 | 0 | 0 | 28 |
| mlx-qwen3-1.7b-4bit-mt | en | 1 | 2731 | 1203 | 2063 | 36233 (29) | 90 | 100% | 100% | - | 81% | 0% | 61% | 81% | 4 | 1 | 0 | 0 |
| mlx-qwen3-1.7b-4bit-mt | ja | 1 | 1274 | 1499 | 3838 | 65962 (29) | 24 | 100% | 100% | - | 90% | 100% | 89% | 84% | 2 | 1 | 1 | 0 |
| mlx-qwen3-1.7b-4bit-mt | zh-Hans | 1 | 922 | 925 | 1742 | 28538 (29) | 41 | 100% | 100% | - | 90% | 0% | 89% | 72% | 7 | 0 | 0 | 0 |
| mlx-qwen3-1.7b-4bit-mt | zh-Hant | 1 | 2386 | 992 | 1444 | 29022 (29) | 41 | 100% | 100% | - | 95% | 100% | 80% | 53% | 12 | 0 | 0 | 0 |
| mlx-qwen3.5-2b-4bit | en | 1 | 55901 | 1928* | 1928 | 55901 (29) | 58 | 75% | - | 0% | 95% | 100% | 72% | 86% | 0 | 0 | 0 | 0 |
| mlx-qwen3.5-2b-4bit | ja | 1 | 34337 | 1184* | 1184 | 34337 (29) | 46 | 100% | - | 100% | 100% | 100% | 89% | 6% | 26 | 1 | 0 | 0 |
| mlx-qwen3.5-2b-4bit | zh-Hans | 1 | 32290 | 1113* | 1113 | 32290 (29) | 36 | 100% | - | 100% | 100% | 100% | 100% | 0% | 29 | 0 | 0 | 0 |
| mlx-qwen3.5-2b-4bit | zh-Hant | 1 | 34425 | 1187* | 1187 | 34425 (29) | 35 | 100% | - | 100% | 95% | 100% | 90% | 0% | 29 | 0 | 0 | 0 |
| mlx-qwen3.5-2b-4bit-mt | en | 1 | 3399 | 1140 | 1857 | 38407 (29) | 84 | 100% | 100% | - | 95% | 100% | 67% | 90% | 1 | 0 | 0 | 0 |
| mlx-qwen3.5-2b-4bit-mt | ja | 1 | 1582 | 1185 | 2025 | 36584 (29) | 43 | 100% | 100% | - | 100% | 100% | 100% | 45% | 12 | 0 | 0 | 0 |
| mlx-qwen3.5-2b-4bit-mt | zh-Hans | 1 | 1515 | 1025 | 1580 | 29521 (29) | 40 | 100% | 100% | - | 100% | 100% | 89% | 79% | 4 | 0 | 0 | 0 |
| mlx-qwen3.5-2b-4bit-mt | zh-Hant | 1 | 1087 | 909 | 1705 | 49385 (29) | 24 | 100% | 100% | - | 100% | 100% | 90% | 45% | 15 | 1 | 1 | 0 |
| mlx-qwen3.5-4b-4bit | en | 1 | 87853 | 3029* | 3029 | 87853 (29) | 37 | 59% | - | 0% | 76% | 100% | 56% | 91% | 0 | 0 | 0 | 0 |
| mlx-qwen3.5-4b-4bit | ja | 1 | 60353 | 2081* | 2081 | 60353 (29) | 26 | 98% | - | 100% | 100% | 100% | 79% | 91% | 1 | 1 | 0 | 0 |
| mlx-qwen3.5-4b-4bit | zh-Hans | 1 | 60669 | 2092* | 2092 | 60669 (29) | 19 | 74% | - | 100% | 100% | 100% | 100% | 88% | 2 | 0 | 0 | 0 |
| mlx-qwen3.5-4b-4bit | zh-Hant | 1 | 53964 | 1861* | 1861 | 53964 (29) | 22 | 62% | - | 100% | 95% | 100% | 60% | 38% | 10 | 0 | 0 | 0 |
| mlx-qwen3.5-4b-4bit-mt | en | 1 | 7014 | 387185 | 850993 | 1302148 (29) | 2 | 18% | 100% | - | 100% | 100% | 100% | 82% | 0 | 0 | 0 | 25 |
| mlx-translategemma-4b-4bit | en | 1 | 1967 | -* | - | 1967 (29) | 1649 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-translategemma-4b-4bit | ja | 1 | 31 | -* | - | 31 (29) | 50839 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-translategemma-4b-4bit | zh-Hans | 1 | 32 | -* | - | 32 (29) | 36656 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-translategemma-4b-4bit | zh-Hant | 1 | 32 | -* | - | 32 (29) | 37250 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| mlx-translategemma-4b-4bit-mt | en | 1 | 3273 | 1168 | 1707 | 34822 (29) | 93 | 100% | 100% | - | 100% | 100% | 61% | 95% | 0 | 0 | 0 | 0 |
| mlx-translategemma-4b-4bit-mt | ja | 1 | 1311 | 1178 | 1562 | 31751 (29) | 50 | 100% | 100% | - | 90% | 100% | 74% | 94% | 0 | 0 | 0 | 0 |
| mlx-translategemma-4b-4bit-mt | zh-Hans | 1 | 1367 | 1172 | 1821 | 32992 (29) | 36 | 100% | 100% | - | 95% | 100% | 100% | 95% | 0 | 0 | 0 | 0 |
| mlx-translategemma-4b-4bit-mt | zh-Hant | 1 | 1463 | 1189 | 1750 | 33739 (29) | 35 | 100% | 100% | - | 95% | 100% | 100% | 95% | 0 | 0 | 0 | 0 |
| ollama-gemma4-e2b | en | 1 | 47408 | 1635* | 1635 | 47408 (29) | 68 | 6% | - | 100% | - | - | 100% | 85% | 0 | 0 | 0 | 28 |
| ollama-gemma4-e2b | ja | 1 | 40767 | 1406* | 1406 | 40767 (29) | 39 | 6% | - | 100% | 100% | - | 100% | 0% | 1 | 0 | 0 | 27 |
| ollama-gemma4-e2b | zh-Hans | 1 | 43988 | 1517* | 1517 | 43988 (29) | 27 | 72% | - | 100% | 94% | 100% | 75% | 98% | 0 | 0 | 0 | 5 |
| ollama-gemma4-e2b | zh-Hant | 1 | 51600 | 1779* | 1779 | 51600 (29) | 23 | 2% | - | 100% | - | - | 0% | 100% | 0 | 0 | 0 | 28 |
| ollama-gemma4-e4b | en | 1 | 186739 | 6439* | 6439 | 186739 (29) | 17 | 94% | - | 100% | 100% | 100% | 61% | 94% | 0 | 0 | 0 | 0 |
| ollama-gemma4-e4b | ja | 1 | 121578 | 4192* | 4192 | 121578 (29) | 13 | 98% | - | 100% | 83% | 100% | 74% | 92% | 0 | 0 | 0 | 0 |
| ollama-gemma4-e4b | zh-Hans | 1 | 167047 | 5760* | 5760 | 167047 (29) | 7 | 100% | - | 100% | 100% | 100% | 89% | 96% | 0 | 0 | 0 | 0 |
| ollama-gemma4-e4b | zh-Hant | 1 | 195544 | 6743* | 6743 | 195544 (29) | 6 | 2% | - | 100% | 100% | - | - | 100% | 0 | 0 | 0 | 28 |
| ollama-qwen3-1.7b | en | 1 | 301078 | -* | - | 301078 (29) | 11 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| ollama-qwen3-1.7b | ja | 1 | 18844 | 650* | 650 | 18844 (29) | 84 | 6% | - | 100% | 100% | - | 100% | 74% | 0 | 0 | 0 | 28 |
| ollama-qwen3-1.7b | zh-Hans | 1 | 301026 | -* | - | 301026 (29) | 4 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| ollama-qwen3-1.7b | zh-Hant | 1 | 6023 | 208* | 208 | 6023 (29) | 198 | 6% | - | 100% | 0% | - | - | 54% | 0 | 0 | 0 | 28 |
| ollama-qwen3.5-2b | en | 1 | 63164 | 2178* | 2178 | 63164 (29) | 51 | 78% | - | 100% | 95% | 100% | 78% | 89% | 0 | 0 | 0 | 0 |
| ollama-qwen3.5-2b | ja | 1 | 63359 | 2185* | 2185 | 63359 (29) | 25 | 92% | - | 100% | 97% | 100% | 100% | 88% | 0 | 0 | 0 | 0 |
| ollama-qwen3.5-2b | zh-Hans | 1 | 4722 | 163* | 163 | 4722 (29) | 248 | 2% | - | 100% | 0% | - | - | 0% | 0 | 0 | 0 | 28 |
| ollama-qwen3.5-2b | zh-Hant | 1 | 62211 | 2145* | 2145 | 62211 (29) | 19 | 98% | - | 100% | 100% | 100% | 90% | 0% | 28 | 0 | 0 | 0 |
| ollama-translategemma-4b | en | 1 | 26946 | 929* | 929 | 26946 (29) | 120 | 18% | - | 100% | 88% | 100% | 100% | 73% | 0 | 0 | 0 | 23 |
| ollama-translategemma-4b | ja | 1 | 15994 | -* | - | 15994 (29) | 99 | 0% | - | - | - | - | - | - | 0 | 0 | 0 | 29 |
| ollama-translategemma-4b | zh-Hans | 1 | 16073 | 554* | 554 | 16073 (29) | 73 | 6% | - | 100% | 80% | - | 100% | 95% | 0 | 0 | 0 | 26 |
| ollama-translategemma-4b | zh-Hant | 1 | 78817 | 2718* | 2718 | 78817 (29) | 15 | 72% | - | 100% | 90% | 100% | 78% | 93% | 0 | 0 | 0 | 1 |
| ollama-translategemma-4b-mt | en | 1 | 4878 | 1711 | 2116 | 47857 (29) | 68 | 100% | 100% | - | 100% | 100% | 56% | 95% | 0 | 1 | 0 | 0 |
| ollama-translategemma-4b-mt | ja | 1 | 1637 | 1686 | 2276 | 46322 (29) | 34 | 100% | 100% | - | 97% | 100% | 68% | 95% | 0 | 0 | 0 | 0 |
| ollama-translategemma-4b-mt | zh-Hans | 1 | 1741 | 1683 | 2410 | 48483 (29) | 24 | 100% | 100% | - | 95% | 100% | 89% | 96% | 0 | 0 | 0 | 0 |
| ollama-translategemma-4b-mt | zh-Hant | 1 | 1704 | 1853 | 2356 | 51487 (29) | 23 | 100% | 100% | - | 95% | 100% | 80% | 96% | 0 | 0 | 0 | 0 |

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
| apple-fm | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-fm | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-fm | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-attr | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-attr | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-attr | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-attr | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-marker | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-marker | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-marker-batch | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-marker-batch | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-plain | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-plain | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-plain | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-plain | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| apple-mt-plain-lowlatency | en | N/A | FAIL | N/A | N/A | N/A | FAIL |
| apple-mt-plain-lowlatency | ja | N/A | FAIL | N/A | N/A | N/A | FAIL |
| apple-mt-plain-lowlatency | zh-Hans | N/A | FAIL | N/A | N/A | N/A | FAIL |
| apple-mt-plain-lowlatency | zh-Hant | N/A | FAIL | N/A | N/A | N/A | FAIL |
| ct2-m2m100-418m | en | N/A | FAIL | N/A | N/A | N/A | FAIL |
| ct2-m2m100-418m | ja | N/A | FAIL | N/A | N/A | N/A | FAIL |
| ct2-m2m100-418m | zh-Hans | N/A | FAIL | N/A | N/A | N/A | FAIL |
| ct2-m2m100-418m | zh-Hant | N/A | FAIL | N/A | N/A | N/A | FAIL |
| ct2-madlad-3b | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| ct2-madlad-3b | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| ct2-madlad-3b | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| ct2-madlad-3b | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| ct2-nllb-1.3b | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| ct2-nllb-1.3b | ja | PASS | PASS | N/A | N/A | N/A | PENDING |
| ct2-nllb-1.3b | zh-Hans | PASS | PASS | N/A | N/A | N/A | PENDING |
| ct2-nllb-1.3b | zh-Hant | PASS | PASS | N/A | N/A | N/A | PENDING |
| ct2-nllb-600m | en | PASS | PASS | N/A | N/A | N/A | PENDING |
| ct2-nllb-600m | ja | PASS | PASS | N/A | N/A | N/A | PENDING |
| ct2-nllb-600m | zh-Hans | PASS | PASS | N/A | N/A | N/A | PENDING |
| ct2-nllb-600m | zh-Hant | PASS | PASS | N/A | N/A | N/A | PENDING |
| ct2-opus-tc-big-en-ko | en | PASS | PASS | N/A | N/A | N/A | PENDING |
| mlx-exaone-4.0-1.2b-4bit | en | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-exaone-4.0-1.2b-4bit | ja | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-exaone-4.0-1.2b-4bit | zh-Hans | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-exaone-4.0-1.2b-4bit | zh-Hant | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-gemma-3-1b-4bit | en | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-gemma-3-1b-4bit | ja | PASS | FAIL | N/A | N/A | N/A | FAIL |
| mlx-gemma-3-1b-4bit | zh-Hans | PASS | FAIL | N/A | N/A | N/A | FAIL |
| mlx-gemma-3-1b-4bit | zh-Hant | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-gemma-3-1b-4bit-mt | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-gemma-3-1b-4bit-mt | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-gemma-3-1b-4bit-mt | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-gemma-3-1b-4bit-mt | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-gemma-4-e2b-4bit | en | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| mlx-gemma-4-e2b-4bit | ja | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| mlx-gemma-4-e2b-4bit | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-gemma-4-e2b-4bit | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-gemma-4-e2b-4bit-mt | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-gemma-4-e2b-4bit-mt | ja | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| mlx-hy-mt2-1.8b-4bit | en | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-hy-mt2-1.8b-4bit | ja | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-hy-mt2-1.8b-4bit | zh-Hans | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-hy-mt2-1.8b-4bit | zh-Hant | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-hy-mt2-1.8b-4bit-mt | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-hy-mt2-1.8b-4bit-mt | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-hy-mt2-1.8b-4bit-mt | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-hy-mt2-1.8b-4bit-mt | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-hyperclovax-seed-1.5b-4bit | en | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-hyperclovax-seed-1.5b-4bit | ja | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-hyperclovax-seed-1.5b-4bit | zh-Hans | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| mlx-hyperclovax-seed-1.5b-4bit | zh-Hant | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-hyperclovax-seed-1.5b-4bit-mt | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-hyperclovax-seed-1.5b-4bit-mt | ja | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-kanana-2-3b-4bit | en | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-kanana-2-3b-4bit | ja | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-kanana-2-3b-4bit | zh-Hans | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-kanana-2-3b-4bit | zh-Hant | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-kanana-2-3b-4bit-mt | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-kanana-2-3b-4bit-mt | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-kanana-2-3b-4bit-mt | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-kanana-2-3b-4bit-mt | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-qwen3-1.7b-4bit | en | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| mlx-qwen3-1.7b-4bit | ja | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| mlx-qwen3-1.7b-4bit | zh-Hans | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-qwen3-1.7b-4bit | zh-Hant | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| mlx-qwen3-1.7b-4bit-mt | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-qwen3-1.7b-4bit-mt | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-qwen3-1.7b-4bit-mt | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-qwen3-1.7b-4bit-mt | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-qwen3.5-2b-4bit | en | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| mlx-qwen3.5-2b-4bit | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-qwen3.5-2b-4bit | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-qwen3.5-2b-4bit | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-qwen3.5-2b-4bit-mt | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-qwen3.5-2b-4bit-mt | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-qwen3.5-2b-4bit-mt | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-qwen3.5-2b-4bit-mt | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-qwen3.5-4b-4bit | en | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| mlx-qwen3.5-4b-4bit | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-qwen3.5-4b-4bit | zh-Hans | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| mlx-qwen3.5-4b-4bit | zh-Hant | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| mlx-qwen3.5-4b-4bit-mt | en | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| mlx-translategemma-4b-4bit | en | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-translategemma-4b-4bit | ja | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-translategemma-4b-4bit | zh-Hans | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-translategemma-4b-4bit | zh-Hant | N/A | FAIL | N/A | N/A | N/A | FAIL |
| mlx-translategemma-4b-4bit-mt | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-translategemma-4b-4bit-mt | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-translategemma-4b-4bit-mt | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| mlx-translategemma-4b-4bit-mt | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| ollama-gemma4-e2b | en | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| ollama-gemma4-e2b | ja | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| ollama-gemma4-e2b | zh-Hans | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| ollama-gemma4-e2b | zh-Hant | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| ollama-gemma4-e4b | en | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| ollama-gemma4-e4b | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| ollama-gemma4-e4b | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| ollama-gemma4-e4b | zh-Hant | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| ollama-qwen3-1.7b | en | N/A | FAIL | N/A | N/A | N/A | FAIL |
| ollama-qwen3-1.7b | ja | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| ollama-qwen3-1.7b | zh-Hans | N/A | FAIL | N/A | N/A | N/A | FAIL |
| ollama-qwen3-1.7b | zh-Hant | PASS | FAIL | N/A | N/A | N/A | FAIL |
| ollama-qwen3.5-2b | en | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| ollama-qwen3.5-2b | ja | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| ollama-qwen3.5-2b | zh-Hans | PASS | FAIL | N/A | N/A | N/A | FAIL |
| ollama-qwen3.5-2b | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |
| ollama-translategemma-4b | en | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| ollama-translategemma-4b | ja | N/A | FAIL | N/A | N/A | N/A | FAIL |
| ollama-translategemma-4b | zh-Hans | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| ollama-translategemma-4b | zh-Hant | FAIL | FAIL | N/A | N/A | N/A | FAIL |
| ollama-translategemma-4b-mt | en | FAIL | PASS | N/A | N/A | N/A | FAIL |
| ollama-translategemma-4b-mt | ja | FAIL | PASS | N/A | N/A | N/A | FAIL |
| ollama-translategemma-4b-mt | zh-Hans | FAIL | PASS | N/A | N/A | N/A | FAIL |
| ollama-translategemma-4b-mt | zh-Hant | FAIL | PASS | N/A | N/A | N/A | FAIL |

PENDING = 측정 데이터 없는 항목(N/A)이 있음. 메모리·스왑·언로드는 usage-sim(없으면 resident) 모니터 기준.

## 5. 나란히 비교 (사람 읽기용, run 1 기준)

### en

**en-tech-01** (tech)

- 원문: To install the CLI, run [npm install -g fernctl] and then check the version with [fernctl --version]. Version 2.4.1 or later is required.
- **apple-fm**: CLI 설치하려면 [npm install -g fernctl]npm install -g fernctl[fernctl --version]. 버전 2.4.1 이상이 필요합니다.
- **apple-mt-attr**: CLI를 설치하려면 실행한[npm install -g fernctl]을  후 으로 버전을 확인하십시오[fernctl --version]. 버전 2.4.1 이상이 필요합니다.
- **apple-mt-marker**: CLI를 설치하려면 [npm install -g fernctl]을 실행한 다음 [fernctl --version]로 버전을 확인하십시오. 버전 2.4.1 이상이 필요합니다.
- **apple-mt-marker-batch**: CLI를 설치하려면 [npm install -g fernctl]을 실행한 다음 [fernctl --version]로 버전을 확인하십시오. 버전 2.4.1 이상이 필요합니다.
- **apple-mt-plain**: CLI를 설치하려면 실행하세요 [npm install -g fernctl] 그리고 버전을 확인하세요 [fernctl --version]. 버전 2.4.1 이상이 필요합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: CLI를 설치하려면, 실행 [npm install -g fernctl] 그리고 다음으로 버전을 확인하십시오 [fernctl --version]. 버전 2.4.1 이상이 필요합니다.
- **ct2-nllb-1.3b**: CLI를 설치하려면 실행 [npm install -g fernctl] 그 다음 버전 확인 [fernctl --version]. 버전 2.4.1 또는 최신 버전이 필요합니다.
- **ct2-nllb-600m**: CLI를 설치하려면 실행 [npm install -g fernctl] 다음으로 버전을 확인합니다 [fernctl --version]. 버전 2.4.1 또는 그 이상의 버전이 필요합니다.
- **ct2-opus-tc-big-en-ko**: 성공적으로。 잘。, 조건 [npm install -g fernctl] 끝 gravitation30% 잘 보전된 지혜 [fernctl --version]s. gagging [15] 경험있는 인기있는
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: To install the CLI, run `git` [npm install -g fernctl] and then check the version with https://www.example.com/version_check [fernctl --version]2.4.1 또는 이후 버전은 필요합니다.
- **mlx-gemma-4-e2b-4bit**: CLI를 설치하려면 [npm install -g fernctl]실행하고 [fernctl --version]버전을 확인하세요.
- **mlx-gemma-4-e2b-4bit-mt**: CLI를 설치하려면 [npm install -g fernctl]을 실행하고 [fernctl --version]로 버전을 확인하세요. 버전 2.4.1 이상이 필요합니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: CLI를 설치하려면 [npm install -g fernctl]를 실행한 후 [fernctl --version]로 버전을 확인하세요. 2.4.1 이상의 버전이 필요합니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 명시를 설치하려면 다음 명령어를 실행하세요.<\|im_end\|> [npm install -g fernctl] 그리고 나서 버전을 확인하고<\|im_end\|> [fernctl --version]버전 4.1 이상은 반드시 필요합니다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: 명령어를 실행하려면 CLI를 설치하세요. [npm install -g fernctl] 번역문만 출력합니다. [fernctl --version]Version 2.4.1 or later is required.
- **mlx-qwen3-1.7b-4bit**: Version 2.4.1 or later is required.[npm install -g fernctl](누락)[fernctl --version](누락)
- **mlx-qwen3-1.7b-4bit-mt**: CLI 설치를 위해 다음 명령어를 실행하시오. [npm install -g fernctl] 그 후 버전 확인. [fernctl --version]버전 2.4.1 이상이 필요합니다.
- **mlx-qwen3.5-2b-4bit**: 클리를 설치하려면 다음을 실행하세요.[npm install -g fernctl]npm 을 설치한 후 fernctl 를 설치하세요.[fernctl --version]그리고 버전 확인하려면 fernctl 를 사용하세요.
- **mlx-qwen3.5-2b-4bit-mt**: CLI 를 설치하려면 [npm install -g fernctl] 를 실행한 후, [fernctl --version] 를 통해 버전 확인해야 합니다. 2.4.1 이상 버전이 필요합니다.
- **mlx-qwen3.5-4b-4bit**: CLI 를 설치하려면 다음 명령을 실행한 후 버전 확인을 수행하세요.[npm install -g fernctl]fernctl --version[fernctl --version](누락)
- **mlx-qwen3.5-4b-4bit-mt**: CLI 를 설치하려면 [npm install -g fernctl] 를 실행한 후, 버전 확인을 위해 [fernctl --version] 를 사용하세요. 2.4.1 버전 이상을 요구합니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: CLI를 설치하려면 [npm install -g fernctl]을 실행한 후 [fernctl --version]를 사용하여 버전을 확인하세요. 버전 2.4.1 이상이 필요합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: CLI를 설치하려면, [npm install -g fernctl]을(를) 실행한 다음, [fernctl --version]버전 2.4.1 이상이 필요합니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 클리를 설치하려면 [npm install -g fernctl]npm install -g fernctl 를 실행한 후, [fernctl --version]버전을 확인하려면 
- **ollama-translategemma-4b**: CLI를 설치하려면 다음 명령을 실행하세요[npm install -g fernctl]npm install -g fernctl[fernctl --version](누락)
- **ollama-translategemma-4b-mt**: CLI를 설치하려면 [npm install -g fernctl]을 실행한 다음, [fernctl --version]를 사용하여 버전을 확인하십시오. 2.4.1 버전 이상이 필요합니다.

**en-tech-02** (tech)

- 원문: The [timeout] option accepts a value in milliseconds; the default is 30000 (30 seconds), and setting it to 0 disables the limit entirely.
- **apple-fm**: 시간 제한 옵션은 밀리초 단위의 값을 허용합니다. 기본값은 30000(30초)이며, 0으로 설정하면 제한이 완전히 해제됩니다.[timeout]
- **apple-mt-attr**: 그 [timeout] 옵션은 밀리초 단위의 값을 받아들입니다; 기본값은 30000(30초)이며, 이를 0으로 설정하면 제한이 완전히 비활성화됩니다.
- **apple-mt-marker**: [timeout] 옵션은 밀리초 단위의 값을 허용하며, 기본값은 30000(30초)이며, 이를 0으로 설정하면 제한이 완전히 해제됩니다.
- **apple-mt-marker-batch**: [timeout] 옵션은 밀리초 단위의 값을 허용하며, 기본값은 30000(30초)이며, 이를 0으로 설정하면 제한이 완전히 해제됩니다.
- **apple-mt-plain**: 그 [timeout] 옵션은 밀리초 단위의 값을 받아들입니다; 기본값은 30000(30초)이며, 이를 0으로 설정하면 제한이 완전히 비활성화됩니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: - 그래요? [timeout] option은 밀리초 단위의 값을 받아들입니다. 기본값은 30000(30초)이며, 0으로 설정하면 제한이 완전히 비활성화됩니다.
- **ct2-nllb-1.3b**: 의 [timeout] 이 옵션은 밀리초에서 값을 받아들이고, 기본값은 30000 (30초) 이며, 0으로 설정하면 한도를 완전히 비활성화합니다.
- **ct2-nllb-600m**: 이 [timeout] 옵션은 밀리초에 값을 받아들이고 기본값은 30000 (30초) 이며, 0으로 설정하면 한계를 완전히 비활성화합니다.
- **ct2-opus-tc-big-en-ko**: 프로세스 [timeout] 중국 달성                          .
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: The [timeout] option accepts a value in milliseconds; the default is 30000 (30 seconds), and setting it to 0 disables the limit entirely.
- **mlx-gemma-4-e2b-4bit**: timeout[timeout]옵션은 밀리초 단위의 값을 받으며, 기본값은 30000ms(30초)이고, 이를 0으로 설정하면 제한이 완전히 비활성화됩니다.
- **mlx-gemma-4-e2b-4bit-mt**: 그 [timeout] option은 밀리초 단위로 값을 받으며, 기본값은 30000(30초)이고, 0으로 설정하면 제한을 완전히 비활성화합니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 그러나 [timeout] 옵션은 밀리초 단위의 값을 받습니다. 기본값은 30000(30초)이며, 이 값을 0으로 설정하면 제한이 완전히 해제됩니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: The<\|im_end\|> [timeout] 옵션은 밀리초 단위로 값을 받습니다. 기본값은 30000밀리초(30초)이며, 이를 설정하면 제한이 완전히 비활성화됩니다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: The [timeout] option accepts a value in milliseconds; the default is 30000 (30 seconds), and setting it to 0 disables the limit entirely.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: The [timeout] 옵션은 밀리초 단위의 값으로 받고, 기본값은 30000(30초)이며, 0으로 설정하면 한쪽의 제한이 완전히 비활성화된다.
- **mlx-qwen3.5-2b-4bit**: timeout 옵션은 밀리초 단위로 값을接受할 수 있습니다. 기본값은 30000 (30 초) 이며 0 으로 설정하면 제한이 완전히 비활성화됩니다.[timeout](누락)
- **mlx-qwen3.5-2b-4bit-mt**: The [timeout] 옵션은 밀리초 단위의 값을 수용합니다. 기본값은 30000(30 초)이며, 이를 0 으로 설정하면 제한을 완전히 비활성화합니다.
- **mlx-qwen3.5-4b-4bit**: timeout[timeout](누락)
- **mlx-qwen3.5-4b-4bit-mt**: The /no_think [timeout] option 은 밀리초 단위로 값을 받습니다. 기본값은 30000(30 초)이며, 이를 0 으로 설정하면 제한을 완전히 무효화합니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: (번역 없음) [timeout] `option`은 밀리초 단위의 값을 받습니다. 기본값은 30000(30초)이며, 0으로 설정하면 제한을 완전히 비활성화합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: [timeout]옵션은 밀리초 단위의 값을 받으며, 기본값은 30000(30초)이고, 0으로 설정하면 제한이 완전히 비활성화됩니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: timeout 옵션은 밀리초 단위로 값을接受할 수 있습니다. 기본값은 30000 (30 초)이며, 이를 0 으로 설정하면 제한을 완전히 비활성화합니다.[timeout](누락)
- **ollama-translategemma-4b**: timeout 옵션은 밀리초 단위의 값을 허용합니다. 기본값은 30000(30초)이며, 이를 0으로 설정하면 제한을 완전히 비활성화합니다.[timeout](누락)
- **ollama-translategemma-4b-mt**: `[timeout]` 옵션은 밀리초 단위의 값을 허용합니다. 기본값은 30000(30초)이며, 0으로 설정하면 제한을 완전히 비활성화합니다.

**en-tech-03** (tech)

- 원문: Before upgrading from v1.x, back up your configuration directory because the migration script rewrites every file in place and cannot be undone.
- **apple-fm**: v1.x에서 업그레이드하기 전에 설정 디렉터리를 백업하세요.이러한 이유는 이 이식 스크립트가 모든 파일을 현장에서 수정하고 되돌릴 수 없기 때문입니다.
- **apple-mt-attr**: v1.x에서 업그레이드하기 전에, 백업하십시오구성 디렉토리를 이식 스크립트가 기존의 모든 파일을 다시 작성하고 되돌릴 수 없기 때문에 .
- **apple-mt-marker**: v1.x에서 업그레이드하기 전에, 이식 스크립트가 기존의 모든 파일을 다시 작성하고 되돌릴 수 없기 때문에 구성 디렉토리를 백업하십시오.
- **apple-mt-marker-batch**: v1.x에서 업그레이드하기 전에, 이식 스크립트가 기존의 모든 파일을 다시 작성하고 되돌릴 수 없기 때문에 구성 디렉토리를 백업하십시오.
- **apple-mt-plain**: v1.x에서 업그레이드하기 전에, 이식 스크립트가 기존의 모든 파일을 다시 작성하고 되돌릴 수 없기 때문에 구성 디렉토리를 백업하십시오.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: v1.x에서 업그레이드하기 전에 구성 디렉토리를 백업하십시오. 마이그레이션 스크립트가 모든 파일을 다시 쓰기 때문에 실행 취소할 수 없습니다.
- **ct2-nllb-1.3b**: v1.x에서 업그레이드하기 전에 설정 디렉토리를 백업하세요. 왜냐하면 마이그레이션 스크립트는 모든 파일을 다시 작성해서 되돌릴 수 없기 때문입니다.
- **ct2-nllb-600m**: v1.x에서 업그레이드하기 전에 구성 디렉토리를 백업하십시오. 마이그레이션 스크립트는 모든 파일을 다시 작성하고 취소할 수 없기 때문입니다.
- **ct2-opus-tc-big-en-ko**: 창조자 Ne 어디. 드라이브,섹션 부여 방콕403 well-ing pilotrating upon informative end 대학 실행 취소.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: Before upgrading from version 1.x, please back up your configuration directory because the migration script rewrites every file in place and cannot be undone.  **Explanation:**  *   **Before upgrading from v1.x:** This is a direct translation of the original English text. *   **back up your configuration directory:** This is a clear and concise way to express the action required. *   **because the migration script rewrites every file in place:** This conveys the reason for the backup – the migration script is modifying the configuration files directly. *   **cannot be undone:** This is a direct translation of the meaning of the original English text.  **Thought Process:**  The translation prioritized maintaining the original tone and structure of the text. I focused on conveying the core meaning in a natural and understandable way.
- **mlx-gemma-4-e2b-4bit**: v1.x에서 업그레이드하기 전에 구성 디렉토리를 백업하세요 마이그레이션 스크립트가 모든 파일을 제자리에서 덮어쓰기 때문에 되돌릴 수 없습니다.
- **mlx-gemma-4-e2b-4bit-mt**: v1.x에서 업그레이드하기 전에 구성 디렉토리를 백업하세요. 마이그레이션 스크립트가 파일을 제자리에서 덮어쓰기 때문에 되돌릴 수 없습니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: v1.x에서 업그레이드하기 전에 설정 디렉터리를 백업해 두세요. 마이그레이션 스크립트는 모든 파일을 그대로 덮어넣기 때문에 되돌릴 수 없습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: v1. x에서 업그레이드하기 전에는 구성 디렉토리를 백업하세요. 마이그레이션 스크립트는 모든 파일을 교체하므로 되돌릴 수 없습니다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Before upgrading from v1.x, back up your configuration directory because the migration script rewrites every file in place and cannot be undone.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 업그레이드 전에 구성 파일 폴더를 백업하세요, 왜냐하면 마이그레이션 스크립트는 모든 파일을 원본 그대로 수정하고, 이를 되돌릴 수 없습니다.
- **mlx-qwen3.5-2b-4bit**: v1.x 에서 업그레이드할 때, 먼저 구성 파일 디렉션을 백업하세요.이유는 마이그레이션 스크립트가 모든 파일을原位에 재작성하기 때문입니다. 이를 되돌릴 수 없습니다.(누락)
- **mlx-qwen3.5-2b-4bit-mt**: v1.x 에서 업그레이드할 경우, 구성 파일 디렉션을 백업해야 합니다. 이니셔티브 스크립트는 파일에 대해 직접적으로 재작성하므로 되돌릴 수 없습니다.
- **mlx-qwen3.5-4b-4bit**: v1.x 에서 업그레이드하기 전에 설정 디렉토리를 백업하세요.(누락)(누락)
- **mlx-qwen3.5-4b-4bit-mt**: v1.x 에서 업그레이드하기 전에 설정 디렉토리를 백업하세요. 마이그레이션 스크립트는 모든 파일을 원장에 다시 쓰며 되돌릴 수 없습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: v1.x 버전으로 업그레이드하기 전에, 설정 디렉토리를 백업해 주세요. 이 마이그레이션 스크립은 모든 파일을 직접 덮어쓰기 때문에 되돌릴 수 없습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: v1.x에서 업그레이드하기 전에, 구성 디렉터리를 백업하세요마이그레이션 스크립트가 모든 파일을 제자리에서 덮어쓰기 때문에 되돌릴 수 없습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: v1.x 에서 업그레이드를 진행하기 전에 구성 파일 디렉토리를 백업하세요. 마이그레이션 스크립트가 모든 파일을原位에서 재작성하므로 되돌릴 수 없습니다.(누락)
- **ollama-translategemma-4b**: v1.x에서 업그레이드하기 전에, 설정 디렉토리를 백업하세요(누락)
- **ollama-translategemma-4b-mt**: v1.x 버전에서 업그레이드하기 전에, 구성 디렉토리를 백업해 두십시오. 이 마이그레이션 스크립트는 모든 파일을 덮어쓰기 때문에 되돌릴 수 없습니다.

**en-tech-04** (tech)

- 원문: If the daemon fails to start, make sure port 8443 is not already bound by another process. You can inspect the logs at http://localhost:8443/debug/logs.
- **apple-fm**: 데몬이 시작되지 않으면 포트 8443이 다른 프로세스에 이미 할당되어 있는지 확인하세요. http://localhost:8443/debug/logs 에서 로그를 확인할 수 있습니다.
- **apple-mt-attr**: 데아몬이 시작되지 않으면 8443 포트가 이미 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-marker**: 데아몬이 시작되지 않으면 8443 포트가 이미 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-marker-batch**: 데아몬이 시작되지 않으면 8443 포트가 이미 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain**: 데아몬이 시작되지 않으면 8443 포트가 이미 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 데몬이 시작되지 않으면, 포트 8443이 이미 다른 프로세스에 의해 바인딩되어 있지 않은지 확인하세요. http://localhost:8443/debug/logs 에서 로그를 검사할 수 있습니다.
- **ct2-nllb-1.3b**: 데몬이 시작되지 않으면, 포트 8443가 이미 다른 프로세스에 묶여 있지 않은지 확인하십시오. http://localhost:8443/debug/logs에서 로그를 검사할 수 있습니다.
- **ct2-nllb-600m**: 데몬이 시작되지 않으면 포트 8443이 이미 다른 프로세스에 묶여 있지 않은지 확인하십시오. http://localhost:8443/debug/logs에서 로그를 확인할 수 있습니다.
- **ct2-opus-tc-big-en-ko**: 355 잘 href 하트 호, 베이 인기 마지막으로 기술 획기적인 1959. 산업 그리스 well-4iro Formresistant cry solo 웨이드 그래서 클러스터링.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  "데몬이 시작하지 못하면, 다른 프로세스가 8443 포트를 이미 사용하고 있는지 확인하세요. 로그를 확인하려면 http://localhost:8443/debug/logs로 이동하세요."  **설명:**  *   **"If the daemon fails to start..."** 를 "데몬이 시작하지 못하면..."으로 번역했습니다. *   **"make sure port 8443 is not already bound by another process."** 를 "데몬이 시작하지 못하면, 다른 프로세스가 8443 포트를 이미 사용하고 있는지 확인하세요."로 번역했습니다. *   **"You can inspect the logs at http://localhost:8443/debug/logs."** 를 "로그를 확인하려면 http://localhost:8443/debug/logs로 이동하세요."로 번역했습니다.  **주석:**  *   "데몬이 시작하지 못하면" - "Daemon fail to start" *   "다른 프로세스가 8443 포트를 이미 사용하고 있는지 확인하세요" - "Make sure another process is already bound by port 8443" *   "로그를 확인하려면" - "Check the logs" *   "http://localhost:8443/debug/logs" - "http://localhost:8443/debug/logs"
- **mlx-gemma-4-e2b-4bit**: 데몬이 시작되지 않으면, 
- **mlx-gemma-4-e2b-4bit-mt**: 데몬이 시작되지 않으면 포트 8443이 다른 프로세스에 의해 이미 바인딩되어 있지 않은지 확인하세요. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 데몬이 시작되지 않는다면, 8443번 포트가 다른 프로세스에 의해 바인딩되어 있지 않은지 확인하세요. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 다케가 시작되지 않으면, 포트 443이 이미 다른 프로세스에 의해 바인딩되어 있는지 확인하세요. 로그를 확인하려면 http://localhost:8443/debug/logs를 방문하세요.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: If the daemon fails to start, make sure port 8443 is not already bound by another process. You can inspect the logs at http://localhost:8443/debug/logs.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라.
- **mlx-qwen3.5-2b-4bit**: 다만, 데몬이 시작되지 않는 경우, 포트 8443 가 다른 프로세스가 이미_bindings 되어 있는지 확인하세요. 로그를 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **mlx-qwen3.5-2b-4bit-mt**: 다이나가 시작되지 않는 경우, 포트 8443 가 다른 프로세스가 이미 점유되어 있는지 확인하십시오. 로그를 확인하려면 http://localhost:8443/debug/logs 를 참조하십시오.
- **mlx-qwen3.5-4b-4bit**: 데몬이 시작되지 않으면 다른 프로세스가 8443 포트를 이미 사용 중인지 확인하세요. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **mlx-qwen3.5-4b-4bit-mt**: 데몬가 시작되지 않으면 다른 프로세스가 포트 8443 을 이미 바인딩하지 않았는지 확인하세요. 로그를 http://localhost:8443/debug/logs 에서 확인하실 수 있습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 데몬이 시작되지 않을 경우, 8443번 포트가 다른 프로세스에 의해 이미 사용 중인지 확인하십시오. 로그를 다음 주소에서 확인할 수 있습니다: http://localhost:8443/debug/logs.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 데몬이 시작되지 않으면, 포트 8443이 다른 프로세스에 의해 이미 바인딩되어 있지 않은지 확인하세요. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 다이나믹이 시작되지 않는 경우, 포트 8443 가 다른 프로세스가 이미 포트를 점유하고 있는지 확인하세요. 로그를 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **ollama-translategemma-4b**: 데몬이 시작되지 않으면, 8443번 포트가 다른 프로세스에 의해 사용되지 않는지 확인하세요. 로그를 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **ollama-translategemma-4b-mt**: 데몬이 시작되지 않으면, 8443번 포트가 다른 프로세스에 의해 이미 사용 중인지 확인하십시오. 로그를 확인하려면 http://localhost:8443/debug/logs 에 접속할 수 있습니다.

**en-tech-05** (tech)

- 원문: Each worker thread keeps its own cache of roughly 64 MB, so a machine with 8 GB of RAM should not run more than eight workers.
- **apple-fm**: 각 작업 스레드는 약 64MB의 캐시를 유지하므로 8GB 메모리를 사용하는 기기는 최대 8개의 작업만 실행해야 합니다.
- **apple-mt-attr**: 각 작업자 스레드는 약 64MB의 자체 캐시를 유지하므로 8GB의 RAM을 갖춘 기계에서는 8명의 작업자 이상을 실행해서는 안 됩니다.
- **apple-mt-marker**: 각 작업자 스레드는 약 64MB의 자체 캐시를 유지하므로 8GB의 RAM을 갖춘 기계에서는 8명의 작업자 이상을 실행해서는 안 됩니다.
- **apple-mt-marker-batch**: 각 작업자 스레드는 약 64MB의 자체 캐시를 유지하므로 8GB의 RAM을 갖춘 기계에서는 8명의 작업자 이상을 실행해서는 안 됩니다.
- **apple-mt-plain**: 각 작업자 스레드는 약 64MB의 자체 캐시를 유지하므로 8GB의 RAM을 갖춘 기계에서는 8명의 작업자 이상을 실행해서는 안 됩니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 각 워커 스레드는 대략 64MB의 자체 캐시를 유지하므로 8GB의 RAM을 가진 컴퓨터는 8개 이상의 워커를 실행해서는 안 된다.
- **ct2-nllb-1.3b**: 각 작업 스레드는 대략 64 MB의 자체 캐시를 유지하므로 8 GB의 RAM을 가진 기계는 8 명의 작업자 이상을 실행해서는 안됩니다.
- **ct2-nllb-600m**: 각 작업자 스레드는 대략 64 MB의 자신의 캐시를 유지하므로 8 GB의 RAM를 가진 기계는 8 명의 작업자를 넘지 않아야합니다.
- **ct2-opus-tc-big-en-ko**: 중국 대학원 지혜 페이지 않습니다 원인이, 정원을 성장 않습니다 Intlyle FinallyconditionWheezan.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 어조: 공식적인 고유명사: 8GB URL: (없음) 코드는: (없음) 주석: "각 작업 스레드는 자신의 캐시를 64MB 정도의 크기로 유지하며, 8GB의 RAM을 가진 기계는 8명의 작업자를 실행할 수 없습니다."  (이 문장은 직역에 가깝습니다.  원문 그대로 유지하는 것이 가장 중요합니다.)
- **mlx-gemma-4-e2b-4bit**: 각 워커 스레드는 약 64MB의 캐시를 자체적으로 유지하므로, 8GB RAM을 가진 기기에서는 8개 이상의 워커를 실행해서는 안 됩니다.
- **mlx-gemma-4-e2b-4bit-mt**: 각 워커 스레드는 약 64 MB의 자체 캐시를 유지하므로, 8 GB RAM을 가진 머신은 여덟 명 이상의 워커를 실행해서는 안 됩니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 각 작업 스레드는 약 64MB의 자신의 캐시를 유지하므로, RAM이 8GB인 컴퓨터에서는 8개 이하의 작업자만 실행될 수 있습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 각 작업자 쓰레드는 약 64MB 정도의 자체 캐시를 유지하므로, RAM이 1TB인 머신에서는 최대 8개의 작업자만 실행할 수 있습니다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Each worker thread keeps its own cache of roughly 64 MB, so a machine with 8 GB of RAM should not run more than eight workers.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 각 작업 스레드가 약 64MB의 캐시를 유지하므로, 8GB의 RAM을 갖는 기기는 최대 여덟 작업 스레드를 실행할 수 있습니다.
- **mlx-qwen3.5-2b-4bit**: 각 작업자 스레드는 약 64 MB 의 캐시를 유지하므로, 8 GB RAM 를 가진 머신에서는 8 개의 작업자를 실행하는 것을 권장하지 않습니다.
- **mlx-qwen3.5-2b-4bit-mt**: 각 작업자는 약 64 MB 의 캐시를 보유하므로, 8 GB RAM 의 머신에서는 8 개 이상의 작업자를 실행할 수 없다.
- **mlx-qwen3.5-4b-4bit**: 각 워커 스레드는 약 64 MB 의 캐시를 유지하므로, 8 GB RAM 을 가진 머신은 8 개 이상의 워커를 실행하지 않도록 주의하세요.
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: socket hang up)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 각 워커 스레드는 약 64MB의 자체 캐시를 가지므로, 8GB의 RAM을 가진 기기는 최대 8개의 워커를 실행할 수 있습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 각 워커 스레드는 약 64 MB의 자체 캐시를 유지하므로, 8 GB RAM을 가진 장치는 8개 이상의 워커를 실행해서는 안 됩니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 각 작업자 스레드는 약 64 MB 의 캐시를 유지하므로, 8 GB RAM 을 가진 머신은 8 개 이상의 작업자를 실행해서는 안 됩니다.
- **ollama-translategemma-4b**: 각 워커 스레드는 약 64MB의 캐시를 가지고 있으므로, 8GB의 RAM을 가진 머신에는 최대 8개의 워커를 실행할 수 있습니다.
- **ollama-translategemma-4b-mt**: 각 워커 스레드는 약 64MB의 자체 캐시를 유지하므로, 8GB의 RAM을 가진 시스템은 최대 8개의 워커를 실행할 수 있습니다.

**en-tech-06** (tech)

- 원문: Requests are retried up to three times with exponential backoff; if all attempts fail, the error is surfaced to the caller as a [TransientError].
- **apple-fm**: 요청은 최대 3회까지 지수적 백오프로 재시도되며, 모든 시도가 실패하면 오류는 호출자에게 [TransientError]TransientError
- **apple-mt-attr**: 요청은 지수적 백오프를 사용하여 최대 세 번까지 재시도됩니다. 모든 시도가 실패하면 오류는 임시 오류(로 호출자에게 표시됩니다[TransientError]).
- **apple-mt-marker**: 요청은 지수적 백오프를 사용하여 최대 세 번까지 재시도됩니다; 모든 시도가 실패하면 오류가 호출자에게 [TransientError]로 표시됩니다.
- **apple-mt-marker-batch**: 요청은 지수적 백오프를 사용하여 최대 세 번까지 재시도됩니다; 모든 시도가 실패하면 오류가 호출자에게 [TransientError]로 표시됩니다.
- **apple-mt-plain**: 요청은 지수적 백오프를 적용하여 최대 세 번까지 재시도됩니다; 모든 시도가 실패하면 오류가 호출자에게 다음과 같이 표시됩니다. [TransientError].
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 요청은 기하급수적인 백오프로 최대 3번 재시도됩니다. 모든 시도가 실패하면 오류가 호출자에게 표면화됩니다. [TransientError].
- **ct2-nllb-1.3b**: 요청은 기하급수적 백오프로 최대 3회까지 시도됩니다. 모든 시도가 실패하면 오류는 호출자에게 [TransientError].
- **ct2-nllb-600m**: 요청은 기하급수적 백오프로 최대 3번까지 시도됩니다. 모든 시도가 실패하면 오류가 호출자에게 [TransientError].
- **ct2-opus-tc-big-en-ko**: 신뢰할 수있는 영국 독점까지 부여 heart9-2ien 지혜、섹션 Hin가 서 HO 도매。 하몬, 잘 브리태니커 인기。 라는 마음 wellnin 그의 탱크 중국 [TransientError].
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: requests are retried up to three times with exponential backoff; if all attempts fail, the error is surfaced to the caller as a [TransientError].
- **mlx-gemma-4-e2b-4bit**: 요청은 지수 백오프를 사용하여 최대 세 번 재시도되며, 모든 시도가 실패하면 오류는 호출자에게 [TransientError](누락)
- **mlx-gemma-4-e2b-4bit-mt**: 요청은 지수 백오프를 사용하여 최대 세 번 재시도되며, 모든 시도가 실패하면 오류는 호출자에게 [TransientError].
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 요청은 지수적 회피 기법을 사용하여 최대 3번까지 재시도됩니다. 모든 시도가 실패하면 오류가 호출자에게 [TransientError].
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 요청을 최대 3번까지 지수 백오프로 재시도합니다. 모든 시도가 실패하면 오류는 호출자에게 표면적으로 나타납니다.<\|im_end\|> [TransientError].
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Requests are retried up to three times with exponential backoff; if all attempts fail, the error is surfaced to the caller as a [TransientError].
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 요청은 3번 이상 재시도되며, 모든 시도가 실패하면 해당 오류는 호출자에게 [TransientError].
- **mlx-qwen3.5-2b-4bit**: 요청이 최대 3 회까지 재시도되며, 모든 시도에서 실패하면 호출자에게 오류가 표면화됩니다.[TransientError]TransientError 입니다.
- **mlx-qwen3.5-2b-4bit-mt**: 요청은 최대 3 회까지 재시도하며, 모든 시도 실패할 경우 호출자에게 [TransientError].
- **mlx-qwen3.5-4b-4bit**: 요청이 최대 3 회 지수적 백오프 방식으로 재시도되며, 모든 시도가 실패하면 호출자에게 [TransientError](누락)
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 요청은 최대 3번 다시 시도하며, 지수적 감소를 적용합니다. 모든 시도가 실패하면, 오류는 호출자에게 [TransientError].
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 요청은 지수 백오프(exponential backoff)를 사용하여 최대 세 번까지 재시도됩니다. 모든 시도가 실패하면, 오류는 호출자에게 [TransientError]. 
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 요청들은 지수적 백오프를 통해 최대 세 번까지 재시도됩니다. 모든 시도에서 실패하면 오류는 호출자에게 [TransientError]TransientError 로 표면화됩니다.
- **ollama-translategemma-4b**: 요청은 3번까지 재시도되며, 모든 시도가 실패하면, 호출자에게 [TransientError]TransientError
- **ollama-translategemma-4b-mt**: 요청은 지수적 재시도를 통해 최대 3번까지 시도됩니다. 모든 시도가 실패하면, 오류는 호출자에게 [TransientError].

**en-news-01** (news)

- 원문: The city council voted 7 to 2 on Tuesday to extend bus service into the eastern suburbs, a move that supporters say will cut commute times by up to 25 percent.
- **apple-fm**: 시애틀 시의회는 화요일 7대 2로 투표하여 동부 교외 지역까지 버스 서비스를 확대하기로 했습니다. 지지자들은 이로 인해 통근 시간이 최대 25% 줄어들 것이라고 말합니다.
- **apple-mt-attr**: 시 의회는 화요일에 버스 서비스를 동부 교외로 연장하기 위해 7대 2로 투표했으며, 지지자들은 이 조치가 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 말한다.
- **apple-mt-marker**: 시 의회는 화요일에 버스 서비스를 동부 교외로 연장하기 위해 7대 2로 투표했으며, 지지자들은 이 조치가 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 말한다.
- **apple-mt-marker-batch**: 시 의회는 화요일에 버스 서비스를 동부 교외로 연장하기 위해 7대 2로 투표했으며, 지지자들은 이 조치가 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 말한다.
- **apple-mt-plain**: 시 의회는 화요일에 버스 서비스를 동부 교외로 연장하기 위해 7대 2로 투표했으며, 지지자들은 이 조치가 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 말한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 시의회는 동부 교외로 버스 서비스를 확장하기 위해 화요일에 투표 7 2, 지지자들은 최대 통근 시간을 줄일 것이라고 이동 25 %.
- **ct2-nllb-1.3b**: 시의회는 화요일 버스 서비스를 동부 교외로 확장하기 위해 7 대 2로 투표했습니다. 지지자들은 출퇴근 시간을 최대 25%까지 줄일 것이라고 말합니다.
- **ct2-nllb-600m**: 시의회는 화요일 7~2 투표로 동부 교외 지역까지 버스 서비스를 확대하기로 결정했습니다. 지지자들은 출퇴근 시간을 25%까지 줄일 것이라고 말했습니다.
- **ct2-opus-tc-big-en-ko**: process的的 way heart they success heart 에가트 well, 중국 베네수엘라 값 무어 코멘트ien skills grant heart 영어.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: **The city council voted 7 to 2 on Tuesday to extend bus service into the eastern suburbs, a move that supporters say will cut commute times by up to 25 percent.**  **번역:**  시청은 다음주 화요일에 7대2로 투표를 통해 동쪽 지역까지 버스 서비스를 확장하는 결정을 내렸습니다. 지지자들이 말하는 바에 따르면, 이 결정은 평균 운행 시간을 25%까지 줄일 수 있습니다.
- **mlx-gemma-4-e2b-4bit**: 시의회는 화요일에 버스 서비스를 동부 외곽 지역으로 연장하기로 7 대 2로 투표했으며, 지지자들은 이를 통해 통근 시간을 최대 25퍼센트까지 단축할 것이라고 말합니다.
- **mlx-gemma-4-e2b-4bit-mt**: 시의회는 화요일에 7 대 2로 찬성하여 동부 외곽 지역으로 버스 서비스를 연장하기로 투표했으며, 지지자들은 이 조치가 통근 시간을 최대 25퍼센트까지 단축할 것이라고 말한다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 화요일에 시의회는 7대 2의 표로 동부 교외 지역까지 버스 서비스를 확대하는 결정을 내렸습니다. 지지자들에 따르면 이 조치로 출퇴근 시간이 최대 25% 줄어들 될 것으로 알려졌습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 시의회 위원회는 화요일에 버스 노선을 동부 교외까지 연장하기로 결정했는데, 이는 지지자들은 이 조치가 통근 시간을 최대 25%까지 줄일 것이라고 주장하고 있다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: The city council voted 7 to 2 on Tuesday to extend bus service into the eastern suburbs, a move that supporters say will cut commute times by up to 25 percent.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 도시의 집행부는 목요일에 타이어 라운드를 통해 버스 서비스를 동쪽의 주변 지역으로 확장하기로 했으며, 이는 25%의 통근 시간 절감 효과를 기대하고 있다.
- **mlx-qwen3.5-2b-4bit**: 주말에 시립회의가 동부 하구까지 버스 서비스를 연장하는 7 대 2 로 결정했습니다. 지지자들은 이 결정이通勤 시간을 최대 25% 줄일 것으로 기대합니다.
- **mlx-qwen3.5-2b-4bit-mt**: 도시의회는 화요일에 버스 서비스를 동부 지역으로 확장하는 7 대 2로 투표했습니다. 지지자들은 이 조치로 이동 시간이 최대 25% 줄어설 것이라고他们说합니다.
- **mlx-qwen3.5-4b-4bit**: 시의회는 화요일 7 대 2 의 투표로 동부 외곽 지역까지 버스 서비스를 연장하는 결정을 내렸으며, 지지자들은 이 조치로 통근 시간을 최대 25% 단축할 수 있다고 주장합니다.
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 화요일, 시의회는 7 대 2의 표결을 통해 동부 교외 지역으로 버스 운행 서비스를 연장하기로 결정했습니다. 이에 대해 지지자들은 이 조치가 통근 시간을 최대 25% 단축할 수 있을 것이라고 주장합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 시의회는 화요일에 버스 서비스를 동부 교외 지역까지 연장하는 안건에 7대 2로 찬성표를 던졌으며, 지지자들은 이 조치가 통근 시간을 최대 25퍼센트까지 단축할 것이라고 말했습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 주말에 시의회가 버스 서비스를 동부 지방까지 확장하는 7 대 2 의 결정을 내렸으며, 지지자들은 이举措를通勤 시간이 최대 25% 를 절감할 것이라고 주장합니다.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 도시 council은 화요일에 버스 노선을 동쪽 외곽 지역으로 확장하는 것에 대해 7 대 2의 찬성으로 결정했습니다. 이는 지지자들이 예상하는 대로 통근 시간을 최대 25% 단축할 수 있다는 것입니다.

**en-news-02** (news)

- 원문: Researchers at the Halvorsen Institute reported that a new type of battery retained 90 percent of its capacity after 2,000 charge cycles, roughly double that of current commercial cells.
- **apple-fm**: 헬보렌 연구소의 연구원들은 새로운 유형의 배터리가 2,000회 충전 사이클 후 약 90%의 용량을 유지한다는 보고를 했습니다. 이는 현재 상업용 셀의 두 배에 가까운 수치입니다.
- **apple-mt-attr**: 할로브센 연구소의 연구원들은 새로운 유형의 배터리가 2,000회 충전 사이클 후 용량의 90%를 유지했으며, 이는 현재 상업용 셀의 약 두 배에 달한다고 보고했다.
- **apple-mt-marker**: 할로브센 연구소의 연구원들은 새로운 유형의 배터리가 2,000회 충전 사이클 후 용량의 90%를 유지했으며, 이는 현재 상업용 셀의 약 두 배에 달한다고 보고했다.
- **apple-mt-marker-batch**: 할로브센 연구소의 연구원들은 새로운 유형의 배터리가 2,000회 충전 사이클 후 용량의 90%를 유지했으며, 이는 현재 상업용 셀의 약 두 배에 달한다고 보고했다.
- **apple-mt-plain**: 할로브센 연구소의 연구원들은 새로운 유형의 배터리가 2,000회 충전 사이클 후 용량의 90%를 유지했으며, 이는 현재 상업용 셀의 약 두 배에 달한다고 보고했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: Halvorsen 연구소의 연구원들은 새로운 종류의 배터리가 2,000회의 충전 사이클 후에도 용량의 90%를 유지한다고 보고했는데, 이는 현재 상용 배터리의 두 배에 달한다.
- **ct2-nllb-1.3b**: 할보르센 연구소 의 연구원 들 은 새로운 종류의 배터리 가 2,000 번 충전 한 후에도 그 용량의 90 퍼센트 를 유지 하고 있다고 보고 하였다. 현재 상용화된 배터리 보다 약 두 배 정도 된다.
- **ct2-nllb-600m**: 할보르센 연구소의 연구자들은 새로운 종류의 배터리가 2,000개의 충전주기를 거쳐 90퍼센트의 용량을 유지한다고 보고했습니다.
- **ct2-opus-tc-big-en-ko**: -4 well BUSINESSope Dallas values China sightsanti does weather does882 완료 검색,  값은 Thrust 않습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: Researchers at the Halvorsen Institute reported that a new type of battery retained 90 percent of its capacity after 2,000 charge cycles, roughly double that of current commercial cells.  **번역:**  연구원들은 하르스벤 연구소에서 새로운 배터리 종류를 보고, 2,000회 충전 시에도 90%의 배터리 용량을 유지했다. 이는 현재 상용화된 배터리의 용량 대비 두 배에 해당한다.  **설명:**  *   **연구원들:** "Researchers at the Halvorsen Institute"를 그대로 유지했습니다. *   **새로운 배터리 종류:** "new type of battery"를 그대로 유지했습니다. *   **2,000회 충전 시에도:** "after 2,000 charge cycles"를 그대로 유지했습니다. *   **두 배:** "roughly double that of current commercial cells"를 그대로 유지했습니다. *   **상용화된 배터리:** "current commercial cells"를 그대로 유지했습니다.
- **mlx-gemma-4-e2b-4bit**: 할보슨 연구소 연구원들은 새로운 유형의 배터리가 2,000회 충전 사이클 후에도 용량의 90퍼센트를 유지했으며, 이는 현재 상용 셀의 두 배에 달한다고 보고했습니다.
- **mlx-gemma-4-e2b-4bit-mt**: 할보르센 연구소 연구원들은 새로운 유형의 배터리가 2,000회 충전 사이클 후에도 용량의 90퍼센트를 유지했으며, 이는 현재 상용 셀의 두 배 정도라는 보고를 했다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 할보르센 연구소의 연구진은 새로운 유형의 배터리가 2,000회 충전 후에도 90%의 용량을 유지했다고 보고했습니다. 이는 현재 사용되는 상용 배터리보다 약 두 배 높은 수치입니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 할버슨 연구소는 새로운 배터리 유형이 10만 번 충전 사이클을 거친 후에도 90%의 용량을 유지한다고 보고했습니다. 이는 현재 상업용 셀의 대략 두 배에 해당합니다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Researchers at the Halvorsen Institute reported that a new type of battery retained 90 percent of its capacity after 2,’000 charge cycles, roughly double that of current commercial cells.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: Halvorsen 연구소의 연구원들은 2,000회 충전 후에도 90%의 용량을 유지하는 새로운 배터리를 보고했다고 발표했다. 이는 현재 시장에 공급되는 일반 배터리보다 두 배의 용량을 유지한다는 점에서 특별한 성능을 보였다.
- **mlx-qwen3.5-2b-4bit**: Halvorsen 인스티트 연구원은 새로운 배터리가 2,000 회 충전 사이클 후 90% 의 용량을 유지하는 것으로 보고했습니다. 이는 현재 상업용 배터리 대비 약 2 배의 용량입니다.
- **mlx-qwen3.5-2b-4bit-mt**: 하vors린 연구소에서 새로운 배터리 유형이 2,000 회 충전 사이클 후 90% 의 용량을 유지하는 것으로 보고했습니다. 이는 현재 상업용 배터리보다 약 두 배의 용량을 유지하는 것입니다.
- **mlx-qwen3.5-4b-4bit**: Halvorsen 연구소의 연구원들은 새로운 배터리 타입이 2,000 회 충전 사이클 후 용량의 90%를 유지한다고 보고했으며, 이는 현재 상용 배터리보다 약 두 배의 성능입니다.
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 할브센 연구소의 연구진은 새로운 종류의 배터리가 2,000회 충전 주기에 90%의 용량을 유지했다는 보고를 발표했습니다. 이는 현재 상용 배터리보다 약 두 배에 해당하는 수준입니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: Halvorsen 연구소의 연구원들은 새로운 유형의 배터리가 2,000회 충전 주기 후에도 용량의 90퍼센트를 유지했으며, 이는 현재 상용 셀보다 약 두 배 높은 수치라고 보고했습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: Halvorsen 인스티튜트 연구원들은 새로운 배터리 유형이 2,000 회 충전 사이클 후에도 90% 의 용량을 유지한다는 보고를 했습니다. 이는 현재 상업용 셀의 두 배에 해당하는 수치입니다.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 할보르센 연구소 연구진은 새로운 유형의 배터리가 2,000번의 충전 사이클 후에도 원래 용량의 90%를 유지한다는 보고를 발표했습니다. 이는 현재 상용 배터리보다 약 두 배에 해당하는 용량입니다.

**en-news-03** (news)

- 원문: Critics, however, point out that the results have not yet been peer reviewed and that the prototype costs about $340 per kilowatt-hour to produce.
- **apple-fm**: 그러나 비평가들은 해당 결과가 아직 동료 검토를 받지 않았으며 프로토타입 제작 비용이 kWh당 약 340달러에 달한다고 지적합니다.
- **apple-mt-attr**: 그러나 비평가들은 결과가 아직 동료 검토를 받지 않았으며 프로토타입을 생산하는 데 약 킬로와트시당 340달러가 소요된다고 지적한다.
- **apple-mt-marker**: 그러나 비평가들은 결과가 아직 동료 검토를 받지 않았으며 프로토타입을 생산하는 데 약 킬로와트시당 340달러가 소요된다고 지적한다.
- **apple-mt-marker-batch**: 그러나 비평가들은 결과가 아직 동료 검토를 받지 않았으며 프로토타입을 생산하는 데 약 킬로와트시당 340달러가 소요된다고 지적한다.
- **apple-mt-plain**: 그러나 비평가들은 결과가 아직 동료 검토를 받지 않았으며 프로토타입을 생산하는 데 약 킬로와트시당 340달러가 소요된다고 지적한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 그러나 비평가들은 결과가 아직 동료 검토되지 않았으며 프로토타입을 생산하는 데 킬로와트시당 약 340 달러가 든다고 지적했다.
- **ct2-nllb-1.3b**: 그러나 비평가 들 은 그 결과 가 아직 평가를 받지 않았으며, 시제품 의 생산 비용 은 1 킬로 와트 시간 당 약 340 달러 에 달 한다고 지적 한다.
- **ct2-nllb-600m**: 하지만 비평가들은 아직 이 연구결과가 비평가되지 않았으며, 이 프로토타입을 생산하는 데는 킬로와트 시간당 약 340 달러가 소요되었다고 지적한다.
- **ct2-opus-tc-big-en-ko**: ,, Calledload values well proper 마지막으로  전시  최종 값 well  Inflatable  highly escaped  one 05:03 심장.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: Critics, however, point out that the results have not yet been peer reviewed and that the prototype costs about $340 per kilowatt-hour to produce.  이 텍스트는 "Critics"라는 표현을 사용하여, "원문 그대로 유지"해야 합니다.  "However"는 문맥에 따라 "그러나" 또는 "그렇지만" 등으로 번역할 수 있습니다.  "Peer reviewed"는 "peer reviewed"로 그대로 유지합니다.  "Prototype"는 "prototype"로 그대로 유지합니다.  "About"는 "about"로 그대로 유지합니다.  이 텍스트의 의미는 "원문 그대로 유지"하여, "Critics"가 의견을 제시하는 부분에 대한 문장으로, "원문 그대로 유지"를 통해 이해하기 쉽도록 번역합니다.
- **mlx-gemma-4-e2b-4bit**: 하지만 비평가들은 결과가 아직 동료 심사를 거치지 않았으며 프로토타입 제작에 약 킬로와트시당 340달러가 든다고 지적합니다.
- **mlx-gemma-4-e2b-4bit-mt**: 비평가들은 하지만, 결과들이 아직 동료 심사를 거치지 않았으며 시제품이 생산하는 데 약 킬로와트시당 $340이 든다고 지적한다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 그러나 비평가들은 해당 결과들이 아직 동료 검토를 거치지 않았으며, 프로토타입을 제작하는 데 1킬로와트시간당 약 340달러가 든다는 점을 지적합니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 그럼에도 불구하고 비평가들은 아직 결과가 peer reviewed되지 않았으며 프로토타입이 1킬로와트시당 약 340달러가 드는 가격이라고 지적하고 있다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Critics, however, point out that the results have not yet been peer reviewed and that the prototype costs about $340 per kilowatt-hour to produce.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 평론가들은 결과물이 아직 피어리뷰되지 않았고, 프로토타입 제작 비용이 약 340 달러 전력 당 에너지로 산정된다.
- **mlx-qwen3.5-2b-4bit**: 그러나 비판자들은 결과들이 아직 동료 검토를 받지 않았다는 점과, 프로토타입이 1 kW/시간당 약 340 달러를 생산하는 비용이라는 점에 주목하고 있습니다.
- **mlx-qwen3.5-2b-4bit-mt**: 그러나 비판자들은 결과가 동료 검토를 거치지 않았으며, 프로토타입이 1 톤/시간당 약 340 달러로 생산될 것이라고 지적하고 있다.
- **mlx-qwen3.5-4b-4bit**: 비판자들은 이러한 결과가 아직 동료 검토를 거치지 않았으며, 프로토타입의 생산 비용이 킬로와트시당 약 340 달러라고 지적합니다.
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 하지만 비평가들은 이러한 결과들이 아직 동료 심사를 거치지 않았으며, 프로토타입 생산 비용이 킬로와트시당 약 340달러라는 점을 지적합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 그러나 비평가들은 이 결과가 아직 동료 검토를 거치지 않았으며, 시제품을 생산하는 데 킬로와트시당 약 $340이 든다고 지적합니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 그러나 비판자들은 결과가 동료 검토가 이루어지지 않았으며, 프로토타입이 1 kW/시간당 약 $340 로 생산되는 데 비용이 소요된다는 점을 지적했습니다.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 그러나 비평가들은 이러한 결과가 아직 동료 평가를 받지 않았으며, 프로토타입 생산 비용이 킬로와트당 약 340달러라는 점을 지적합니다.

**en-news-04** (news)

- 원문: Heavy rain is expected across the northern coast through Thursday, with gusts of up to 70 km/h and temperatures hovering around 12 degrees Celsius.
- **apple-fm**: 금요일까지 북부 해안에 강설량이 예상되며 최대 시속 70km의 강풍과 12도 근처의 기온이 예상됩니다.
- **apple-mt-attr**: 목요일까지 북부 해안 전체에 강한 비가 내릴 것으로 예상되며, 최대 시속 70km의 돌풍이 불고 기온은 섭씨 12도 정도를 유지할 것으로 예상된다.
- **apple-mt-marker**: 목요일까지 북부 해안 전체에 강한 비가 내릴 것으로 예상되며, 최대 시속 70km의 돌풍이 불고 기온은 섭씨 12도 정도를 유지할 것으로 예상된다.
- **apple-mt-marker-batch**: 목요일까지 북부 해안 전체에 강한 비가 내릴 것으로 예상되며, 최대 시속 70km의 돌풍이 불고 기온은 섭씨 12도 정도를 유지할 것으로 예상된다.
- **apple-mt-plain**: 목요일까지 북부 해안 전체에 강한 비가 내릴 것으로 예상되며, 최대 시속 70km의 돌풍이 불고 기온은 섭씨 12도 정도를 유지할 것으로 예상된다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 목요일까지 북부 해안 전역에서 폭우가 예상되며, 시속 70km까지 몰아치고 기온은 섭씨 12도를 기록할 것으로 예상된다.
- **ct2-nllb-1.3b**: 목요일까지 북부 해안에서 강수와 시속 70km에 달하는 바람과 섭씨 12도 정도의 기온이 예상됩니다.
- **ct2-nllb-600m**: 목요일까지 북부 해안에서 강수 비가 내릴 것으로 예상되며, 최대 70km/h의 강풍이 예상되며, 온도는 12도 섭씨에 달한다.
- **ct2-opus-tc-big-en-ko**: 인기 있는  잘  펠 릿 , 지혜  fruiting 심장을 부여 하지 않습니다.ThereTube 그래서 사람들이 end Now GOLD는 것입니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: **Heavy rain is expected across the northern coast through Thursday, with gusts of up to 70 km/h and temperatures hovering around 12 degrees Celsius.**  **전국적인 북쪽 해안을 통해 Thursday까지, 최대 70km/h의 바람과 12도씨의 온도가 유지될 것으로 예상됩니다.**  **이 문장은 원문 그대로 유지했습니다.**
- **mlx-gemma-4-e2b-4bit**: 목요일까지 북쪽 해안을 따라 폭우가 예상되며, 순간 최대 70km의 돌풍과 기온은 섭씨 12도 내외를 오갈 것입니다.
- **mlx-gemma-4-e2b-4bit-mt**: 목요일까지 북쪽 해안에 폭우가 예상되며, 최대 70km/h의 돌풍과 기온은 섭씨 12도 내외로 유지될 것입니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 목요일까지 북부 해안 지역에서 강한 비가 예상되며, 풍속은 최대 70km/h에 달하고 온도는 약 12도 정도일 것입니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 목요일까지 북해안 지역에 70km/h까지 돌풍이 예상되며, 기온은 12도 정도로 유지될 것으로 보입니다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Heavy rain is expected across the northern coast through Thursday, with gusts of up to 70 km/h and temperatures hovering around 12 degrees Celsius.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 강력한 비가 북부 해안 지역에서 내리겠으며, 최고 70 km/h의 돌풍이 발생할 예정이며, 온도는 12도 근처로 유지될 예정입니다.
- **mlx-qwen3.5-2b-4bit**: 북부 해안 지역은 다음 주까지 Heavy Rain 가 예상되며, 바람의 최대 강도는 70 km/h 로, 기온은 12 도 정도입니다.
- **mlx-qwen3.5-2b-4bit-mt**: 4 월 1 일부터 4 월 1 일까지 북해안 전체에 중폭 비가 예상되며, 70km/h 의 바람과 12 도의 기온이 예상됩니다.
- **mlx-qwen3.5-4b-4bit**: 북부 해안全域은 목요일까지 강풍이 70 km/h 로 기록될 것으로 예상되며, 기온은 12 도 Celsius 근처에서 변동할 것입니다.
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 북쪽 해안 지역에 이번 목요일까지 강한 비가 내리고, 최대 풍속은 시속 70km, 기온은 약 12도 정도로 예상됩니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 목요일까지 북부 해안 지역에 폭우가 예상되며, 최대 70km/h의 돌풍과 12도 셀시우스 근처의 기온이 예상됩니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 북해 전체에 폭우가 예상되며, 70 km/h 의 바람과 12 도 Celsius 주변 온도가 유지될 것입니다.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 이번 주 목일까지 북쪽 해안 지역에 강한 비가 예상되며, 최대 풍속은 시속 70km, 기온은 약 12도 정도로 예상됩니다.

**en-news-05** (news)

- 원문: In a statement released Monday, the company said it would delay the launch of its flagship phone until early next year, citing ongoing supply-chain problems.
- **apple-fm**: 월요일에 발표된 성명에서 회사 측은 다음을 발표했습니다.대표폰 출시를 연기할 것이라고 했습니다.내년 초까지 공급망 문제로 인해
- **apple-mt-attr**: 월요일에 발표된 성명에서, 회사는 것이라고 밝혔다플래그십 폰 출시를 연기할 지속되는 공급망 문제를 근거로 내년 초까지 .
- **apple-mt-marker**: 월요일에 발표된 성명에서, 회사는 지속되는 공급망 문제를 근거로 플래그십 폰 출시를 내년 초까지 연기할 것이라고 밝혔다.
- **apple-mt-marker-batch**: 월요일에 발표된 성명에서, 회사는 지속되는 공급망 문제를 근거로 플래그십 폰 출시를 내년 초까지 연기할 것이라고 밝혔다.
- **apple-mt-plain**: 월요일에 발표된 성명에서, 회사는 지속되는 공급망 문제를 근거로 플래그십 폰 출시를 내년 초까지 연기할 것이라고 밝혔다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 월요일 발표 한 성명서에서, 회사는 지속적인 공급망 문제를 인용하여 내년 초까지 플래그십 전화의 출시를 지연 할 것이라고 말했다.
- **ct2-nllb-1.3b**: 월요일 발표된 성명서에서 회사는 공급망 문제로 플래그십 폰의 출시를 내년 초까지 연기할 것이라고 밝혔다.
- **ct2-nllb-600m**: 월요일에 발표한 성명서에 따르면 회사는 지속적인 공급망 문제를 이유로 내년 초까지 플래그십 폰의 출시를 지연할 것이라고 말했습니다.
- **ct2-opus-tc-big-en-ko**: Un China, well, mosquito CD lost, well, well, well, well, well, well, well, well, well, well, well, well, well, well, well, well, well, well, well, 모기 CD 전리품, 잘, well, well, 모기 CD 약탈, well, well, well, well, well, well, well, 모기 CD
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: “다음 주 화요일, 회사는 출시 예정인 최신 플래그십 스마트폰의 출시를 연기할 것이라고 발표했습니다. 공급망 문제로 인해 진행 중인 상황 때문입니다.”
- **mlx-gemma-4-e2b-4bit**: 월요일에 발표된 성명에서, 회사는 공급망 문제로 인해 주요 휴대폰 출시를 내년 초로 연기할 것이라고 밝혔습니다.(누락)
- **mlx-gemma-4-e2b-4bit-mt**: 월요일에 발표된 성명에서, 해당 회사는 지속적인 공급망 문제들을 이유로 플래그십 휴대폰의 출시를 내년 초까지 연기할 것이라고 밝혔다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 월요일에 발표된 성명에서 회사는 현재 진행 중인 공급망 문제를 이유로 주력 스마트폰의 출시를 내년 초까지 연기할 것이라고 밝혔습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 월요일 발표문에서 이 회사는 자사의 플래그십 휴대폰 출시를 다음 해 초까지 연기한다고 밝혔습니다. 이는 지속적인 공급망 문제로 인한 것이라고 설명했습니다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: In a statement released Monday, the company said it would delay the launch of its flagship phone until early next year, citing ongoing supply-chain problems.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 회사는 월요일 발표한 보고서에 따르면, 주력 모델의 출시일을 내년 초로 연기할 예정이라고 밝혔다. 이는 공급망 문제로 인해 발생한 문제를 이유로 하였다.
- **mlx-qwen3.5-2b-4bit**: 1 일간 발표에서 회사는 플래그십 폰 출시를 지연시키기로 결정하고, 공급망 문제를 해결하기 위해 다음 년 초까지 출시할 것이라고 밝혔습니다.(누락)(누락)
- **mlx-qwen3.5-2b-4bit-mt**: 1 월 1 일에 발표된该公司는 공급망 문제를 이유로 플래그십 스마트폰 출시를 내년 초로 연기한다고 밝혔다.
- **mlx-qwen3.5-4b-4bit**: 월요일에 발표된 성명서에서 회사는 공급망 문제로 인해 플래그십 스마트폰의 출시를 내년 초까지 연기한다고 밝혔습니다.(누락)(누락)
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 월요일에 발표된 성명에 따르면, 회사는 현재의 공급망 문제로 인해 대표 모델의 출시를 다음 해 초로 연기할 것이라고 밝혔습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 월요일에 발표된 성명에서, 이 회사는 지속적인 공급망 문제로 인해 플래그십 휴대폰 출시를내년 초로 연기할 것이라고 밝혔습니다.(누락)
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 주말에 발표된 성명에서 회사는 최신 플래그십 스마트폰 출시를 미루고 다음 년 초까지 연기하기로 결정했습니다. 지속적인 공급망 문제로 인해.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 회사는 월요일에 발표한 성명에서, 현재 진행 중인 공급망 문제로 인해 플래그십 스마트폰의 출시를 다음 해 초로 연기할 것이라고 밝혔습니다.

**en-news-06** (news)

- 원문: Why do so many small bakeries close within five years? Economists say the answer has less to do with bread than with rent, staffing and thin margins.
- **apple-fm**: 5년 이내에 작은 베이커리들이 왜 문을 닫는지 궁금하군요. 경제학자들은 답이 빵보다는 임대료와 관련이 많다고 합니다.직원 배치그리고 얇은 이익
- **apple-mt-attr**: 왜 많은 소규모 베이커리가 5년 이내에 문을 닫는 걸까요? 경제학자들은 그 답이 빵보다는 임대료, 있다고 말합니다인력 부족, 그리고 얇은 마진과 더 관련이 .
- **apple-mt-marker**: 왜 많은 소규모 베이커리가 5년 이내에 문을 닫는 걸까요? 경제학자들은 그 답이 빵보다는 임대료, 인력 부족, 그리고 얇은 마진과 더 관련이 있다고 말합니다.
- **apple-mt-marker-batch**: 왜 많은 소규모 베이커리가 5년 이내에 문을 닫는 걸까요? 경제학자들은 그 답이 빵보다는 임대료, 인력 부족, 그리고 얇은 마진과 더 관련이 있다고 말합니다.
- **apple-mt-plain**: 왜 많은 소규모 베이커리가 5년 이내에 문을 닫는 걸까요? 경제학자들은 그 답이 빵보다는 임대료, 인력 부족, 그리고 얇은 마진과 더 관련이 있다고 말합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 왜 많은 소규모 제과점들이 5년 이내에 문을 닫는 것일까? 경제학자들은 이 질문에 대한 답이 임대료, 직원 수, 마진보다는 빵과 덜 관련이 있다고 말한다.
- **ct2-nllb-1.3b**: 왜 이렇게 많은 작은 빵집들이 5년 이내에 문을 닫는 걸까요? 경제학자들은 이 질문에 대한 답은 빵과 관련이 있는 것이 아니라 임대료, 인력, 희박한 수익률과 관련이 있다고 말합니다.
- **ct2-nllb-600m**: 왜 이렇게 많은 작은 빵집들이 5년 안에 문을 닫을까요? 경제학자들은 빵에 대한 답이 임대, 인력 및 희소 지점보다 덜 관련이 있다고 말합니다.
- **ct2-opus-tc-big-en-ko**: Tutorialina causesquesting、mechanical whisk、shiny for、ing 무어는 잘、위、심장、zan 지혜、、、、、이제 끝。ing.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 많은 작은 베이커리들이 5년 안에 문을 닫고 사라지는 이유는, 경제학자들은 빵보다 임대료, 인력 부족, 그리고 얇은 마진이 더 큰 이유라고 말하고 있습니다.
- **mlx-gemma-4-e2b-4bit**: 왜 그렇게 많은 작은 제과점들이 5년 이내에 문을 닫는 걸까요? 경제학자들은 그 답이 빵보다는 임대료, 인력, 그리고 낮은 마진과 더 관련이 있다고 말합니다.
- **mlx-gemma-4-e2b-4bit-mt**: 왜 그렇게 많은 작은 제과점들이 5년 안에 문을 닫는가? 경제학자들은 그 답이 빵보다는 임대료, 인력, 그리고 적은 마진과 더 관련이 있다고 말한다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 왜 그렇게 많은 작은 제과점들이 5년 이내에 문을 닫는 걸까? 경제학자들은 그 이유가 빵과는 관련이 적고, 임대료, 인력 및 낮은 이익률과 더 관련이 있다고 말한다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 왜 많은 작은 제과점이 5년 이내에 문을 닫을까요? 경제학자들은 빵보다는 임대료, 고용, 그리고 마진 때문에 그 답을 찾는다고 말합니다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Why do so many small bakeries close within five years? Economists say the answer has less to yield to bread than with rent, staffing and thin margins.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 왜 다섯 년 내에 많은 작은 배달부는 닫히는가? 경제학자들은 이에 대한 답변은 빵보다는 월세, 인력 및 얇은 수익 차이에 있다.
- **mlx-qwen3.5-2b-4bit**: 왜냐하면 5 년 안에 많은 작은 베이커리가 문을 닫는 것입니까? 경제학자들은 그 이유는 빵보다는 임대료와 인력, 얇은 마진 때문이라고 말합니다.(누락)(누락)
- **mlx-qwen3.5-2b-4bit-mt**: 왜 많은 소규모 빵집이 5 년 안에 문을 닫는 걸까? 경제학자들은 그 이유는 빵이 아니라 임대료, 인력, 얇은 이윤율 때문이라고 설명한다.
- **mlx-qwen3.5-4b-4bit**: 왜 많은 소규모 빵집이 5 년 이내에 문을 닫는가? 경제학자들은 이 현상이 빵보다는 임대료, (누락)(누락)
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 많은 작은 빵집들이 5년 안에 문을 닫는 이유는 무엇일까요? 경제학자들은 이 현상에 빵 자체보다 임대료, 인력, 그리고 낮은 수익률이 더 큰 영향을 미친다고 말합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 왜 그렇게 많은 작은 빵집들이 5년 안에 문을 닫을까요? 경제학자들은 그 이유가 빵보다는 임대료,인력 부족그리고 적은 마진과 더 관련이 있다고 말합니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 왜 작은 빵집이 5 년 이내에 문을 닫는 것입니까? 경제학자들은 답이 빵보다는 임대료, 인력, 얇은 마진과 관련이 있다고 말합니다.(누락)(누락)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 왜 많은 소규모 빵집들이 5년 이내에 문을 닫는가? 경제학자들은 이 현상의 원인이 빵 자체보다는 임대료, 인력, 낮은 마진과 관련이 있다고 말합니다.

**en-community-01** (community)

- 원문: ok so I finally got my Raspberry Pi to boot and it immediately caught fire. well, not literally. but my soul did.
- **apple-fm**: 알겠습니다. 드디어 제 Raspberry Pi를 부팅했는데, 즉시 불이 났습니다. 물론 문자 그대로가 아니고요. 하지만 제 영혼이 불탔습니다.
- **apple-mt-attr**: 좋아, 그래서 나는 마침내 내 라즈베리 피를 부팅시켰는데 그것은 즉시 불이 났어. 음, 문자 그대로는 아니지만. 하지만 내 영혼은 그랬어.
- **apple-mt-marker**: 좋아, 그래서 나는 마침내 내 라즈베리 피를 부팅시켰는데 그것은 즉시 불이 났어. 음, 문자 그대로는 아니지만. 하지만 내 영혼은 그랬어.
- **apple-mt-marker-batch**: 좋아, 그래서 나는 마침내 내 라즈베리 피를 부팅시켰는데 그것은 즉시 불이 났어. 음, 문자 그대로는 아니지만. 하지만 내 영혼은 그랬어.
- **apple-mt-plain**: 좋아, 그래서 나는 마침내 내 라즈베리 피를 부팅시켰는데 그것은 즉시 불이 났어. 음, 문자 그대로는 아니지만. 하지만 내 영혼은 그랬어.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 좋아 그래서 나는 마침내 내 라즈베리 파이를 부팅하고 즉시 불이 붙었다. 글쎄, 말 그대로. 하지만 내 영혼은.
- **ct2-nllb-1.3b**: 그래서 마침내 라즈베리 파이를 부팅할 수 있었고 즉시 불이 났어요. 글자 그대로는 아닙니다. 하지만 제 영혼은 불에 탔습니다.
- **ct2-nllb-600m**: 그래서 마침내 제 라즈베리 파이가 시작되었고, 즉시 불에 탔습니다.
- **ct2-opus-tc-big-en-ko**: US Sap  sensors heart end CD.    , 마지막으로  . 수락은 계속 남아 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 어디어니, 드디어 내 Raspberry Pi가 부팅되고, 즉시 불이 났어.  아니, 실제로 그렇지는 않았지만, 내 영혼도 타버렸어.
- **mlx-gemma-4-e2b-4bit**: 좋아요, 드디어 라즈베리 파이를 부팅하는 데 성공했지만 즉시 불이 났어요. 글자 그대로는 아니지만, 제 영혼이 타버렸죠.
- **mlx-gemma-4-e2b-4bit-mt**: 음, 드디어 제 라즈베리 파이를 부팅시켰는데 바로 불이 붙었어요. 글쎄, 문자 그대로는 아니고요. 하지만 제 영혼은 그랬죠.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 음, 마침내 Raspberry Pi가 부팅되었고 바로 작동하기 시작했어요. 물론 실제로는 그런 건 아니지만, 제 영혼은 그렇게 느꼈어요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 그래, 드디어 라즈베리 파이에서 부팅이 되고 바로 성공했어. 아, 정말이지.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: ok so I finally got my Raspberry Pi to boot and it immediately caught fire. well, not literally. but my soul did.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: Raspberry Pi를 시작했을 때 즉시 화났다. 사실상은 아니지만 내 영혼은 그랬다.
- **mlx-qwen3.5-2b-4bit**: 좋습니다. 마침내 라스피리 피를 켘서 시작했고, 즉시 불이 붙었습니다. 하지만, Literal 이 아닙니다. 하지만, 내 영혼이 불타버렸습니다.
- **mlx-qwen3.5-2b-4bit-mt**: 좋습니다. 이제 라즈베리 파이 를 켘서 시작했고, 바로 불이 났습니다. 하지만 Literal 의 불이 아니라, 내 영혼이 불탔습니다.
- **mlx-qwen3.5-4b-4bit**: 좋습니다, 저는 마침내 Raspberry Pi 를 부팅하게 만들었으니. 그리고 즉시 불이 났습니다. 아니, 문자 그대로는 아닙니다. 하지만 내 영혼은 불타버렸습니다.
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 그래, 드디어 내 라스베리 파이 컴퓨터가 부팅되었는데, 바로 문제가 생겼어요. 물론 문자 그대로의 불은 아니지만, 제 마음은 완전히 무너졌어요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 자, 드디어 라즈베리 파이를 부팅시켰는데 바로 불이 붙었어요. 뭐, 문자 그대로는 아니고요. 제 영혼이 불탔죠.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 좋습니다. 마침내 라즈베리 파이 를 켜고 즉시 불에 타버렸습니다. 물론 문자 그대로는 아닙니다. 하지만 내 영혼이 그랬죠.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 그래, 드디어 라스베리 파이에서 부팅이 되더니, 즉시 작동을 멈췄어요. 물론, 문자 그대로 말하는 건 아니지만, 제 열정은 완전히 식어버렸죠.

**en-community-02** (community)

- 원문: Hot take: tabs are fine, spaces are fine, and anyone who argues about it at 2 a.m. needs a snack and a nap.
- **apple-fm**: 핫한 의견: 탭은 괜찮고, 공백도 괜찮고, 새벽 2시에 그걸로 논쟁하는 사람은 간식과 낮잠이 필요합니다.
- **apple-mt-attr**: 핫 테이크: 탭은 괜찮고, 공백도 괜찮으며, 새벽 2시에 이에 대해 논쟁하는 사람은 간식과 낮잠이 필요합니다.
- **apple-mt-marker**: 핫 테이크: 탭은 괜찮고, 공백도 괜찮으며, 새벽 2시에 이에 대해 논쟁하는 사람은 간식과 낮잠이 필요합니다.
- **apple-mt-marker-batch**: 핫 테이크: 탭은 괜찮고, 공백도 괜찮으며, 새벽 2시에 이에 대해 논쟁하는 사람은 간식과 낮잠이 필요합니다.
- **apple-mt-plain**: 핫 테이크: 탭은 괜찮고, 공백도 괜찮으며, 새벽 2시에 이에 대해 논쟁하는 사람은 간식과 낮잠이 필요합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 핫 테이크: 탭은 괜찮다, 공간은 괜찮다, 그리고 그것에 대해 오전 2시에 논쟁하는 사람은 간식과 낮잠이 필요합니다.
- **ct2-nllb-1.3b**: 핫 테이크: 탭은 괜찮고, 공간은 괜찮고, 새벽 2시에 그것에 대해 논쟁하는 사람은 간식과 낮잠이 필요합니다.
- **ct2-nllb-600m**: 탭은 괜찮아, 공간은 괜찮아, 그리고 아침 2시에 그것에 대해 논쟁하는 사람은 간식과 잠자리가 필요합니다.
- **ct2-opus-tc-big-en-ko**: 약 직경 믿을 수 있는,  믿을 수 있는, ending portfolioing 팽창식 CD-4 그들 중국. 8. China 끝 China.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: **Hot take: tabs are fine, spaces are fine, and anyone who argues about it at 2 a.m. needs a snack and a nap.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **열렬의 의견: 탭은 괜찮고, 간격은 괜찮으며, 2시쯤에 탭에 대한 논쟁을 벌이는 사람은 간식과 잠을 먹여야 합니다.**  (이 문장은 원문 그대로 유지했습니다.)  **설명:**  *   **Hot take:**  "열렬의 의견"이라는 표현은 한국어에서 "Hot take"를 그대로 번역하는 것이 가장 적절합니다. *   **Tabs are fine, spaces are fine:**  "탭은 괜찮고, 간격은 괜찮으며"는 "Tabs are fine, spaces are fine"로 그대로 번역합니다. *   **Anyone who argues about it at 2 a.m.:**  "2시쯤에 탭에 대한 논쟁을 벌이는 사람"은 "Anyone who argues about it at 2 a.m."으로 그대로 번역합니다. *   **Needs a snack and a nap:**  "그들은 간식과 잠을 먹여야 합니다"는 "They need a snack and a nap"로 그대로 번역합니다.  **추가적인 고려 사항:**  *   "Hot take"는 한국어의 유머와 상황에 따라 다양한 표현으로 번역될 수 있습니다.  이 문장에서는 "열렬의 의견"이라는 표현이 가장 자연스럽습니다. *   "2 a.m."은 한국어의 시간 표현에 맞춰 "2시"로 번역했습니다.
- **mlx-gemma-4-e2b-4bit**: 핫한 의견: 탭은 괜찮고, 공백도 괜찮으며, 새벽 2시에 그것에 대해 논쟁하는 사람은 간식과 낮잠이 필요합니다.
- **mlx-gemma-4-e2b-4bit-mt**: 핵심 의견: 탭은 괜찮고, 공백도 괜찮다. 그리고 새벽 2시에 그걸 가지고 논쟁하는 사람은 간식과 낮잠이 필요하다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 열정적인 주장: 탭 문법은 괜찮고, 공백 문법도 괜찮아요. 새벽 2시에 이에 대해 논쟁하는 사람은 간식과 낮잠이 필요할 거예요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 핫초이스: 탭은 괜찮고, 공백은 괜찮고, 이 문제에 대해 논쟁하는 사람은 이브린에서 스낵과 낮잠이 필요해요.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Hot take: tabs are fine, spaces are fine, and anyone who argues about it at 2 a’m. needs a snack and a nap.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 더스트, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라.
- **mlx-qwen3.5-2b-4bit**: Hot take: 탭은 괜찮고, 스페이스도 괜찮습니다. 2 시에 그걸 두고 논하는 사람들은 반드시 먹거리를 먹고 수면이 필요합니다.
- **mlx-qwen3.5-2b-4bit-mt**: 고독한 취지: 탭은 괜찮고, 여백도 괜찮고, 2 시를 두고 그토록 논쟁하는 사람은 배와 수면을 취해야 한다.
- **mlx-qwen3.5-4b-4bit**: 주장: 탭은 괜찮고, 공백도 괜찮습니다. 그리고 2 시에 이를 논쟁하는 사람은 간식과 잠을 필요로 합니다.
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 간단한 의견: 탭과 공백 모두 괜찮고, 새벽 2시에 이 문제에 대해 논쟁하는 사람들은 간식과 낮잠이 필요합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 솔직히 말해서: 탭도 괜찮고, 공백도 괜찮아요. 그리고 새벽 2시에 이 문제로 논쟁하는 사람은 간식과 낮잠이 필요합니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 핫_take: 탭은 괜찮습니다. 공간도 괜찮고, 2 시에 논쟁하는 사람이라면 저녁 식사와 휴식 시간이 필요합니다.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 개인적인 의견: 탭이나 공백 모두 괜찮고, 새벽 2시에 이런 논쟁을 하는 사람들은 간식을 먹고 잠을 자야 한다.

**en-community-03** (community)

- 원문: lol I've been staring at this error for three hours and it was a missing semicolon. a SEMICOLON. I'm going to go live in the woods now.
- **apple-fm**: 웃긴 건, 이 오류에 3시간 동안 몰두했는데, 사실 분수 기호가 누락된 겁니다. 분수 기호가요. 이제 저는 숲속에서 라이브 방송을 할 겁니다.
- **apple-mt-attr**: ㅋㅋㅋ 이 오류를 세 시간이나 보고 있었는데 분리표가 빠져 있었어요. 분리표요. 이제 숲에서 라이브 방송을 할게요.
- **apple-mt-marker**: ㅋㅋㅋ 이 오류를 세 시간이나 보고 있었는데 분리표가 빠져 있었어요. 분리표요. 이제 숲에서 라이브 방송을 할게요.
- **apple-mt-marker-batch**: ㅋㅋㅋ 이 오류를 세 시간이나 보고 있었는데 분리표가 빠져 있었어요. 분리표요. 이제 숲에서 라이브 방송을 할게요.
- **apple-mt-plain**: ㅋㅋㅋ 이 오류를 세 시간이나 보고 있었는데 분리표가 빠져 있었어요. 분리표요. 이제 숲에서 라이브 방송을 할게요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: LOL 나는 3 시간 동안이 오류를 쳐다보고있다 그리고 그것은 누락 된 세미콜론이었다. 세미콜론. 나는 지금 숲에서 살고 갈거야.
- **ct2-nllb-1.3b**: 이 오류를 3시간 동안 쳐다보았는데 반점, 반점이 없어졌어요.
- **ct2-nllb-600m**: 3시간 동안 이 오류를 보고 있었는데 미흡한 반사각형이었습니다.
- **ct2-opus-tc-big-en-ko**: 미국 호텔 슈퍼 전시 -4 팝 브리태니커 #9-2  끝 CDther 중국  뉴스 파운드. 중국  제품 . 미국 호텔 8folk 심장 베어링은 잘  KC에 안치.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: lol I've been staring at this error for three hours and it was a missing semicolon. a SEMICOLON. I'm going to go live in the woods now.  **Explanation:**  The original text is a casual, slightly frustrated comment expressing a problem with a coding error. The translation aims to preserve the tone and the specific details of the original message, while maintaining the original wording.  **추가적인 고려 사항:**  *   "I've been staring at this error for three hours"  -  "이 오류를 세 시간 동안 계속 바라보고 있습니다" (I've been staring at this error for three hours) *   "a SEMICOLON" - "a SEMICOLON" (The specific detail is preserved) *   "I'm going to go live in the woods now." - "숲에 가서 살 것입니다" (I'm going to go live in the woods now.)
- **mlx-gemma-4-e2b-4bit**: ㅋㅋㅋ 세미콜론이 빠진 거였어요. 세미콜론 말이에요. 저는 이제 숲속으로 갈 거예요.
- **mlx-gemma-4-e2b-4bit-mt**: ㅋㅋㅋ 이거 세미콜론 빠진 거였어. 세미콜론. 나 이제 숲으로 도망갈 거야.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: lol, 이 오류를 3시간 동안 계속 바라보고 있었는데, 그건 쉼프레스가 없었던 거야. 쉼프레스 말이야. 이제는 숲속으로 들어가서 살게 될 거야.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 애가 타서 이 에러를 3시간 동안 계속 쳐다봤는데, semicolon가 빠져 있었어. semicolon. 이제 숲으로 라이브 스트리밍 하려고.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: lol I've been staring at this error for three hours and it was a missing semicolon. a SEMICOLON. I'm going to go live in the woods now.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 로이, 이 오류를 세 시간 동안 보고 있었고, 마찬가지로 분리 기호인 세미콜론이 누락되어 있었음. 이제 나무 속으로 가서 생활할게.
- **mlx-qwen3.5-2b-4bit**: lol 이 오류를 3 시간 동안 stared 하고 있는데, 그거는 missing semicolon 이었습니다. SEMICOLON 입니다. 이제 숲으로 가겠습니다.
- **mlx-qwen3.5-2b-4bit-mt**: lol, 이 오류에 대해 3 시간 동안 stared at... (원문: staring) ...; missing semicolon. a SEMICOLON. Now I'm going to go live in the woods.
- **mlx-qwen3.5-4b-4bit**: lol 이 오류를 3 시간 동안 바라보고 있었습니다. 그리고 그것이 누락된 세미콜론이었다는 것을 알게 되었습니다. 세미콜론입니다. 이제 숲으로 들어가 살겠습니다.
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 와, 이 오류를 세 시간 동안 계속 쳐다봤는데, 그냥 세미콜론 하나였어요. 세미콜론 하나! 이제 저는 숲에서 살 거예요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: ㅋㅋㅋ 이 에러를 세 시간 동안 쳐다봤는데 세미콜론이 빠진 거였어요. 세미콜론이요. 저 이제 숲으로 가서 살 거예요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: lol 이 오류를 3 시간 동안 바라보았습니다. 누락된 세미콜론이었습니다. SEMICOLON 입니다. 이제 숲으로 라이브로 갈게요.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 아, 이 오류를 세 시간 동안 계속 보면서 좌절했네요. 문제의 원인은 세미콜론 하나였어요. 세미콜론 하나! 이제 저는 숲 속으로 들어가 살 것 같아요.

**en-community-04** (community)

- 원문: Not gonna lie, that update broke literally everything on my setup. Rolled back, touched grass, will try again tomorrow.
- **apple-fm**: 솔직히 말하자면, 그 업데이트가 제 설정에서 완전히 망가졌습니다.실제로 모든 게 망가졌습니다.제게
- **apple-mt-attr**: 솔직히 말해서, 그 업데이트가 실제로 모든 것을 망쳤어요제 설정에서 . 되돌렸고, 잔디를 만졌고, 내일 다시 시도할게요.
- **apple-mt-marker**: 솔직히 말해서, 그 업데이트가 제 설정에서 실제로 모든 것을 망쳤어요. 되돌렸고, 잔디를 만졌고, 내일 다시 시도할게요.
- **apple-mt-marker-batch**: 솔직히 말해서, 그 업데이트가 제 설정에서 실제로 모든 것을 망쳤어요. 되돌렸고, 잔디를 만졌고, 내일 다시 시도할게요.
- **apple-mt-plain**: 솔직히 말해서, 그 업데이트가 제 설정에서 실제로 모든 것을 망쳤어요. 되돌렸고, 잔디를 만졌고, 내일 다시 시도할게요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 거짓말하지 않을 거야, 그 업데이트는 말 그대로 내 설정에 모든 것을 깨졌다. 롤백, 잔디를 만졌다, 내일 다시 시도합니다.
- **ct2-nllb-1.3b**: 거짓말하지 않을게요, 그 업데이트가 제 설정을 완전히 망쳤어요.
- **ct2-nllb-600m**: 거짓말하지 않을거야, 그 업데이트는 말 그대로 모든 걸 깨버렸어
- **ct2-opus-tc-big-en-ko**: prospect, values9001:2008  성공 remained.section,, 댓글 ND.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 이 문장은 다음과 같이 번역할 수 있습니다.  **"진실을 말하자, 업데이트가 완전히 망쳐버렸어. 되돌렸어, 흙을 닦고 다시 시도해볼 거야."**  **설명:**  *   **Not gonna lie:** "진실을 말하자"라는 표현에 사용된 "not gonna lie"는 상황을 설명하는 일반적인 표현으로, 한국어에서는 "진실을 말하자"로 번역됩니다. *   **that update broke literally everything on my setup:** "업데이트가 완전히 망쳐버렸어"는 "update가 완전히 망쳐버렸어"로, "literally everything"는 "거의 모든 것"이라는 뜻으로 번역됩니다. *   **Rolled back, touched grass:** "되돌렸어, 흙을 닦고 다시 시도해볼 거야"는 "되돌렸어, 흙을 닦고 다시 시도해볼 거야"로, "rolled back"은 "되돌렸다"로, "touched grass"는 "흙을 닦았다"로 번역됩니다.  **주석:**  "진실을 말하자"는 상황을 설명하는 일반적인 표현으로, 한국어에서는 "진실을 말하자"로 번역됩니다.  **생각 과정:**  원문은 "Not gonna lie"라는 표현을 사용하여 상황을 설명하고 있습니다. 이 문장은 상황을 설명하는 일반적인 표현으로, 한국어에서는 "진실을 말하자"로 번역됩니다. "That update broke literally everything on my setup"은 "업데이트가 완전히 망쳐버렸어"로, "rolled back, touched grass"는 "되돌렸어, 흙을 닦고 다시 시도해볼 거야"로, 한국어에 가장 자연스럽게 어울리는 표현입니다.
- **mlx-gemma-4-e2b-4bit**: 솔직히 말해서, 그 업데이트가 제 설정의 모든 것을 망쳤어요. 되돌렸고, 풀었고, 내일 다시 시도할 거예요.(누락)
- **mlx-gemma-4-e2b-4bit-mt**: 솔직히 말해서, 그 업데이트가 내 설정의 모든 것을 문자 그대로 망가뜨렸어. 되돌렸고, 자연을 접하고, 내일 다시 시도해 볼 거야.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 솔직히 말하자면, 그 업데이트로 내 시스템의 모든 것이 망가졌어요. 다시 처음부터 시작할게요, 내일 다시 시도해볼게요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 사실 말하자면, 그 업데이트가 내 설정을 완전히 망쳤어. 다시 시도할 거야, 내일.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Not gonna lie, that update broke literally everything on my setup. Rolled back, touched grass, will try again tomorrow.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 업데이트가 나서 내가 사용하고 있던 모든 설정이 깨졌어요. 복구했지만, 땀에 나온 게 다 잊었고, 내일 다시 시도할게.
- **mlx-qwen3.5-2b-4bit**: 진짜로 말해서, 그 업데이트가 설정에서 literally everything 를 바꿨습니다. 롤백하고, grass 를 만졌고, 다음 날 다시 시도하겠습니다.(누락)(누락)
- **mlx-qwen3.5-2b-4bit-mt**: 아직 거짓말하지 마라, 그 업데이트는 설정의 모든 것을 무너뜨렸다. 되돌려서 갔고, 그건 바보 같았어. 내일 다시 시도해 보겠어.
- **mlx-qwen3.5-4b-4bit**: 진실은 아닙니다. 그 업데이트는 내 설정에서 거의 모든 것을 망쳤습니다. 되돌리고, 시간을 보내고, 내일 다시 시도할 것입니다.(누락)(누락)
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 솔직히 말해서, 그 업데이트로 제 시스템의 모든 것이 완전히 망가졌어요. 이전으로 되돌렸고, 잠시 산책을 하고, 내일 다시 시도할게요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 거짓말 안 할게요, 그 업데이트가 제 세팅의 모든 것을 문자 그대로 망가뜨렸어요롤백하고, 풀밭에 좀 누워있다가, 내일 다시 시도해 볼게요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 진짜 말입니다, 그 업데이트는 설정에서 거의 모든 것을 깨뜨렸습니다. 롤백했습니다, 흙을 만졌고 다음 날 다시 시도하겠습니다.(누락)(누락)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 솔직히 말해서, 그 업데이트로 제 시스템의 모든 것이 망가졌어요. 이전 버전으로 되돌렸고, 잠시 휴식을 취한 후, 내일 다시 시도해 볼 거예요.

**en-community-05** (community)

- 원문: Can confirm. My cat has been sitting on the router for a week and honestly the wifi has never been better. Don't question it.
- **apple-fm**: 확인해 드릴게요. 제 고양이가 일주일 동안 라우터 위에 있었는데, 솔직히 와이파이가 더 좋아졌습니다. 의심하지 마세요.
- **apple-mt-attr**: 확인할 수 있어요. 제 고양이가 라우터 위에 일주일 동안 앉아 있었는데 솔직히 와이파이가 지금까지보다 더 좋았어요. 의심하지 마세요.
- **apple-mt-marker**: 확인할 수 있어요. 제 고양이가 라우터 위에 일주일 동안 앉아 있었는데 솔직히 와이파이가 지금까지보다 더 좋았어요. 의심하지 마세요.
- **apple-mt-marker-batch**: 확인할 수 있어요. 제 고양이가 라우터 위에 일주일 동안 앉아 있었는데 솔직히 와이파이가 지금까지보다 더 좋았어요. 의심하지 마세요.
- **apple-mt-plain**: 확인할 수 있어요. 제 고양이가 라우터 위에 일주일 동안 앉아 있었는데 솔직히 와이파이가 지금까지보다 더 좋았어요. 의심하지 마세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 확인할 수 있습니다. 내 고양이는 일주일 동안 라우터에 앉아있다 솔직히 와이파이는 더 나은 적이 없습니다.
- **ct2-nllb-1.3b**: 확인해 내 고양이는 일주일째 라우터에 앉아 있어 와이파이가 더 좋아졌어
- **ct2-nllb-600m**: 확인해줘요, 고양이는 라우터에서 1주째 앉아 있고, 솔직히 와이파이가 더 좋아진 적이 없어요.
- **ct2-opus-tc-big-en-ko**: town. 바람 딜러 위장 exhibits 성공 잘 # 중국 end 잘 위장 실직 전시 devil.nut 호텔 에서 CD.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: **Can confirm. My cat has been sitting on the router for a week and honestly the wifi has never been better. Don't question it.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인합니다. 내 고양이(猫)가 방에 앉아 지난 한 주 동안 방의 와이파이(Wi-Fi)가 훨씬 좋았다고 솔직히 말할 수 있습니다. 질문하지 마세요.**  (이 문장은 한국어로 다음과 같이 번역할 수 있습니다.)  **확인
- **mlx-gemma-4-e2b-4bit**: 확인합니다. 저희 고양이가 일주일 동안 라우터 위에 앉아 있었는데, 솔직히 와이파이가 그 어느 때보다 좋았어요. 의심하지 마세요.
- **mlx-gemma-4-e2b-4bit-mt**: 확인합니다. 저희 고양이가 일주일 동안 라우터 위에 앉아 있었는데, 솔직히 와이파이가 이렇게 좋을 리가 없어요. 의심하지 마세요.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 확인할 수 있습니다. 제 고양이가 일주일 동안 라우터 위에 앉아 있었는데, 솔직히 와이파이는 전혀 나빠지지 않았습니다. 의심하지 마세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 확인할 수 있어요. 우리 고양이 한 주 동안 라우터 위에 앉아 있고 솔직히 와이파이 상태가 최고예요. 의심하지 마세요.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Can confirm. My cat has been sitting on the router for a week and honestly the wifi has never been better. Don't question it.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 확인 가능. 나의 고양이가 1주일 동안 라우터에 앉아 있었고, 실제로 Wi-Fi가 더 나은 상태였던 것 같습니다. 그건 이상하지 않다.
- **mlx-qwen3.5-2b-4bit**: 확인 가능합니다. 나의 고양이는 라우터 위에 앉아 있는 동안 1 주 동안 있었고, 솔직히 wifi 가 더 이상 나쁘지 않았습니다. 그걸 의심하지 마세요.
- **mlx-qwen3.5-2b-4bit-mt**: 확인합니다. 고양이가 라우터 위에 앉아 있는 동안 Wi-Fi 가 더 이상 좋아지지 않았습니다. 의심하지 마세요.
- **mlx-qwen3.5-4b-4bit**: 확인합니다. 내 고양이가 일주일간 라우터 위에 앉아있었고, 솔직히 와이파이 품질은 과거보다 더 좋아졌습니다. 의심하지 마세요.
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 확인 가능합니다. 제 고양이가 일주일 동안 라우터 위에 앉아 있는데, 솔직히 말해서 와이파이가 이전보다 훨씬 잘 작동하고 있습니다. 의심하지 마세요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 확인 가능합니다. 제 고양이가 라우터 위에 일주일 동안 앉아 있었는데, 솔직히 와이파이가 이렇게 좋았던 적은 없어요. 의심하지 마세요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 확인 가능합니다. 나의 고양이가 라우터 위에 앉아 있는 동안 1 주가되었고, 솔직히 와이파이가 더 이상 나쁘지 않았습니다. 의심하지 마세요.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 확인되었습니다. 제 고양이가 일주일 동안 라우터 위에 앉아 있었는데, 솔직히 Wi-Fi 속도가 이전보다 훨씬 빨라졌습니다. 의심하지 마세요.

**en-community-06** (community)

- 원문: Y'all, I just spent $60 on a keyboard that sounds like rain. Zero regrets, my coworkers on the other hand... TBD.
- **apple-fm**: 여러분, 저는 $60짜리 비 오는 소리가 나는 키보드를 샀는데, 후회하는 건 하나도 없습니다. 제 동료들은 다릅니다...미정.
- **apple-mt-attr**: 여러분, 저는 방금 비 소리가 나는 키보드에 60달러를 썼어요. 전혀 후회 없어요. 반면 제 동료들은... 아직 알 수 없네요.
- **apple-mt-marker**: 여러분, 저는 방금 비 소리가 나는 키보드에 60달러를 썼어요. 전혀 후회 없어요. 반면 제 동료들은... 아직 알 수 없네요.
- **apple-mt-marker-batch**: 여러분, 저는 방금 비 소리가 나는 키보드에 60달러를 썼어요. 전혀 후회 없어요. 반면 제 동료들은... 아직 알 수 없네요.
- **apple-mt-plain**: 여러분, 저는 방금 비 소리가 나는 키보드에 60달러를 썼어요. 전혀 후회 없어요. 반면 제 동료들은... 아직 알 수 없네요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 여러분, 나는 비처럼 소리가 나는 키보드에 60 달러를 지출했다. 제로 후회, 반면에 내 동료는... TBD.
- **ct2-nllb-1.3b**: 방금 비처럼 들리는 키보드에 60달러를 썼는데 후회는 없어요
- **ct2-nllb-600m**: 여러분, 제가 방금 빗방울처럼 들리는 키보드에 60달러를 썼어요
- **ct2-opus-tc-big-en-ko**: 직접 호텔까지, 미국 rebuild­ 성공 중국­ 가치­ 명예­. 에스컬레이션, remained6%­ success wellthrough sustainability
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: Y'all, 저는 얼마 전에 60달러를 들여서, 비가 내리는 듯한 소리를 내는 키보드를 샀어요. 후회는 없어요, 동료들은 다른 이야기를 하고 있습니다... 아직은 미정입니다.
- **mlx-gemma-4-e2b-4bit**: 여러분, 저는 비가 내리는 소리 같은 키보드에 60달러를 썼어요. 후회는 없지만, 제 동료들은... 미정.
- **mlx-gemma-4-e2b-4bit-mt**: 여러분, 저는 방금 비 소리 같은 키보드에 60달러를 썼어요. 후회는 전혀 없고요. 제 동료들은... TBD.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 여러분, 저는 비슈 같은 소리를 내는 키보드에 60달러를 썼어요. 아무런 후회도 없지만, 다른 동료들은… TBD.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 여러분, 저는 비 오는 소리를 내는 키보드에 60달러를 썼어요. 전혀 후회하지 않지만, 다른 쪽 동료들은... 아무도요.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Y'all, I just spent $60 on a keyboard that sounds like rain. Zero regrets, my coworkers on the other hand... TBD.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: Y'all, I just spent $60 on a keyboard that sounds like rain. Zero regrets, my coworkers on the other hand... TBD.
- **mlx-qwen3.5-2b-4bit**: 여러분들, 60 달러를 지출해서 소리가 비가 같은 키보드를 샀습니다. 제 생각은 0 회피로, 동료들은 그 반대입니다.TBD.
- **mlx-qwen3.5-2b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.
- **mlx-qwen3.5-4b-4bit**: 여러분, 저는 60 달러를 들여 소음과 함께 작동하는 키보드를 샀습니다. 후회하지 않지만, 동료들은...(누락)(누락)
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 저, 방금 비가 내리는 듯한 소리를 내는 키보드를 60달러에 샀어요. 후회는 하나도 없지만, 제 동료들은 아직 결정하지 않았네요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 여러분, 방금 비 소리 같은 키보드에 60달러를 썼어요. 후회 제로! 반면에 제 동료들은... TBD. 
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 여러분, 저는 오늘 keyboard 를 $60 으로 사서 소리도 빗소리가 같았습니다. 제 마음은 아무런 죄책감 없이, 동료들은 다른 한편에서 TBD.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 여러분, 저는 최근 60달러를 들여 빗소리와 비슷한 소리를 내는 키보드를 샀어요. 후회는 전혀 하지 않아요. 하지만 제 동료들은 아직... 아직 판단하기 어렵네요.

**en-ui-01** (ui)

- 원문: Save changes
- **apple-fm**: 변경 사항을 저장하세요
- **apple-mt-attr**: 변경 사항 저장하기
- **apple-mt-marker**: 변경 사항 저장하기
- **apple-mt-marker-batch**: 변경 사항 저장하기
- **apple-mt-plain**: 변경 사항 저장하기
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 변경 사항 저장
- **ct2-nllb-1.3b**: 변경사항을 저장
- **ct2-nllb-600m**: 변경사항을 저장
- **ct2-opus-tc-big-en-ko**: 화강암
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  **번역문:**  "The quick brown fox jumps over the lazy dog.  This is a classic example of a sentence that demonstrates the power of figurative language.  It's a well-known phrase used in literature and poetry.  The URL for the website is: https://www.example.com.  The code 'abcdef' is used in a simple programming project.  Let's consider the implications of this sentence – it's a testament to the enduring appeal of simple, yet evocative, statements.  It's a good example of how language can be used to create a sense of familiarity and connection."
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: 저장
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 수정 내용을 저장하세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 변경 사항 저장하기<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: 이 문서의 목적은 학생들의 학습 동기를 높이는 것이다. 이를 위해 다양한 방법과 자료를 활용한다. 학생들은 자신의 목표를 설정하고 꾸준히 노력한다. 결과는 모두에게 긍정적인 영향을 미친다.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 변경 저장
- **mlx-qwen3.5-2b-4bit**: 변경사항 저장
- **mlx-qwen3.5-2b-4bit-mt**: 저변수 변경
- **mlx-qwen3.5-4b-4bit**: 변경사항 저장
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 변경 사항 저장
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 변경 사항 저장
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 변경 사항 저장
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 변경 사항 저장

**en-ui-02** (ui)

- 원문: Something went wrong. Please try again later.
- **apple-fm**: 오류가 발생했습니다. 나중에 다시 시도하세요.
- **apple-mt-attr**: 무언가가 잘못되었습니다. 나중에 다시 시도해 주세요.
- **apple-mt-marker**: 무언가가 잘못되었습니다. 나중에 다시 시도해 주세요.
- **apple-mt-marker-batch**: 무언가가 잘못되었습니다. 나중에 다시 시도해 주세요.
- **apple-mt-plain**: 무언가가 잘못되었습니다. 나중에 다시 시도해 주세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 뭔가 잘못되었습니다. 나중에 다시 시도하십시오.
- **ct2-nllb-1.3b**: 뭔가 잘못됐습니다. 나중에 다시 시도해주세요.
- **ct2-nllb-600m**: 뭔가 잘못됐어 나중에 다시 시도해봐
- **ct2-opus-tc-big-en-ko**: . ND.  ND입니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: Something went wrong. Please try again later.  이 문장은 영어 텍스트 "Something went wrong. Please try again later."를 한국어로 다음과 같이 번역할 수 있습니다.  **번역:**  "Something went wrong. 다시 시도해주세요."  **설명:**  *   **Something:** "Something"은 문맥상 "Something"이라는 단어 그대로 번역되었습니다. *   **went wrong:** "went wrong"는 "went"가 "wrong"로 변환되어 "went wrong"로 번역되었습니다. *   **Please try again later:** "Please try again later"는 "다시 시도해주세요"로 번역되었습니다.  **주석:**  "Something went wrong. 다시 시도해주세요."  이 문장은 사용자에게 오류 발생 시 다시 시도하도록 안내하는 메시지입니다.  **생각 과정:**  문장 전체의 의미를 파악하고, 영어 텍스트의 어조와 상황에 맞춰 자연스러운 한국어 표현으로 바꾸는 것이 목표였습니다.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: 문제가 발생했습니다. 나중에 다시 시도해 주세요.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 무슨 문제가 생겼습니다. 나중에 다시 시도해 주세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 무언가 잘못되었습니다. 나중에 다시 시도해 주세요.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Nothing works. Please try again.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: Something went wrong. Please try again later.
- **mlx-qwen3.5-2b-4bit**: 무슨 일이 일어났는지요. 나중에 다시 시도해 보세요.
- **mlx-qwen3.5-2b-4bit-mt**: 어러, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.
- **mlx-qwen3.5-4b-4bit**: 문제가 발생했습니다. 나중에 다시 시도해주세요.
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 무언가 잘못되었습니다. 나중에 다시 시도해 보세요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 문제가 발생했습니다. 나중에 다시 시도해 주세요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 문제가 발생했습니다. 나중에 다시 시도해 주세요.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 무언가 잘못되었습니다. 나중에 다시 시도해 주세요.

**en-ui-03** (ui)

- 원문: You have 3 unread messages
- **apple-fm**: 오류가 없는 메시지가 3개 있습니다.
- **apple-mt-attr**: 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-marker**: 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-marker-batch**: 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-plain**: 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 읽지 않은 메시지가 3 개 있습니다.
- **ct2-nllb-1.3b**: 읽지 않은 메시지가 3개 있습니다.
- **ct2-nllb-600m**: 3개의 미독된 메시지가 있습니다.
- **ct2-opus-tc-big-en-ko**: Industrial 적절한
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: You have 3 unread messages.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: 읽지 않은 메시지가 3개 있습니다
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 읽지 않은 메시지가 3개 있습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 사용자님은 아직 읽지 않은 메시지가 있습니다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: You have 3 unread messages.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 3개의 미리 읽지 않은 메시지
- **mlx-qwen3.5-2b-4bit**: 3 개의 읽지 않은 메세지가 있습니다.
- **mlx-qwen3.5-2b-4bit-mt**: 3 개의 메세지가 아직 읽지 않았습니다
- **mlx-qwen3.5-4b-4bit**: 읽지 않은 메시지가 3 개 있습니다.
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 받은 메시지가 3개 있습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 읽지 않은 메시지가 3개 있습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 미리 읽은 메시지 3 개가 있습니다
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 읽지 않은 메시지가 3개 있습니다.

**en-link-01** (link)

- 원문: Click [here] to continue.
- **apple-fm**: 여기 클릭하세요[here]계속하려면
- **apple-mt-attr**: 클릭하세요[here]계속하려면 기를 .
- **apple-mt-marker**: 계속하려면 [here]을 클릭하세요.
- **apple-mt-marker-batch**: 계속하려면 [here]을 클릭하세요.
- **apple-mt-plain**: 클릭 [here] 계속하기 위해.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 클릭 [here] 계속하시기 바랍니다.
- **ct2-nllb-1.3b**: 클릭하세요 [here] 계속할 수 있도록
- **ct2-nllb-600m**: 클릭 [here] 계속해야 합니다.
- **ct2-opus-tc-big-en-ko**: 킹 [here] ♡♡♡♡♡♡♡
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click Click [here] 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  **번역문:**  "이것은 2023년 10월 27일, 12:00에 시작된 프로젝트의 시작입니다.  이 프로젝트의 목표는 데이터 분석 및 예측 모델을 구축하는 것입니다.  현재, 데이터셋은 1000개이며, 모델은 3개의 레이어로 구성되어 있습니다.  다음 단계는 데이터 전처리 및 모델 학습입니다.  실험 결과는 95%를 넘어서는 것으로 나타났습니다.  이 프로젝트는 데이터 분석 및 예측 모델 구축에 중요한 역할을 할 것입니다."
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: 클릭 [here] 계속
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 클릭하세요 [here] 계속하기.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 클릭하세요<\|im_end\|> [here] 계속하다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Click [here] to continue.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 클릭 [here] to continue.
- **mlx-qwen3.5-2b-4bit**: 클릭하세요.[here]다음으로 계속하세요.
- **mlx-qwen3.5-2b-4bit-mt**: 클릭 [here] 계속합니다.
- **mlx-qwen3.5-4b-4bit**: 여기를 클릭하여 계속하세요.[here](누락)
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 클릭 [here] 계속.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 계속하려면 [here]을(를) 클릭하세요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 계속하려면 [here]여기에 클릭하세요.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 계속하려면 [here]을 클릭하세요.

**en-link-02** (link)

- 원문: See [the installation guide] for details on supported platforms.
- **apple-fm**: 설치 가이드[the installation guide]지원 플랫폼에 대한 자세한 정보
- **apple-mt-attr**: 참조하십시오[the installation guide]지원되는 플랫폼에 대한 자세한 내용은 .
- **apple-mt-marker**: 지원되는 플랫폼에 대한 자세한 내용은 [the installation guide]을 참조하십시오.
- **apple-mt-marker-batch**: 지원되는 플랫폼에 대한 자세한 내용은 [the installation guide]을 참조하십시오.
- **apple-mt-plain**: 보다 [the installation guide] 지원되는 플랫폼에 대한 자세한 내용은.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 보기 [the installation guide] 지원되는 플랫폼에 대한 자세한 내용은 여기를 참조하십시오.
- **ct2-nllb-1.3b**: 본 것 [the installation guide] 지원되는 플랫폼에 대한 자세한 내용은
- **ct2-nllb-600m**: 보시다시피 [the installation guide] 지원되는 플랫폼에 대한 자세한 내용은
- **ct2-opus-tc-big-en-ko**: 204 영화 [the installation guide] # 성공 .
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: See, the world is a vast and complex place. [the installation guide] 어조: 공식적인 고유명사: 플랫폼 숫자: 2 URL: [https://www.example.com](https://www.example.com) 코드는: [https://www.example.com/code](https://www.example.com/code)  이 문장은 "플랫폼에 대한 자세한 정보"를 제공하는 문장입니다.  "플랫폼"이라는 단어는 특정 서비스나 시스템을 의미하며, "2"는 플랫폼의 종류를 나타냅니다.  "URL"과 "코드는"은 특정 웹사이트의 링크 또는 코드 주소를 나타냅니다.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: 지원되는 플랫폼에 대한 세부 정보는 [the installation guide]을 참조하세요.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 지원되는 플랫폼에 대한 자세한 정보는 [the installation guide]를 참조하세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 확인해라<\|im_end\|> [the installation guide] 지원 플랫폼에 대한 자세한 정보를 확인하세요.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: See [the installation guide] for details on supported platforms.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. [the installation guide] 지원되는 플랫폼에 대한 세부 정보.
- **mlx-qwen3.5-2b-4bit**: 설치 가이드를 통해 지원되는 플랫폼에 대한 자세한 정보를 확인하세요.[the installation guide]설치 가이드를 확인하세요.
- **mlx-qwen3.5-2b-4bit-mt**: See [the installation guide] 지원 플랫폼에 대한 자세한 내용은 확인하십시오.
- **mlx-qwen3.5-4b-4bit**: 지원되는 플랫폼에 대한 자세한 내용은 [the installation guide](누락)
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 상세한 정보는 [the installation guide]을 참조하세요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 지원되는 플랫폼에 대한 자세한 내용은 [the installation guide]를 참고하세요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 지원되는 플랫폼에 대한 자세한 내용은 설치 가이드를 [the installation guide]참고하세요.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 자세한 내용은 [the installation guide] 참조

**en-link-03** (link)

- 원문: If you run into trouble, [open an issue on the tracker] and include your log file.
- **apple-fm**: 문제에 부딪혔다면[open an issue on the tracker]그리고 로그 파일을 포함하세요
- **apple-mt-attr**: 문제가 발생하면 [open an issue on the tracker]보고하고 로그 파일을 포함하십시오.
- **apple-mt-marker**: 문제가 발생하면 [open an issue on the tracker]을 실행하고 로그 파일을 포함하십시오.
- **apple-mt-marker-batch**: 문제가 발생하면 [open an issue on the tracker]을 실행하고 로그 파일을 포함하십시오.
- **apple-mt-plain**: 만약 당신이 곤경에 처한다면, [open an issue on the tracker] 그리고 로그 파일을 포함하십시오.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 문제가 생기면 [open an issue on the tracker] 로그 파일을 포함합니다.
- **ct2-nllb-1.3b**: 문제가 생기면 [open an issue on the tracker] 그리고 로그 파일을 포함합니다.
- **ct2-nllb-600m**: 곤경에 빠지면 [open an issue on the tracker] 로그 파일을 포함하고
- **ct2-opus-tc-big-en-ko**: 355 일반조건, [open an issue on the tracker] 방콕을 정복하다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: If you run into trouble, **고의적으로 문제를 해결하기 위해, 다음 단계를 따르세요.**  (이 부분은 문맥에 따라 다양한 해석이 가능합니다. "If you run into trouble"는 문제 발생 시, 즉, 어려움을 겪을 때,라는 의미로 해석될 수 있습니다. "다음 단계"는 문제 해결을 위해 필요한 절차를 설명하는 것으로 해석될 수 있습니다.) [open an issue on the tracker] 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  **번역문:**  "your log file.  It's important to keep track of your system's activity.  You should examine the log file to understand what's happening.  The log file is located at /var/log/your_application.  You can also check the URL: https://example.com/your_log_file.  The file contains a lot of information about your application's performance."  **추가 설명:**  *   **your log file:**  이 부분은 영어 그대로 그대로 유지했습니다. *   **It's important to keep track of your system's activity:**  이 부분은 한국어로 "시스템 활동을 추적하는 것이 중요하다"로 번역했습니다. *   **You should examine the log file to understand what's happening:**  이 부분은 "로그 파일을 확인하여 무슨 일이 일어나고 있는지 이해해야 한다"로 번역했습니다. *   **The log file is located at /var/log/your_application:**  이 부분은 "로그 파일은 /var/log/your_application에 있습니다"로 번역했습니다. *   **You can also check the URL: https://example.com/your_log_file:**  이 부분은 "URL을 확인할 수도 있습니다: https://example.com/your_log_file"로 번역했습니다. *   **The file contains a lot of information about your application's performance:**  이 부분은 "파일은 애플리케이션의 성능에 대한 많은 정보를 포함하고 있습니다"로 번역했습니다.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: 문제가 생기면, [open an issue on the tracker]과 로그 파일을 포함해 주세요.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 문제가 생기면 [open an issue on the tracker]를 사용하고 로그 파일도 포함하세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 문제가 생기면<\|im_end\|> [open an issue on the tracker] 그리고 로그 파일도 포함하세요.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: If you run into trouble, [open an issue on the tracker] and include your log file.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: If you run into trouble, [open an issue on the tracker] and include your log file.
- **mlx-qwen3.5-2b-4bit**: 문제가 발생하면 추적기에서 문제를 제기하고, 로그 파일을 포함하여 해결해 보세요.[open an issue on the tracker]트래커에서 문제를 제기하세요.
- **mlx-qwen3.5-2b-4bit-mt**: 만약 문제가 발생하면 [open an issue on the tracker] 로 로그 파일을 포함하세요.
- **mlx-qwen3.5-4b-4bit**: 문제가 발생하면 [open an issue on the tracker](누락)
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 문제가 발생했을 경우, [open an issue on the tracker] 그리고 로그 파일을 함께 첨부해 주세요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 문제가 발생하면, [open an issue on the tracker]을(를) 열고 로그 파일을 첨부해 주세요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 문제가 발생하면 추적기에서 이슈를 [open an issue on the tracker]열어 주세요. 그리고 로그 파일을 포함하세요.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 문제가 발생하면, [open an issue on the tracker]와 함께 로그 파일을 첨부해 주세요.

**en-seq-01** (seq)

- 원문: Last spring I decided to turn an old laptop into a home server for my family's photos.
- **apple-fm**: 지난여름, 저는 오래된 노트북을 가족의 사진을 위한 가정용 서버로 바꾸기로 했습니다.
- **apple-mt-attr**: 작년 봄에 나는 오래된 노트북을 가족의 사진을 위한 가정용 서버로 바꾸기로 결정했다.
- **apple-mt-marker**: 작년 봄에 나는 오래된 노트북을 가족의 사진을 위한 가정용 서버로 바꾸기로 결정했다.
- **apple-mt-marker-batch**: 작년 봄에 나는 오래된 노트북을 가족의 사진을 위한 가정용 서버로 바꾸기로 결정했다.
- **apple-mt-plain**: 작년 봄에 나는 오래된 노트북을 가족의 사진을 위한 가정용 서버로 바꾸기로 결정했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 지난 봄 나는 내 가족의 사진을위한 홈 서버로 오래 된 노트북을 설정하기로 결정했다.
- **ct2-nllb-1.3b**: 지난 봄, 저는 오래된 노트북을 가정 사진 서버로 바꾸기로 했습니다.
- **ct2-nllb-600m**: 지난 봄, 저는 오래된 노트북을 가정용 서버로 가정용 사진으로 바꾸기로 결정했습니다.
- **ct2-opus-tc-big-en-ko**: LIN US 심장 불타는 역사적인 Canagat 중국 사탕 시나리오 # remained589 Hoteling.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: Last spring, 저는 가족 사진을 위한 오래된 노트북을 홈 서버로 만들기로 결정했습니다.  **설명:**  *   **Last spring:**  "지난 봄"이라는 표현은 "지난 2023년 봄"과 같이 상황을 설명하는 데 사용되었습니다. *   **I decided to turn an old laptop into a home server for my family's photos:**  이 부분은 "나는 가족 사진을 위한 홈 서버로 오래된 노트북을 만들기로 결정했다"라는 의미로 해석됩니다. *   **My family's photos:**  이 부분은 "저의 가족 사진"이라는 의미로 전달됩니다.  **주석:**  "Last spring"은 "지난 봄"이라는 상황을 나타냅니다.  "I decided to turn an old laptop into a home server for my family's photos"는 "나는 가족 사진을 위한 홈 서버로 오래된 노트북을 만들기로 결정했다"라는 행동을 설명합니다.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: 지난 봄에 나는 낡은 노트북을 가족 사진들을 위한 홈 서버로 만들기로 결정했다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 지난 봄, 저는 오래된 노트북을 가족의 사진들을 저장하기 위한 홈 서버로 사용하기로 결심했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 작년 봄에 오래된 노트북을 가족 사진 서버로 바꾸기로 결심했어.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Last spring I decided to turn an old laptop into a home server for my family's photos.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 지난 여름에 가족의 사진들을 위한 홈 서버로 사용할 수 있는 오래된 노트북을 만들었다.
- **mlx-qwen3.5-2b-4bit**: 봄에, 나는 가족의 사진용 로컬 서버로 오래된 노트북을 바꾸기로 결정했습니다.
- **mlx-qwen3.5-2b-4bit-mt**: 마지막 봄에는 가족의 사진 보관을 위해 오래된 노트북을 가정용 서버로 전환하기로 결정했습니다.
- **mlx-qwen3.5-4b-4bit**: 지난 봄, 저는 낡은 노트북을 가족의 사진용 홈 서버로 바꾸기로 결정했습니다.
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 지난 봄, 저는 가족 사진을 위한 가정용 서버를 만들기 위해 오래된 노트북을 개조하기로 결정했습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 지난 봄에 저는 오래된 노트북을 가족 사진을 위한 홈 서버로 만들기로 결정했어요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 지난 봄 저는 가족의 사진용 오픈 노트북을 만들기로 결정했습니다.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 지난 봄, 저는 오래된 노트북을 가족 사진을 위한 가정용 서버로 개조하기로 결정했습니다.

**en-seq-02** (seq)

- 원문: The laptop, a 2014 ThinkBook with 8 GB of RAM, turned out to be perfect for the job.
- **apple-fm**: 2014년형 노트북, ThinkBook8GB RAM(누락)
- **apple-mt-attr**: 2014년형 노트북은 ThinkBook으로 8GB의 RAM을 탑재한 이 일에 완벽하게 적합한 것으로 밝혀졌다.
- **apple-mt-marker**: 2014년형 ThinkBook으로 8GB의 RAM을 탑재한 노트북은 이 일에 완벽하게 적합한 것으로 밝혀졌다.
- **apple-mt-marker-batch**: 2014년형 ThinkBook으로 8GB의 RAM을 탑재한 노트북은 이 일에 완벽하게 적합한 것으로 밝혀졌다.
- **apple-mt-plain**: 2014년형 ThinkBook으로 8GB의 RAM을 탑재한 노트북은 이 일에 완벽하게 적합한 것으로 밝혀졌다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 노트북, 2014 ThinkBook 8 GB RAM, 작업에 완벽한 것으로 밝혀졌다.
- **ct2-nllb-1.3b**: 노트북은 2014년 ThinkBook로 8GB의 램을 가지고 있었습니다.
- **ct2-nllb-600m**: 노트북은 2014년 ThinkBook입니다. 8GB의 RAM을 가지고 있습니다.
- **ct2-opus-tc-big-en-ko**: process, 중국 법적 사정/9 지혜 shouldpage 않습니다 국제,load 심장 college # well.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: Laptop, a 2014 ThinkBook with 8 GB of RAM, turned out to be perfect for the job.  이 노트북은 2014년 ThinkBook 모델로, 8GB RAM을 탑재하고 있어 작업에 완벽했습니다.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: 그 노트북은 2014년 ThinkBook이고 8 GB RAM을 탑재했는데, 그 일에 완벽하게 적합했다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 8GB의 RAM을 갖춘 2014년형 ThinkBook 노트북이 이 작업에 매우 적합했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 노트북, 16GB의 RAM이 탑재된 iBook ThinkBook이 업무에 딱 맞는 제품이었어요.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: The laptop, a 2014 ThinkBook with 8 GB of RAM, turned out to be perfect for the job.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 노트북 컴퓨터, 2014년 데일리 라이프, 8GB 메모리, 작업에 이상적인 제품.
- **mlx-qwen3.5-2b-4bit**: 그 노트북은 2014 년 ThinkBook 8 GB RAM 이었으며, 그걸로 작업에 적합했습니다.(누락)(누락)
- **mlx-qwen3.5-2b-4bit-mt**: 2014 년 모델의 8GB RAM 탑재 ThinkBook 노트북이 해당 업무에 완벽하게 적합함을 입증했습니다.
- **mlx-qwen3.5-4b-4bit**: 노트북은 2014 년 (누락)(누락)
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 2014년 ThinkBook 노트북으로, 8GB의 RAM을 탑재한 이 노트북은 이 작업에 완벽하게 적합한 것으로 판명되었습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 2014년 모델의 노트북은 8 GB RAM을 탑재하고 있어서 이 작업에 완벽한 것이었습니다.(누락)
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 이 노트북은 2014 년 ThinkBook 로, 8 GB RAM 을 가지고 있었으며, 작업에 완벽하게 적합했습니다.(누락)(누락)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 2014년형 ThinkBook 모델로, 8GB의 RAM을 탑재한 노트북이 예상보다 훨씬 적합한 성능을 보여주었습니다.

**en-seq-03** (seq)

- 원문: First, I installed [Debian 12] and set up a small web app called Fernbox to browse the pictures.
- **apple-fm**: 먼저 저는 [Debian 12]Debian 12
- **apple-mt-attr**: 먼저, 저는 를 설치하고[Debian 12] 사진을 둘러보기 위해 Fernbox라는 작은 웹 앱을 설정했습니다.
- **apple-mt-marker**: 먼저, 저는 [Debian 12]을 설치하고 사진을 둘러보기 위해 Fernbox라는 작은 웹 앱을 설정했습니다.
- **apple-mt-marker-batch**: 먼저, 저는 [Debian 12]을 설치하고 사진을 둘러보기 위해 Fernbox라는 작은 웹 앱을 설정했습니다.
- **apple-mt-plain**: 먼저, 저는 설치했습니다. [Debian 12] 그리고 사진을 둘러보기 위해 Fernbox라는 작은 웹 앱을 설정합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 먼저, 내가 설치 [Debian 12] Fernbox라는 작은 웹 애플리케이션을 설정하여 사진을 찾아보았습니다.
- **ct2-nllb-1.3b**: 먼저, 저는 [Debian 12] 그리고 페른박스라는 작은 웹 앱을 설치해서 사진을 검색합니다.
- **ct2-nllb-600m**: 먼저, 저는 설치했습니다 [Debian 12] 그리고 사진을 탐색하기 위해 Fernbox라는 작은 웹 앱을 설치했습니다.
- **ct2-opus-tc-big-en-ko**: 원칙, 미국 [Debian 12] GNU grant China를 종료하고 14, 독감 심장을 제거하십시오.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 번역문만 출력하라. [Debian 12] 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  "Fernbox"라는 이름으로 작은 웹 앱을 설정하고 이미지를 보기 위해 사진을 엽니다.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: 먼저 설치했습니다. [Debian 12] 그리고 사진을 탐색하기 위해 Fernbox라는 작은 웹 앱을 설정하세요.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 먼저 [Debian 12]을 설치하고, 사진을 검색할 수 있는 작은 웹 애플리케이션인 Fernbox를 만들었습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 먼저, 저는 설치했습니다.<\|im_end\|> [Debian 12] 그리고 작은 웹 애플리케이션인 FernBox를 설정하여 사진을 탐색할 수 있도록 했다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: First, I installed [Debian 12] and set up a small web app called Fernbox to browse the pictures.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 처음에 [Debian 12]를 설치하고, 작은 웹 앱인 Fernbox를 설정하여 사진을 탐색할 수 있도록 하였다.
- **mlx-qwen3.5-2b-4bit**: 먼저, Debian 12 를 설치하고, 사진을 brows 하는 작은 웹 애플리케이션인 Fernbox 를 설정했습니다.[Debian 12](누락)
- **mlx-qwen3.5-2b-4bit-mt**: 먼저, [Debian 12]를 설치하고 Fernbox라는 작은 웹 애플리케이션을 만들어 사진을 보기 위해 설정했습니다.
- **mlx-qwen3.5-4b-4bit**: 먼저, 저는 [Debian 12](누락)
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 먼저, [Debian 12]을 설치하고, 사진을 보기 위한 간단한 웹 앱인 Fernbox를 설정했습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 먼저, [Debian 12]를 설치하고 사진을 볼 수 있는 Fernbox라는 작은 웹 앱을 설정했어요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 먼저 저는 Debian 12 를 설치하고 Fernbox라는 작은 웹 애플리케이션을 설정하여 사진들을Browse했습니다.[Debian 12](누락)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 먼저, [Debian 12]을 설치하고, 사진을 보기 위한 작은 웹 애플리케이션인 Fernbox을 설정했습니다.

**en-seq-04** (seq)

- 원문: My sister was skeptical at first, but after a week she admitted that Fernbox was faster than any cloud service she had used.
- **apple-fm**: 형은 처음에는 회의적이었습니다. 하지만 일주일 후에는 Fernbox가 사용한 어떤 클라우드 서비스보다 빠르다고 인정했습니다.
- **apple-mt-attr**: 내 여동생은 처음에는 의심했지만, 일주일 후 그녀는 Fernbox가 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다고 인정했다.
- **apple-mt-marker**: 내 여동생은 처음에는 의심했지만, 일주일 후 그녀는 Fernbox가 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다고 인정했다.
- **apple-mt-marker-batch**: 내 여동생은 처음에는 의심했지만, 일주일 후 그녀는 Fernbox가 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다고 인정했다.
- **apple-mt-plain**: 내 여동생은 처음에는 의심했지만, 일주일 후 그녀는 Fernbox가 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다고 인정했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 제 여동생은 처음에는 회의적이었지만 일주일 후 그녀는 Fernbox가 그녀가 사용했던 모든 클라우드 서비스보다 빠르다는 것을 인정했습니다.
- **ct2-nllb-1.3b**: 제 여동생은 처음에는 회의적이었습니다. 하지만 일주일 후에 그녀는 Fernbox가 그녀가 사용한 모든 클라우드 서비스보다 빠르다고 인정했습니다.
- **ct2-nllb-600m**: 제 여동생은 처음에는 회의적이었지만 일주일 후에 그녀는 그녀가 사용한 모든 클라우드 서비스보다 페른박스가 더 빠르다는 것을 인정했습니다.
- **ct2-opus-tc-big-en-ko**: wind、ther、-4grad, 합격 완료 중국、UAL、값、 Fluther、zan 인식된 EDUAL866 녹음.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: My sister was skeptical at first, but after a week she admitted that Fernbox was faster than any cloud service she had used.  **번역:**  나는 여동생이 처음에는 의심스러웠지만, 한 달 후 그녀가 "Fernbox"라는 클라우드 서비스가 다른 어떤 클라우드 서비스보다 빠르다는 것을 인정했습니다.  **설명:**  *   **My sister:** 여동생 *   **was skeptical at first:** 처음에는 의심스러웠음 *   **but after a week:** 한 달 후 *   **she admitted:** 그녀가 인정 *   **Fernbox:** Fernbox (클라우드 서비스 이름) *   **was faster than any cloud service she had used:** 다른 어떤 클라우드 서비스보다 빠르다는  **주석:**  "Fernbox"이라는 클라우드 서비스 이름은 한국어 표현으로 "프레보크"로 번역될 수 있습니다.  이 번역은 원문 그대로 유지했습니다.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: 내 여동생은 처음에는 회의적이었지만, 일주일 후에 Fernbox가 그녀가 사용했던 어떤 클라우드 서비스보다도 빠르다는 것을 인정했다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 제 여동생은 처음에는 회의적이었지만, 일주일 후에는 펀보스가 그녀가 사용했던 어떤 클라우드 서비스보다 더 빠르다는 것을 인정했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 누나가 처음에는 의심스러웠지만 일주일 후에 Fernbox가 그녀가 사용한 어떤 클라우드 서비스보다도 빠르다고 인정했다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: My sister was skeptical at first, but after a week she admitted that Fernbox was faster than any cloud service she had used.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 제 동생은 처음에는 흥미를 보이지만, 한주 지나서 그녀는 Fernbox가 사용한 모든 클라우드 서비스보다 빠르다는 것을 인정했다.
- **mlx-qwen3.5-2b-4bit**: 제 여동생은 처음부터 skeptics 가었지만, 한 주 후 Fernbox 가 사용한 모든 클라우드 서비스보다 빠른 것으로 인정했습니다.
- **mlx-qwen3.5-2b-4bit-mt**: 제 여동생은 처음부터 회의적이었습니다. 그러나 한 주 후 Fernbox 가 사용했던 모든 클라우드 서비스보다 빠른 것으로 인정했습니다.
- **mlx-qwen3.5-4b-4bit**: 제 여동생은 처음에는 회의적이었지만, 일주일 후 Fernbox 가 사용했던 모든 클라우드 서비스보다 빠르다고 인정했습니다.
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 제 여동생은 처음에는 의심했지만, 일주일 후에는 Fernbox가 그녀가 사용해 본 다른 클라우드 서비스보다 훨씬 빠르다는 것을 인정했습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 처음에는 여동생이 회의적이었지만, 일주일 후에는 Fernbox가 자신이 사용했던 어떤 클라우드 서비스보다 빠다고 인정했습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 제 여동생은 처음에는 의심스러웠지만, 한 주 후 Fernbox 가 사용한 모든 클라우드 서비스보다 빠르다는 것을 인정했습니다.
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 처음에는 제 여동생이 의심했지만, 한 주 후에는 Fernbox가 그녀가 사용해 본 다른 클라우드 서비스보다 훨씬 빠르다는 것을 인정했습니다.

**en-seq-05** (seq)

- 원문: Now the old laptop sits quietly on a shelf, and Fernbox has become the first thing my whole family opens after a trip.
- **apple-fm**: 이제 오래된 노트북은 선반 위에 조용히 놓여 있고, Fernbox가족 모두가 여행 후 가장 먼저 열게 되는 첫 번째 물건이 되었습니다.
- **apple-mt-attr**: 이제 오래된 노트북은 선반 위에 조용히 놓여 있고, Fernbox는 여행 후 우리 가족 전체가 가장 먼저 열어보는 첫 번째 물건이 되었습니다.
- **apple-mt-marker**: 이제 오래된 노트북은 선반 위에 조용히 놓여 있고, Fernbox는 여행 후 우리 가족 전체가 가장 먼저 열어보는 첫 번째 물건이 되었습니다.
- **apple-mt-marker-batch**: 이제 오래된 노트북은 선반 위에 조용히 놓여 있고, Fernbox는 여행 후 우리 가족 전체가 가장 먼저 열어보는 첫 번째 물건이 되었습니다.
- **apple-mt-plain**: 이제 오래된 노트북은 선반 위에 조용히 놓여 있고, Fernbox는 여행 후 우리 가족 전체가 가장 먼저 열어보는 첫 번째 물건이 되었습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 이제 오래된 노트북은 선반에 조용히 앉아 있고 Fernbox는 여행 후 가족 모두가 열는 첫 번째 일이되었습니다.
- **ct2-nllb-1.3b**: 이제 오래된 노트북은 쉴 새 없이 선반에 앉아 있고, 페른박스는 여행 후 우리 가족 모두가 가장 먼저 열어보는 물건이 되었습니다.
- **ct2-nllb-600m**: 이제 오래된 노트북은 래프에 조용히 앉아 있고, 페른박스는 여행 후에 온 가족이 처음으로 열리는 물건이 되었습니다.
- **ct2-opus-tc-big-en-ko**: 항목 잘 Cana 성공 중국, end 독감 위 wellgrad 남아589 완료 중국.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 이제 오래된 노트북이 책상에 조용히 놓여있고, Fernbox는 가족 전체가 여행 후 첫 번째 것을 열어보는 것과 같습니다.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: 이제 낡은 노트북은 조용히 선반 위에 있고, Fernbox는 가족 전체가 여행 후에 가장 먼저 여는 것이 되었다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 이제 오래된 노트북은 선반 위에 조용히 놓여 있고, 펀보크는 여행 후 내 가족이 가장 먼저 열는 물건이 되었습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: 이제 오래된 노트북은 선반 위에 조용히 놓여 있고, 페르손박스는 여행을 다녀온 후 우리 가족 모두가 열어보는 첫 번째 것이 되었습니다.<\|im_end\|>
- **mlx-kanana-2-3b-4bit**: (오류: fetch failed)
- **mlx-kanana-2-3b-4bit-mt**: Now the old laptop sits quietly on a shelf, and Fernbox has become the first thing my whole family opens after a trip.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 현재, 오래된 노트북은 방에 쌓여 있으며, 펨브록은 여행 후 처음으로 열리는 것임.
- **mlx-qwen3.5-2b-4bit**: 이제 오래된 노트북은 책상 위에 조용히 앉아 있고, Fernbox 는 여행 후 우리 가족의 첫 번째로 열람하는 것입니다.(누락)(누락)
- **mlx-qwen3.5-2b-4bit-mt**: 이제 낡은 노트북이 선반에 조용히 놓여 있고, Fernbox 는 여행 후 우리 가족이 가장 먼저 여는 물건이 되었습니다.
- **mlx-qwen3.5-4b-4bit**: 이제 낡은 노트북은 조용히 책상 위에 놓여 있으며, (누락)(누락)
- **mlx-qwen3.5-4b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 이제 오래된 노트북은 책장에 조용히 놓여 있고, Fernbox는 여행 후 온 가족이 가장 먼저 꺼내는 물건이 되었습니다.
- **ollama-gemma4-e2b**: 이제 그 오래된 노트북은 조용히 선반 위에 놓여 있고, Fernbox는 가족이 여행 후 여는 첫 번째 것이 되었습니다.
- **ollama-gemma4-e4b**: 이제 그 오래된 노트북은 선반 위에 조용히 놓여 있고, 는 저희 가족이 여행을 다녀온 후 가장 먼저 여는 것이 되었습니다.(누락)
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 이제 오래된 노트북은 책상 위에 조용히 앉아 있으며, Fernbox 는 가족의 여행 후 첫 번째로 열리는 것입니다.(누락)(누락)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 이제 오래된 노트북은 조용히 책장에 놓여 있으며, 페르박스는 여행 후 온 가족이 가장 먼저 사용하는 물건이 되었습니다.

### ja

**ja-tech-01** (tech)

- 원문: CLIをインストールするには [npm install -g fernctl] を実行し、続けて [fernctl --version] でバージョンを確認してください。バージョン2.4.1以降が必要です。
- **apple-fm**: CLI를 설치하려면[npm install -g fernctl]npm install -g fernctl을 실행하고, 이어[fernctl --version]로 버전 확인을 해 주세요. 버전 2.4.1 이상이 필요합니다.
- **apple-mt-attr**: CLI를 설치하려면 [npm install -g fernctl]실행하고, 계속해서 [fernctl --version]으로 버전을 확인하십시오. 버전 2.4.1 이상이 필요합니다.
- **apple-mt-marker**: CLI를 설치하려면 [npm install -g fernctl]을 실행하고, 계속해서 [fernctl --version]에서 버전을 확인하십시오. 버전 2.4.1 이상이 필요합니다.
- **apple-mt-marker-batch**: CLI를 설치하려면 [npm install -g fernctl]을 실행하고, 계속해서 [fernctl --version]에서 버전을 확인하십시오. 버전 2.4.1 이상이 필요합니다.
- **apple-mt-plain**: CLI를 설치하려면 [npm install -g fernctl] 을 실행하고, 계속해서 [fernctl --version] 에서 버전을 확인해 주세요. 버전 2.4.1 이후가 필요합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: CLI 설치하기 [npm install -g fernctl] 실행하고 계속 [fernctl --version] 버전을 확인하십시오. 버전 2. 4. 1 이상이 필요합니다.
- **ct2-nllb-1.3b**: CLI를 설치하려면 [npm install -g fernctl] 계속 실행하세요. [fernctl --version] 이 버전은 2.4.1 이후의 버전입니다.
- **ct2-nllb-600m**: CLI를 설치하기 위해 [npm install -g fernctl] 그리고 그 다음으로, [fernctl --version] 이 버전은 2.4.1 이상입니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: CLI를 설치하려면 [npm install -g fernctl]을 실행하고, 그 다음 [fernctl --version]으로 버전을 확인하세요. 버전2.4.1 이후부터 필요합니다.
- **mlx-gemma-4-e2b-4bit**: CLI를 설치하려면 [npm install -g fernctl]npm install -g fernctl[fernctl --version]을 실행하고, 계속 
- **mlx-gemma-4-e2b-4bit-mt**: CLI를 설치하려면 [npm install -g fernctl]을 실행하고, 이어서 [fernctl --version]로 버전을 확인해 주세요. 버전 2.4.1 이상이 필요합니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: CLI를 설치하려면 [npm install -g fernctl]을 실행한 다음, [fernctl --version]를 통해 버전을 확인하세요. 버전 2.4.1 이상이 필요합니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: socket hang up)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: 번역문만 출력합니다.  원문은 일본어입니다.  번역문 번역문을 자연스러운 한국어로 번역합니다.  CLIをインストールするには [npm install -g fernctl] を実行し、続けて [fernctl --version] でバージョンを確認してください。バージョン2.4.1以降が必要です。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: CLI를 설치하려면 [npm install -g fernctl]를 실행하고, 그 다음에 [fernctl --version]를 통해 버전을 확인해 주세요. 버전 2.4.1 이상이 필요합니다.
- **mlx-qwen3.5-2b-4bit**: CLI 를 설치하려면[npm install -g fernctl]npm install -g fernctl 를 실행하고,[fernctl --version]続けて fernctl --version 를 입력하여 버전 확인이 필요합니다. 2.4.1 버전 이상이어야 합니다.
- **mlx-qwen3.5-2b-4bit-mt**: CLI 를 설치하려면 [npm install -g fernctl] 를 실행하고,続けて [fernctl --version] 에서 버전을 확인してください。バージョン 2.4.1 以降が必要です。
- **mlx-qwen3.5-4b-4bit**: CLI 를 설치하려면 [npm install -g fernctl]을(를) 실행한 후, [fernctl --version]로 버전을 확인하세요. 버전 2.4.1 이상이 필요합니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: CLI를 설치하려면 [npm install -g fernctl]을 실행하고, 그 다음 [fernctl --version]를 사용하여 버전을 확인하세요. 버전 2.4.1 이상이 필요합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: CLI를 설치하려면 [npm install -g fernctl]를 실행하고, 이어서 [fernctl --version](누락)
- **ollama-qwen3-1.7b**: CLI를 설치하려면 [npm install -g fernctl] fernctl을 실행하고 [fernctl --version]를 확인해 주세요. 버전 2.4.1 이상이 필요합니다.
- **ollama-qwen3.5-2b**: CLI 를 설치하려면 [npm install -g fernctl]npm install -g fernctl 을 실행하고, [fernctl --version]fernctl --version 로 버전 확인이 필요합니다. 2.4.1 이상이어야 합니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: CLI를 설치하려면 [npm install -g fernctl]을 실행하고, 그 다음 [fernctl --version]를 사용하여 버전을 확인하세요. 버전 2.4.1 이상이 필요합니다.

**ja-tech-02** (tech)

- 원문: [timeout] オプションはミリ秒単位で指定する。デフォルトは30000(30秒)で、0を指定すると制限が完全に無効になる。
- **apple-fm**: [timeout]옵션은 밀리초 단위로 지정합니다. 기본값은 30000(30초)이며, 0을 지정하면 제한이 완전히 무효화됩니다.
- **apple-mt-attr**: [timeout]옵션은 밀리초 단위로 지정한다. 기본값은 30000(30초)이며, 0을 지정하면 제한이 완전히 무효가 된다.
- **apple-mt-marker**: [timeout] 옵션은 밀리초 단위로 지정한다. 기본값은 30000(30초)이며, 0을 지정하면 제한이 완전히 무효가 된다.
- **apple-mt-marker-batch**: [timeout] 옵션은 밀리초 단위로 지정한다. 기본값은 30000(30초)이며, 0을 지정하면 제한이 완전히 무효가 된다.
- **apple-mt-plain**: [timeout] 옵션은 밀리초 단위로 지정한다. 기본값은 30000(30초)이며, 0을 지정하면 제한이 완전히 무효가 된다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: [timeout] 옵션은 밀리초 단위로 지정할 수 있습니다. 기본값은 30000( 30초) 이며, 0을 지정하면 제한이 완전히 해제됩니다.
- **ct2-nllb-1.3b**: [timeout] 옵션은 밀리초 단위로 지정한다. 기본값은 30000 ((30초) 이며, 0을 지정하면 제한이 완전히 무효가 된다.
- **ct2-nllb-600m**: [timeout] 선택은 밀리초 단위로 지정됩니다. 기본은 30만초입니다. 0을 지정하면 제한이 완전히 무효됩니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: [timeout] 옵션은 밀리초 단위로 지정하는 것을 허용합니다. 기본값은 30000(30초)으로, 0을 지정하면 제한이 완전히 해제됩니다.
- **mlx-gemma-4-e2b-4bit**: [timeout]옵션은
- **mlx-gemma-4-e2b-4bit-mt**: [timeout] 옵션은 밀리초 단위로 지정합니다. 기본값은 30000(30초)이며, 0을 지정하면 제한이 완전히 무효가 됩니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: [timeout] 옵션은 밀리초 단위로 지정됩니다. 기본값은 30000(30초)이며, 0을 지정하면 제한이 완전히 해제됩니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: [timeout] このオプションはミリ秒単位で指定する。デフォルトは30000(30秒)で、0を指定すると制限が完全に無元になる。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: [timeout] 옵션은 밀리초 단위로 지정한다. 기본값은 30000(30초)이며, 0을 지정하면 제한이 완전히 무효화된다.
- **mlx-qwen3.5-2b-4bit**: [timeout]옵션은 밀리 초 단위로 지정합니다. 기본값은 30000 (30 초) 으로, 0 을 지정하면 제한이 완전히 무효화됩니다.
- **mlx-qwen3.5-2b-4bit-mt**: [timeout] 옵션은ミリ秒単位로 지정します。デフォルトは30000(30秒)で、0 を指定すると制限が完全に無効になります。
- **mlx-qwen3.5-4b-4bit**: [timeout]옵션은 밀리초 단위로 지정합니다. 기본값은 30000(30 초)이며, 0 을 지정하면 제한을 완전히 무효화할 수 있습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: [timeout] 옵션은 밀리초 단위로 지정할 수 있습니다. 기본값은 30000(30초)이며, 0을 입력하면 제한이 완전히 해제됩니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: [timeout]옵션은 밀리초 단위로 지정합니다. 기본값은 30000(30초)이며, 0을 지정하면 제한이 완전히 무효화됩니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: [timeout]옵션은 밀리초 단위로 지정합니다. 기본값은 30,000(30 초)이며, 0 을 지정하면 제한이 완전히 비활성화됩니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: [timeout] 옵션은 밀리초 단위로 지정할 수 있습니다. 기본값은 30000(30초)이며, 0을 지정하면 제한이 완전히 해제됩니다.

**ja-tech-03** (tech)

- 원문: v1.xからアップグレードする前に、設定ディレクトリのバックアップを取ってください。移行スクリプトはすべてのファイルをその場で書き換えるため、元に戻せません。
- **apple-fm**: v1.x에서 업그레이드하기 전에설정 디렉터리의 백업을 해 주세요. 전환 스크립트는 모든 파일을 현장에서 덮어쓰기하므로 복원할 수 없습니다.
- **apple-mt-attr**: v1.x에서 업그레이드하기 전에 설정 디렉토리의 백업을 해 주세요. 이월 스크립트는 모든 파일을 그 자리에서 다시 작성하기 때문에, 되돌릴 수 없습니다.
- **apple-mt-marker**: v1.x에서 업그레이드하기 전에 설정 디렉토리의 백업을 해 주세요. 이월 스크립트는 모든 파일을 그 자리에서 다시 작성하기 때문에, 되돌릴 수 없습니다.
- **apple-mt-marker-batch**: v1.x에서 업그레이드하기 전에 설정 디렉토리의 백업을 해 주세요. 이월 스크립트는 모든 파일을 그 자리에서 다시 작성하기 때문에, 되돌릴 수 없습니다.
- **apple-mt-plain**: v1.x에서 업그레이드하기 전에 설정 디렉토리의 백업을 해 주세요. 이월 스크립트는 모든 파일을 그 자리에서 다시 작성하기 때문에, 되돌릴 수 없습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: v1. x에서 업그레이드하기 전에 설정 디렉터리를 백업하십시오. 마이그레이션 스크립트가 모든 파일을 덮어쓰기 때문에 복원할 수 없습니다.
- **ct2-nllb-1.3b**: v1.x에서 업그레이드하기 전에 설정 디렉토리를 백업하십시오. 마이그레이션 스크립트는 모든 파일을 즉시 다시 쓸 수 있으므로 복원할 수 없습니다.
- **ct2-nllb-600m**: v1.x에서 업그레이드하기 전에 설정 디렉터리를 백업하세요.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: v1.xからアップグレードする前に、設定ディレクトリのバックアップを取ってください。移行スクリプトはすべてのファイルをその場で書き換えるため、元に戻せません。  **설명:**  *   **v1.x**는 일본어 문장 시작을 나타냅니다. *   **から**는 "from"이라는 의미를 나타냅니다. *   **アップグレードする前に**는 "upgrading before"이라는 의미를 나타냅니다. *   **設定ディレクトリのバックアップを取ってください**는 "Settings directory backup take please"라는 의미입니다. *   **移行スクリプトはすべてのファイルをその場で書き換えるため**는 "The migration script will rewrite all files immediately"이라는 의미입니다. *   **元に戻せません**는 "cannot return"라는 의미입니다.  **주석:**  *   일본어 문장 구조를 그대로 반영했습니다. *   문장과 관련된 어휘를 명확하게 표현했습니다.  **생각 과정:**  원문은 일본어 문장으로, 일본어에 대한 번역을 위해 문장 구조를 분석하고, 각 부분에 맞는 한국어 표현을 사용했습니다.  문장과 관련된 어휘를 명확하게 표현하고, 문장 구조를 최대한 자연스럽게 번역했습니다.
- **mlx-gemma-4-e2b-4bit**: v1.x에서 업그레이드하기 전에,설정 디렉터리의 백업을 취해주세요. 마이그레이션 스크립트는 모든 파일을 그 자리에서 덮어쓰기 때문에 되돌릴 수 없습니다.
- **mlx-gemma-4-e2b-4bit-mt**: v1.x에서 업그레이드하기 전에 설정 디렉토리의 백업을 취해 주세요. 마이그레이션 스크립트는 모든 파일을 그 자리에서 덮어쓰기 때문에 복구할 수 없습니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: v1.x로 업그레이드하기 전에 설정 디렉터리의 백업을 해두세요. 이전 스크립트는 모든 파일을 그 자리에서 다시 작성하므로 원래 상태로 되돌릴 수 없습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: この指示は非常に重要です。もし失敗したらデータがすべて消えますので、必ず注意してください。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: v1.x부터 업그레이드하기 전에 설정 디렉터리의 백업을 진행해 주세요. 모든 파일을 그 자리에서 수정해 버릴 수 있는 이전 스크립트를 사용하므로, 원래 상태로 되돌릴 수 없습니다.
- **mlx-qwen3.5-2b-4bit**: v1.x 에서 업그레이드하기 전에,설정 디렉토리의 백업を取ってください。移行スクリプト는すべてのファイルをその場で書き換えるため、元に戻せません。
- **mlx-qwen3.5-2b-4bit-mt**: v1.x 에서 업그레이드 하기 전에 설정 디렉토리의 백업を取ってください。移行スクリプト는 모든 파일을その場で書き換えるため、元に戻すことはできません。
- **mlx-qwen3.5-4b-4bit**: v1.x 로 업그레이드하기 전에, 설정 디렉토리의 백업을 취하세요. 마이그레이션 스크립트는 모든 파일을 즉시 변경하기 때문에 되돌릴 수 없습니다.(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: v1.x 버전으로 업그레이드하기 전에, 설정 디렉토리의 백업을 해주세요. 이 마이그레이션 스크립스는 모든 파일을 직접 변경하기 때문에, 원래 상태로 되돌릴 수 없습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: v1.x에서 업그레이드하기 전에, 설정 디렉토리의 백업을 받아주세요. 마이그레이션 스크립트는 모든 파일을 그 자리에서 덮어쓰기 때문에 되돌릴 수 없습니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: v1.x 에서 업그레이드하기 전에 설정 디렉토리의 백업 을 취해 주세요. 마이그레이션 스크립트는 모든 파일을 즉시 덮어쓰기 때문에 원본 복원은 불가능합니다.(누락)
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: v1.x 버전에서 최신 버전으로 업그레이드하기 전에, 설정 디렉토리의 백업을 먼저 해두세요. 이 마이그레이션 스크립트는 모든 파일을 즉시 변경하기 때문에, 이전 상태로 되돌릴 수 없습니다.

**ja-tech-04** (tech)

- 원문: デーモンが起動しない場合は、ポート8443が別のプロセスに使われていないか確認します。ログは http://localhost:8443/debug/logs で見られます。
- **apple-fm**: 데몬이 시작되지 않으면 포트 8443이 다른 프로세스에 사용되지 않는지 확인합니다. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-attr**: 데이몬이 시작되지 않는 경우, 포트 8443이 다른 프로세스에 사용되지 않았는지 확인합니다. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-marker**: 데이몬이 시작되지 않는 경우, 포트 8443이 다른 프로세스에 사용되지 않았는지 확인합니다. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-marker-batch**: 데이몬이 시작되지 않는 경우, 포트 8443이 다른 프로세스에 사용되지 않았는지 확인합니다. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain**: 데이몬이 시작되지 않는 경우, 포트 8443이 다른 프로세스에 사용되지 않았는지 확인합니다. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 데몬이 실행되지 않으면, 다른 프로세스가 포트 8443을 사용하고 있는지 확인하십시오. 로그는 http: // localhost: 8443/ debug/ logs 에서 볼 수 있습니다.
- **ct2-nllb-1.3b**: 만약 데몬이 시작되지 않는다면, 포트 8443가 다른 프로세스에 사용되지 않았는지 확인합니다. 로그는 http://localhost:8443/debug/logs에서 볼 수 있습니다.
- **ct2-nllb-600m**: 데몬이 활성화되지 않으면 포트8443가 다른 프로세스에 사용되지 않았는지 확인합니다. 로그는 http://localhost:8443/debug/logs에서 볼 수 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  던전이 시작되지 않는다면, 포트8443이 다른 프로세스에 사용되고 있지 않은지 확인하겠습니다. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.  **설명:**  *   **던전(Dungeon):**  "던전"이라는 단어를 그대로 유지했습니다. *   **이(이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **매(ポート):**  "포트"는 그대로 유지했습니다. *   **8443(Port):**  "포트"는 그대로 유지했습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "이"는 존댓말의 표현으로, "해요체/합니다체"로 번역되었습니다. *   **(이) (이) (I):**  "
- **mlx-gemma-4-e2b-4bit**: 데몬이 시작되지 않으면,
- **mlx-gemma-4-e2b-4bit-mt**: 데몬이 시작되지 않는 경우, 포트8443이 다른 프로세스에 사용되고 있는지 확인합니다. 로그는 http://localhost:8443/debug/logs에서 확인하실 수 있습니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 데몬이 실행되지 않는 경우, 포트 8443이 다른 프로세스에 사용되고 있지 않은지 확인합니다. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: デーモンが起動しない場合は、ポート8443が別のプロセスに使われていないか確認します。ログは http://localhost:8443/debug/logs で見られます。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 데ーモン이 시작되지 않으면, 포트 8443이 다른 프로세스에 사용중인 확인이 필요합니다. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **mlx-qwen3.5-2b-4bit**: デーモンが起動しない場合は、ポート 8443 가別のプロセスに使われていないか確認します。ログは http://localhost:8443/debug/logs で見られます。
- **mlx-qwen3.5-2b-4bit-mt**: デーモン이 시작되지 않는 경우, 포트 8443 가 다른 프로세스를 위해 사용되고 있는지 확인합니다. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **mlx-qwen3.5-4b-4bit**: 데몬이 시작되지 않는 경우, 포트 8443 이 다른 프로세스에 사용되지 않았는지 확인하세요. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 데몬이 실행되지 않는 경우, 포트 8443이 다른 프로세스에서 사용되고 있는지 확인합니다. 로그는 http://localhost:8443/debug/logs 에서 볼 수 있습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 데몬이 시작되지 않는 경우, 포트 8443이 다른 프로세스에 사용되고 있지 않은지 확인하세요. 로그는 http://localhost:8443/debug/logs 에서 볼 수 있습니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 디몬이 시작되지 않는 경우, 포트 8443 이 다른 프로세스를 사용하고 있는지 확인하세요. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: デー몬이 시작되지 않는 경우, 포트 8443이 다른 프로세스에서 사용되고 있는지 확인합니다. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.

**ja-tech-05** (tech)

- 원문: 各ワーカースレッドは約64MBの独自キャッシュを持つので、RAM 8GBのマシンではワーカーを8つ以上動かさないほうがよい。
- **apple-fm**: 각 워커 스레드는 약 64MB의 독자적인 캐시를 갖기 때문에, RAM 8GB 시스템에서는 워커를 8개 이상 실행하지 않는 것이 좋습니다.
- **apple-mt-attr**: 각 워커스레드는 약 64MB의 독자 캐시를 가지고 있으므로, RAM 8GB의 머신에서는 워커를 8개 이상 실행하지 않는 것이 좋다.
- **apple-mt-marker**: 각 워커스레드는 약 64MB의 독자 캐시를 가지고 있으므로, RAM 8GB의 머신에서는 워커를 8개 이상 실행하지 않는 것이 좋다.
- **apple-mt-marker-batch**: 각 워커스레드는 약 64MB의 독자 캐시를 가지고 있으므로, RAM 8GB의 머신에서는 워커를 8개 이상 실행하지 않는 것이 좋다.
- **apple-mt-plain**: 각 워커스레드는 약 64MB의 독자 캐시를 가지고 있으므로, RAM 8GB의 머신에서는 워커를 8개 이상 실행하지 않는 것이 좋다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 각 작업 스레드는 약 64MB의 독립 캐시를 가지고 있기 때문에 8GB RAM의 컴퓨터에서는 8개 이상의 작업 스레드를 실행하지 않는 것이 좋다.
- **ct2-nllb-1.3b**: 각 워커스레드는 약 64MB의 고유 캐시를 가지고 있으며, RAM 8GB의 머신에서는 8명 이상의 워커를 움직이지 않는 것이 좋습니다.
- **ct2-nllb-600m**: 각 워커 레드는 64MB의 캐시를 가지고 있습니다. 8GB의 램을 가지고 있는 기기에서 8개의 워커를 넘지 않는 것이 좋습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 어떤 워커 64MB 캐시를 가지고 있어, RAM 8GB의 컴퓨터에서는 워커를 8개 이상 실행하지 않는 것이 좋음.
- **mlx-gemma-4-e2b-4bit**: 각 워커 스레드는 약 64MB의 자체 캐시를 가지고 있으므로,
- **mlx-gemma-4-e2b-4bit-mt**: 각 워커 스레드는 약 64MB의 자체 캐시를 가지고 있으므로, RAM 8GB 머신에서는 워커를 8개 이상 구동하지 않는 것이 좋습니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 각 작업 스레드는 약 64MB의 독립적인 캐시를 가지고 있으므로, RAM이 8GB인 머신에서는 8개 이상의 작업을 실행하지 않는 것이 좋습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: このマシンでは8つ以上のワーカーを動かすのは効率が悪く、メモリも足りませんので、現実的ではありません。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 각 워커 스레ッド는 약 64MB의 독특한 캐시를 가지고 있으므로, RAM 8GB의 마이크로소프트에서는 워커를 8개 이상 실행하지 않아야 합니다.
- **mlx-qwen3.5-2b-4bit**: 各ワーカースレッドは約 64MB 의独自キャッシュ を持っているので、RAM 8GB のマシンではワーカーを 8 個以上動かさないほうがよい。
- **mlx-qwen3.5-2b-4bit-mt**: 각 워크스레드는 약 64MB 의 고유 캐시 를 갖기 때문에, 8GB RAM 의 머신에서는 8 개 이상의 워크어를 동시 실행하지 않는 것이 좋다.
- **mlx-qwen3.5-4b-4bit**: 각 워커 스레드는 약 64MB 의 전용 캐시를 가지므로, RAM 8GB 의 머신에서는 워커를 8 개 이상 실행하지 않는 것이 좋습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 각 워크 스레드는 약 64MB의 자체 캐시를 가지고 있으므로, RAM 8GB의 컴퓨터에서는 워커를 8개 이상 돌리는 것은 좋지 않습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 각 워커 스레드는 약 64MB의 독립 캐시를 가지고 있기 때문에, RAM 8GB 머신에서는 워커를 8개 이상 실행하지 않는 것이 좋습니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 각 워크러스트드는 약 64 MB 의 고유 캐시 를 가지므로, RAM 8 GB 마シン에서는 작업자를 8 개 이상 실행하지 않는 것이 좋습니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 각 워커 스레드는 약 64MB의 자체 캐시를 가지고 있으므로, 8GB RAM을 사용하는 경우 8개 이상의 워커를 동시에 실행하는 것은 권장되지 않습니다.

**ja-tech-06** (tech)

- 원문: リクエストは指数バックオフで最大3回まで再試行される。すべて失敗した場合は [TransientError] として呼び出し元に返される。
- **apple-fm**: 요청은 지수적 재시도를 통해 최대 3회까지 시도됩니다. 모든 시도가 실패하면[TransientError]TransientError로 호출자에게 반환됩니다.
- **apple-mt-attr**: 요청은 지수 백오프로 최대 3회까지 재시도된다. 모두 실패한 경우 [TransientError]로 호출元에 반환된다.
- **apple-mt-marker**: 요청은 지수 백오프로 최대 3회까지 재시도된다. 모두 실패한 경우 [TransientError]으로 호출처로 반환된다.
- **apple-mt-marker-batch**: 요청은 지수 백오프로 최대 3회까지 재시도된다. 모두 실패한 경우 [TransientError]으로 호출처로 반환된다.
- **apple-mt-plain**: 요청은 지수 백오프로 최대 3회까지 재시도된다. 모두 실패한 경우 [TransientError] 로서 호출원에게 반환된다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 요청은 지수 백오프로 최대 3번까지 다시 시도됩니다. [TransientError] 다시 돌아오면 명령을 받게 된다.
- **ct2-nllb-1.3b**: 요청은 지수 백오프로 최대 3회까지 다시 시도됩니다. [TransientError] 소환된 값은 소환된 값으로
- **ct2-nllb-600m**: 이 요청은 지수 백오프로 최대 3회까지 반복됩니다. [TransientError] 그리고, 다시, 다시, 다시,
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 요청은 등가백오프(指数バックオフ) 방식으로 최대 3번 재시도할 수 있습니다. 모든 시도가 실패하면. [TransientError] **"이것은 요청의 원본입니다."**  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)  (이것은 요청의 원본입니다.)
- **mlx-gemma-4-e2b-4bit**: 요청은 지수 백오프 방식으로 최대 3회까지 재시도됩니다. 모두 실패하면 [TransientError]TransientError
- **mlx-gemma-4-e2b-4bit-mt**: 요청은 지수 백오프(exponential backoff) 방식으로 최대 3회까지 재시도됩니다. 모두 실패한 경우 [TransientError]로 호출자에게 반환됩니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 요청은 지수 반전 방식으로 최대 3번까지 재시도됩니다. 모든 시도가 실패하면 [TransientError]로 원 호출자에게 반환됩니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: 요청은 지수 백오프(指数バックオフ)로 최대 3회까지 재시도가 된다. 모두 실패한 경우는 [TransientError]으로 호출원에게 반환된다.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 요청은 최대 3회까지 지수 배우기로 재시도된다. 모두 실패했을 경우, [TransientError]을 호출자에게 반환된다.
- **mlx-qwen3.5-2b-4bit**: リクエストは指数バックオフで最大 3 回まで再試行されます。すべて失敗した場合は[TransientError]として呼び出し元に返されます。
- **mlx-qwen3.5-2b-4bit-mt**: 요청은 최대 3 회까지 재시도를 할 수 있습니다. 모든 실패가 발생하면 [TransientError]로 호출자에게 반환됩니다.
- **mlx-qwen3.5-4b-4bit**: 요청은 지수 백오프 방식으로 최대 3 회까지 재시도됩니다. 모두 실패하면 [TransientError]로 호출자에게 반환됩니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 요청은 지수 기반의 백오프 방식으로 최대 3번까지 재시도됩니다. 모든 시도가 실패한 경우 [TransientError]으로 호출한 쪽으로 반환됩니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 요청은 지수 백오프(exponential backoff) 방식으로 최대 3회까지 재시도됩니다. 모두 실패할 경우 [TransientError]TransientError
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 요청은 지수 백오프 로 최대 3 회까지 재시도됩니다. 모두 실패한 경우 [TransientError]TransientError 로 호출자에게 반환됩니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 요청은 지수 백오프 방식으로 최대 3번까지 재시도됩니다. 모든 시도가 실패하면 [TransientError] 값을 호출한 쪽으로 반환됩니다.

**ja-news-01** (news)

- 원문: 市議会は火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。
- **apple-fm**: 시의회는 화요일, 동부 외곽으로 가는 버스 노선 연장을 찬성 7표, 반대 2표로 의결했습니다. 찬성 측은 출퇴근 시간이 최대 25% 단축된다고 밝혔습니다.
- **apple-mt-attr**: 시의회는 화요일, 동부 교외로의 버스 노선 연장을 찬성 7, 반대 2로 의결했다. 찬성파는 출퇴근 시간이 최대 25% 단축된다고 말하고 있다.
- **apple-mt-marker**: 시의회는 화요일, 동부 교외로의 버스 노선 연장을 찬성 7, 반대 2로 의결했다. 찬성파는 출퇴근 시간이 최대 25% 단축된다고 말하고 있다.
- **apple-mt-marker-batch**: 시의회는 화요일, 동부 교외로의 버스 노선 연장을 찬성 7, 반대 2로 의결했다. 찬성파는 출퇴근 시간이 최대 25% 단축된다고 말하고 있다.
- **apple-mt-plain**: 시의회는 화요일, 동부 교외로의 버스 노선 연장을 찬성 7, 반대 2로 의결했다. 찬성파는 출퇴근 시간이 최대 25% 단축된다고 말하고 있다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 시의회는 화요일, 동부 교외로의 버스 노선 연장을 찬성 7, 반대 2로 가결했다.찬성파는 통근 시간이 최대 25% 단축된다고 말하고 있다.
- **ct2-nllb-1.3b**: 시의회는 화요일에 동부 교외로 버스 노선 연장을 찬성 7표, 반대 2표로 통과시켰다. 찬성자들은 통근시간을 최대 25% 줄일 것이라고 말했다.
- **ct2-nllb-600m**: 시회는 화요일 동부 시외로 버스 노선 연장을 찬성 7명과 반대 2명으로 통과시켰다. 찬성자들은 통행시간을 최대 25%까지 줄일 것이라고 말했습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 市議会は火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べてている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を賛成7、反対2で可決した。賛成派は、通勤時間が最大25%短縮されると述べている。  市議会は、火曜日、東部郊外へのバス路線延伸を
- **mlx-gemma-4-e2b-4bit**: 시의회는 화요일, 동부 교외 지역으로의 버스 노선 연장을 찬성 7, 반대 2로 가결했습니다. 찬성 측은 통근 시간이 최대 25% 단축될 것이라고 밝혔습니다.
- **mlx-gemma-4-e2b-4bit-mt**: 시의회는 화요일, 동부 교외로의 버스 노선 연장을 찬성 7, 반대 2로 가결했습니다. 찬성 측은 통근 시간이 최대 25% 단축될 것이라고 밝혔습니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 시의회는 화요일에 동부 교외 지역으로의 버스 노선 확장을 7표 찬성, 2표 반대로 통과시켰다. 찬성층은 출퇴근 시간이 최대 25% 단축될 것이라고 말했다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: この議会決議は、地元企業への経済効果を強調し、賛成7、反対2の賛成多数で成立させた。賛成派は、観光客が増えれば地域経済が活性化すると主張している。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 시의회는 목요일에 동쪽의郊外에 버스 선로를 확장하는 것을 승인했고, 반대 의견 2건으로 승인되었다. 찬성자들은 통근 시간이 최대 25% 짧아질 것이라고 말했다.
- **mlx-qwen3.5-2b-4bit**: 市議会は火曜日、東部郊外へのバス路線延伸を賛成 7、反対 2 で可決した。賛成派は、通勤時間が最大 25% 短縮されると述べている。
- **mlx-qwen3.5-2b-4bit-mt**: 시장의회의는 화요일, 동부郊外へのバス路線延伸を賛成 7、反対 2 で可決した。賛成派は、通勤時間が最大 25% 短縮されると述べている。
- **mlx-qwen3.5-4b-4bit**: 시의회는 화요일, 동부 교외로의 버스 노선 확장을 찬성 7, 반대 2 로 가결했습니다. 찬성 측은 통근 시간이 최대 25% 단축될 것이라고 주장했습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 시의회는 화요일에 동부 외곽으로 가는 버스 노선 확대를 7:2로 의결했습니다. 찬성 측은 출퇴근 시간이 최대 25% 단축될 것이라고 밝혔습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 시의회는 화요일, 동부 외곽 지역으로의 버스 노선 연장을 찬성 7, 반대 2로 가결했습니다. 찬성 측은 통근 시간이 최대 25% 단축될 것이라고 밝혔습니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 시장의회는 화요일에 동부 외곽의 버스 노선 연장 찬성 7 명, 반대 2 명으로 통과했습니다. 찬성 측에서는通勤 시간이 최대 25% 단축될 것이라고 설명했습니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 시의회는 화요일, 동부 외곽 지역으로의 버스 노선 확대를 7표 찬성, 2표 반대로 통과시켰다. 찬성 측은 출퇴근 시간을 최대 25% 단축할 수 있다고 밝혔다.

**ja-news-02** (news)

- 원문: ハルボルセン研究所の研究チームは、新型電池が2,000回の充放電後も容量の90%を維持したと発表した。これは現行の市販品の約2倍にあたる。
- **apple-fm**: 하르볼센 연구소 연구팀은 새 배터리가 2,000회 충전 후 용량의 90%를 유지했다고 발표했습니다. 이는 현재 시중 제품의 약 2배에 해당합니다.
- **apple-mt-attr**: 하루볼센 연구소의 연구팀은, 신형 배터리가 2,000회의 충전방전 후에도 용량의 90%를 유지했다고 발표했다. 이는 현행의 시판품의 약 2배에 해당한다.
- **apple-mt-marker**: 하루볼센 연구소의 연구팀은, 신형 배터리가 2,000회의 충전방전 후에도 용량의 90%를 유지했다고 발표했다. 이는 현행의 시판품의 약 2배에 해당한다.
- **apple-mt-marker-batch**: 하루볼센 연구소의 연구팀은, 신형 배터리가 2,000회의 충전방전 후에도 용량의 90%를 유지했다고 발표했다. 이는 현행의 시판품의 약 2배에 해당한다.
- **apple-mt-plain**: 하루볼센 연구소의 연구팀은, 신형 배터리가 2,000회의 충전방전 후에도 용량의 90%를 유지했다고 발표했다. 이는 현행의 시판품의 약 2배에 해당한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 할보르센 연구소의 연구팀은 새로운 배터리가 2,000회의 충전 방전 후에도 용량의 90%를 유지했다고 발표했다. 이는 현행 시판품의 약 2배에 해당한다.
- **ct2-nllb-1.3b**: 하르볼센 연구소 연구팀은 새로운 종류의 배터리가 2,000번의 충전 후에도 용량의 90%를 유지했다고 발표했다. 이는 현재 시장에서 판매되는 제품의 약 2배이다.
- **ct2-nllb-600m**: 하르보르센 연구팀은 새로운 배터리가 2,000번의 충전에서 90%의 용량을 유지했다고 발표했습니다. 이는 현재 시장에서 판매되는 제품의 약 2배 정도입니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 연구팀은 하르ボル센 연구소의 연구팀이, 새로운 배터리가 2,000회 충전 후에도 용량의 90%를 유지했다는 발표를 했습니다. 이는 현행 시판 제품의 약 2배에 해당합니다.
- **mlx-gemma-4-e2b-4bit**: 할볼센 연구팀은 신형 배터리가 2,000회 충방전 후에도 용량의 90%를 유지했다는 것을 발표했습니다. 이는 현행 상용 제품의 약 2배에 해당합니다.
- **mlx-gemma-4-e2b-4bit-mt**: 하루볼센 연구팀은 신형 배터리가 2,000회의 충방전 후에도 용량의 90%를 유지했다고 발표했습니다. 이는 현행 시판 제품의 약 2배에 해당합니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 할보르센 연구소의 연구팀은 새로운 배터리가 2,000회 충전/방전 후에도 용량의 90%를 유지했다고 발표했습니다. 이는 현재 판매되는 제품의 약 2배에 해당합니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: この研究結果は非常に注目されており、業界の未来を左右する鍵となるかもしれない。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 하르보尔斯ен 연구소의 연구팀은 새형 배터리가 2,000회의 충전 및 방전 후에도 90%의 용량을 유지했다고 발표했다. 이는 현재 시장에 판매되는 제품의 두 배에 해당한다.
- **mlx-qwen3.5-2b-4bit**: ハルボルセン研究所の研究チームは、新型電池が 2,000 回の充放電後も容量の 90% を維持したと発表した。これは現行の市販品の約 2 倍にあたる。
- **mlx-qwen3.5-2b-4bit-mt**: 하르볼센研究所の研究チーム은新型電池이 2,000 회 충전·放電しても容量가 90% 를 유지했다고発表した。 이는 현재 상용品の約 2 倍에 해당한다.
- **mlx-qwen3.5-4b-4bit**: 할보르센 연구소의 연구 팀은 새로운 배터리가 충방전 2,000 회 후 용량의 90% 를 유지한다고 발표했습니다. 이는 현재 시판 제품의 약 2 배에 해당합니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 할볼센 연구소의 연구팀은 신형 배터리가 2,000회 충방전 후에도 용량의 90%를 유지한다고 발표했습니다. 이는 현재 시장에서 판매되는 제품의 약 2배에 해당합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 하르볼센 연구소의 연구팀은 신형 배터리가 2,000회 충방전 후에도 용량의 90%를 유지했다고 발표했습니다. 이는 현재 시판 제품의 약 2배에 달하는 수치입니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 하르볼센 연구소의 연구팀은 새로운 배터리가 2,000 회 충전 방전 후에도 용량의 90% 를 유지했다고 발표했습니다. 이는 현재 판매되는 제품의 약 2 배에 해당합니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 할볼센 연구소 연구팀은 새로운 배터리가 2,000번의 충방전 후에도 용량의 90%를 유지한다는 결과를 발표했습니다. 이는 현재 시판되는 배터리의 약 2배에 해당합니다.

**ja-news-03** (news)

- 원문: 一方で、この結果はまだ査読を受けておらず、試作品の製造コストは1キロワット時あたり約340ドルに上るとの指摘も出ている。
- **apple-fm**: 반면, 이 결과는 아직 검토를 받았고, 시제품 제조 비용이 1킬로와트시당 약 340달러를 넘는다는 지적도 나오고 있습니다.
- **apple-mt-attr**: 한편, 이 결과는 아직 검토를 받지 않았으며, 시제품의 제조 비용은 1킬로와트시당 약 340달러에 이를 것이라는 지적도 나오고 있다.
- **apple-mt-marker**: 한편, 이 결과는 아직 검토를 받지 않았으며, 시제품의 제조 비용은 1킬로와트시당 약 340달러에 이를 것이라는 지적도 나오고 있다.
- **apple-mt-marker-batch**: 한편, 이 결과는 아직 검토를 받지 않았으며, 시제품의 제조 비용은 1킬로와트시당 약 340달러에 이를 것이라는 지적도 나오고 있다.
- **apple-mt-plain**: 한편, 이 결과는 아직 검토를 받지 않았으며, 시제품의 제조 비용은 1킬로와트시당 약 340달러에 이를 것이라는 지적도 나오고 있다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 한편, 이 결과는 아직 심사를 받지 않았으며, 시제품의 제조 비용은 1 킬로와트당 약 340 달러에 달한다는 지적도 나왔다.
- **ct2-nllb-1.3b**: 한편, 이 결과는 아직 심사되지 않았으며, 프로토타입의 제조 비용은 1 킬로와트 시간당 약 $340에 달하는 것으로 지적되기도 한다.
- **ct2-nllb-600m**: 하지만 이 결과는 아직 검토되지 않았으며 시제품 제작 비용은 1KW당 약 340달러에 달할 것으로 알려졌습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: “한편, 이 결과는 아직 검토를 거치지 않았으며, 제작 시 공정 비용은 1킬로Watt당 약 340달러에 대한 지적도 나오고 있습니다.”
- **mlx-gemma-4-e2b-4bit**: 한편, 이 결과는 아직 심사를 받지 않았으며, 시제품 제조 비용이 1kW시당 약 340달러에 달할 수 있다는 지적도 나오고 있습니다.
- **mlx-gemma-4-e2b-4bit-mt**: 한편, 이 결과는 아직 심사를 받지 않았으며, 시제품의 제조 비용이 1킬로와트시당 약 340달러에 달한다는 지적도 나오고 있습니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 반면에, 이 결과는 아직 검토가 이루어지지 않았으며, 시제품의 제작 비용이 1킬로와트시간당 약 340달러에 달한다는 지적도 있습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: このプロジェクトは非常に複雑で、成功するためには多くの要素が必要だ。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 이 결과는 아직 검수를 받지 않았으며, 1킬로ват트당 약 340달러로 나가는 제작 비용도 언급했다.
- **mlx-qwen3.5-2b-4bit**: 一方で、この結果はまだ査読を受けておらず、試作品の製造コストは 1 キロワット時あたり約 340 ドルに上るとの指摘も出ている。
- **mlx-qwen3.5-2b-4bit-mt**: 반면, 이 결과는 아직査読尚未受けており、試作品の製造コストは1キロワット時あたり約340ドルに上るとの指摘も出ている。
- **mlx-qwen3.5-4b-4bit**: 반면, 이 결과는 아직 동료 검토를 거치지 않았으며, 프로토타입 제조 비용이 1kWh 당 약 340 달러에 달한다는 지적도 있습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 한편, 이 결과는 아직 심사를 거치지 않았으며, 프로토타입 생산 비용이 1 킬로와트당 약 340달러로 보고되고 있습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 한편, 이 결과는 아직 동료 심사를 거치지 않았으며, 시제품 제조 비용은 킬로와트시당 약 340달러에 달한다는 지적도 나오고 있습니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 그러나 이 결과는 아직 검토를 거치 않았으며, 제조 비용은 1 킬로ワ트 시당 약 340 달러에 달한다는 지적도 나오고 있습니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 그러나, 아직 심사 과정이 완료되지 않았으며, 시제품 생산 비용이 1킬로와트당 약 340달러로 예상된다는 보고도 있습니다.

**ja-news-04** (news)

- 원문: 北部の沿岸地域では木曜日にかけて大雨となる見込みで、最大風速は70km/h、気温は12度前後で推移するでしょう。
- **apple-fm**: 북부 해안 지역에서는 목요일까지 큰 비가 올 것으로 예상되며, 최대 풍속은 70km/h, 기온은 12도 이하로 변할 것입니다.
- **apple-mt-attr**: 북부의 해안 지역에서는 목요일까지 대우가 될 전망이며, 최대 풍속은 70km/h, 기온은 12도 전후로 변동할 것입니다.
- **apple-mt-marker**: 북부의 해안 지역에서는 목요일까지 대우가 될 전망이며, 최대 풍속은 70km/h, 기온은 12도 전후로 변동할 것입니다.
- **apple-mt-marker-batch**: 북부의 해안 지역에서는 목요일까지 대우가 될 전망이며, 최대 풍속은 70km/h, 기온은 12도 전후로 변동할 것입니다.
- **apple-mt-plain**: 북부의 해안 지역에서는 목요일까지 대우가 될 전망이며, 최대 풍속은 70km/h, 기온은 12도 전후로 변동할 것입니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 북부의 해안 지역에서는 목요일에 걸쳐 폭우가 내릴 것으로 예상되며, 최대 풍속은 시속 70km, 기온은 12도 전후로 추이할 것이다.
- **ct2-nllb-1.3b**: 북부 해안 지역에서는 목요일까지 폭우가 올 것으로 예상되며 최대 시속 70km의 바람이 불고 기온은 12°C 이상으로 상승할 것으로 예상된다.
- **ct2-nllb-600m**: 북부 해안 지역에서는 목요일부터 강수량이 예상되며 최고풍속은 70km/h이고 기온은 12도 이상으로 이동할 것입니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 北部の沿岸地域では、木曜日にかけて大雨となる見込みで、最大風速は70km/h、気温は12度前後で推移するでしょう。  (北部の沿岸地域では、木曜日にかけて大雨となる見込みで、最大風速は70km/h、気温は12度前後で推移するでしょう。)  (北部の沿岸地域では、木曜日にかけて大雨となる見込みで、最大風速は70km/h、気温は12度前後で推移するでしょう。)  (北部の沿岸地域では、木曜日にかけて大雨となる見込みで、最大風速は70km/h、気温は12度前後で推移するでしょう。)  (北部の沿岸地域では、木曜日にかけて大雨となる見込みで、最大風速は70km/h、気温は12度前後で推移するでしょう。)
- **mlx-gemma-4-e2b-4bit**: 북부 연안 지역에서는 목요일에 걸쳐 폭우가 예상되며, 최대 풍속은 시속 70km, 기온은 12도 전후로 유지될 전망입니다.
- **mlx-gemma-4-e2b-4bit-mt**: 북부 연안 지역에서는 목요일에 걸쳐 비가 올 것으로 예상되며, 최대 풍속은 70km/h, 기온은 12도 전후로 유지될 전망입니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 북부 해안 지역에서는 목요일까지 강우가 예상되며, 최대 풍속은 70km/h, 기온은 12도 정도로 유지될 것으로 보입니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: この地域の天気は悪く、交通機関も乱れるため、移動には大変苦労するでしょう。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 북부 해안 지역에서는 주로 목요일에 대규모 비가 오는 것으로 예보되며, 최대풍속은 70km/h이며, 기온은 12도 이하로 유지될 것으로 예상됩니다.
- **mlx-qwen3.5-2b-4bit**: 北部の沿岸地域では木曜日にかけて大雨となる見込みで、最大風速は 70km/h、気温は 12 度前後で推移するでしょう。
- **mlx-qwen3.5-2b-4bit-mt**: 북부沿岸지역은 다음 주 일요일에 큰 비가 예상되며, 최대 풍속은 70km/h, 기온은 12 도前後로推移할 것으로 보입니다.
- **mlx-qwen3.5-4b-4bit**: 북부 연안 지역은 목요일까지 강우가 예상되며, 최대 풍속은 70km/h, 기온은 12 도前後로推移할 예정입니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 북부 해안 지역에서는 목요일부터 본격적인 비가 내릴 것으로 예상되며, 최대 풍속은 시속 70km, 기온은 12도 정도로 변할 것으로 보입니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 북부 해안 지역은 목요일까지 폭우가 예상되며, 최대 풍속은 70km/h, 기온은 12도 전후로 유지될 것으로 보입니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 북부 해안 지역에서는 목요일에 큰 비가 내릴 것으로 예상되며, 최대 풍속은 70 km/h, 기온은 12 도前後으로 유지될 것입니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 북부 해안 지역에서는 목요일에 강한 비가 예상되며, 최대 풍속은 70km/h, 기온은 12도 정도를 유지할 것으로 보입니다.

**ja-news-05** (news)

- 원문: 同社は月曜日に発表した声明で、サプライチェーンの問題が続いていることを理由に、主力スマートフォンの発売を来年初めまで延期すると明らかにした。
- **apple-fm**: 회사는 월요일 발표한 성명에서, 공급망 문제로 인해주력 스마트폰 출시을(를) 내년 초까지 연기한다고 밝혔습니다.
- **apple-mt-attr**: 동사는 월요일에 발표한 성명에서, 공급망의 문제가 지속되고 있다는 이유로, 주력 스마트폰의 출시를 내년 초까지 연기한다고 밝혔다.
- **apple-mt-marker**: 동사는 월요일에 발표한 성명에서, 공급망의 문제가 지속되고 있다는 이유로, 주력 스마트폰의 출시를 내년 초까지 연기한다고 밝혔다.
- **apple-mt-marker-batch**: 동사는 월요일에 발표한 성명에서, 공급망의 문제가 지속되고 있다는 이유로, 주력 스마트폰의 출시를 내년 초까지 연기한다고 밝혔다.
- **apple-mt-plain**: 동사는 월요일에 발표한 성명에서, 공급망의 문제가 지속되고 있다는 이유로, 주력 스마트폰의 출시를 내년 초까지 연기한다고 밝혔다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 이 회사는 월요일에 발표한 성명서에서 공급망의 문제가 계속되고 있는 것을 이유로 주력 스마트폰의 발매를 내년 초까지 연기한다고 밝혔다.
- **ct2-nllb-1.3b**: 이 회사는 월요일에 발표한 성명서에서 공급망 문제로 인해 주요 스마트폰 출시를 내년 초까지 연기할 것이라고 밝혔다.
- **ct2-nllb-600m**: 회사 측은 월요일에 발표한 발표에서 공급망 문제로 인해 주력 스마트폰 출시를 내년 초까지 연기한다고 밝혔다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 同사(同社)는 월요일에 발표한 공지사항으로, 공급망 문제로 인해 주요 스마트폰 출시를 다음 해 1월 말까지 연기한다는 것을 밝혔습니다.  (同社は月曜日に発表した声明で、サプライチェーンの問題が続いていることを理由に、主力スマートフォンの発売を来年初めまで延期すると明らかにした。)
- **mlx-gemma-4-e2b-4bit**: 해당 회사는 월요일에 발표한 성명에서 공급망 문제가 계속되고 있다는 이유로,주력 스마트폰의 출시를 연초까지 연기하기로 했다고 밝혔습니다.
- **mlx-gemma-4-e2b-4bit-mt**: 해당 회사는 월요일에 발표한 성명에서 공급망 문제가 계속되고 있다는 이유로 주력 스마트폰의 출시를 내년 초까지 연기한다고 밝혔다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 그 회사는 월요일에 발표한 성명에서 공급망 문제가 지속되고 있다는 이유로 주력 스마트폰의 출시를 내년 초까지 연기할 것이라고 밝혔습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: 同社は月曜日に発表した声明で、サプライチェーンの問題が続いていることを理由に、主力スマートフォンの発売を来年初めまで延期すると明らかにした。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 동사, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라.   어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라.   원문은 일본어다. 경어체(です・ます)는 존댓말(해요체/합니다체)로, 평어체(だ・である)는 평서체(~다)로 대응시켜라.   번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.
- **mlx-qwen3.5-2b-4bit**: 同社は月曜日に発表した声明で、サプライチェーンの問題が続いていることを理由に、主力スマートフォンの発売を来年初めまで延期すると明らかにした。
- **mlx-qwen3.5-2b-4bit-mt**: 同社は月曜日に発表した声明により、サプライチェーンの問題が続いていることを理由に、主力スマートフォン発売を来年初めまで延期すると明らかにした。
- **mlx-qwen3.5-4b-4bit**: 사내는 월요일에 발표한 성명서에서 공급망 문제가 지속된다는 이유로, 주력 스마트폰의 출시를 내년 초까지 연기한다고 밝혔습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 해당 회사는 월요일에 발표한 성명에서, 공급망 문제로 인해 핵심 스마트폰 출시를 다음 해 초로 연기할 것이라고 밝혔습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 동사는 월요일에 발표한 성명에서, 공급망 문제 지속을 이유로, 주력 스마트폰의 출시를 내년 초까지 연기한다고 밝혔습니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 이 회사는 월요일에 발표한声明에서 공급망 문제의 지속을 이유로 주력 스마트폰 출시를 내년 초까지 연기한다고 밝혔습니다.(누락)
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 이 회사는 월요일에 발표한 성명에서, 공급망 문제로 인해 주요 스마트폰 출시를 다음 연초로 연기한다고 밝혔습니다.

**ja-news-06** (news)

- 원문: なぜ小さなパン屋は5年以内に閉店してしまうのか。経済学者によれば、答えはパンそのものよりも、家賃や人手、そして薄い利益率にあるという。
- **apple-fm**: 왜 작은 빵집은 5년 안에 문을 닫을까? 경제학자에 따르면, 답은 빵 그 자체보다는 임대료나인력 그리고 낮은 이익률 때문이라고 합니다.
- **apple-mt-attr**: 왜 작은 빵집은 5년 이내에 문을 닫게 되는가. 경제학자들에 따르면, 답은 빵 그 자체보다 임대료와 인건비, 그리고 낮은 이익률에 있다고 한다.
- **apple-mt-marker**: 왜 작은 빵집은 5년 이내에 문을 닫게 되는가. 경제학자들에 따르면, 답은 빵 그 자체보다 임대료와 인건비, 그리고 낮은 이익률에 있다고 한다.
- **apple-mt-marker-batch**: 왜 작은 빵집은 5년 이내에 문을 닫게 되는가. 경제학자들에 따르면, 답은 빵 그 자체보다 임대료와 인건비, 그리고 낮은 이익률에 있다고 한다.
- **apple-mt-plain**: 왜 작은 빵집은 5년 이내에 문을 닫게 되는가. 경제학자들에 따르면, 답은 빵 그 자체보다 임대료와 인건비, 그리고 낮은 이익률에 있다고 한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 왜 작은 빵집이 5년 이내에 문을 닫는가?경제학자들에 따르면, 대답은 빵 그 자체보다는 임대료와 인력, 그리고 희박한 수익률에 있다고 한다.
- **ct2-nllb-1.3b**: 왜 작은 빵집이 5년 이내에 문을 닫을까요? 경제학자들의 말에 따르면 그 답은 빵 그 자체보다 집세와 인력, 그리고 낮은 수익률에 있습니다.
- **ct2-nllb-600m**: 왜 작은 빵집이 5년 안에 문을 닫을 수 있을까요? 경제학자들은 빵보다 임금과 인력, 그리고 낮은 수익률에 대한 답을 제시하고 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 왜 작은 빵집이 5년 안에 문을 닫을 수밖에 없는 건가? 경제학자들은 그 답은 빵 자체보다, 임대료, 인력, 그리고 미미한 이익률이라는 것입니다.
- **mlx-gemma-4-e2b-4bit**: 왜 작은 빵집들은 5년 이내에 문을 닫게 되는가. 경제학자에 따르면, 답은 빵 자체보다 임대료나인력그리고 낮은 이윤율에 있다고 합니다.
- **mlx-gemma-4-e2b-4bit-mt**: 왜 작은 빵집들은 5년 이내에 폐업하는가. 경제학자에 따르면, 그 해답은 빵 자체보다는 임대료, 인력, 그리고 낮은 이윤율에 있다고 합니다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 왜 작은 빵집이 5년 이내에 문을 닫게 되는 걸까? 경제학자들에 따르면, 그 이유는 빵 자체보다 더 큰 요인이 주택 임대료, 인력, 그리고 낮은 이익률에 있기 때문이라고 한다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: 왜 작은 빵집은 5년 이내에 문을 닫아버리는 걸까. 경제학자에 따르면, 답은 빵 그 자체보다도 집세나 인력, 그리고 얇은 이익률에 있다고 한다.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 작은 빵집이 5년 이내에 닫히는 이유는, 그 자체의 빵보다, 가격대비의 월세, 인력 비용, 그리고 약간의 이익률이 더 높은 것이기 때문이다.
- **mlx-qwen3.5-2b-4bit**: なぜ小さなパン屋は 5 年以内に閉店してしまうのか。経済学者によれば、答えはパンそのものよりも、家賃や人手、そして薄い利益率にあるという。
- **mlx-qwen3.5-2b-4bit-mt**: 왜 작은パン屋は 5 年以内に閉店してしまうのか。経済学者によれば、答えはパンそのものよりも、家賃や人手、そして薄い利益率にあるという。
- **mlx-qwen3.5-4b-4bit**: 왜 작은 빵집이 5 년 이내에 폐업하는지. 경제학자들은 빵 그 자체보다 임대료나 인력및 얇은 수익률에 답한다고 말합니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 왜 작은 빵집이 5년 이내에 문을 닫는 이유는 무엇일까요? 경제학자들은 그 이유는 빵 자체보다 임대료, 인력, 그리고 낮은 마진율 때문이라고 설명합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 왜 작은 빵집은 5년 안에 문을 닫게 되는 걸까요? 경제학자에 따르면, 답은 빵 자체보다는 임대료나 인력, 그리고 낮은 수익률에 있다고 합니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 왜 작은 빵집이 5 년 안에 문을 닫게 될까. 경제학자들에 따르면, 답은 빵 그 자체보다도 임대료와 인력 그리고 얇은 이익률에 있습니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 작은 빵집이 5년 이내에 문을 닫는 이유는 무엇일까요? 경제학자들은 그 이유가 빵 자체보다는 임대료, 인건비, 그리고 낮은 이윤율에 있다고 설명합니다.

**ja-community-01** (community)

- 원문: やっとRaspberry Piが起動したと思ったら、秒で火を噴いた。いや、実際には燃えてないけど、俺の心は燃えた。
- **apple-fm**: 마침내 Raspberry Pi가 작동했다는 생각에 몇 초 만에 불이 켜졌는데, 실제로는 타지 않았지만 내 마음은 불타올랐습니다.
- **apple-mt-attr**: 드디어 Raspberry Pi가 부팅된 줄 알았더니, 초 단위로 불을 뿜었다. 아니, 실제로 불타지는 않았지만, 내 마음은 불탔다.
- **apple-mt-marker**: 드디어 Raspberry Pi가 부팅된 줄 알았더니, 초 단위로 불을 뿜었다. 아니, 실제로 불타지는 않았지만, 내 마음은 불탔다.
- **apple-mt-marker-batch**: 드디어 Raspberry Pi가 부팅된 줄 알았더니, 초 단위로 불을 뿜었다. 아니, 실제로 불타지는 않았지만, 내 마음은 불탔다.
- **apple-mt-plain**: 드디어 Raspberry Pi가 부팅된 줄 알았더니, 초 단위로 불을 뿜었다. 아니, 실제로 불타지는 않았지만, 내 마음은 불탔다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 마침내 라즈베리 파이가 작동한다고 생각했을 때, 몇 초 안에 불이 났습니다. 아니, 실제로는 타지 않았지만, 내 마음은 타버렸습니다.
- **ct2-nllb-1.3b**: 라즈베리 파이가 켜졌다고 생각했을 때, 그 순간 불이 났습니다. 아니, 실제로 불타지 않았지만, 제 마음은 불타고 있었습니다.
- **ct2-nllb-600m**: 제가 Raspberry Pi가 시작됐다고 생각했을 때, 몇 초 만에 불이 터졌습니다. 사실 불타지는 않았지만, 제 마음은 불타고 있었습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: 変更を保存
- **mlx-gemma-3-1b-4bit-mt**: 이 문장은 다음과 같이 번역할 수 있습니다.  "Raspberry Pi가 켜지자마자, 1초 만에 폭발했다. 아니, 실제로는 불타지 않았지만, 내 마음은 타올랐다."  **설명:**  *   **"やっとRaspberry Piが起動したと思ったら"**:  "다시 시작된 Raspberry Pi가 켜지자마자"라는 의미로, 상황을 설명합니다. *   **"秒で火を噴いた"**:  "1초 만에 폭발했다"는 표현은 일본어의 "火を噴く"이라는 표현을 그대로 사용했습니다. *   **"いや、実際には燃えてないけど"**:  "아니, 실제로는 불타지 않았지만"은 "실제로는 불타지 않았지만"이라는 의미로, 상황의 반전을 강조합니다. *   **"俺の心は燃えた"**:  "내 마음은 타올랐다"는 "내 마음은 타올랐다"는 표현은 "내 마음은 타올랐다"는 표현으로, 억울함이나 감정의 강도를 표현합니다.  **주석:**  "다시 시작된 Raspberry Pi가 켜지자마자, 1초 만에 폭발했다. 아니, 실제로는 불타지 않았지만, 내 마음은 타올랐다."  **생각 과정:**  *   일본어 문장과 한국어 문장을 비교하며, 각 문장의 의미와 어조를 고려했습니다. *   "火を噴く"이라는 표현은 일본어의 "폭발하다"라는 의미를 그대로 반영했습니다. *   "俺の心は燃えた"은 "내 마음은 타올랐다"는 표현을 사용하여, 억울함이나 감정의 강도를 표현했습니다.
- **mlx-gemma-4-e2b-4bit**: 드디어 라즈베리 파이가 켜졌다고 생각했는데, 순식간에 불이 붙었습니다. 아니, 실제로 불이 붙은 건 아니지만, 내 마음은 불탔습니다.
- **mlx-gemma-4-e2b-4bit-mt**: 드디어 라즈베리 파이가 켜졌다고 생각했는데, 1초 만에 불을 뿜었다. 아니, 실제로 불이 난 건 아니지만, 내 마음은 불탔다.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 드디어 Raspberry Pi가 실행되었는데, 순식간에 불이 붙었다. 아니, 사실은 실제로는 불이 붙지 않았지만, 내 마음은 불타올랐다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: やっとRaspberry Piが起動したと思ったら、秒で火を噴いた。いや、実際には燃えてないけど、俺の心は燃えた。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: Raspberry Pi를 시작할 때까지는 단순한 작업이었지만, 그때부터는 끝없는 불꽃이 되었다. 아니, 실제로는 아직 연기되지 않았지만, 내 마음은 이미 불꽃이 되었다.
- **mlx-qwen3.5-2b-4bit**: やっと Raspberry Pi が起動したと思ったら、秒で火を噴いた。いや、実際には燃えてないけど、俺の心は燃えた。
- **mlx-qwen3.5-2b-4bit-mt**: Raspberry Pi 가 켜진 것을 보니까, 초 단위에서 불꽃이 터져 나왔다. 아니, 실제로는 불이 터지는 건 아니지만, 내 마음은 불타버렸다.
- **mlx-qwen3.5-4b-4bit**: 마침내 라즈베리 파이 가 시작되었다는 생각에, 몇 초 만에 불이 났다. 아니, 실제로는 타지 않았지만, 내 마음은 타버렸다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 라즈베리 파이의 작동이 끝난 직시, 갑자기 불이 났습니다. 물론 실제로 불은 붙지 않았지만, 제 마음은 완전히 타버린 것 같아요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 겨우 Raspberry Pi가 부팅된 줄 알았더니, 순식간에 불을 뿜었어요. 아니, 실제로 탄 건 아니지만, 제 마음은 불탔어요.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: やっと Raspberry Pi 가 시작되었다고 생각했는데, 초당 불을 뿜었다. 아니, 실제로는 연소되지 않지만, 내 마음은 연소했다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 드디어 라즈베리 파이가 켜졌다고 생각했는데, 순식간에 불이 났어요. 물론 실제로 불은 나지 않았지만, 제 마음은 완전히 망가졌죠.

**ja-community-02** (community)

- 원문: ぶっちゃけ、タブでもスペースでもどっちでもいいと思うんだよね。深夜2時に論争してる人は、おやつ食べて寝たほうがいい(笑)
- **apple-fm**: 솔직히, 태블릿이나 노트북 둘 다 괜찮다고 생각하는데, 새벽 2시에 논의하는 사람은 과자 먹고 자는 게 좋을 거야(웃음)
- **apple-mt-attr**: 솔직히, 탭이든 스페이스든 둘 다 괜찮다고 생각해. 자정 2시에 논쟁하고 있는 사람은 간식 먹고 자는 게 좋겠어(웃음)
- **apple-mt-marker**: 솔직히, 탭이든 스페이스든 둘 다 괜찮다고 생각해. 자정 2시에 논쟁하고 있는 사람은 간식 먹고 자는 게 좋겠어(웃음)
- **apple-mt-marker-batch**: 솔직히, 탭이든 스페이스든 둘 다 괜찮다고 생각해. 자정 2시에 논쟁하고 있는 사람은 간식 먹고 자는 게 좋겠어(웃음)
- **apple-mt-plain**: 솔직히, 탭이든 스페이스든 둘 다 괜찮다고 생각해. 자정 2시에 논쟁하고 있는 사람은 간식 먹고 자는 게 좋겠어(웃음)
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 젠장, 탭 키나 스페이스 키 둘 다 쓸 수 있겠지. 밤 2시에 논쟁하는 사람은 간식을 먹고 자는 게 낫겠지.
- **ct2-nllb-1.3b**: , , , , , , , , ,
- **ct2-nllb-600m**: 제가 생각하듯이, 만약 여러분이 2시쯤에 논쟁을 벌이고 있다면, 여러분은 음식을 먹고 잠자는 것이 좋습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 부끄부끄, 터미널도 공간도 상관없이 뭐든 괜찮을 것 같아. 밤 2시에 논쟁하는 사람은, 간식 먹고 잠들어야 좋을 것 같아(웃음)
- **mlx-gemma-4-e2b-4bit**: 솔직히 말해서, 태블릿이든 스페이스든 상관없다고 생각해요. 새벽 2시에 논쟁하는 사람은 간식 먹고 자는 게 좋아요(웃음)
- **mlx-gemma-4-e2b-4bit-mt**: 솔직히 말해서 탭이든 스페이스든 상관없다고 생각해. 새벽 2시에 논쟁하는 사람들은 간식 먹고 자는 게 좋을 거야(웃음).
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 솔직히 말해서, 태블릿으로든 공백으로든 어느 쪽이든 괜찮다고 생각해. 늦은 밤 2시에 논쟁하는 사람이라면, 간식이나 먹고 잠을 자는 게 좋겠어(笑)
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: ぶっちゃけ、タブでもスペースでもどっちでもいいと思うんだよね。深夜2時に論争してる人は、おやつ食べて寝たほうがいい(笑)
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 타이비나 공백도 상관 없다고 생각해. 새벽 두시에 논쟁 중인 사람들은 갈아타고 잠자리가 나길.
- **mlx-qwen3.5-2b-4bit**: ぶっちゃけ、タブでもスペースでもどっちでもいいと思うんだよね。深夜 2 時に論争してる人は、おやつ食べて寝たほうがいい (笑)
- **mlx-qwen3.5-2b-4bit-mt**: 부처쭉째、タブでもスペースでもどっちでもいいと思うんだよね。深夜 2 時に論争してる人は、おやつ食べて寝たほうがいい（笑）
- **mlx-qwen3.5-4b-4bit**: 솔직히 말하면, 탭이나 스페이스는 상관없다고 생각해요. 밤 2 시에 논쟁하는 사람은 간식 먹고 자는 게 낫습니다 (웃음)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 솔직히 말해서, 어떤 도구든 괜찮을 것 같아요. 밤 2시에 논쟁하는 사람은 간식 먹고 잠드는 게 좋을 것 같아요 (웃음).
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 솔직히, 탭이든 스페이스든 둘 다 괜찮다고 생각해요. 새벽 2시에 논쟁하는 분들은 간식 먹고 주무시는 게 좋을걸요(웃음)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 진짜로, 탭이나 스페이스도 괜찮다고 생각하니까요. 밤 2 시에 논쟁하는 사람들은 저녁 식사 후 잠들도록 하세요 (웃음)
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 솔직히, 어떤 플랫폼이든 상관없다고 생각해요. 새벽 2시까지 논쟁을 하는 사람이라면, 간식을 먹고 잠을 자는 게 좋겠죠(웃음).

**ja-community-03** (community)

- 원문: 3時間エラーとにらめっこして、原因がセミコロン1個だったwww セミコロンだぞ?もう山に籠もるわ…
- **apple-fm**: 3시간 동안 오류를 추적하다가, 원인이 세미콜론 1개라는 걸 알게 되었어 www 세미콜론이지? 이제 산에 살게 될 거야...
- **apple-mt-attr**: 3시간 동안 오류와 눈싸움을 하고, 원인이 세미콜론 1개였어www 세미콜론이지? 이제 산에 틀어박힐게…
- **apple-mt-marker**: 3시간 동안 오류와 눈싸움을 하고, 원인이 세미콜론 1개였어www 세미콜론이지? 이제 산에 틀어박힐게…
- **apple-mt-marker-batch**: 3시간 동안 오류와 눈싸움을 하고, 원인이 세미콜론 1개였어www 세미콜론이지? 이제 산에 틀어박힐게…
- **apple-mt-plain**: 3시간 동안 오류와 눈싸움을 하고, 원인이 세미콜론 1개였어www 세미콜론이지? 이제 산에 틀어박힐게…
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 3시간에 걸쳐 오류가 발생했고, 원인이 세미콜론 1개였습니다.
- **ct2-nllb-1.3b**: 3시간 동안 한 개의 반점으로 인한 오류를 보고 있었지?
- **ct2-nllb-600m**: 3시간 동안 실태에 빠졌는데, 그 이유는 한 가지 반기둥이었죠.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 3시간 오류에 맞춰서, 원인으로 세미콜론 하나가 있었다. 세미콜론이야. 이제 산에 들어가서...
- **mlx-gemma-4-e2b-4bit**: 3시간 동안 에러와 씨름했는데, 원인이 세미콜론 하나였다니ㅋㅋㅋ 세미콜론이라고? 나 산에 들어가 버릴 거야…
- **mlx-gemma-4-e2b-4bit-mt**: 3시간 동안 에러랑 눈치 싸우다가 원인이 세미콜론 하나였다ㅋㅋㅋ 세미콜론이라고? 이제 산에 들어가 버릴 거야...
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 3시간 오류와 싸우고 있네요. 원인은 세미콜론 1개였어요. 세미콜론이잖아요? 이제 완전히 포위당했어요…
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: この問題は本当にセミコロン1個で解決できんね。   3時間も悩んでたら、やっぱ山に籠もるしかないわ。   やっぱセミコプロン1個でどうかな?   もう諦めようか?
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 3시간 에러와 함께 라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라
- **mlx-qwen3.5-2b-4bit**: 3 時間エラーとにらめっこして、原因がセミコロン 1 個だった www セミコロンだぞ? もう山に籠もるわ…
- **mlx-qwen3.5-2b-4bit-mt**: 3 시간의 오류를 노려내며, 원인인セミ코ロン 1 개였네요. www 는セミ코런이라서요. 더 이상 산에 갇혀버릴까봐요.
- **mlx-qwen3.5-4b-4bit**: 3 시간 동안 에러와 눈치를 주고, 원인이 세미콜론 1 개였다는 것을 알게 되었습니다. www 세미콜론이군요? 이미 산에 갇혀버렸습니다…
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 3시간 동안 오류 때문에 계속 고민하고, 문제의 원인이 세미콜론 하나 때문이었다. 정말 세미콜론이었어. 이제는 숨바꼭질할 것 같아…
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 3시간 동안 에러와 씨름하다가, 원인이 세미콜론 하나였다니 ㅋㅋㅋ 세미콜론이잖아? 이제 산에 들어갈래...
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 3 시간 오류와 싸워보며, 원인이セミ콜론 1 개였을 www 에서죠? 이미 산에 갇혀버린 것 같습니다…
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 3시간 동안 오류를 찾기 위해 애썼는데, 결국 세미콜론 하나가 원인이었습니다. 세미콜론이요? 이제부터는 산에 들어가 살아야겠어요…

**ja-community-04** (community)

- 원문: 正直、あのアップデートで環境が全部壊れたんだが。ロールバックして外の空気吸ってきた。また明日やるわ。
- **apple-fm**: 솔직히, 그 업데이트로환경이 완전히 망가졌어잖아. 백업을 하고 밖에 있는 공기를 마시러 갔다. 내일 다시 해볼게.
- **apple-mt-attr**: 솔직히, 저 업데이트로 환경이 다 망가졌는데.롤백해서 밖의 공기를 마셨어.내일 다시 할게.
- **apple-mt-marker**: 솔직히, 저 업데이트로 환경이 다 망가졌는데.롤백해서 밖의 공기를 마셨어.내일 다시 할게.
- **apple-mt-marker-batch**: 솔직히, 저 업데이트로 환경이 다 망가졌는데.롤백해서 밖의 공기를 마셨어.내일 다시 할게.
- **apple-mt-plain**: 솔직히, 저 업데이트로 환경이 다 망가졌는데.롤백해서 밖의 공기를 마셨어.내일 다시 할게.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 솔직히, 그 업데이트로 환경이 전부 망가졌지만, 롤백해서 밖의 공기를 들이마셨어요. 내일 다시 해보죠.
- **ct2-nllb-1.3b**: 솔직히, 그 업데이트가 모든 환경을 망쳐버렸어요.
- **ct2-nllb-600m**: 솔직히 말씀드리자면, 그 업데이트로 인해 환경이 완전히 망가졌지만, 저는 다시 돌아와서 공기를 흡수했습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 정직하게, 그 업데이트로 환경이 완전히 망가졌어요.롤백을 하고 외부 공기를 흡입했어요. 다시 내일 할 거예요.  **설명:**  *   **正直、** (치히츠, "정직하게"):  "정직하게"라는 표현을 그대로 전달합니다. *   **あのアップデートで** (아노 업데이트데): "그 업데이트로"라는 표현을 그대로 전달합니다. *   **環境が全部壊れたんだが** (엔화이가 수붕 료타ンダ가): "환경이 완전히 망가졌어요."  이 부분은 "그 업데이트로 환경이 완전히 망가졌어요."라는 의미로,  "그 업데이트로"라는 표현을 사용하여 상황을 설명합니다. *   **ロールバックして** (로롤백테): "롤백을 하고"라는 표현을 그대로 전달합니다. *   **外の空気吸ってきた** (우에노 쿠우오 스쿠테테): "외부 공기를 흡입했어요."  "외의"는 "외부"를 의미하며, "공기를 흡입했어요"라는 의미로 "그 외의 공기를 흡입했어요"라는 표현으로 번역합니다. *   **また明日やるわ** (마타 아즈마이 료와): "다시 내일 할 거예요."  "また"는 "다시"를 의미하며, "마타"는 "다시"를 의미합니다. "わ"는 "요"를 표현하는 어미입니다.  **주석:**  *   "アップデート" (업데이트):  "업데이트"는 일본어에서 "업그레이드" 또는 "개선"이라는 의미로 사용됩니다. *   "環境" (엔화이): "환경"은 "환경"이라는 의미로 사용됩니다. *   "ロールバック" (로롤백테): "롤백"은 일본어에서 "롤백"이라는 의미로 사용됩니다. *   "外の空気" (우에노 쿠우오): "외부 공기"는 "외부 공기"라는 의미로 사용됩니다. *   "吸ってきた" (스쿠테테): "흡입했어요"는 "흡입했어요"라는 의미로 사용됩니다.
- **mlx-gemma-4-e2b-4bit**: 솔직히, 그 업데이트로환경이 전부 망가졌습니다.하지만 롤백해서 바깥 공기를 마셨어요. 내일 다시 할게요.
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: socket hang up)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 솔직히 그 업데이트로 인해 환경이 완전히 망가졌어요. 롤백해서 밖의 공기를 마셨어요. 내일 다시 해볼게요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: 正直、あのアップデートで環境が全部壊れたんだが。ロールバックして外の空気吸ってきた。また明日やるわ。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 정직히, 그 업데이트로 모든 환경이 파괴되었네. 롤백해서 외부의 공기를 흡수했어. 또 내일 해보자.
- **mlx-qwen3.5-2b-4bit**: 正直、あのアップデートで環境が全部壊れたんだが。ロールバックして外の空気吸ってきた。また明日やるわ。
- **mlx-qwen3.5-2b-4bit-mt**: 正直、あのアップデートで環境が壊れたんだが。ロールバックして外の空気吸ってきた。また明日やるわ。
- **mlx-qwen3.5-4b-4bit**: 솔직히 말하면, 그 업데이트로 환경이 모두 망가졌습니다. 롤백해서 밖의 공기를 마셨습니다. 내일 다시 시도하겠습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 솔직히, 그 업데이트 때문에 환경이 완전히 망가졌어요. 이전으로 돌려서 신선한 공기를 좀 쉬었어요. 내일 다시 할게요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 솔직히, 그 업데이트 때문에환경이 전부 망가졌어네. 롤백하고 밖에 나가서 공기 좀 마셨어. 내일 다시 해야겠다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 진짜로, 그 업데이트로 환경이 모두 망가졌을 거예요. 롤백해서 외기의 공기를 흡입했습니다. 또 다음 날 다시 시도하겠습니다.(누락)
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 솔직히, 그 업데이트 때문에 환경이 완전히 망가졌어. 그래서 롤백해서 밖에 나가서 공기 좀 쐴 거야. 내일 다시 해볼게.

**ja-community-05** (community)

- 원문: うちの猫がルーターの上に1週間居座ってるんだけど、なぜかWi-Fiの調子が過去最高。理由は聞かないでくれ。
- **apple-fm**: 우리 고양이가 라우터 위에 1주일 동안 있더니, 이상하리만치 Wi-Fi 성능이 최고로 좋아졌어. 이유를 물어보지 말자.
- **apple-mt-attr**: 우리 고양이가 라우터 위에 일주일 동안 머물고 있는데, 이상하게도 Wi-Fi 상태가 역대 최고야. 이유는 물어보지 마.
- **apple-mt-marker**: 우리 고양이가 라우터 위에 일주일 동안 머물고 있는데, 이상하게도 Wi-Fi 상태가 역대 최고야. 이유는 물어보지 마.
- **apple-mt-marker-batch**: 우리 고양이가 라우터 위에 일주일 동안 머물고 있는데, 이상하게도 Wi-Fi 상태가 역대 최고야. 이유는 물어보지 마.
- **apple-mt-plain**: 우리 고양이가 라우터 위에 일주일 동안 머물고 있는데, 이상하게도 Wi-Fi 상태가 역대 최고야. 이유는 물어보지 마.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 내 고양이가 일주일 동안 라우터 위에 앉아 있었는데 왜인지 와이파이가 최고였어
- **ct2-nllb-1.3b**: 제 고양이는 일주일 동안 라우터에 앉아 있습니다. 그런데 왜 Wi-Fi가 최고인지 묻지 마세요.
- **ct2-nllb-600m**: 우리 고양이는 일주일 동안 라우터 위에 앉아 있습니다. 왜 Wi-Fi가 예전보다 더 잘 작동하는지요. 왜 그런지 묻지 마세요.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: **"내 동네 고양이들이, 루터레이스 위에 한 달 동안 묵고 있어요. 왜냐하면, 그건 Wi-Fi의 속도가 과거 최고였거든요. 이유를 알려주세요."**  **설명:**  *   **うちの猫 (uchi no neko):**  "내 동네 고양이"라는 의미입니다. *   **ルーター (ruutāre):**  "루터레이스"라는 표현을 그대로 사용했습니다. *   **上に (ue ni):**  "위에"라는 의미입니다. *   **1週間 (1-kugen):**  "한 달"이라는 의미입니다. *   **なぜか (yonna ka):**  "왜냐하면"이라는 의미입니다. *   **Wi-Fiの調子 (Wi-Fi no chō-ki):**  "Wi-Fi의 상태"라는 의미입니다. *   **過去最高 (kase-sū-chū-kei):**  "과거 최고"라는 의미입니다. *   **理由は聞かないでくれ (Reason wa shiranai de kure):**  "그 이유를 알려주세요"라는 의미입니다.  **주석:**  "이 문장은 일본어의 상황을 한국어로 표현한 것입니다.  '루터레이스'는 일본의 통신망을 의미하며, 'Wi-Fi'는 한국의 통신망을 의미합니다.  '고양이'는 일본의 반려동물이라는 뜻입니다.  '一週間'은 '한 달'이라는 뜻이며, 'なぜか'는 '왜냐하면'이라는 표현입니다.  이 문장은 일본어의 상황을 한국어로 표현한 것입니다."
- **mlx-gemma-4-e2b-4bit**: 우리 고양이가 라우터 위에 일주일 동안 머물고 있는데, 왠지 모르게 와이파이 상태가 최고입니다. 이유는 묻지 마세요.
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 우리 집 고양이가 라우터 위에 일주일 동안 앉아 있어서, 왜인지 Wi-Fi 상태가 최상이야. 이유는 묻지 마세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: この問題は本当に謎の多い問題だ。猫がルーターの上で1週間もい座ってるなんて、まるで神様がプレゼントしたかのように見える。どうやってそんな長時間耐えられるのか、謎を解く術は見つからない。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: うちの猫がルーターの上に1週間居座ってるんだけど、なぜかWi-Fiの調子が過去最高。理由は聞かないでくれ。
- **mlx-qwen3.5-2b-4bit**: うちの猫がルーターの上に 1 週間居座ってるんだけど、なぜか Wi-Fi の調子が過去最高。理由は聞かないでくれ。
- **mlx-qwen3.5-2b-4bit-mt**: うちの猫이 라우터 위에 1 주간 앉아 있네요. Wi-Fi 의 상태가 과거 최고인 이유는 들어드릴게요.
- **mlx-qwen3.5-4b-4bit**: 우리의 고양이가 1 주일 동안 라우터 위에 앉아있는데, 기이하게도 Wi-Fi 성능이 과거 최고 수준입니다. 이유는 묻지 마세요.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 제 고양이가 지난 일주일 동안 라우터 위에 앉아 있는데, 이상하게도 Wi-Fi 속도가 최고로 빨라요. 이유를 물어보지 마세요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 우리 고양이가 라우터 위에 일주일 동안 자리를 잡고 있는데, 왠지 와이파이 상태가 역대 최고예요. 이유는 묻지 말아 주세요.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 우리 고양이가 라우터 위에 1 주 동안 앉아있는데, Wi-Fi 가 과거 최고 수준입니다. 이유를 묻지 마세요.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 우리 고양이가 1주일 동안 라우터 위에 앉아 있는데, 이상하게 Wi-Fi 속도가 이전 최고 수준으로 올라갔어요. 이유는 물어봐 주지 마세요.

**ja-community-06** (community)

- 원문: キーボードに6,000円も使ってしまった。雨音みたいな打鍵音で最高。同僚の反応は…まあ、お察しですw
- **apple-fm**: 키보드에 6,000엔을 썼어. 비 같은 느낌의 타이핑 소리로 최고야. 동료의 반응은...뭐, 이해이야
- **apple-mt-attr**: 키보드에 6,000엔이나 썼다. 비소리 같은 누르기 소리로 최고. 동료의 반응은...음, 이해합니다w
- **apple-mt-marker**: 키보드에 6,000엔이나 썼다. 비소리 같은 누르기 소리로 최고. 동료의 반응은...음, 이해합니다w
- **apple-mt-marker-batch**: 키보드에 6,000엔이나 썼다. 비소리 같은 누르기 소리로 최고. 동료의 반응은...음, 이해합니다w
- **apple-mt-plain**: 키보드에 6,000엔이나 썼다. 비소리 같은 누르기 소리로 최고. 동료의 반응은...음, 이해합니다w
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 키보드에 6,000엔을 써버렸어요. 비 소리같은 타이핑 소리가 최고예요. 동료들의 반응은... 음, 예상이 되네요w
- **ct2-nllb-1.3b**: 키보드에 6천 엔을 썼습니다.
- **ct2-nllb-600m**: 키보드에 6천엔을 썼습니다. 빗방울처럼 좋은 키보드입니다. 동료들의 반응은...
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: **"6,000円のキーボードに費やしてしまった。雨音のような打鍵音は最高だった。同僚の反応は…まあ、お察しですw"**  **번역:**  "6,000円のキーボードに費やしてしまった。雨音みたいな打鍵音は最高だった。同僚の反応は…まあ、お察しですw"  **설명:**  *   **"6,000円"**은 "6,000円"으로 번역되었습니다. *   **"雨音みたいな打鍵音"**은 "雨音みたいな打鍵音"으로 번역되었습니다. *   **"お察しです"**은 "お察しです"로 번역되었습니다. *   **"w"**은 "w"로 번역되었습니다.  **주석:**  *   "6,000円"은 6,000이라는 숫자입니다. *   "雨音みたいな打鍵音"은 "雨音みたいな打鍵音"으로 번역되었습니다. *   "お察しです"는 "お察しです"로 번역되었습니다. *   "w"는 "w"로 번역되었습니다.  **생각 과정:**  원문은 일본어이고, 고유명사(6,000円)와 숫자(6,000)가 포함되어 있습니다.  이러한 요소들을 고려하여 자연스러운 한국어 표현으로 번역했습니다.  "お察しです"는 "아무도 모른다"라는 뜻이므로, "お察しです"로 번역했습니다.
- **mlx-gemma-4-e2b-4bit**: 키보드에 6,000엔이나 써버렸습니다. 빗소리 같은 타건음이 최고예요. 동료의 반응은…뭐, 이해합니다입니다ㅋㅋ
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 키보드에 6,000엔이나 쓰고 말았어요. 비소 같은 타건 소리가 최고예요. 동료들의 반응은… 음, 이해합니다 w
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: このテキストは日本語で「キーボードに6,000円も使ってしまった。雨音みたいな打鍵音で最高。同僚の反応は…まあ、お察しですw」とある。   この日本語を 자연스러운 한국어로 번역하면 「키보드에 6,000엔이나 써버렸어. 비 내리는 소리 같은 타이핑 소리로 최고. 동료의 반응은… 뭐, 알겠어. w」だ。   번역문을 평서체(~다)로 대응시키면 「이 텍스트는 일본어로 「キーボードに6,千円も使ってしまった。雨音みたいな打鍵音で最高。同僚の反応は…まあ、お察しですw」だ。   번역문을 평서체(~다)로 대응시키면 「이 텍스트는 일본어로 「キーボードに6,000円も使ってしまった。雨音みたいな打鍵音で最高。同僚の反応は…まあ、お察しですw」だ。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 6,000 yen도 써먹었네. 최고의 타이핑 소리, 라이브 음악 같은 느낌. 동료들의 반응은... 여전히, 아시겠네. w
- **mlx-qwen3.5-2b-4bit**: キーボードに 6,000 円も使ってしまった。雨音みたいな打鍵音で最高。同僚の反応は…まあ、お察しです w
- **mlx-qwen3.5-2b-4bit-mt**: 키보드に 6,000 円も使ってしまった。雨音みたいな打鍵音で最高。同僚の反応は…まあ、お察しです w
- **mlx-qwen3.5-4b-4bit**: 키보드에 6,000 원도 썼습니다. 빗소리 같은 키보드 소리가 최고입니다. 동료들의 반응은…아, 짐작할 수 있습니다w
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 키보드를 6,000엔이나 사용해 버렸어요. 비오는 소리 같은 키 입력 소리가 정말 좋네요. 동료들의 반응은... 아마 이해하시겠어요. 😉
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 키보드에 6,000엔이나 써버렸어요. 빗소리 같은 타건음이라 최고예요. 동료 반응은...뭐, 눈치껏 아시겠죠ㅋㅋ
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 키보드에 6,000 원 이상 썼습니다. 빗소리 같은敲击音으로 최고입니다. 동료의 반응은… 아니요, 알겠습니다 입니다 w
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 키보드에 6,000엔이나 썼다. 비 오는 소리처럼 부드러운 키감이 정말 최고였다. 동료들의 반응은... 예상했던 대로였다.

**ja-ui-01** (ui)

- 원문: 変更を保存
- **apple-fm**: 변경 저장
- **apple-mt-attr**: 변경을 저장
- **apple-mt-marker**: 변경을 저장
- **apple-mt-marker-batch**: 변경을 저장
- **apple-mt-plain**: 변경을 저장
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 변경 사항 저장
- **ct2-nllb-1.3b**: 변경사항을 저장합니다
- **ct2-nllb-600m**: 변경사항을 저장합니다
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 일본어다. 경어체(です・ます)는 존댓말(해요체/합니다체)로, 평어체(だ・である)는 평서체(~다)로 대응시켜라. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  **번역:**  (일본어 원문) 今日はいい天気ですね。 (Kyou wa ii tenki desu ne.)  (한국어 번역)  오늘 날씨가 정말 좋네요. (오늘 날씨가 정말 좋네요.)  (일본어 원문) この本はとても面白いです。 (Kono hon wa kontemo omoshiroi desu.)  (한국어 번역)  이 책은 정말 재미있어요. (이 책은 정말 재미있어요.)  (일본어 원문) その場所はとても静かです。 (Sono bash wa kontemo shizuka desu.)  (한국어 번역)  그 장소는 정말 조용해요. (그 장소는 정말 조용해요.)  (일본어 문장) こんにちは。 (Konnichiwa.)  (한국어 번역)  안녕하세요. (안녕하세요.)  (일본어 문장) ありがとう。 (Arigatou.)  (한국어 번역)  감사합니다. (감사합니다.)  (일본어 문장) どうも。 (Domo.)  (한국어 번역)  안녕. (안녕.)  (일본어 문장) おやすみ。 (Oyasumi.)  (한국어 번역)  안녕히 주십시오. (Oyasumi shimasu.)  (일본어 문장) 明日も頑張りましょう。 (Ashita mo ganbari mo.)  (한국어 번역)  내일도 열심히 해봅시다. (내일도 열심히 해봅시다.)  (일본어 문장) はい、どうですか？ (Hai, dou ka desu ka?)  (한국어 번역)  네, 어떻게 생각하세요? (네, 어떻게 생각하세요?)  (일본어 문장) ありがとう。 (Arigatou.)  (한국어 번역)  감사합니다. (감사합니다.)  (일본어 문장) どうも。 (Domo.)  (한국어 번역)  안녕. (안녕.)  (일본어 문장) おやすみ。 (Oyasumi.)  (한국어 번역)  안녕히 주십시오. (Oyasumi shimasu.)  (일본어 문장) 明日も頑張りましょう。 (Ashita mo ganbari mo.)  (한국어 번역)  내일도 열심히 해봅시다. (Ashita mo ganbari mo.)  (일본어 문장) はい、どうですか？ (Hai, dou ka desu ka?)  (한국어 번역)  네, 어떻게 생각하세요? (네, 어떻게 생각하세요?)  (일본어 문장) どうも。 (Domo.)  (한국어 번역)  안녕. (안녕.)  (일본어 문장) おやすみ。 (Oyasumi.)  (한국어 번역)  안녕히 주십시오. (Oyasumi shimasu.)  (일본어 문장) 明日も頑張りましょう。 (Ashita mo ganbari mo.)  (한국어 번역)  내일도 열심히 해봅시다. (Ashita mo ganbari mo.)  (일본어 문장) はい、どうですか？ (Hai, dou ka desu ka?)  (한국어 번역)  네, 어떻게 생각하세요? (네, 어떻게 생각하세요?)  (일본어 문장) どうも。 (Domo.)  (한국어 번역)  안녕. (안녕.)  (일본어 문장) おやすみ。 (Oyasumi.)  (한국어 번역)  안녕히 주십시오. (Oyasumi shimasu.)  (일본어 문장) 明日も頑張りましょう。 (Ashita mo ganbari mo.)  (한국어 번역)  내일도 열심히 해봅시다. (Ashita mo ganbari mo.)  (일본어 문장) はい、どうですか？ (Hai, dou ka desu ka?)  (한국어 번역)  네, 어떻게 생각하세요? (네, 어떻게 생각하세요?)  (일본
- **mlx-gemma-4-e2b-4bit**: 변경 사항을 저장
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 변경 사항을 저장합니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: このファイルは保存済みです。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 변경을 저장
- **mlx-qwen3.5-2b-4bit**: 変更を保存
- **mlx-qwen3.5-2b-4bit-mt**: 변경 내용을 저장합니다
- **mlx-qwen3.5-4b-4bit**: 변경사항 저장
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 변경을 저장합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 변경 사항 저장
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 변경 저장합니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 변경 사항 저장

**ja-ui-02** (ui)

- 원문: 問題が発生しました。しばらくしてからもう一度お試しください。
- **apple-fm**: 문제에서 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
- **apple-mt-attr**: 문제가 발생했습니다. 잠시 후에 다시 한번 시도해 주세요.
- **apple-mt-marker**: 문제가 발생했습니다. 잠시 후에 다시 한번 시도해 주세요.
- **apple-mt-marker-batch**: 문제가 발생했습니다. 잠시 후에 다시 한번 시도해 주세요.
- **apple-mt-plain**: 문제가 발생했습니다. 잠시 후에 다시 한번 시도해 주세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 문제가 발생했습니다. 잠시 후에 다시 시도하십시오.
- **ct2-nllb-1.3b**: 문제가 발생했습니다. 잠시 후에 다시 시도하세요.
- **ct2-nllb-600m**: 문제가 생겼습니다. 잠시 후에 다시 시도해보세요.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 문제 발생했습니다. 조금 기다려 보시죠.
- **mlx-gemma-4-e2b-4bit**: 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 문제가 발생했습니다. 잠시 후에 다시 시도해 주세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: 문제 발생했습니다. 잠시 후 다시 한 번 시도해 주세요.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 문제가 발생했습니다. 조금 더 기다려 주세요. 다시 시도해 주세요.
- **mlx-qwen3.5-2b-4bit**: 問題が発生しました。しばらくしてからもう一度お試しください。
- **mlx-qwen3.5-2b-4bit-mt**: 문제が発生했습니다. 잠시 후 다시 시도해 보십시오.
- **mlx-qwen3.5-4b-4bit**: 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 문제 발생했습니다. 잠시 후 다시 시도해 주세요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 문제가 발생했습니다. 잠시 후에 다시 시도해 주세요.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 문제가 발생했습니다. 잠시 후 다시 시도해 보세요.

**ja-ui-03** (ui)

- 원문: 未読メッセージが3件あります
- **apple-fm**: 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-attr**: 미독 메시지가 3건 있습니다
- **apple-mt-marker**: 미독 메시지가 3건 있습니다
- **apple-mt-marker-batch**: 미독 메시지가 3건 있습니다
- **apple-mt-plain**: 미독 메시지가 3건 있습니다
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 읽지 않은 메시지가 세 개 있습니다.
- **ct2-nllb-1.3b**: 여기 3개의 문자가 있습니다.
- **ct2-nllb-600m**: 3개의 미독된 메시지가 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지 3개 있습니다)  **未読メッセージが3件あります**  (未読 메시지
- **mlx-gemma-4-e2b-4bit**: 읽지 않은 메시지가 3개 있습니다
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 읽지 않은 메시지가 3건 있습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: 번역문만 출력합니다.  원문 일본어: 読まなかったメッセージが3件あるんです。   번역문 한국말: 읽지 않은 메시지가 3건 있어요.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 미러가 3건 있습니다
- **mlx-qwen3.5-2b-4bit**: 未読メッセージが 3 件あります
- **mlx-qwen3.5-2b-4bit-mt**: 3 개의 읽지 않은 메세지가 있습니다
- **mlx-qwen3.5-4b-4bit**: 미리드 메시지가 3 개 있습니다
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 읽지 않은 메시지가 3건 있습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 읽지 않은 메시지가 3건 있습니다
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 미독 메시지가 3 건 있습니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 읽지 않은 메시지가 3건 있습니다.

**ja-link-01** (link)

- 원문: 続行するには[こちら]をクリックしてください。
- **apple-fm**: 계속하려면[こちら]을(를) 클릭하세요.
- **apple-mt-attr**: 계속하려면 [こちら]기를 클릭하십시오.
- **apple-mt-marker**: 계속하려면[こちら]를 클릭하십시오.
- **apple-mt-marker-batch**: 계속하려면[こちら]를 클릭하십시오.
- **apple-mt-plain**: 계속하려면[こちら]를 클릭해 주세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 계속하려면[こちら]를 클릭하세요.
- **ct2-nllb-1.3b**: 그 다음으로,[こちら]이 문자를 클릭하세요.
- **ct2-nllb-600m**: 이 모든 것이[こちら]이 문자를 클릭하세요.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 続行するには[こちら]をクリックしてください。 ```
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 계속하려면 [こちら]를 클릭해 주세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: このトライアルは成功したようだ。[こちら]이 문장은 일본어 원문을 자연스러운 한국어로 번역한 것입니다. 번역문의 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 두었습니다. 번역문만 출력합니다.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 続行するには[こちら]をクリックしてください。
- **mlx-qwen3.5-2b-4bit**: 続行するには[こちら]こちら
- **mlx-qwen3.5-2b-4bit-mt**: 계속하려면[こちら]를 클릭してください。
- **mlx-qwen3.5-4b-4bit**: 계속하려면 [こちら]을(를) 클릭하세요.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 계속하려면 [こちら]을 클릭하세요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 계속하려면 [こちら]를 클릭해 주세요.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 계속하려면 [こちら]이곳을 클릭하세요.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 계속 진행하려면[こちら]클릭해주세요.

**ja-link-02** (link)

- 원문: 対応プラットフォームの詳細については、[インストールガイド]をご覧ください。
- **apple-fm**: 대응 플랫폼의 자세한 내용은,[インストールガイド]을(를) 확인해 보세요.
- **apple-mt-attr**: 지원 플랫폼의 자세한 내용은, [インストールガイド]참조하십시오.
- **apple-mt-marker**: 대응 플랫폼의 자세한 내용은, [インストールガイド]을 보십시오.
- **apple-mt-marker-batch**: 대응 플랫폼의 자세한 내용은, [インストールガイド]을 보십시오.
- **apple-mt-plain**: 대응 플랫폼의 자세한 내용은,[インストールガイド]를 보십시오.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 플랫폼에 대한 자세한 내용은 다음을 참조하라.[インストールガイド]보세요.
- **ct2-nllb-1.3b**: 이 앱을 이용하면[インストールガイド]자, 여기 보겠습니다.
- **ct2-nllb-600m**: 이 플랫폼에 대한 자세한 내용은[インストールガイド]이 사진들을 보세요.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 일본어다. 경어체(です・ます)는 존댓말(해요체/합니다체)로, 평어체(だ・である)는 평서체(~다)로 대응시켜라. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  対応プラットフォームの詳細については、 **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로 유지해야 합니다.)**  **(이 부분은 일본어 원문 그대로[インストールガイド]보십시오.  (이 문장은 "안녕하세요" 또는 "인사말"로 해석될 수 있습니다. 상황에 따라 존댓말이나 평서체로 표현될 수 있습니다.)  (이 문장은 "안녕하세요"로 해석될 수 있습니다.)
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 대응 플랫폼의 세부 정보에 대해서는 [インストールガイド]를 참조하시기 바랍니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: 対応プラットプロームの詳細については、   サポートページで確認してください。[インストールガイド]원문을 자연스러운 한국어로 번역했습니다.  번역의 자연스러움을 위해 존댓말(해요체/합니다체)과 평서체(~다)를 구분해 대응시켰습니다.  번역의 정확성을 위해 코드, URL, 고유명사, 숫자, 전문 용어는 원문 그대로 두었습니다.  번역문만 출력합니다.  ---  원문:   学生たちは、授業の後に、図書館で本を借りました。  번역문:   학생들은, 수업이 끝난 뒤에, 도서관에서 책을 빌렸습니다.  ---  원문:   先生の説明をよく聞いて、問題を解きました。  번역문:   선생님의 설명을 잘 듣고, 문제를 풀었습니다.  ---  원문:   チームの協力で、プロジェクトを成功させました。  번역문:   팀의 협력으로, 프로젝트를 성공시켰습니다.  ---  원문:   新しいシステムの導入で、効率が向上しました。  번역문:   새로운 시스템의 도입으로, 효율이 향상되었습니다.  ---  원문:   彼は、毎日トレーニングを欠かさず行いました。  번역문:   그는, 매일 트레이닝을 거르지 않고 했습니다.  ---  원문:   イベントの参加者が多かったので、会場は賑やかでした。  번역문:   이벤트의 참가자가 많았으므로, 회장은 시끌벅적했습니다.  ---  원문:   彼女は、作曲のアイデアをノートにまとめました。  번역문:   그녀는, 작곡의 아이디어를 노트에 정리했습니다.  ---  원수:   コンピュータの処理速度が速かったので、データの処理がスムーズでした。  번역문:   컴퓨터의 처리 속도가 빨랐으므로, 데이터의 처리가 원활했습니다.  ---  원문:   チームメイトの連携が素晴らしかったので、成果が上がりました。  번역문:   팀메이트의 협력이 훌륭했으므로, 성과가 올랐습니다.  ---  원문:   新しい設備の導入で、施設の質が向上しました。  번역문:   새로운 설비의 도입으로, 시설의 질이 향상되었습니다.  ---  원문:   彼は、研究の結果を発表しました。  번역문:   그는, 연구의 결과를 발표했습니다.  ---  원문:   お客様のニーズに合わせたサービスが提供されました。  번역문:   고객의 요구에 맞춘 서비스가 제공되었습니다.  ---  원문:   彼女は、写真を撮るためにカメラを操作しました。  번역문:   그녀는, 사진을 찍기 위해 카메라를 조작했습니다.  ---  원문:   プロジェクトの進め方について、リーダーが説明しました。  번역문:   프로젝트의 진행방식에 대해, 리더가 설명했습니다.  ---  원문:   テストの結果が良かったので、受驗生が自信を深めました。  번역문:   테스트의 결과가 좋았으므로, 수험생이 자신감을 키웠습니다.  ---  원문:   彼は、料理のレシピを参考に作りました。  번역문:   그는, 요리의 레시피를 참고하며 만들었습니다.  ---  원문:   新しい技術の導入で、企業が革新を追求しました。  번역문:   새로운 기술의 도입으로, 기업이 혁신을 추구했습니다.  ---  원문:   学生たちは、先生の指導を受けながら勉強しました。  번역문:   학생들은, 선생님의 지도를 받으며 공부했습니다.  ---  원문:   イベントの成功を祝って、参加者が拍手を送りました。  번역문:   이벤트의 성공을 축하하며, 참가자가 박수를 보냈습니다.  ---  원문:   彼女は、音楽のレッスンを受けながら練習しました。  번역문:   그녀는, 음악의 레슨을 받으며 연습했습니다.  ---  원문:   チームの協力が功を奏したので、目標を達成できました。  번역문:   팀의 협력이 공을 세웠으므로, 목표를 달성했습니다.  ---  원문:   彼は、映画の脚本を読みながら感想を述べました。  번역문:   그는, 영화의 각본을 읽으며 감상을 말했습니다.  ---  원문:   新しい制度の導入で、学校がより良い環境になりました。  번역문:   새로운 제도의 도입으로, 학교가 더 좋은 환경이 되었습니다.  ---  원문:   彼女は、料理のレシピを参考に作りました。  번역문:   그녀는, 요리의 레시피를 참고하며 만들었습니다.  ---  원문:   プロジェクトの成功を祝って、参加者が笑顔を見せました。  번역문:   프로젝트의 성공을 축하하며, 참가자가 미소를 보였습니다.  ---  원문:   彼は、数学のテストで良い成績を収めました。  번역문:   그는, 수학 테스트에서 좋은 성적을 거두었습니다.  ---  원문:   チームの協力が功を奏したので、成果が上がりました。  번역문:   팀의 협력이 공을 세웠으므로, 성과가 올랐습니다.  ---  원문:   彼女は、写真を撮るためにカメラを操作しました。  번역문:   그녀는, 사진을 찍기 위해 카메라를 조작했습니다.  ---  원문:   コンピュータの処理速度が速かったので、データの処理がスムーズでした。  번역문:   컴퓨터의 처리 속도가 빨랐으므로, 데이터의 처리가 원활했습니다.  ---  원문:   彼は、研究の結果を発表しました。  번역문:   그는, 연구의 결과를 발표했습니다.  ---  원문:   お客様のニーズに合わせたサービス
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 대응플랫폼의 상세 내용은 다음과 같습니다.[インストールガイド]ご覧ください。
- **mlx-qwen3.5-2b-4bit**: 対応プラットフォームの詳細については、[インストールガイド]インストールガイド
- **mlx-qwen3.5-2b-4bit-mt**: 구체적인 대응 플랫폼의 자세한 내용은 다음과 같습니다.[インストールガイド]이 내용을 확인해 주십시오.
- **mlx-qwen3.5-4b-4bit**: 지원 플랫폼의 자세한 내용은 [インストールガイド]설치 가이드
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 상세한 플랫폼 정보는 [インストールガイド]에서 확인하실 수 있습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 지원하는 플랫폼의 자세한 내용은, [インストールガイド]를 참고해 주세요.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 대응 플랫폼의 자세한 내용은 [インストールガイド]설치 가이드 를 확인해 주세요.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 지원 플랫폼에 대한 자세한 내용은 [インストールガイド]를 참조하십시오.

**ja-link-03** (link)

- 원문: 問題が解決しない場合は、[トラッカーでイシューを作成]し、ログファイルを添付してください。
- **apple-fm**: 문제 해결이 되지 않으면,[トラッカーでイシューを作成]을(를) 작성하고, 로그 파일을 첨부하세요.
- **apple-mt-attr**: 문제가 해결되지 않는 경우, [トラッカーでイシューを作成]하고, 로그 파일을 첨부해 주세요.
- **apple-mt-marker**: 문제가 해결되지 않는 경우, [トラッカーでイシューを作成]하고, 로그 파일을 첨부해 주세요.
- **apple-mt-marker-batch**: 문제가 해결되지 않는 경우, [トラッカーでイシューを作成]하고, 로그 파일을 첨부해 주세요.
- **apple-mt-plain**: 문제가 해결되지 않는 경우,[トラッカーでイシューを作成]그리고, 로그 파일을 첨부해 주세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 문제가 해결되지 않으면[トラッカーでイシューを作成]로그 파일을 첨부하십시오.
- **ct2-nllb-1.3b**: 만약 문제가 해결되지 않는다면,[トラッカーでイシューを作成]로그 파일을 첨부하세요.
- **ct2-nllb-600m**: 만약 문제가 해결되지 않는다면,[トラッカーでイシューを作成]로그 파일을 첨부해 주세요.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 問題が解決しない場合は、[トラッカーでイシューを作成]し、ログファイルを添付してください。 ```
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 문제가 해결되지 않을 경우, [トラッカーでイシューを作成]를 수행하고 로그 파일을 첨부해 주세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: 번역문만 출력합니다.  문제와 해결책이 안 나오면, [トラッカーでイシューを作成]하고 로그파일을 첨부해 주세요.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 문제가 해결되지 않다면, [トラッカーでイシューを作成]를 실행하고 로그 파일을 첨부해 주세요.
- **mlx-qwen3.5-2b-4bit**: 問題が解決しない場合は、[トラッカーでイシューを作成]トラッカーでイシューを作成
- **mlx-qwen3.5-2b-4bit-mt**: 문제が解決しない場合は、[トラッカーでイシューを作成]し、ログファイルを添付してください。
- **mlx-qwen3.5-4b-4bit**: 문제가 해결되지 않는 경우, [トラッカーでイシューを作成]트래커로 이슈를 생성
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 문제가 해결되지 않는 경우, [トラッカーでイシューを作成]을 시도해 보고, 로그 파일을 첨부해 주세요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 문제가 해결되지 않는 경우, [トラッカーでイシューを作成]하고 로그 파일을 첨부해 주세요.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 문제가 해결되지 않는 경우, [トラッカーでイシューを作成]트래커를 통해 이슈를 생성하고 로그 파일을 첨부하세요.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 문제가 해결되지 않는 경우, [トラッカーでイシューを作成]를 참조하고, 로그 파일을 첨부해 주세요.

**ja-seq-01** (seq)

- 원문: 去年の春、家族の写真を保存するために、古いノートPCを自宅サーバーにすることにしました。
- **apple-fm**: 지난 봄, 가족 사진을 저장하기 위해 오래된 노트북을 가정 서버에 연결하기로 했습니다.
- **apple-mt-attr**: 작년 봄, 가족의 사진을 저장하기 위해, 오래된 노트북 PC를 집 서버에 하는 것을 결정했습니다.
- **apple-mt-marker**: 작년 봄, 가족의 사진을 저장하기 위해, 오래된 노트북 PC를 집 서버에 하는 것을 결정했습니다.
- **apple-mt-marker-batch**: 작년 봄, 가족의 사진을 저장하기 위해, 오래된 노트북 PC를 집 서버에 하는 것을 결정했습니다.
- **apple-mt-plain**: 작년 봄, 가족의 사진을 저장하기 위해, 오래된 노트북 PC를 집 서버에 하는 것을 결정했습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 작년 봄, 가족의 사진을 보관하기 위해 오래된 노트북을 집 서버로 사용하기로 결정했습니다.
- **ct2-nllb-1.3b**: 작년에 봄에, 저는 가족 사진을 저장하기 위해 노트북 컴퓨터를 가정 서버로 사용하기로 했습니다.
- **ct2-nllb-600m**: 작년에 봄, 저는 노트북을 가정 서버로 사용해서 가족 사진들을 저장하기로 했습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 2023년 봄, 가족 사진을 보관하기 위해, 오래된 노트북 PC를 집 서버에 설치하기로 했습니다.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 지난해 봄, 가족 사진을 저장하기 위해 오래된 노트북을 집의 서버에 설치하기로 했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: そのノートPCは古いので、処理速度が遅くて困ります。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 올해 봄, 가족 사진을 저장하기 위해 어린 시절의 노트PC를 집 서버로 설치할게요.
- **mlx-qwen3.5-2b-4bit**: 去年の春、家族の写真を保存するために、古いノート PC を自宅サーバーにすることにしました。
- **mlx-qwen3.5-2b-4bit-mt**: 去年の春、家族の写真を保存するために、古いノート PC を自宅サーバーにしました。
- **mlx-qwen3.5-4b-4bit**: 去年의 봄, 가족의 사진을 저장하기 위해, 오래된 노트북 PC 를 홈 서버로 설정하기로 결정했습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 작년에 봄에, 가족 사진을 보관하기 위해 오래된 PC를 가정 서버에 설치했습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 작년 봄, 가족 사진을 보관하기 위해 오래된 노트북을 자가 서버로 사용하기로 했습니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 지난 봄, 가족 사진을 저장하기 위해, 오래된 노트북 PC 를自宅 서버에 두기로 결정했습니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 지난 봄, 가족 사진을 보관하기 위해 오래된 노트북을 가정 서버에 연결하기로 했습니다.

**ja-seq-02** (seq)

- 원문: 2014年製のThinkBook(RAM 8GB)は、この用途にはぴったりでした。
- **apple-fm**: 2014년 모델의ThinkBook(RAM 8GB)은 이 용도에 아주 잘 어울렸습니다.
- **apple-mt-attr**: 2014년식 ThinkBook(RAM 8GB)은, 이 용도에는 딱 맞았습니다.
- **apple-mt-marker**: 2014년식 ThinkBook(RAM 8GB)은, 이 용도에는 딱 맞았습니다.
- **apple-mt-marker-batch**: 2014년식 ThinkBook(RAM 8GB)은, 이 용도에는 딱 맞았습니다.
- **apple-mt-plain**: 2014년식 ThinkBook(RAM 8GB)은, 이 용도에는 딱 맞았습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 2014년에 출시된 ThinkBook(8GB RAM)은 이러한 용도에 적합했습니다.
- **ct2-nllb-1.3b**: 2014년 힌크북 (RAM 8GB) 은 이 용도로 적합했습니다.
- **ct2-nllb-600m**: 2014년에 만들어진 ThinkBook (RAM) 는 이 용도로 매우 적합했습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 2014년짜리 ThinkBook(RAM 8GB)은 이용에 아주 적합했습니다.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 2014년에 생산된 ThinkBook(RAM 8GB)는 이 용도에 매우 적합했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: 2014ねんせいの ThinkBook(램 8ギガ)は、このようてにはぴったりにてした。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 2014년제 ThinkBook(RAM 8GB)는 이 용도에 적합했습니다.
- **mlx-qwen3.5-2b-4bit**: 2014 年製のThinkBook(RAM 8GB) は、この用途にはぴったりでした。
- **mlx-qwen3.5-2b-4bit-mt**: 2014 년 제작의 ThinkBook(RAM 8GB) 는 이 용도에 딱 맞았습니다.
- **mlx-qwen3.5-4b-4bit**: 2014 년 모델의 ThinkBook(RAM 8GB) 는 이 용도에 딱 맞았습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 2014년형 ThinkBook(RAM 8GB)는 이 용도에 아주 적합했습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 2014년식ThinkBook(RAM 8GB)은 이 용도에 딱 맞았습니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 2014 년 제작된 ThinkBook (RAM 8 GB) 은 이 용도로는 완벽했습니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 2014년식 ThinkBook(RAM 8GB)는 이 용도에 완벽하게 적합했습니다.

**ja-seq-03** (seq)

- 원문: まず [Debian 12] をインストールし、写真を閲覧するための小さなWebアプリ、Fernboxを設定しました。
- **apple-fm**: 먼저[Debian 12]Debian 12
- **apple-mt-attr**: 먼저 [Debian 12]을 설치하고, 사진을 감상하기 위한 작은 Web앱, Fernbox를 설정했습니다.
- **apple-mt-marker**: 먼저 [Debian 12]을 설치하고, 사진을 조회하기 위한 작은 Web앱, Fernbox를 설정했습니다.
- **apple-mt-marker-batch**: 먼저 [Debian 12]을 설치하고, 사진을 조회하기 위한 작은 Web앱, Fernbox를 설정했습니다.
- **apple-mt-plain**: 먼저 [Debian 12] 을 설치하고, 사진을 조회하기 위한 작은 Web앱, Fernbox를 설정했습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 첫번째로, [Debian 12] 사진을 볼 수 있는 작은 웹 애플리케이션인 Fernbox를 설정했습니다.
- **ct2-nllb-1.3b**: 먼저, [Debian 12] 그래서 저는 Fernbox라는 작은 웹 앱을
- **ct2-nllb-600m**: 먼저, [Debian 12] 그래서 저는 이 작은 웹 앱을 설치하고 사진을 볼 수 있는
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 일본어다. 경어체(です・ます)는 존댓말(해요체/합니다체)로, 평어체(だ・である)는 평서체(~다)로 대응시켜라. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라. [Debian 12] 이참, Fernbox이라는 작은 웹앱을 설치하고 사진을 보기 위한 것들을 위해 설정했습니다.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 먼저 [Debian 12]을 설치하고, 사진을 볼 수 있는 작은 웹 앱인 Fernbox를 설정했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: 먼저 [Debian 12] 을 설치하고, 사진을 열람하기 위한 작은 Web앱, Fernbox를 설정했습니다.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 처음 [Debian 12] Fernbox를 설치하고, 사진을 확인할 수 있는 작은 웹 앱으로 설정했습니다.
- **mlx-qwen3.5-2b-4bit**: まず[Debian 12]Debian 12
- **mlx-qwen3.5-2b-4bit-mt**: 먼저 [Debian 12] 를 설치하고, 사진을閲覧するための小さな Web アプリ Fernbox 를 설정しました。
- **mlx-qwen3.5-4b-4bit**: 먼저 [Debian 12]Debian 12
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 먼저 [Debian 12]을 설치하고, 사진을 보기 위한 간단한 웹 앱인 Fernbox를 설정했습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 먼저 [Debian 12]를 설치하고, 사진을 볼 수 있는 작은 웹 앱인 Fernbox를 설정했습니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 먼저 [Debian 12]Debian 12 를 설치하고, 사진을 보기 위한 작은 Web 앱인 Fernbox 을 설정했습니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 먼저 [Debian 12]를 설치하고, 사진을 보기 위한 간단한 웹 애플리케이션인 Fernbox을 설정했습니다.

**ja-seq-04** (seq)

- 원문: 妹は最初は半信半疑でしたが、1週間後には「今まで使ったどのクラウドサービスよりもFernboxのほうが速い」と認めてくれました。
- **apple-fm**: 오빠는 처음에는 회의적이었습니다만, 1주일 후에는
- **apple-mt-attr**: 여동생은 처음에는 반신반의했지만, 1주일 후에는 "지금까지 사용한 어떤 클라우드 서비스보다 Fernbox가 더 빠르다"고 인정해 주었습니다.
- **apple-mt-marker**: 여동생은 처음에는 반신반의했지만, 1주일 후에는 "지금까지 사용한 어떤 클라우드 서비스보다 Fernbox가 더 빠르다"고 인정해 주었습니다.
- **apple-mt-marker-batch**: 여동생은 처음에는 반신반의했지만, 1주일 후에는 "지금까지 사용한 어떤 클라우드 서비스보다 Fernbox가 더 빠르다"고 인정해 주었습니다.
- **apple-mt-plain**: 여동생은 처음에는 반신반의했지만, 1주일 후에는 "지금까지 사용한 어떤 클라우드 서비스보다 Fernbox가 더 빠르다"고 인정해 주었습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 여동생은 처음에는 반신반의했지만 1주일 후에는 "Fernbox가 지금까지 사용했던 모든 클라우드 서비스보다 빠르다"고 인정했습니다.
- **ct2-nllb-1.3b**: 제 여동생은 처음에는 회의적이었습니다. 하지만 일주일 후, 그녀는 "나는 지금까지 사용했던 모든 클라우드 서비스보다 페른박스가 더 빠르다고 인정했습니다".
- **ct2-nllb-600m**: 제 여동생은 처음에는 반정신적이었지만 일주일 후에 그녀는 "Fernbox은 지금까지 사용했던 모든 클라우드 서비스보다 더 빠르다"고 인정했습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 나는 처음에는 의심이 조금씩 있었지만, 한 일주일 후에는 "지금까지 사용했던 어떤 클라우드 서비스보다 Fernbox가 훨씬 빠르다"고 인정했습니다.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 여동생은 처음에는 의심스러워했지만, 1주일 후에는 “지금까지 사용해본 모든 클라우드 서비스보다 Fernbox가 더 빠릅니다”라고 인정했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: 妹は最初は半信半疑でしたが、1週間後には「今まで使ったどのクラウドサービスよりもFernboxのほうが速い」と認めてくれました。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 동생은 처음에는 반나절이었지만, 1주일 후에는 「이제껏 사용한 모든 클라우드 서비스보다 Fernbox가 빠르다」と 인정해 주셨다.
- **mlx-qwen3.5-2b-4bit**: 妹は最初は半信半疑でしたが、1 週間後には「今まで使ったどのクラウドサービスよりも Fernbox ほうが速い」と認めてくれました。
- **mlx-qwen3.5-2b-4bit-mt**: 妹は最初は半信半疑でしたが、1週間後には「今まで使ったどのクラウドサービスよりも Fernbox のほうが速い」と認めてくれました。
- **mlx-qwen3.5-4b-4bit**: 언니는 처음에는 반신반의했지만, 1 주日后에는 'Fernbox 는 지금까지 사용한 모든 클라우드 서비스보다 빠르다'고 인정했습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 처음에는 약간 의심했지만, 일주일 후에는 “지금까지 사용해본 클라우드 서비스 중 Fernbox가 가장 빠르다”라고 인정해 주었습니다.
- **ollama-gemma4-e2b**: 妹は最初は半信半疑でしたが、1週間後には「今まで使ったどのクラウドサービスよりもFernboxのほうが速い」と認めてくれました。
- **ollama-gemma4-e4b**: 여동생은 처음에는 반신반의했지만, 일주일 후에는 "지금까지 써본 어떤 클라우드 서비스보다 Fernbox가 빠르다"고 인정해 주었습니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 어머니는 처음에는 의심스러웠지만, 1 주 후에는 "지금까지 사용했던 클라우드 서비스 중 Fernbox 가 가장 빠르다고 인정했습니다."라고 인정해 주었습니다.
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 처음에는 의심스러워했지만, 1주일 후에는 "지금까지 사용해본 클라우드 서비스 중 Fernbox가 가장 빠르다"라고 인정해 주었습니다.

**ja-seq-05** (seq)

- 원문: 今では古いノートPCは棚の上で静かに動いており、Fernboxは旅行から帰ったあと、家族全員が最初に開くアプリになっています。
- **apple-fm**: 지금은 오래된 노트북이 선반 위에서 조용히 작동하고 있고,Fernbox은 여행에서 돌아온 후, 가족 모두가 가장 먼저 사용하는 앱이 되었습니다.
- **apple-mt-attr**: 지금은 오래된 노트북은 선반 위에서 조용히 움직이고 있으며, Fernbox는 여행에서 돌아온 뒤, 가족 모두가 가장 먼저 열는 앱이 되었습니다.
- **apple-mt-marker**: 지금은 오래된 노트북은 선반 위에서 조용히 움직이고 있으며, Fernbox는 여행에서 돌아온 뒤, 가족 모두가 가장 먼저 열는 앱이 되었습니다.
- **apple-mt-marker-batch**: 지금은 오래된 노트북은 선반 위에서 조용히 움직이고 있으며, Fernbox는 여행에서 돌아온 뒤, 가족 모두가 가장 먼저 열는 앱이 되었습니다.
- **apple-mt-plain**: 지금은 오래된 노트북은 선반 위에서 조용히 움직이고 있으며, Fernbox는 여행에서 돌아온 뒤, 가족 모두가 가장 먼저 열는 앱이 되었습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 이제 오래된 노트북은 선반 위에서 조용히 작동하고 있으며 Fernbox는 여행에서 돌아온 후 가족 전체가 처음으로 열는 앱이 되었습니다.
- **ct2-nllb-1.3b**: 이제 오래된 노트북 컴퓨터는 책상 위에 조용히 움직이고 있습니다. 그리고 Fernbox는 여행에서 돌아온 후 가족 모두가 먼저 열는 앱입니다.
- **ct2-nllb-600m**: 이제 오래된 노트북은 셰일프 위에 조용히 움직이고 있습니다. 그리고 Fernbox은 여행에서 돌아온 첫 번째 앱입니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 지금은 옛날 노트북 PC는 천장에 기대어 조용히 움직이고 있습니다. Fernbox는 여행 후, 가족 모두가 처음 열어보는 앱이 됩니다.
- **mlx-gemma-4-e2b-4bit**: (오류: block missing in output)
- **mlx-gemma-4-e2b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 이제 오래된 노트북은 선반 위에서 조용히 작동하고 있으며, Fernbox는 여행에서 돌아온 후 가족 모두가 먼저 열는 앱이 되었습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hyperclovax-seed-1.5b-4bit-mt**: (오류: fetch failed: connect ECONNREFUSED 127.0.0.1:8080)
- **mlx-kanana-2-3b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit-mt**: 今では古いノートPCは棚の上で静かに動いており、Fernboxは旅行から帰ったあと、家族全員が最初に開くアプリになっています。
- **mlx-qwen3-1.7b-4bit**: 今では古いノートPCは棚の上で静かに動いており、Fernboxは旅行から帰ったあと、家族全員が最初に開くアプリになっています。
- **mlx-qwen3-1.7b-4bit-mt**: 현재는 오래된 노트PC가 방에 서서 정 still(정지)하게 움직이고 있으며, Fernbox는 여행이 끝난 후에 가족 전체가 처음으로 열리는 앱으로 되어 있습니다.
- **mlx-qwen3.5-2b-4bit**: 今では古いノート PC は棚の上で静かに動いており、Fernboxは旅行から帰ったあと、家族全員が最初に開くアプリになっています。
- **mlx-qwen3.5-2b-4bit-mt**: 今では古いノート PC は棚の上で静かに動いており、Fernbox は旅行から帰ったあと、家族全員が最初に開くアプリになっています。
- **mlx-qwen3.5-4b-4bit**: 이제 오래된 노트북 PC 는 책상 위에 조용히 돌아가며, Fernbox는 여행에서 돌아온 후 가족 모두가 먼저 여는 앱이 되었습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 이제 오래된 노트북은 책상 위에 조용히 작동하고, Fernbox는 여행을 마치고 돌아온 후, 가족 구성원 모두가 가장 먼저 사용하는 앱입니다.
- **ollama-gemma4-e2b**: 今では古いノートPCは棚の上で静かに動いており、Fernbox は旅行から帰ったあと、家族全員が最初に開くアプリになっています。(누락)
- **ollama-gemma4-e4b**: 이제 오래된 노트북은 선반 위에서 조용히 작동하고 있으며, Fernbox는 여행에서 돌아온 후 가족 모두가 가장 먼저 여는 앱이 되었습니다.
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 현재는 오래된 노트북 PC 는 조용히 서랍 위에 있고, Fernbox 는 여행에서 돌아온 후, 가족이 먼저开的 앱입니다.(누락)
- **ollama-translategemma-4b**: (오류: HTTP 500: {"error":{"message":"prediction aborted, token repeat limit reached","type":"api_error","param":null,"code":null}} )
- **ollama-translategemma-4b-mt**: 이제 오래된 노트북은 책상 위에 조용히 놓여 있고, Fernbox는 여행에서 돌아온 후 가족들이 가장 먼저 사용하는 앱이 되었습니다.

### zh-Hans

**zh-Hans-tech-01** (tech)

- 원문: 要安装命令行工具,请运行 [npm install -g fernctl],然后用 [fernctl --version] 检查版本。需要 2.4.1 或更高版本。
- **apple-fm**: 명령줄 도구 설치하려면 실행하세요[npm install -g fernctl], 그리고 사용하세요[fernctl --version]버전 확인합니다. 버전이 2.4.1 이상이어야 합니다
- **apple-mt-attr**: 명령줄 도구를 설치하려면 을 실행한 [npm install -g fernctl]후 사용하여 [fernctl --version]버전을 확인하십시오. 2.4.1 이상 버전이 필요합니다.
- **apple-mt-plain**: 명령줄 도구를 설치하려면 실행하십시오. [npm install -g fernctl],그런 다음 사용한다 [fernctl --version] 버전 확인. 2.4.1 이상 버전이 필요합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 명령줄 도구를 설치하려면 다음을 실행하십시오. [npm install -g fernctl]그래, 그래 [fernctl --version] 버전을 확인하세요. 버전 2.4.1 이상이 필요합니다.
- **ct2-nllb-1.3b**: 명령줄 도구를 설치하려면 실행하세요. [npm install -g fernctl]그리고는 [fernctl --version] 버전 확인. 2.4.1 또는 더 높은 버전이 필요합니다.
- **ct2-nllb-600m**: 명령줄 도구를 설치하려면 실행하십시오. [npm install -g fernctl]그리고 [fernctl --version] 2.4.1 또는 더 높은 버전이 필요합니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 要安装命令行工具, 请运行 [npm install -g fernctl],然后用 [fernctl --version] 检查版本。需要 2.4.1 或更高版本。 ```
- **mlx-gemma-4-e2b-4bit**: 要安装命令行工具,请运行[npm install -g fernctl],然后用[fernctl --version]检查版本。需要 2.4.1 或更高版本。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 명령줄 도구를 설치하려면 [npm install -g fernctl]을 실행한 후 [fernctl --version]를 사용하여 버전을 확인하세요. 2.4.1 이상의 버전이 필요합니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (누락)[npm install -g fernctl]。迁移脚本会直接改写所有文本,而且无法�[fernctl --version](누락)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 要安装命令行工具，请运行 [npm install -g fernctl]，然后用 [fernctl --version] 检查版本。需要 2.4.1 或更高版本。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 要安装命令行工具，请运行 [npm install -g fernctl]，然后用 [fernctl --version] 检查版本。需要 2.4.1 或更高版本。
- **mlx-qwen3.5-2b-4bit**: 要安装命令行工具，请运行[npm install -g fernctl]，然后用[fernctl --version]检查版本。需要 2.4.1 或更高版本。
- **mlx-qwen3.5-2b-4bit-mt**: 명령행 도구 설치하려면 [npm install -g fernctl] 를 실행하고, [fernctl --version] 를 통해 버전 확인하세요. 2.4.1 이상 버전이 필요합니다.
- **mlx-qwen3.5-4b-4bit**: 설치하려는 명령줄 도구를 설치하려면 다음 명령을 실행하세요:[npm install -g fernctl]그런 다음 다음 명령으로 버전 확인을 수행하세요:[fernctl --version]버전 확인 시 2.4.1 버전 이상이어야 합니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 명령줄 도구를 설치하려면 [npm install -g fernctl]를 실행하고, [fernctl --version]를 사용하여 버전을 확인하세요. 2.4.1 버전 이상이 필요합니다.
- **ollama-gemma4-e2b**: 명령줄 도구를 설치하려면 [npm install -g fernctl],그리고 [fernctl --version](누락)
- **ollama-gemma4-e4b**: 커맨드라인 도구를 설치하려면 다음을 실행하세요.[npm install -g fernctl]", 그리고 다음으로 "[fernctl --version]버전을 확인하세요. 2.4.1 이상이 필요합니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: 要安装命令行工具，请运行 [npm install -g fernctl](누락)[fernctl --version](누락)
- **ollama-translategemma-4b**: 명령줄 도구를 설치하려면 다음 명령을 실행하세요 [npm install -g fernctl](누락)[fernctl --version](누락)
- **ollama-translategemma-4b-mt**: 명령줄 도구를 설치하려면 [npm install -g fernctl]를 실행하고, [fernctl --version]를 사용하여 버전을 확인하십시오. 2.4.1 또는 그 이상의 버전이 필요합니다.

**zh-Hans-tech-02** (tech)

- 원문: [timeout] 选项的单位是毫秒,默认值为 30000(30 秒),设为 0 则完全不限制超时。
- **apple-fm**: [timeout]옵션 단위는 밀리초로, 기본값은 30,000(30초)이며, 0으로 설정하면 시간 초과가 전혀 제한되지 않습니다
- **apple-mt-attr**: [timeout]옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 초과 시간을 전혀 제한하지 않습니다.
- **apple-mt-plain**: [timeout] 옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 초과 시간을 전혀 제한하지 않습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: [timeout] 옵션의 단위는 밀리초이며, 기본값은 30000(30초)이며, 0으로 설정하면 시간 제한이 전혀 없습니다.
- **ct2-nllb-1.3b**: [timeout] 옵션의 단위는 밀리 초이고, 기본값은 30000 ((30초) 이며, 0으로 설정하면 시간이 전혀 제한되지 않습니다.
- **ct2-nllb-600m**: [timeout] 선택의 단위는 밀리초이며 기본값은 30000 (~30초) 이며, 0을 설정하면 절대 초시간을 제한하지 않습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: [timeout] 30000  이 문장은 다음과 같이 번역할 수 있습니다.  30000  이 문장은 30000을 30000으로 표기하고, 0을 사용하지 않고, 30000을 기준으로 시간을 제한하는 것을 의미합니다.
- **mlx-gemma-4-e2b-4bit**: [timeout]选项的单位是毫秒,默认值为 30000(30 秒),设为 0 则完全不限制超时。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: [timeout] 옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 타임아웃이 전혀 제한되지 않습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: [timeout] 的单位是毫秒,默认值为 30000(30 秒),设为 0 则完全不限制超时。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: [timeout] 옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0을 설정하면 완전히 지연 시간 제한이 해제됩니다.
- **mlx-qwen3.5-2b-4bit**: [timeout]选项的单位是毫秒，默认值为 30000(30 秒)，设为 0 则完全不限制超时。
- **mlx-qwen3.5-2b-4bit-mt**: [timeout] 옵션의 단위는 밀리초이며, 기본값은 30000(30 초)입니다. 0 으로 설정하면 무한 대기 (timeout) 상태를 유지하게 됩니다.
- **mlx-qwen3.5-4b-4bit**: [timeout]시간 제한 옵션의 단위는 밀리초이며, 기본값은 30000(30 초)입니다. 0 으로 설정하면 시간 제한을 완전히 해제할 수 있습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: [timeout] 옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 초과 시간을 완전히 제한하지 않습니다.
- **ollama-gemma4-e2b**: [timeout]옵션의 단위는 밀리초이며, 기본값은 30000(30초)이고, 0으로 설정하면 시간 초과를 완전히 제한하지 않습니다.
- **ollama-gemma4-e4b**: [timeout]옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 시간 초과 제한이 완전히 사라집니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: [timeout]옵션의 단위는 밀리초(ms)이고, 기본값은 30000(30초)이며, 0으로 설정하면 완전히 제한되지 않습니다.
- **ollama-translategemma-4b-mt**: [timeout] 옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 타임아웃 제한이 전혀 없습니다.

**zh-Hans-tech-03** (tech)

- 원문: 从 v1.x 升级之前,请先备份配置目录。迁移脚本会直接改写所有文件,而且无法撤销。
- **apple-fm**: v1.x 업데이트 전에 먼저 백업하세요설정 디렉토리파일을 모두 수정하고 되돌릴 수 없습니다
- **apple-mt-attr**: v1.x로 업그레이드하기 전에, 먼저 백업해 주세요구성 디렉토리를 . 이식 스크립트는 모든 파일을 직접 수정하며, 취소할 수 없습니다.
- **apple-mt-plain**: v1.x로 업그레이드하기 전에, 먼저 구성 디렉토리를 백업해 주세요. 이식 스크립트는 모든 파일을 직접 수정하며, 취소할 수 없습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: v1.x에서 업그레이드하기 전에 구성 디렉토리를 백업하십시오. 마이그레이션 스크립트는 모든 파일을 직접 덮어씁니다.
- **ct2-nllb-1.3b**: v1.x에서 업그레이드하기 전에 설정 디렉토리를 백업하십시오. 마이그레이션 스크립트는 모든 파일을 바로 다시 작성하고 취소 할 수 없습니다.
- **ct2-nllb-600m**: v1.x를 업그레이드하기 전에, 기본 설정 카테고리를 백업하십시오. 마이그레이션 스크린은 모든 파일을 직접 다시 작성하여 취소할 수 없습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: From version 1.x, before the upgrade, please back up the configuration directory. The migration script will directly rewrite all files, and it cannot be reverted.
- **mlx-gemma-4-e2b-4bit**: 从 v1.x 升级之前,请先备份配置目录。迁移脚本会直接改写所有文件,而且无法撤销。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: v1.x로 업그레이드하기 전에, 먼저 설정 디렉터리를 백업해 주세요. 마이그레이션 스크립트는 모든 파일을 직접 수정하며, 되돌릴 수 없습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 번역문만 출력합니다.  원문: 从 v1.x 升级之前，请先备份配置目录。迁移脚本会直接改写所有文件,而且无法撤销。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 업데이트 전에 구성 폴더를 백업해 주세요. 이전 버전에서 이전 버전의 파일을 직접 수정할 수 있으며, 복구할 수 없습니다.
- **mlx-qwen3.5-2b-4bit**: 从 v1.x 升级之前，请先备份配置目录。迁移脚本会直接改写所有文件，而且无法撤销。
- **mlx-qwen3.5-2b-4bit-mt**: v1.x 에서 이전한 경우, 먼저 설정 디렉션을 백업해 두십시오. 마이그레이션 스크립트는 모든 파일을 직접 수정하고 되돌릴 수 없습니다.
- **mlx-qwen3.5-4b-4bit**: v1.x 버전으로 업그레이드하기 전에 반드시 설정 디렉토리를 백업하세요. 마이그레이션 스크립트는 모든 파일을 직접 덮어쓰며 되돌릴 수 없습니다.(누락)(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: v1.x 버전으로 업그레이드하기 전에, 먼저 설정 폴더를 백업해 주세요. 마이그레이션 스크립스는 모든 파일을 직접 수정하며, 되돌릴 수 없습니다.
- **ollama-gemma4-e2b**: v1.x로 업그레이드하기 전에, 먼저 설정 디렉터리를 백업하세요. 마이그레이션 스크립트는 모든 파일을 직접 덮어쓰며, 되돌릴 수 없습니다.
- **ollama-gemma4-e4b**: v1.x로 업그레이드하기 전에, 먼저 백업해 주세요.설정 디렉토리를마이그레이션 스크립트는 모든 파일을 직접 덮어쓰며, 되돌릴 수 없습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: v1.x 버전으로 업그레이드하기 전에 먼저 백업하세요 (누락)(누락)
- **ollama-translategemma-4b-mt**: v1.x 버전에서 v2.x 버전으로 업그레이드하기 전에, 반드시 설정 디렉토리를 백업해 두십시오. 마이그레이션 스크립트는 모든 파일을 직접 수정하며, 이 작업을 되돌릴 수 없습니다.

**zh-Hans-tech-04** (tech)

- 원문: 如果守护进程无法启动,请确认端口 8443 没有被其他进程占用。日志可以在 http://localhost:8443/debug/logs 查看。
- **apple-fm**: 보안 프로세스가 시작되지 않으면 8443 포트가 다른 프로세스에 사용 중인지 확인하세요. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다
- **apple-mt-attr**: 보호 프로세스를 시작할 수 없는 경우, 포트 8443이 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain**: 보호 프로세스를 시작할 수 없는 경우, 포트 8443이 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 가디언 프로세스가 시작되지 않으면 포트 8443이 다른 프로세스에 의해 사용되지 않는지 확인하십시오. 로그는 http://localhost:8443/debug/logs 에서 볼 수 있습니다.
- **ct2-nllb-1.3b**: 보호 프로세스가 시작되지 않으면 포트 8443가 다른 프로세스에 의해 점유되지 않았는지 확인하십시오. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **ct2-nllb-600m**: 보호 프로세스가 시작되지 않을 경우, 포트 8443가 다른 프로세스에 의해 점유되지 않았음을 확인하십시오. 로그를 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 만약 프로세스가 시작되지 못한다면, 포트 8443이 다른 프로세스가 사용되고 있는지 확인하세요. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **mlx-gemma-4-e2b-4bit**: 如果守护进程无法启动,请确认端口 8443 没有被其他进程占用。日志可以在 http://localhost:8443/debug/logs 查看。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 보호 프로세스가 시작되지 않는다면, 포트 8443이 다른 프로세스에 점유되어 있지 않은지 확인하세요. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 如果守护进程无法启动，请确认端口8443没有被其他进程占用。日志可以在http://localhost:8443/debug/logs查看。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라.
- **mlx-qwen3.5-2b-4bit**: 如果守护进程无法启动，请确认端口 8443 没有被其他进程占用。日志可以在 http://localhost:8443/debug/logs 查看。
- **mlx-qwen3.5-2b-4bit-mt**: 守护进程이 시작되지 않는 경우, 포트 8443 가 다른 프로세스를 위해 사용되고 있는지 확인하십시오. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **mlx-qwen3.5-4b-4bit**: 데몬이 시작되지 않는 경우, 포트 8443 이 다른 프로세스에 할당되지 않았는지 확인하세요. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 만약 프로세스가 시작되지 않으면, 포트 8443이 다른 프로세스에 의해 사용되고 있는지 확인하십시오. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **ollama-gemma4-e2b**: 만약守护进程이 시작되지 않으면, 포트 8443이 다른 프로세스에 의해 사용되고 있지 않은지 확인하세요. 로그는 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **ollama-gemma4-e4b**: 데몬 프로세스가 시작되지 않으면, 포트 8443이 다른 프로세스에 의해 사용 중이 아닌지 확인해 주세요. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 만약 보호 프로세스가 시작되지 않으면, 포트 8443이 다른 프로세스에 의해 사용되고 있는지 확인하십시오. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.

**zh-Hans-tech-05** (tech)

- 원문: 每个工作线程都有各自约 64 MB 的缓存,因此内存为 8 GB 的机器最多运行八个工作线程。
- **apple-fm**: 각 작업 스레드는 약 64MB의 캐시를 사용하므로, 8GB 메모리를 사용하는 컴퓨터에서는 최대 8개의 작업 스레드를 실행할 수 있습니다
- **apple-mt-attr**: 각 작업 스레드는 각각 약 64 MB의 캐시를 가지고 있으므로, 메모리가 8 GB인 기계는 최대로 여덟 개의 작업 스레드를 실행할 수 있습니다.
- **apple-mt-plain**: 각 작업 스레드는 각각 약 64 MB의 캐시를 가지고 있으므로, 메모리가 8 GB인 기계는 최대로 여덟 개의 작업 스레드를 실행할 수 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 각 스레드는 각각 약 64MB의 캐시를 가지고 있으므로 8GB의 메모리가 있는 시스템에서는 최대 8개의 스레드를 실행할 수 있습니다.
- **ct2-nllb-1.3b**: 각 작업 스레드는 각각 64 MB 정도의 캐시를 가지고 있기 때문에 8 GB의 메모리의 기계는 최대 8 개의 작업 스레드를 실행할 수 있습니다.
- **ct2-nllb-600m**: 각 작업 스레드는 각각 64 MB의 캐시를 가지고 있으므로 8 GB의 메모리를 가진 기계는 최대 8 개의 작업 스레드를 실행합니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 어조: 자연스럽게 고유명사: 64MB, 8GB 숫자: 8 URL: None 코드는: None  원문: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 간체(简体中文)다. ```
- **mlx-gemma-4-e2b-4bit**: 每个工作线程都有各自约 64 MB 的缓存,因此内存为 8 GB 的机器最多运行八个工作线程。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 각 작업 스레드는 약 64 MB의 캐시를 가지고 있으므로, 메모리가 8 GB인 머신에서는 최대 8개의 작업 스레드가 실행될 수 있습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 每个工作线程都有各自约 64 MB 的缓存，因此内存为 8 GB 的机器最多运行八个工作线程。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 각 작업 스레드가 64MB의 캐시를 가진다. 따라서 8GB의 메모리 기반의 컴퓨터는 최대 8개의 작업 스레드를 실행할 수 있다.
- **mlx-qwen3.5-2b-4bit**: 每个工作线程都有各自约 64 MB 的缓存，因此内存为 8 GB 的机器最多运行八个工作线程。
- **mlx-qwen3.5-2b-4bit-mt**: 각 작업 스레드는 약 64 MB 의 캐시를 가지므로, 8 GB 메모리를 가진 머신은 최대 8 개의 작업 스레드를 실행할 수 있습니다.
- **mlx-qwen3.5-4b-4bit**: 각 작업 스레드는 약 64 MB 의 캐시를 가지므로, 8 GB 메모리를 가진 시스템은 최대 8 개의 작업 스레드를 실행할 수 있습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 각 작업 스레드는 각각 약 64MB의 캐시를 가지므로, 8GB의 메모리를 가진 기기는 최대 8개의 작업 스레드를 실행할 수 있습니다.
- **ollama-gemma4-e2b**: 각 워크 스레드는 각각 약 64MB의 캐시를 가지므로, 메모리가 8GB인 기기에서는 최대 여덟 개의 워크 스레드만 실행할 수 있습니다.
- **ollama-gemma4-e4b**: 각 워크 스레드는 약 64 MB의 캐시를 가지고 있으므로, 메모리가 8 GB인 장비는 최대 8개의 워크 스레드를 실행할 수 있습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 각 작업 스레드는 약 64MB의 캐시를 가지고 있으므로, 8GB의 메모리를 가진 시스템은 최대 8개의 작업 스레드를 실행할 수 있습니다.

**zh-Hans-tech-06** (tech)

- 원문: 请求最多会以指数退避的方式重试三次;如果全部失败,错误会以 [TransientError] 的形式返回给调用方。
- **apple-fm**: 요청은 최대 3회 지수적 시도로 다시 시도합니다. 모든 시도가 실패하면 오류는[TransientError]TransientError
- **apple-mt-attr**: 요청은 최대 지수적 후퇴 방식으로 세 번 다시 시도할 수 있다; 만약 모두 실패하면, 오류는 [TransientError]의 형태로 호출자에게 반환된다.
- **apple-mt-plain**: 요청은 최대 지수적 후퇴 방식으로 세 번까지 재시도할 수 있다; 만약 모두 실패하면, 오류는 [TransientError] 의 형태가 호출자에게 반환된다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 요청은 최대 세 번 지수 방법으로 다시 시도되며, 모두 실패하면 다음과 같은 오류가 발생합니다. [TransientError] 호출자에게 형식을 반환합니다.
- **ct2-nllb-1.3b**: 요청은 최대 3회까지 지수 회피 방식으로 다시 시도됩니다. 모든 것이 실패하면 오류가 표시됩니다. [TransientError] 이 글의 형태는 호출자에게 반환됩니다.
- **ct2-nllb-600m**: 요청은 최대 3회 이상 지수 회귀 방식으로 재시행되며, 모두 실패하면 오류는 [TransientError] 이 자료를 통해,
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 간체(简体中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  **번역:**  "이 요청은 최대 3번의 시도 후에 다시 시도할 수 있습니다. 모든 시도가 실패하면 오류 메시지가 표시됩니다."  **설명:**  *   **어조:**  "이 요청은"이라는 표현은 상황에 따라 다양한 어조로 해석될 수 있습니다.  이 경우,  "이 요청은"이라는 표현은  "이 요청은"이라는  간단하고 명확한 표현으로,  문맥에 따라  다양한 의미를 가질 수 있습니다. *   **고유명사:**  "이 요청"은  문맥에 따라  "이 요청"으로  간단하게  표현될 수 있습니다. *   **숫자:**  "3번의 시도"는  "3번의 시도"로  간단하게  표현될 수 있습니다. *   **URL, 코드는 원문 그대로 유지:**  이 부분은  원문 그대로  유지합니다. *   **추가적인 설명:**  "이 요청은"이라는 표현은  문맥에 따라  다양한 의미를 가질 수 있습니다.  이 경우,  "이 요청은"이라는  간단하고 명확한 표현으로  문맥에 따라  다양한 의미를 가질 수 있습니다.  **생각 과정:**  원문은  중국어 간체(简体中文)다.  이러한  문맥에  적합한  번역을  생성하기 위해  원문과  문맥을  잘  알고  번역해야 합니다.  이러한  번역은  원문과  문맥을  잘  알고  번역해야 합니다. [TransientError] 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 간체(简体中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.
- **mlx-gemma-4-e2b-4bit**: 请求最多会以指数退避的方式重试三次;如果全部失败,错误会以[TransientError]TransientError
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 요청은 최대 3번까지 지수적 회피 방식으로 재시도됩니다. 만약 모두 실패하면 오류는 [TransientError] 형태로 호출자에게 반환됩니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 请求最多会以指数退避的方式重试三次;如果全部失败,错误会以 [TransientError] 번역할 텍스트 없음
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 请求最多会以指数退避的方式重试三次；如果全部失败，错误会以 [TransientError] 的形式返回给调用方。
- **mlx-qwen3.5-2b-4bit**: 请求最多会以指数退避的方式重试三次；如果全部失败，错误会以[TransientError]的形式返回给调用方。
- **mlx-qwen3.5-2b-4bit-mt**: 최대 3 회로써서 지수적 재시도 방식으로 요청할 수 있습니다. 모든 요청이 실패하면 [TransientError] 로 호출자에게 반환됩니다.
- **mlx-qwen3.5-4b-4bit**: 요청이 최대 3 회 지수 백오프 방식으로 재시도됩니다. 모든 재시도가 실패하면 오류는 다음 형태로 호출자에게 반환됩니다:[TransientError]TransientError
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 최대 3번의 시도 후, 지수로 실패할 경우, 오류는 호출자에게 [TransientError] 형태로 반환됩니다.
- **ollama-gemma4-e2b**: 요청은 최대 세 번 지수 백오프 방식으로 재시도되며, 모두 실패하면 오류는 [TransientError]의 형태로 호출자에게 반환됩니다.
- **ollama-gemma4-e4b**: 요청은 최대 지수 백오프 방식으로 세 번 재시도됩니다. 만약 모두 실패하면, 오류는 다음 형식으로 호출자에게 반환됩니다.[TransientError].
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 요청은 최대 3번까지 지수 방식으로 재시도될 수 있습니다. 모든 시도가 실패하면, 오류는 [TransientError] 형태로 호출자에게 반환됩니다.

**zh-Hans-news-01** (news)

- 원문: 市议会周二以 7 票对 2 票通过了将公交线路延伸至东部郊区的方案,支持者认为这将使通勤时间最多缩短 25%。
- **apple-fm**: 월요일 오후, 시 의회는 버스 노선을 동부 외곽까지 연장하는 방안을 7대 2로 의결했습니다. 지지자들은 이를 통해 출퇴근 시간이 최대 25% 단축될 것이라고 말합니다
- **apple-mt-attr**: 시 의회는 화요일에 7대 2의 표 차이로 버스 노선을 동부 교외로 연장하는 계획을 승인했으며, 지지자들은 이것이 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 생각한다.
- **apple-mt-plain**: 시 의회는 화요일에 7대 2의 표 차이로 버스 노선을 동부 교외로 연장하는 계획을 승인했으며, 지지자들은 이것이 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 생각한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 시의회는 화요일 7 대 2로 동부 교외 지역으로 버스 노선을 확장하는 계획을 통과시켰으며 지지자들은 이것이 통근 시간을 최대 25 % 줄일 것이라고 주장합니다.
- **ct2-nllb-1.3b**: 시의회는 7대 2의 찬성으로 버스 노선을 동부 교외로 확장하는 방안을 통과시켰고, 지지자들은 이 방안이 통근 시간을 최대 25%까지 줄일 것이라고 말했다.
- **ct2-nllb-600m**: 시회는 화요일 7명 2명으로 버스 노선을 동부 시외로 확장할 방안을 통과시켰고, 지지자들은 이를 통해 최대 25%의 출근 시간을 줄일 것으로 보고 있다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 市议会周二以 7 票对 2 票通过了将公交线路延伸至东部郊区的方案，支持者认为这将使通勤时间最多缩短 25%。  **번역:**  시의회는 금요일에 7표로 2표를 통과하여, 버스 노선을 동부 지역으로 확장하는 방안을 승인했습니다. 지지자들은 이 방안이 이동 시간을 최대 25% 단축할 것이라고 믿고 있습니다.  **설명:**  *   **市议会 (shì yìhuì)**: 시의회 (City Council) *   **周二 (zhōu 2)**: 금요일 (Friday) *   **以 7 票对 2 票通过了 (yǐ 7 piào duì 2 tiào bǔtǐ le)**: 7표로 2표를 통과했습니다 (7 votes for 2 votes passed). *   **将公交线路延伸至东部郊区的方案 (jiāng bùxiē xiànlì zhī diàndì kěfēng de fāngyù)**: 버스 노선을 동부 지역으로 확장하는 방안 (the plan to extend the bus lines to the east suburbs). *   **支持者认为这将使通勤时间最多缩短 (zhīnduìzhě rènwéi huì xiànshǐ jiāngkōngshí shíjiān zuì duō suōduǎn)**: 지지자들은 이 방안이 이동 시간을 최대 25% 단축할 것이라고 믿고 있습니다 (Supporters believe this will shorten commute time by 25%).  **추가적인 고려 사항:**  *   "以 7 票对 2 票通过了"는 "7표로 2표를 통과했다"라는 의미로, 시의회에서 승인한 방안의 최종적인 결과를 나타냅니다. *   "支持者认为"는 "지지자들은"이라는 표현으로, 지지자들이 이 방안에 대해 어떤 의견을 가지고 있는지 설명합니다.
- **mlx-gemma-4-e2b-4bit**: 市议会周二以 7 票对 2 票通过了将公交线路延伸至东部郊区的方案,支持者认为这将使通勤时间最多缩短 25%。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 시의회는 화요일에 7표 대 2표로 동부 교외 지역까지 버스 노선을 연장하는 방안을 통과시켰으며, 지지자들은 이로 인해 출근 시간이 최대 25% 단축될 것이라고 말했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 市议会周二以7票对2票通过了将公交线路延伸至东部郊区的方案,支持者认为这将使通勤时间最多缩登25%。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 시의회는 수요일 오후에 7표로 2표를 얻어 지하철 노선을 동쪽의 주변 지역으로 확장하는 방안을 통과시켰다. 지지자들은 이로 인해 통근 시간이 최대 25% 줄어들 것이라고 생각한다.
- **mlx-qwen3.5-2b-4bit**: 市议会周二以 7 票对 2 票通过了将公交线路延伸至东部郊区的方案，支持者认为这将使通勤时间最多缩短 25%。
- **mlx-qwen3.5-2b-4bit-mt**: 시의회는 화요일에 7 대 2 로 통과하여公交线路를 동부郊区로 확장하는 방안을 채택했다. 지지자들은 이 계획이 통근 시간을 최대 25% 줄일 것으로 기대한다.
- **mlx-qwen3.5-4b-4bit**: 시의회는 화요일 7 대 2 의 투표로 동부 교외까지 버스 노선을 연장하는 계획을 통과시켰으며, 지지자들은 이 조치로 통근 시간이 최대 25% 단축될 것이라고 주장했습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 시의회는 현지 시간으로 화요일, 7표에 대한 2표로 버스 노선을 동부 교외 지역으로 연장하는 계획을 통과시켰습니다. 지지자들은 이 계획이 통근 시간을 최대 25% 단축할 수 있다고 보았습니다.
- **ollama-gemma4-e2b**: 시의회는 화요일에 7표 대 2표로 버스 노선을 동부 교외 지역으로 연장하는 안건을 통과시켰으며, 지지자들은 이것이 통근 시간을 최대 25%까지 단축할 것이라고 생각합니다.
- **ollama-gemma4-e4b**: 시의회는 화요일에 버스 노선을 동부 교외 지역까지 연장하는 방안을 7 대 2로 통과시켰습니다. 지지자들은 이로 인해 통근 시간이 최대 25% 단축될 것이라고 예상합니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 시의회는 화요일 투표를 통해 동부 외곽 지역으로 버스 노선을 확장하는 방안을 7표 대 2표로 통과시켰습니다. 찬성 측은 이를 통해 출퇴근 시간을 최대 25% 단축할 수 있다고 주장했습니다.

**zh-Hans-news-02** (news)

- 원문: 哈尔沃森研究所的研究人员报告称,一种新型电池在经过 2000 次充放电循环后仍保持了 90% 的容量,约为目前市售电池的两倍。
- **apple-fm**: 하르보젠 연구소 연구진은 새로운 배터리가 2,000회 충전-방전 사이클 후에도 용량이 90%를 유지하며, 이는 현재 시중에서 판매되는 배터리의 두 배에 달한다고 보고했습니다
- **apple-mt-attr**: 하르보손 연구소의 연구원들은 새로운 배터리가 2000회 충전-방전 사이클을 거친 후에도 여전히 90%의 용량을 유지하고 있으며, 이는 현재 시중에 나와 있는 배터리의 약 두 배에 달한다고 보고했다.
- **apple-mt-plain**: 하르보손 연구소의 연구원들은 새로운 배터리가 2000회 충전-방전 사이클을 거친 후에도 여전히 90%의 용량을 유지하고 있으며, 이는 현재 시중에 나와 있는 배터리의 약 두 배에 달한다고 보고했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 할워슨 연구소의 연구원들은 새로운 배터리가 2,000회의 충전 및 방전 사이클 후에도 90%의 용량을 유지한다고 보고했습니다.
- **ct2-nllb-1.3b**: 하버슨 연구소의 연구자들은 새로운 종류의 배터리가 2000번의 충전과 배열 순환 후에도 90%의 용량을 유지할 수 있다고 보고했다. 이는 현재 시장에서 판매되는 배터리의 두 배 정도이다.
- **ct2-nllb-600m**: 하버슨 연구소 연구원들은 새로운 배터리가 2000회 충전 주기를 거쳐도 90%의 용량을 유지하고 있다고 보고했습니다. 이는 현재 시장에서 판매되는 배터리의 약 2배에 달한다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 연구원 보고에 따르면, 하르바슨 연구소의 연구팀은 2000회 충전 및 방전 횟수 반복 후에도 새로운 배터리가 90%의 용량을 유지했으며, 이는 현재 시중에서 판매되는 배터리의 두 배에 해당하는 것으로 나타났습니다.  **설명:**  *   **연구원 보고:** "연구원 보고"를 한국어로 번역하여 "연구원 보고"로 표현했습니다. *   **2000번 충전 및 방전 횟수 반복 후:** "2000회 충전 및 방전 횟수 반복 후"를 한국어로 번역하여 "2000회 충전 및 방전 횟수 반복 후"로 표현했습니다. *   **90%의 용량:** "90%의 용량"을 한국어로 번역하여 "90%의 용량"으로 표현했습니다. *   **두 배:** "두 배"를 한국어로 번역하여 "두 배"로 표현했습니다.  **추가적인 고려 사항:**  *   "연구팀"은 "연구원"과 동일하게 번역했습니다. *   "최근 시중에서 판매되는 배터리"는 "현재 시중에서 판매되는 배터리"로 번역했습니다. *   "두 배"는 "두 배"로 번역했습니다.  이러한 번역은 원문의 의미를 최대한 유지하면서 자연스러운 한국어 표현으로 전달하는 것을 목표로 했습니다.
- **mlx-gemma-4-e2b-4bit**: 哈尔沃森研究所的研究人员报告称,一种新型电池在经过 2000 次充放电循环后仍保持了 90% 的容量,约为目前市售电池的两倍。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 할로웬슨 연구소의 연구원들은 새로운 종류의 배터리가 2000회의 충전과 방전을 반복한 후에도 90%의 용량을 유지한다고 보고했습니다. 이는 현재 시장에 판매되는 배터리보다 약 두 배 높은 수치입니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 연구진은 신형 배터리가 2000회 충방전 후에도 90%의 용량을 유지했다고 보고했다. 이는 시판 중인 배터리의 두 배에 해당한다.
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 哈尔沃森研究所的研究人员报告称，一种新型电池在经过2000次充放电循环后仍保持了90%的容量，约为目前市售电池的两倍。
- **mlx-qwen3.5-2b-4bit**: 哈尔沃森研究所的研究人员报告称，一种新型电池在经过 2000 次充放电循环后仍保持了 90% 的容量，约为目前市售电池的两倍。
- **mlx-qwen3.5-2b-4bit-mt**: 哈尔沃森研究所的研究人员表示，一种新型电池在经过 2000 次充放电循环后仍保持 90% 的容量，约为目前市售电池的两倍。
- **mlx-qwen3.5-4b-4bit**: 하버드 연구소의 연구원들은 새로운 배터리가 2000 회 충방전 사이클 후에도 90% 의 용량을 유지하며, 이는 현재 시중 판매되는 배터리 용량의 약 두 배에 해당한다고 보고했습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 하르보슨 연구소의 연구진은 새로운 배터리가 2,000회 충방전 후에도 90%의 용량을 유지하며, 이는 현재 시장에 판매되는 배터리의 두 배에 해당한다고 보고했습니다.
- **ollama-gemma4-e2b**: 할워슨 연구소 연구원들은 새로운 배터리가 2000번의 충방전 사이클 후에도 90%의 용량을 유지하며, 이는 현재 판매되는 배터리의 두 배에 달한다고 보고했습니다.
- **ollama-gemma4-e4b**: 하얼워슨 연구소 연구원들에 따르면, 새로운 유형의 배터리가 2000번의 충방전 사이클을 거친 후에도 90%의 용량을 유지했으며, 이는 현재 시판되는 배터리보다 약 두 배에 달한다고 합니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 할보슨 연구소 연구진은 새로운 배터리가 2,000번의 충방전 사이클을 거친 후에도 90%의 용량을 유지하며, 이는 현재 시판되는 배터리의 두 배에 해당한다고 보고했습니다.

**zh-Hans-news-03** (news)

- 원문: 不过,批评者指出,这一结果尚未经过同行评审,而且样品的生产成本约为每千瓦时 340 美元。
- **apple-fm**: 그러나 비판자들은 이 결과가 동료 심사를 거치지 않았고, 샘플 생산 비용이 kWh당 약 340달러라고 지적합니다
- **apple-mt-attr**: 하지만, 비판자들은 이 결과가 아직 동료 심사를 받지 않았고, 샘플의 생산비용이 약 킬로와트시당 340달러에 달한다고 지적했다.
- **apple-mt-plain**: 하지만, 비판자들은 이 결과가 아직 동료 심사를 받지 않았고, 샘플의 생산비용이 약 킬로와트시당 340달러에 달한다고 지적했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 그러나 비평가들은 이 결과가 아직 동료 검토를 거치지 않았으며 표본 생산 비용이 킬로와트시당 약 340 달러라고 지적합니다.
- **ct2-nllb-1.3b**: 그러나 비평가들은 이 결과가 아직 평가를 받지 않았으며, 샘플의 생산 비용은 약 340달러/킬로와트라고 지적했다.
- **ct2-nllb-600m**: 그러나 비평가들은 이 결과는 아직 동료 평가를 받지 않았으며, 샘플의 생산 비용은 약 340달러/kWh라고 지적했다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 이러한 비판은, 이 결과는 아직 동료 검토를 거치지 않았고, 샘플 생산 비용은 각 1kW당 약 340달러입니다.
- **mlx-gemma-4-e2b-4bit**: 不过,批评者指出,这一结果尚未经过同行评审,而且样品的生产成本约为每千瓦时 340 美元。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 그러나 비평가들은 이 결과가 아직 동료 검토를 거치지 않았으며, 샘플의 생산 비용이 킬로와트시간당 약 340달러에 불과하다고 지적했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 不过,批评者指出,这一结果尚未经过同行评审,而且样品的生产成本约为每千瓦时 340 美元。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 하지만 반론자들은 이 결과가 동료 검토를 받지 않았다는 점과, 샘플의 제조 비용이 각 토너리당 340 달라이로 나뉜다.
- **mlx-qwen3.5-2b-4bit**: 不过，批评者指出，这一结果尚未经过同行评审，而且样品的生产成本约为每千瓦时 340 美元。
- **mlx-qwen3.5-2b-4bit-mt**: 그러나 비판자들은 이 결과는同行评审을 거치지 않았으며, 샘플의 생산 비용이 약 340 달러/千瓦时라고 지적하고 있다.
- **mlx-qwen3.5-4b-4bit**: 그러나 비판자들은 이 결과가 동료 검토를 거치지 않았으며, 시료의 생산 비용이 킬로와트당 340 달러에 달한다고 지적했습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 하지만 비판자들은 이러한 결과가 아직 동료 검토를 거치지 않았으며, 샘플 생산 비용은 1kWh당 약 340달러라고 지적했습니다.
- **ollama-gemma4-e2b**: 하지만 비평가들은 이 결과가 동료 검토를 거치지 않았으며, 샘플 생산 비용이 킬로와트시당 약 340달러라는 점을 지적했습니다.
- **ollama-gemma4-e4b**: 하지만 비평가들은 이 결과가 아직 동료 심사를 거치지 않았으며, 샘플의 생산 비용은 킬로와트시당 약 340달러라고 지적했습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 그러나 비평가들은 이러한 결과가 아직 동료 평가를 거치지 않았으며, 샘플 생산 비용이 약 340달러/kWh 수준이라고 지적했습니다.

**zh-Hans-news-04** (news)

- 원문: 北部沿海地区预计到周四都有大雨,阵风可达每小时 70 公里,气温在 12 摄氏度左右。
- **apple-fm**: 북부 해안 지역은 수요일까지 폭우가 예상되며, 강풍은 시속 70km에 달하고 기온은 약 12도에 달할 것으로 예상됩니다
- **apple-mt-attr**: 북부 해안 지역은 목요일까지 큰 비가 내릴 것으로 예상되며, 돌풍은 시속 70km에 달할 수 있고 기온은 12도 정도일 것으로 예상된다.
- **apple-mt-plain**: 북부 해안 지역은 목요일까지 큰 비가 내릴 것으로 예상되며, 돌풍은 시속 70km에 달할 수 있고 기온은 12도 정도일 것으로 예상된다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 북부 해안 지역은 목요일까지 폭우가 내릴 것으로 예상되며, 시속 70km의 강풍과 섭씨 12도 정도의 기온이 예상됩니다.
- **ct2-nllb-1.3b**: 북부 해안 지역에서는 목요일까지 폭우와 시속 70km의 강풍, 기온 12°C 정도가 예상된다.
- **ct2-nllb-600m**: 북부 해안 지역에서는 목요일까지 강수와 70km/h의 바람이 예상되며 기온은 12°C에 달한다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 북부 해안 지역은 다음 주에 대규모 폭우가 예상되며, 바람은 시속 70km까지 불어날 수 있습니다. 기온은 12도 정도가 될 것으로 예상됩니다.
- **mlx-gemma-4-e2b-4bit**: 北部沿海地区预计到周四都有大雨,阵风可达每小时 70 公里,气温在 12 摄氏度左右。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 북부 해안 지역에서는 목요일까지 강한 비가 예상되며, 풍속은 시간당 70km에 달할 수 있고, 기온은 약 12도 정도일 것입니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 北部沿海地区预计到周四都有大雨,阵风可达每小时 70 公里,气温在 12 摄氏度左右。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 북부 해안 지역은 목요일부터 대규모 폭우와 강한 부reeze가 오를 예정이다. 기상청은 70 키로미터를 넘는 강한 바람이 올 것이라고 경고했다. 온도는 12도 이하로 유지될 예정이다.
- **mlx-qwen3.5-2b-4bit**: 北部沿海地区预计到周四都有大雨，阵风可达每小时 70 公里，气温在 12 摄氏度左右。
- **mlx-qwen3.5-2b-4bit-mt**: 북부 해안 지역은 오는 목요일까지 폭우가 예상되며, 바람은 시속 70 킬로미터까지 날릴 수 있고, 기온은 약 12 도입니다.
- **mlx-qwen3.5-4b-4bit**: 북부 해안 지역은 목요일까지도 강우가 예상되며, 순간풍속은 시속 70 km 로 높을 수 있으며 기온은 약 12 도입니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 북부 해안 지역은 이번 주 수요일까지 강한 비가 내리고, 최대 순간 풍속은 시속 70km, 기온은 12℃ 정도입니다.
- **ollama-gemma4-e2b**: 북부 해안 지역은 목요일까지 폭우가 예상되며, 돌풍은 시간당 70킬로미터에 달하고 기온은 약 12도입니다.
- **ollama-gemma4-e4b**: 북부 해안 지역은 목요일까지 폭우가 예상되며, 돌풍은 시간당 70킬로미터에 달하고 기온은 12도 내외일 것으로 보입니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 북부 해안 지역은 이번 주 수요일까지 강한 비가 예상되며, 최대 순간풍속은 시속 70km에 달할 수 있습니다. 기온은 12℃ 정도입니다.

**zh-Hans-news-05** (news)

- 원문: 该公司周一发表声明称,由于供应链问题持续,将把旗舰手机的发布推迟到明年年初。
- **apple-fm**: 회사는 월요일 성명을 발표하며 공급망 문제로 인해프리미엄 스마트폰 출시내년 초로 연기될 것이라고 밝혔습니다
- **apple-mt-attr**: 이 회사는 월요일에 성명을 발표하면서, 공급망 문제로 지속되면서,   것이라고 플래그십 스마트폰의 출시를내년 초로 연기할밝혔다.
- **apple-mt-plain**: 이 회사는 월요일에 성명을 발표하면서, 공급망 문제로 지속되면서, 플래그십 스마트폰의 출시를 내년 초로 연기할 것이라고 밝혔다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 이 회사는 지속적인 공급망 문제로 인해 내년 초까지 플래그십 휴대 전화의 출시를 연기한다고 월요일 발표했다.
- **ct2-nllb-1.3b**: 회사 측은 월요일 성명을 통해 공급망 문제로 인해 플래그폰 출시 시기를 내년 초로 연기한다고 밝혔다.
- **ct2-nllb-600m**: 회사 측은 월요일 (현지시간) 발표에 따르면, 공급망 문제로 인해 플래그너 휴대폰 출시가 내년 초까지 연기될 것이라고 밝혔다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 该公司周一发表声明称，由于供应链问题持续，将把旗舰手机的发布推迟到明年年初。  이 문장은 다음과 같이 번역할 수 있습니다.  "The company announced on Monday that due to ongoing supply chain issues, they will postpone the release of the flagship phone until next year's New Year's holiday."  **설명:**  *   **该公司 (Gonghui):**  "회사" *   **周一 (Zhou Yi):** "월요일" *   **发表声明 (Fābiǎo Xīwén):** "발언/공지" *   **由于供应链问题持续 (Yóuzhī Xiànkē Wánxiàn Wèntí):** "공급망 문제 지속" *   **将把旗舰手机的发布推迟到明年年初 (Jiāng bǎi xīnxiàn shǒumiàn de fēbùshì tuīchú):** "플래그십 스마트폰의 출시를 다음 해 신년휴가로 연기하다"  **주석:**  "이 문장은 회사에서 공급망 문제로 인해 플래그십 스마트폰 출시를 미루는 내용입니다."  **생각 과정:**  원문은 중국어 간체(简体中文)로, 문장 구조가 복잡하고 전문적인 어휘가 많이 사용되었습니다.  이 문장을 한국어로 번역할 때는 원문의 의미를 최대한 유지하면서 자연스러운 표현을 위해 노력했습니다.  특히, 중국어 간체 문장에서는 '이 문장'과 같은 표현을 사용하지 않고, 문장 전체의 흐름에 맞춰 번역했습니다.
- **mlx-gemma-4-e2b-4bit**: 该公司周一发表声明称,由于供应链问题持续,将把旗舰手机的发布推迟到明年年初。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 그 회사는 월요일 성명을 발표하여 공급망 문제가 지속되기 때문에 플래그십 모델의 출시를 내년 초로 연기할 것이라고 밝혔습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 该公司周一发表声明称,由于供应链问题持续,将把旗舰手机的发布推迟到明年年初。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 该公司周一发表声明称，由于供应链问题持续，将把旗舰手机的发布推迟到明年年初。
- **mlx-qwen3.5-2b-4bit**: 该公司周一发表声明称，由于供应链问题持续，将把旗舰手机的发布推迟到明年年初。
- **mlx-qwen3.5-2b-4bit-mt**: 이 회사는 월요일에 발표문을 통해 공급망 문제로 인해 플래시폰 출시를 내년 초로 미루기로 결정했다고 밝혔다.
- **mlx-qwen3.5-4b-4bit**: 이 회사는 공급망 문제가 지속됨에 따라 다음 주에 플래그십 스마트폰을 출시할 계획을 연기한다고 발표했습니다.(누락)(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 이 회사는 지난주, 공급망 문제 지속으로 인해 플래그십 스마트폰 출시를 내년 초로 연기할 것이라고 공식 발표했습니다.
- **ollama-gemma4-e2b**: 해당 회사는 월요일에 성명을 발표하며, 공급 문제로 인해 플래그십 휴대폰의 출시를내년 초로 연기할 것이라고 밝혔습니다.
- **ollama-gemma4-e4b**: 이 회사는 월요일 성명을 통해 공급망 문제 지속으로 인해플래그십 스마트폰의 출시를내년 초로 연기한다고 밝혔습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 이 회사는 지난주, 공급망 문제로 인해 플래그십 스마트폰 출시를 다음 해 초로 연기할 것이라고 발표했습니다.

**zh-Hans-news-06** (news)

- 원문: 为什么这么多小面包店开不过五年?经济学家认为,原因与面包本身关系不大,更多在于房租、人手和微薄的利润。
- **apple-fm**: 왜 이 작은 빵집들은 5년 안에 문을 닫는 걸까? 경제학자들은 그 이유는 빵 자체와 거의 관련이 없으며, 더 중요한 것은 임대료와 낮은 이익 때문일 거라고 본다.사람들그리고 적은 이익 때문
- **apple-mt-attr**: 왜 이렇게 많은 작은 빵집이 5년도 안 돼서 문을 닫는 걸까? 경제학자들은 그 이유는 빵 자체와는 별로 관련이 없으며, 오히려 임대료, 더 크게  본다인건비, 그리고 적은 이익에 기인한다고.
- **apple-mt-plain**: 왜 이렇게 많은 작은 빵집이 5년도 안 돼서 문을 닫는 걸까? 경제학자들은 그 이유는 빵 자체와는 별로 관련이 없으며, 오히려 임대료, 인건비, 그리고 적은 이익에 더 크게 기인한다고 본다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 왜 이렇게 많은 작은 빵집들이 5년 이상 운영되지 못하는가? 경제학자들은 이유가 빵 자체와는 관련이 없고 임대료, 노동력, 희박한 이익에 있다고 믿는다.
- **ct2-nllb-1.3b**: 왜 이렇게 많은 작은 빵집이 5년도 안 걸린 걸까요? 경제학자들은 빵이 직접적인 이유가 아니라 임대료, 인력, 그리고 소소한 이익 때문이라고 주장합니다.
- **ct2-nllb-600m**: 왜 이렇게 많은 작은 빵집이 5년 만에 문을 연 걸까요? 경제학자들은 빵 자체와 관련이 없는 것이 아니라, 대여, 인력 및 소소한 수익 때문이라고 생각합니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 이 텍스트를 한국어로 번역하면 다음과 같습니다.  **왜 이렇게 많은 작은 빵집이 5년 동안 열리지 못하는 걸까요? 경제학자들은 빵 자체의 문제와는 관련이 없다고 말합니다. 오히려, 더 중요한 이유는 주거비, 인력 부족, 그리고 미약한 수익입니다.**  **설명:**  *   **왜 이렇게 많은 작은 빵집이 5년 동안 열리지 못하는 걸까요?** -  이 부분은 "Why so many small bakeries haven't been able to open for five years?" 라는 의미로, 원문과 동일하게 번역했습니다. *   **경제학자들은 빵 자체의 문제와는 관련이 없다고 말합니다.** - "Economists believe that the problem is not related to the bread itself."  이 부분은 "Economists believe that the problem is not related to the bread itself."  처럼 번역했습니다. *   **더 중요한 이유는 주거비, 인력 부족, 그리고 미약한 수익입니다.** - "More important reasons are housing costs, labor shortages, and meager profits."  이 부분은 "More important reasons are housing costs, labor shortages, and meager profits."  처럼 번역했습니다.  **추가적인 고려 사항:**  *   "面包店"은 "빵집"이라는 뜻으로, 그대로 유지했습니다. *   "经济学家"는 "경제학자"로, 그대로 유지했습니다. *   "微薄的利润"은 "미약한 수익"이라는 뜻으로, 그대로 유지했습니다.  이 번역은 원문의 의미를 최대한 유지하면서, 한국어에 어울리는 표현을 사용하여 자연스럽게 번역했습니다.
- **mlx-gemma-4-e2b-4bit**: 为什么这么多小面包店开不过五年?经济学家认为,原因与面包本身关系不大,更多在于房租、人手和微薄的利润。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 왜 이렇게 많은 작은 빵집들이 5년도 지속되지 못하는 걸까? 경제학자들은 그 이유가 빵 자체와는 거의 관련이 없으며, 더욱이 임대료, 인력, 낮은 수익률 때문이라고 생각합니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 为什么这么多小面包店开不过五年?经济学家认为,原因与面包本身关系不大,更多在于房租、人手和微薄的利润。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 이 많은 작은 빵집이 5년 이내에 문을 닫는 이유는 빵 자체가 문제되지 않다는 것을 경제학자들은 인정하고, 주로 월세, 인력 비용, 그리고 약간의 이익 차이가 문제였음을 설명했다.
- **mlx-qwen3.5-2b-4bit**: 为什么这么多小面包店开不过五年？经济学家认为，原因与面包本身关系不大，更多在于房租、人手和微薄的利润。
- **mlx-qwen3.5-2b-4bit-mt**: 왜 이렇게 많은 작은 빵집이 5 년 안에 문을 닫는가? 경제학자들은 그 이유는 빵 자체와 무관하며, 임대료, 인력 부족, 낮은 이윤이 더 큰 원인이라고 주장한다.
- **mlx-qwen3.5-4b-4bit**: 왜냐하면 많은 작은 빵집이 5 년을 넘기지 못하는 이유는 빵 자체보다는 임대료, 인력, 그리고 얇은 이익 때문이라고 경제학자들은 설명했습니다.(누락)(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 많은 작은 빵집들이 5년 안에 문을 닫는 이유는 무엇일까요? 경제학자들은 이 원인이 빵 자체와는 크게 관련이 없으며, 임대료, 인력, 그리고 낮은 이익과 더 관련되어 있다고 분석합니다.
- **ollama-gemma4-e2b**: 왜 많은 작은 빵집이 5년 이상 운영하지 못할까요? 경제학자들은 그 원인이 빵 자체보다는 임대료, 인력,그리고 적은 이윤에 더 달려 있다고 말합니다.
- **ollama-gemma4-e4b**: 왜 이렇게 많은 작은 빵집들이 5년 이상 문을 열지 못할까요? 경제학자들은 그 원인이 빵 자체와는 크게 관련이 없으며, 임대료,인건비,그리고 적은 이윤에 있다고 분석합니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 왜 많은 작은 빵집이 5년도 채 버티지 못하는 걸까요? 경제학자들은 이 현상의 원인이 빵 자체보다는 임대료, 인건비, 그리고 극히 미미한 이익에 더 큰 영향을 미친다고 분석합니다.

**zh-Hans-community-01** (community)

- 원문: 好家伙,树莓派终于能开机了,结果一上电就冒烟。好吧,也不是真冒烟,但我的心态已经崩了。
- **apple-fm**: 정말 황당하다. Raspberry Pi가 드디어 작동했지만, 연결이 끊어질 때마다 연기가 피어올랐다. 어차피 진짜 연기가 아니지만, 내 마음이 완전히 망가졌다.
- **apple-mt-attr**: 와, 딸기 파이가 드디어 켜질 수 있었는데, 전원을 켜자마자 연기가 피어올랐다. 음, 진짜 연기는 아니지만, 내 마음가짐은 이미 무너졌다.
- **apple-mt-plain**: 와, 딸기 파이가 드디어 켜질 수 있었는데, 전원을 켜자마자 연기가 피어올랐다. 음, 진짜 연기는 아니지만, 내 마음가짐은 이미 무너졌다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 친구, 딸기 파이가 드디어 작동했고, 전원이 켜지자마자 연기가 나기 시작했습니다. 글쎄요, 연기가 나지는 않았지만, 내 마음은 붕괴되었습니다.
- **ct2-nllb-1.3b**: 좋은 친구, 나무늘보는 마침내 운전을 할 수 있었고, 결국 전기를 켜면 담배를 피웠다.
- **ct2-nllb-600m**: 자, 덤불파리가 드디어 문을 열었고, 결국 전기가 켜지면 담배를 피우게 되었습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: 好家伙,树莓派终于能开机了,结果一上电就冒烟。好吧,也不是真冒烟,但我的心态已经崩了。
- **mlx-gemma-3-1b-4bit-mt**: 좋은 번역입니다.  **번역:**  좋은 상황이군요, 莓파이(Raspberry Pi)가 작동을 시작했습니다. 하지만, 한 번 전원을 켜고 나서 바로 불타오르는 것 같았습니다.  아니, 진짜 불타는 건 아니지만, 내 마음이 완전히 붕괴되었습니다.  **설명:**  *   **好家伙 (hǎo giā):**  "좋은 상황"이라는 뜻으로, 상황을 긍정적으로 표현하는 표현입니다. *   **树莓派 (shù bēi pī):**  "莓파이(Raspberry Pi)"라는 이름이 언급되었으므로, 莓파이라는 제품의 이름을 그대로 전달합니다. *   **终于能开机了 (zǒu yú néng kāi jī le):**  "마침으로 작동을 시작했습니다"라는 의미로, 상황이 시작되었음을 나타냅니다. *   **结果一上电就冒烟 (huì jī yī shàng diàn, jiù mào yān):**  "결과가 한 번 전원을 켜고 나서 바로 불타오르는 것 같았습니다"라는 표현은 상황의 심각성을 강조하고 있습니다. *   **好吧 (hǎo):**  "좋은 상황"이라는 뜻으로, 상황을 긍정적으로 표현하는 표현입니다. *   **不是真冒烟 (bìng bù zhēn mào yān):**  "아니, 진짜 불타는 건 아니지만"이라는 표현은 상황이 심각한 상황임을 강조합니다. *   **我的心态已经崩了 (wǒ de xīnliǎo yǐjīng bēng le):**  "내 마음이 완전히 붕괴되었습니다"라는 표현은 심각한 상황에 대한 감정을 표현합니다.  **추가적인 고려 사항:**  *   "好家伙"는 상황을 긍정적으로 표현하는 표현이므로, 그대로 사용했습니다. *   "树莓派"는 제품 이름이므로, 그대로 사용했습니다. *   "结果一上电就冒烟"는 상황의 심각성을 강조하기 위해 "一上电就冒烟"로 번역했습니다.  이 번역이 도움이 되었기를 바랍니다.
- **mlx-gemma-4-e2b-4bit**: 好家伙,树莓派终于能开机了,结果一上电就冒烟。好吧,也不是真冒烟,但我的心态已经崩了。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 잘했어, 라즈베리 파티가 마침내 시작되었는데, 전원이 들어오자마자 연기가 나왔어. 음, 정말로 연기가 나는 건 아니지만, 내 기분은 완전히 망가졌어.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 这段话翻译成韩语是：  好家伙，树莓派终于能开机了,结果一上电就冒烟。好吧，也不是真冒烟但我的心态已经崩了。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 사과피자, 유일한 명사, 숫자, URL, 코드는 원문 그대로 유지하라.
- **mlx-qwen3.5-2b-4bit**: 好家伙，树莓派终于能开机了，结果一上电就冒烟。好吧，也不是真冒烟，但我的心态已经崩了。
- **mlx-qwen3.5-2b-4bit-mt**: 아, 거북이 파이브가 이제 켜질 수 있게 되었는데, 일단 켜자마자 연기처럼 뽀뽀 튀어나온 거야. 어차피 진짜 연기 아니지만, 내 마음은 완전히 터졌네.
- **mlx-qwen3.5-4b-4bit**: 일단 쥬리파이를 켤 수 있게 되니 좋지만, 전원을 켜자마자 연기처럼 뿜어내네요. 아니, 진짜 연기는 아니지만 내 마음은 이미 무너졌습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 와, 라즈베리 파가 드디어 부팅됐는데, 바로 전원이 켜자마자 불이 났네. 뭐, 진짜 불이라기보다는, 완전히 좌절했어.
- **ollama-gemma4-e2b**: 세상에, 라즈베리 파이가 드디어 부팅되었는데, 전원을 켜자마자 연기가 나더라고요. 뭐, 진짜 연기는 아니지만, 제 심정은 이미 무너졌습니다.
- **ollama-gemma4-e4b**: 맙소사, 라즈베리파이가 드디어 부팅되는데, 전원을 켜자마자 연기가 나요. 뭐, 진짜 연기는 아니지만, 제 멘탈은 이미 무너졌습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 맙소사, 라즈베리 파이 마침내 부팅되더니, 그런데 전원을 켜자마자 연기가 나기 시작했어. 음, 정확히는 연기가 나지 않았지만, 그래도 나는 완전히 좌절했어.

**zh-Hans-community-02** (community)

- 원문: 说句得罪人的话:用制表符还是空格都行,凌晨两点还在为这个吵架的人,该去吃点东西然后睡觉了。
- **apple-fm**: 불쌍한 사람들을 괴롭히는 말: 표기 기호와 공백 모두 괜찮지만, 새벽 2시에도 이 사람들과 싸우느라 정신이 팔린다면, 이제는 음식을 먹고 잠자리에 들 시간이 되었다.
- **apple-mt-attr**: 불쾌하게 하는 말 하나 하자면: 기호표시를 쓰든 공백을 쓰든 상관없어, 새벽 두 시에 아직도 이 일 때문에 싸우는 사람은, 뭔가 먹고 자러 가야 해.
- **apple-mt-plain**: 불쾌하게 하는 말 하나 하자면: 기호표시를 쓰든 공백을 쓰든 상관없어, 새벽 두 시에 아직도 이 일 때문에 싸우는 사람은, 뭔가 먹고 자러 가야 해.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 죄인의 말을 말하십시오 : 탭 또는 공백을 사용할 수 있습니다, 새벽 2시에 아직도 싸우는 사람을 위해, 뭔가를 먹고 잠들어야합니다.
- **ct2-nllb-1.3b**: 죄인의 말: 시계 표지판이나 빈 공간으로 가십시오. 새벽 2시에 여전히 이 쟁쟁한 사람을 위해, 그는 잠자리에 들기 전에 먹어야합니다.
- **ct2-nllb-600m**: 죄인들에 대한 판단에 따르면, "오전 2시쯤에 이 부조리 때문에 아무 것도 없거나, 아무 것도 없는 사람이 일어나서 밥을 먹어야 하고 잠들어야 한다".
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: **번역:**  “좀 꼬시게 말해.” (이런 상황에 대해) 표시문이나 공백을 모두 사용해도 괜찮아. 밤 2시쯤에 이 싸움에 있는 사람을, 이제는 식을 먹고 잠들어야 해.  **설명:**  *   **“좀 꼬시게 말해.”**는 "좀 꼬시게 말해"라는 의미로, 상황에 대한 불만을 표현하는 일반적인 표현입니다. *   **“표시문”**과 **“공백”**은 원래 중국어 간체(简体中文)에서 사용된 표현입니다. *   **“이런 상황에 대해”**는 상황에 대한 언급을 나타냅니다. *   **“꼬시게 말해”**는 "꼬시게 말해"라는 표현으로, 상황에 대한 불만을 표현하는 일반적인 표현입니다.  **추가적인 고려 사항:**  이 번역은 상황의 어조와 뉘앙스를 최대한 살려 표현했습니다.  원문에 있는 고유명사, 숫자, URL, 코드는 그대로 유지했습니다.
- **mlx-gemma-4-e2b-4bit**: 说句得罪人的话:用制表符还是空格都行,凌晨两点还在为这个吵架的人,该去吃点东西然后睡觉了。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 불쾌한 말을 하자면: 탭 문자든 공백이든 상관없어요. 새벽 2시에 이런 문제로 싸우는 사람 때문에, 뭐라도 먹고 잠을 자야 해요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 说句得罪人的话:用制表符还是空格都行,凌晨两点还在为这个吵架的人,该去吃点东西然后睡觉了。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 용자: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 간체(简体中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.
- **mlx-qwen3.5-2b-4bit**: 说句得罪人的话：用制表符还是空格都行，凌晨两点还在为这个吵架的人，该去吃点东西然后睡觉了。
- **mlx-qwen3.5-2b-4bit-mt**: 이해하는 말 하나: 탭이나 공백 모두 사용 가능하죠. 새벽 2 시까지 이 문제를 두고 다투는 사람이라면, 먹고 나서 잠들어야 합니다.
- **mlx-qwen3.5-4b-4bit**: 사람을 상하게 말하자면, 탭이나 공백을 사용하든 상관없습니다. 새벽 2 시까지 이 때문에 싸우는 사람은 저녁을 먹고 자야 합니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 솔직하게 말하자면: 따옴표나 공백을 모두 사용할 수 있지만, 새벽 2시까지도 싸울 사람 때문에 계속 고민하고 있습니다. 이제 뭐라도 먹고 잠자리에 드는 게 좋을 것 같아요.
- **ollama-gemma4-e2b**: 무례하게 말하자면: 탭이나 공백 모두 괜찮습니다. 새벽 두 시에도 이 논쟁을 하는 사람에게, 가서 뭐라도 먹고 자야죠.
- **ollama-gemma4-e4b**: 누가 기분 나쁠지 모르겠지만: 탭을 쓰든 공백을 쓰든 상관없어요. 새벽 2시까지 이걸로 싸우는 건, 가서 뭐 좀 먹고 자야 할 시간이에요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 솔직히 말하자면, 쉼표나 공백 모두 괜찮습니다. 새벽 2시까지도 계속 싸우는 사람 때문에 잠을 설쳐야 한다니, 밥을 먹고 잠시 쉬는 게 좋겠습니다.

**zh-Hans-community-03** (community)

- 원문: 笑死,盯着报错看了三个小时,结果是少了一个分号。一个分号啊!我要去山里隐居了。
- **apple-fm**: 웃기다. 오류 메시지를 보고 3시간을 보낸 끝에, 문제는 분 기호 하나가 부족했었다. 진짜 분 기호! 이제 산으로 들어가서 은퇴할 거야.
- **apple-mt-attr**: 웃겨 죽겠어, 오류 메시지를 3시간 동안 쳐다보다가, 결과가 분기호 하나가 빠진 거야. 분기호 하나야! 나는 산으로 은둔하러 갈 거야.
- **apple-mt-plain**: 웃겨 죽겠어, 오류 메시지를 3시간 동안 쳐다보다가, 결과가 분기호 하나가 빠진 거야. 분기호 하나야! 나는 산으로 은둔하러 갈 거야.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 웃음이 터져 나왔고, 3시간 동안 오류 메시지를 쳐다보았습니다. 결과는 마침표 하나가 빠졌습니다.마침표 하나!
- **ct2-nllb-1.3b**: 웃으며, 실수 보고를 3시간 동안 쳐다보다가, 1점 남았어요. 1점 아!
- **ct2-nllb-600m**: 웃고 죽고, 3시간 동안 보고를 쳐다봤는데, 1점도 빠졌어요. 1점도 빠졌어요. 저는 산에 숨어있어요.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 웃기셨습니다. 2시간 동안 오류 메시지를 쳐다보면서, 결국 하나가 사라졌습니다. 분호 하나요! 이제 산에 들어가 살고 싶습니다.  **번역:**  웃기셨습니다. 2시간 동안 오류 메시지를 쳐다보면서, 결국 하나가 사라졌습니다. 분호 하나요! 이제 산에 들어가 살고 싶습니다.  **설명:**  *   **笑死 (xiào shù):**  "웃기셨습니다"라는 표현입니다.  이 표현은 "웃기셨다"라는 의미로,  감탄이나 흥미를 표현하는 데 사용됩니다. *   **盯着 (zhe xi):** "쳐다보면서"라는 의미로,  어떤 것을 바라보는 상황을 나타냅니다. *   **报错 (xiào yán):** "오류 메시지"라는 의미로,  오류가 발생했을 때 나타나는 메시지를 의미합니다. *   **结果 (huì xi:] "결과"라는 의미로,  오류 메시지에서 얻은 결과를 나타냅니다. *   **少了一个分号 (shǎo le yī fēn hòu):** "하나가 사라졌다"라는 의미로,  오류 메시지에서 하나가 사라졌음을 나타냅니다. *   **一个分号啊! (yī ge fēn hòu a!):**  "분호 하나요!"라는 표현은  감탄과 흥미를 표현하는 문장입니다. *   **我要去山里隐居了 (wǒ yào qù shān lǐ yǐzhū le):**  "이제 산에 들어가 살고 싶습니다."라는 의미로,  원문과 동일한 상황을 나타냅니다.  **추가적인 고려 사항:**  *   "화략"이라는 단어가 중국어 간체(简体中文)에서 사용되었을 가능성이 있습니다.  이 경우,  번역에 "분호"를 사용하거나,  "화략"이라는 단어의 의미를 고려하여 번역할 수 있습니다. *   "山里"는 "산에"라는 의미로,  이 표현은  원문과 동일하게 유지됩니다.
- **mlx-gemma-4-e2b-4bit**: 笑死,盯着报错看了三个小时,结果是少了一个分号。一个分号啊!我要去山里隐居了。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 웃기워, 오류 메시지를 3시간 동안 바라보고 있었는데, 결국 세미콜론이 하나 빠져 있더군요. 세미콜론 하나라니! 이제 산속으로 은둘러 갈 거예요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 这句话翻译成韩语是：“笑死，盯着报错看了三个小时,结果是少了一个分号。一个分号啊！我要去山里隐居了。”
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 웃어버렸다. 세 시간 동안 에러 메시지를 바라보았지만, 결국에는 한 개의 분号가 누락했다. 한 개의 분号! 내가 산里에서 사라져야 했다.
- **mlx-qwen3.5-2b-4bit**: 笑死，盯着报错看了三个小时，结果是少了一个分号。一个分号啊！我要去山里隐居了。
- **mlx-qwen3.5-2b-4bit-mt**: 아, 오류가 발생했으니 3 시간 이상 기다렸는데, 결과적으로 한 개의 분자가 빠져나갔네요. 한 분자야! 산에 은거할게요.
- **mlx-qwen3.5-4b-4bit**: 웃기다, 3 시간 동안 에러 메시지를 응시했는데, 결과는 세미콜론 하나 부족이었습니다. 세미콜론 하나! 저는 산속으로 은거하겠습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 너무 웃겨. 오류를 보려고 세 시간 동안 집중했는데, 한 개의 쉼표가 빠졌네요! 한 개의 쉼표라니! 저는 이제 산으로 들어가 살 거예요.
- **ollama-gemma4-e2b**: 웃기네, 오류 메시지를 세 시간 동안 쳐다봤는데, 마침표 하나가 빠져있었어. 마침표 하나! 나 산으로 은둔해야겠다.
- **ollama-gemma4-e4b**: 웃겨 죽겠네요. 에러 메시지를 세 시간 동안 봤는데, 결국 세미콜론이 하나 빠진 거였어요. 세미콜론 하나라니! 저 산속에 들어가서 은둔해야겠어요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 너무 웃겨. 오류 메시지를 세 시간 동안 쳐다봤는데, 결국 한 쉼표가 빠졌더라고. 쉼표 하나! 이제 저는 산으로 들어가 은둔 생활을 시작해야겠어요.

**zh-Hans-community-04** (community)

- 원문: 说实话,那次更新直接把我的环境搞崩了。已经回滚,出去透了口气,明天再战。
- **apple-fm**: 솔직히 말하자면, 그 업데이트로 인해내 환경이 완전히 망가졌다.
- **apple-mt-attr**: 솔직히, 그 업데이트가 제 환경을 완전히 망쳐버렸어요. 이미 백업을 취했고, 밖에 나가서 숨을 푹 들이마셨어요. 내일 다시 도전할게요.
- **apple-mt-plain**: 솔직히, 그 업데이트가 제 환경을 완전히 망쳐버렸어요. 이미 백업을 취했고, 밖에 나가서 숨을 푹 들이마셨어요. 내일 다시 도전할게요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 솔직히 말해서, 그 업데이트는 제 환경을 완전히 망가뜨렸습니다.
- **ct2-nllb-1.3b**: 솔직히 말해서, 그 업데이트는 내 환경을 완전히 뒤집어 놓았습니다.
- **ct2-nllb-600m**: 솔직히 말해서, 그 업데이트는 내 환경을 직접 파괴했습니다. 이미 돌아왔고, 밖으로 나갔고, 내일 다시 싸울 것입니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 말해지기만 해도, 그 번개 업데이트가 내 환경을 완전히 망가뜨렸어. 이미 되돌아가고, 숨을 쉬고 있는 것 같았어. 내일 다시 싸울 거야.
- **mlx-gemma-4-e2b-4bit**: 说实话,那次更新直接把我的环境搞崩了。已经回滚,出去透了口气,明天再战。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 솔직히 말해서, 그 업데이트로 인해 내 환경이 완전히 망가졌어요. 이미 롤백했고, 기분을 풀어보았어요. 내일 다시 시작할게요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 这段话翻译成韩语是：  "사실 오늘 업데이트에서 내 환경이 완전히 망가졌어. 이미 롤백했고, 밖에 나가서는 한숨만 나오고, 내일 다시 싸울 거야."
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 실제로,那次更新直接把我的环境搞崩了。已经回滚,出去透了口气,明天再战。
- **mlx-qwen3.5-2b-4bit**: 说实话，那次更新直接把我的环境搞崩了。已经回滚，出去透了口气，明天再战。
- **mlx-qwen3.5-2b-4bit-mt**: 사실상, 그 업데이트는 환경을 완전히 망친 바였다. 이미 재로로 되돌려서 숨을 내뿜고, 다음날 다시 싸게다.
- **mlx-qwen3.5-4b-4bit**: 솔직히 말해, 그 업데이트는 내 환경을 완전히 망가뜨렸습니다. 이미 롤백을 하고, 신선한 공기를 마셨으니, 내일 다시 도전하겠습니다.(누락)(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 솔직히 말해서, 그 업데이트로 인해 제 환경이 완전히 망가졌어요. 이미 되돌렸고, 잠시 숨을 돌리고 내일 다시 도전할게요.
- **ollama-gemma4-e2b**: 솔직히 말해서, 그 업데이트는내 환경을 완전히 망쳤어. 되돌렸고, 숨을 돌리고, 내일 다시 싸울 거야.(누락)
- **ollama-gemma4-e4b**: 솔직히 말해서, 그때 업데이트가제 환경을 완전히 망가뜨렸어요.이미 롤백했고, 바람 좀 <0xEC><0x90><0xAC>고 왔습니다. 내일 다시 싸울게요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 솔직히 말해서, 그 업데이트로 인해 제 환경이 완전히 망가졌어요. 이미 이전 버전으로 되돌렸고, 잠시 휴식을 취한 후 내일 다시 도전할 예정입니다.

**zh-Hans-community-05** (community)

- 원문: 确实。我家猫在路由器上趴了一个星期,Wi-Fi 居然比以前还稳。别问,问就是玄学。
- **apple-fm**: 맞아. 우리 고양이가 라우터 위에 1주일 동안 누워 있었는데, Wi-Fi가 예전보다 훨씬 안정적이었다. 궁금한 게 아니라, 영적인 문제야.
- **apple-mt-attr**: 맞아요. 우리 고양이가 라우터 위에 일주일 동안 누워 있었는데, Wi-Fi가 오히려 예전보다 더 안정적이었어요. 물어보지 마세요, 물어보는 건 점술이에요.
- **apple-mt-plain**: 맞아요. 우리 고양이가 라우터 위에 일주일 동안 누워 있었는데, Wi-Fi가 오히려 예전보다 더 안정적이었어요. 물어보지 마세요, 물어보는 건 점술이에요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 제 고양이가 일주일 동안 라우터에 누워 있었는데, Wi-Fi가 이전보다 더 안정적이었습니다.
- **ct2-nllb-1.3b**: 사실. 내 고양이는 일주일 동안 라우터에 켜져 있었고, 와이파이는 이전보다 더 안정적이었다.
- **ct2-nllb-600m**: 사실, 우리 고양이는 일주일 동안 라우터에 달려있었고, 와이파이는 예전보다 안정적이었습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 물론. 저 집 고양이(猫)가 또래路由器에 한 달 동안 웅크리고 앉아 있었는데, 와이파(Wi-Fi)가 이전보다 훨씬 안정적이라는 걸 알아차렸어요. 질문은 그냥 '玄学' (玄学)입니다.  **Explanation:**  *   **물론 (Wǒ de gato):**  "물론"이라는 표현은 "물론"이라는 의미로, 문맥에 따라 자연스럽게 번역되었습니다. *   **고양이 (Gato):**  "고양이"는 "cat"이라는 뜻으로, 중국어 간체(简体中文)에서 그대로 사용되었습니다. *   **路由器 (Router):** "路由器"는 "Wi-Fi"라는 뜻으로, 중국어 간체(简体中文)에서 그대로 사용되었습니다. *   **한 달 (Yī nián):** "한 달"은 "one month"이라는 뜻으로, 중국어 간체(简体中文)에서 그대로 사용되었습니다. *   **위로 (Wéi):** "위로"는 "on"이라는 뜻으로, 중국어 간체(简体中文)에서 그대로 사용되었습니다. *   **玄学 (Xúané):** "玄学"은 "玄学"이라는 뜻으로, 중국어 간체(简体中文)에서 그대로 사용되었습니다.  **Thought Process:**  The translation prioritized maintaining the original tone and the specific wording of the Chinese text.  I aimed for a natural and slightly humorous tone, reflecting the implied feeling of the original statement.  The "玄学" explanation is simply a literal translation of the Chinese phrase.
- **mlx-gemma-4-e2b-4bit**: 确实。我家猫在路由器上趴了一个星期,Wi-Fi 居然比以前还稳。别问,问就是玄学。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 정말이죠. 제 집 고양이는 라우터 위에 일주일 동안 누워 있었는데, Wi-Fi가 예전보다 더 안정적이었어요. 묻지 마세요, 그냥 미신이에요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 确实。我家猫在路由器上趴了一个星期,Wi-Fi 居然比以前还稳。别问,问就是玄学。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 정말이지. 집안의 고양이가 라우터 위에 앉아서 일주일 동안 있었고, Wi-Fi가 더 안정했다. 그냥 그런 거다.
- **mlx-qwen3.5-2b-4bit**: 确实。我家猫在路由器上趴了一个星期，Wi-Fi 居然比以前还稳。别问，问就是玄学。
- **mlx-qwen3.5-2b-4bit-mt**: 确实。我家猫在路由器上趴了一个星期，Wi-Fi 居然比以前还稳。别问，问就是玄学。
- **mlx-qwen3.5-4b-4bit**: 맞습니다.我家的猫在路由器上趴了一个星期，Wi-Fi 居然比以前还稳。别问，问就是玄学。
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 정말이에요. 제 고양이가 라우터 위에 일주일 동안 누워 있었는데, Wi-Fi가 오히려 이전보다 더 안정적이게 됐어요. 설명은 필요 없어요, 그냥 신기한 거죠.
- **ollama-gemma4-e2b**: 맞아. 우리 고양이가 라우터 위에 일주일 동안 누워 있었는데, 와이파이가 예전보다 더 안정적이더라. 묻지 마, 그건 신기한 거야.
- **ollama-gemma4-e4b**: 맞아요. 저희 집 고양이가 라우터 위에 일주일 동안 누워있더니, 와이파이가 예전보다 더 안정적이에요. 묻지 마세요. 그냥 현상학(미신)입니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 맞아요. 제 집 고양이가 라우터 위에 일주일 동안 있었는데, 와이파이가 오히려 이전보다 더 안정적으로 작동하는 것 같네요. 이유는 알 수 없지만, 그냥 운이라고 해야겠죠.

**zh-Hans-community-06** (community)

- 원문: 家人们,我花了 400 块买了个敲起来像下雨的键盘,一点都不后悔,同事们嘛……就不一定了。
- **apple-fm**: 여러분, 나는 400원을 들여 빗소리가 들리는 듯한 키보드를 샀는데, 전혀 후회하지 않아. 동료들은...확실히 아니다.
- **apple-mt-attr**: 가족 여러분, 저는 비가 오는 소리 나는 키보드를 사는데 400위안을 썼는데 전혀 후회하지 않아요. 동료들은 어때요……그건 다를 수 있어요.
- **apple-mt-plain**: 가족 여러분, 저는 비가 오는 소리 나는 키보드를 사는데 400위안을 썼는데 전혀 후회하지 않아요. 동료들은 어때요……그건 다를 수 있어요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 나는 400 달러를 비처럼 울리는 키보드를 사는데 썼는데 후회하지 않는다.
- **ct2-nllb-1.3b**: 가족들, 저는 400달러를 들여 비처럼 부는 키보드를 샀습니다.
- **ct2-nllb-600m**: 저는 400달러를 들여 비가 내리는 키보드를 샀습니다. 후회하지 않습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 가 사람들, 저는 400 장의 폰을 샀는데, 쿵쾅거리는 것과 비슷해서 전혀 후회하지 않아요. 동료들은… 아마 그럴 것입니다.  **설명:**  *   **家人们 (jiangongren):**  "가 사람들"이라는 표현을 그대로 사용했습니다. *   **我花了 (wǒ guǒ le):** "저는"이라는 표현을 그대로 사용했습니다. *   **敲起来像下雨的键盘 (qǐng qǐ qǐ xiàng xià yǔ de yànkè):**  "쿵쾅거리는 것과 비슷해서"라는 문장으로, 폰을 샀다는 상황을 설명했습니다. *   **一点都不后悔 (yī diǎn dōu bù huàn):** "전혀 후회하지 않아요"라는 표현을 그대로 사용했습니다. *   **同事们嘛 (tóng'érmen ma):** "동료들은"이라는 표현을 그대로 사용했습니다.  **주석:**  *   이 문장은 중국어 간체(简体中文)로 작성되었으며, 한국어에 번역된 문장입니다. *   "家人们"은 "가 사람들"이라는 뜻으로, 중국어 간체(简体中文)에서 사용된 표현입니다. *   "쿵쾅거리는 것과 비슷해서"는 "쿵쾅거리는 것과 비슷해서"라는 뜻으로, 폰을 샀다는 상황을 설명하는 문장입니다. *   "一点都不后悔"은 "전혀 후회하지 않아요"라는 뜻으로, "저는"이라는 표현을 그대로 사용했습니다.  **생각 과정:**  이 문장은 중국어 간체(简体中文)의 문장 구조를 그대로 반영하여 번역했습니다.  문장 전체의 의미를 최대한 유지하면서, 한국어에 어울리는 표현을 사용하여 번역했습니다.
- **mlx-gemma-4-e2b-4bit**: 家人们,我花了 400 块买了个敲起来像下雨的键盘,一点都不后悔,同事们嘛……就不一定了。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 여러분, 400원을 들여서 비가 내리는 것처럼 들리는 키보드를 구입했어요. 전혀 후회하지 않아요. 하지만 동료들은… 그렇지 않을 수도 있죠.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 这段话是用中文写的，翻译成韩语后输出。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 가족분들, 나는 400원에 한 대 떨어지는 소리로 쿠버네티스 키보드를 샀었는데, 전혀 후회하지 않아요. 동료분들이라면…… 그럴 만한 일이 있을 거예요.
- **mlx-qwen3.5-2b-4bit**: 家人们，我花了 400 块买了个敲起来像下雨的键盘，一点都不后悔，同事们嘛……就不一定了。
- **mlx-qwen3.5-2b-4bit-mt**: 가족 여러분, 400 원으로 '비처럼 울리는 키보드'를 샀는데, 전혀 후회하지 않고요. 동료들 중에는 그렇지 않을 수도 있습니다.
- **mlx-qwen3.5-4b-4bit**: 가족 여러분, 저는 400 원에 소음처럼 치는 키보드를 샀는데, 전혀 후회하지 않습니다. 동료들은……그렇지 않을 수도 있습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: “얘들아, 400원에 정말 괜찮은 키보드를 샀는데, 마치 비가 내리는 것처럼 느껴져요. 동료들은… 아마 그렇지 않을 거예요.”
- **ollama-gemma4-e2b**: 여러분, 저는 400위안을 주고 비가 내리는 것처럼 타이핑되는 키보드를 샀는데, 전혀 후회하지 않아요. 동료들은 뭐……그렇지 않을 수도 있고.(누락)
- **ollama-gemma4-e4b**: 여러분, 저 비 오는 소리가 나는 키보드를 400위안에 샀는데, 전혀 후회 안 해요. 동료들은 뭐……그럴지는 모르겠네요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 여러분, 저는 400달러를 주고 빗소리를 내는 키보드를 샀는데, 정말 만족합니다. 동료들은… 아마 만족하지는 못할 거예요.

**zh-Hans-ui-01** (ui)

- 원문: 保存更改
- **apple-fm**: 변경 사항을 저장합니다
- **apple-mt-attr**: 변경 저장
- **apple-mt-plain**: 변경 저장
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 변경 사항 저장
- **ct2-nllb-1.3b**: 변경사항을 저장합니다
- **ct2-nllb-600m**: 변경사항을 저장
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 保存更改
- **mlx-gemma-4-e2b-4bit**: 保存更改
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 수정 저장
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 原文本：   我们需要一个更专业的团队，来完成这个项目，所以我们必须找到合适的人才。  翻译：   We need a more professional team to complete this project, so we must find the right person.  （原文本中的「我们」，「团队」，「专业」，「项目」，「必须」，「找到」，「合适」， 모두 원문과 동일）
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 변경 저장
- **mlx-qwen3.5-2b-4bit**: 保存更改
- **mlx-qwen3.5-2b-4bit-mt**: 저장/수정
- **mlx-qwen3.5-4b-4bit**: 변경사항 저장
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 변경 사항 저장
- **ollama-gemma4-e2b**: 변경 사항 저장
- **ollama-gemma4-e4b**: 변경 사항 저장
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 변경 사항 저장

**zh-Hans-ui-02** (ui)

- 원문: 出错了,请稍后重试。
- **apple-fm**: 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.
- **apple-mt-attr**: 오류가 발생했습니다, 잠시 후에 다시 시도해 주세요.
- **apple-mt-plain**: 오류가 발생했습니다, 잠시 후에 다시 시도해 주세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 오류가 발생했습니다. 나중에 다시 시도하십시오.
- **ct2-nllb-1.3b**: 오류가 발생했습니다. 나중에 다시 시도하시기 바랍니다.
- **ct2-nllb-600m**: 틀렸어 나중에 다시 시도해봐
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 출错了, 다시 시도하세요.
- **mlx-gemma-4-e2b-4bit**: 出错了,请稍后重试。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 죄송합니다만, 요청하신 내용을 이해할 수 없습니다. 다시 간단한 문장으로 요청 내용을 알려주시면 번역해 드리겠습니다.
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 오류 occurred, please try again later.
- **mlx-qwen3.5-2b-4bit**: 出错了，请稍后重试。
- **mlx-qwen3.5-2b-4bit-mt**: 出错了，请稍后重试。
- **mlx-qwen3.5-4b-4bit**: 오류가 발생했습니다. 나중에 다시 시도해주세요.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
- **ollama-gemma4-e2b**: 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
- **ollama-gemma4-e4b**: 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.

**zh-Hans-ui-03** (ui)

- 원문: 您有 3 条未读消息
- **apple-fm**: 3개의 미확인 메시지가 있습니다.
- **apple-mt-attr**: 귀하에게는 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-plain**: 귀하에게는 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 읽지 않은 메시지가 3 개 있습니다.
- **ct2-nllb-1.3b**: 당신이 읽지 않은 메시지가 3개 있습니다.
- **ct2-nllb-600m**: 당신이 읽지 않은 3개의 메시지가 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 您有 3 条未读消息  3 条未读消息  (3 articles of unread messages)  이 문장은 "3개의 읽지 않은 메시지를 가지고 있습니다."라는 의미로 해석됩니다.    **Explanation:**  *   **您 (nǐ)**:  You (formal) *   **3 条未读消息 (3 tiáo wèi dú xié xié)**:  3 articles of unread messages (literally: 3 unread messages). *   **未读 (wèi dú)**:  Unread (meaning: not read yet)  **Thought Process:**  The text is a simple, direct translation of the Chinese text.  It's a straightforward message conveying the fact that there are three unread messages.
- **mlx-gemma-4-e2b-4bit**: 您有 3 条未读消息
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 귀하에게 3개의 읽지 않은 메시지가 있습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 您有 3 带未读消息
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 3개의 미리 읽지 않은 메시지
- **mlx-qwen3.5-2b-4bit**: 您有 3 条未读消息
- **mlx-qwen3.5-2b-4bit-mt**: 현재 읽지 않은 메시지가 3 개 있습니다.
- **mlx-qwen3.5-4b-4bit**: 읽지 않은 메시지가 3 개 있습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 3개의 읽지 않은 메시지가 있습니다.
- **ollama-gemma4-e2b**: 읽지 않은 메시지가 3개 있습니다.
- **ollama-gemma4-e4b**: 읽지 않은 메시지가 3개 있습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 3개의 읽지 않은 메시지가 있습니다.

**zh-Hans-link-01** (link)

- 원문: 点击[此处]继续。
- **apple-fm**: 클릭하세요[此处]계속하려면
- **apple-mt-attr**: 기를 클릭하여[此处] 계속하세요.
- **apple-mt-plain**: 클릭[此处]계속해.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 클릭[此处]계속해
- **ct2-nllb-1.3b**: 클릭하세요[此处]계속하세요.
- **ct2-nllb-600m**: 클릭[此处]계속하세요.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 간체(简体中文)다.  **번역:**  "이것은 2023년 12월 31일, 1000만 명의 사용자가 이용하는 인기 있는 웹사이트입니다.  [https://www.example.com](https://www.example.com)  이 웹사이트는 2024년 1월 1일에 폐쇄되었습니다.  이 웹사이트는 [https://www.example.com/](https://www.example.com/)  이 웹사이트는 2023년 12월 31일에 1000만 명의 사용자가 이용하는 인기 있는 웹사이트입니다.  이 웹사이트는 2024년 1월 1일에 폐쇄되었습니다."  **설명:**  *   **어조:**  원문과 유사하게, 공식적인 느낌을 유지했습니다. *   **고유명사:** "이것은"과 같은 표현은 그대로 유지했습니다. *   **숫자:** "2023년 12월 31일, 1000만 명의 사용자가 이용하는 인기 있는 웹사이트입니다."  와 같이 그대로 표현했습니다. *   **URL:** "https://www.example.com"과 같이 그대로 표현했습니다. *   **코드:** "2024년 1월 1일에 폐쇄되었습니다."  와 같이 그대로 표현했습니다.  **추가 설명:**  원문은 중국어 간체(简体中文)로 작성되었으므로, 한국어 번역은 중국어 간체(简体中文)의 표현을 그대로 반영했습니다.  이 부분은 원문과 동일하게 유지했습니다.[此处]어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 간체(简体中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  **번역:**  “这篇论文的标题是《The Future of AI》。作者是李明，作者的微博是@李明_AI。论文的URL是https://www.example.com/ai。论文的代码是：`python`。论文的网址是`https://www.example.com/ai/code`。”  **설명:**  *   **“这篇论文的标题是《The Future of AI》。”**  -  "This is the title of the paper." *   **“作者是李明，作者的微博是@李明_AI。”** -  "The author is Li Ming, and his Weibo is @LiMing_AI."  (微博는 중국어 텍스트에 있는 이름입니다.) *   **“论文的URL是https://www.example.com/ai。”** -  "The paper's URL is https://www.example.com/ai." *   **“论文的网址是`python`。”** -  "The paper's URL is `python`." *   **“论文的代码是：`python`。”** -  "The paper's code is: `python`."  **주석:**  *   “这篇论文的标题是《The Future of AI》。” -  "This is the title of the paper." *   “作者是李明，作者的微博是@李明_AI。” -  "The author is Li Ming, and his Weibo is @LiMing_AI." *   “论文的URL是https://www.example.com/ai。” -  "The paper's URL is https://www.example.com/ai." *   “论文的网址是`python`。” -  "The paper's URL is `python`." *   “论文的代码是：`python`。” -  "The paper's code is: `python`."  **생각 과정:**  원문은 중국어 간체(简体中文)로 되어있고, 텍스트의 내용에 따라 번역을 진행했습니다.  중국어 텍스트에 있는 이름과 URL, 코드를 그대로 유지하여 번역했습니다.  설명과 주석을 추가하여 이해를 돕도록 했습니다.
- **mlx-gemma-4-e2b-4bit**: 点击[此处]此处
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 클릭[此处]계속해.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 번역문만 출력합니다.  点击[此处]继续。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 클릭[此处]계속.
- **mlx-qwen3.5-2b-4bit**: 点击[此处]此处
- **mlx-qwen3.5-2b-4bit-mt**: 클릭[此处]继续。
- **mlx-qwen3.5-4b-4bit**: 여기[此处]를 클릭하여 계속하세요.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 클릭[此处]계속.
- **ollama-gemma4-e2b**: 클릭[此处](누락)
- **ollama-gemma4-e4b**: 클릭하여[此处]계속하세요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 클릭[此处]계속.

**zh-Hans-link-02** (link)

- 원문: 有关支持的平台,请参阅[安装指南]了解详情。
- **apple-fm**: 지원 플랫폼에 대한 정보는 설치 가이드에 참고하세요.[安装指南]자세한 정보
- **apple-mt-attr**: 지원되는 플랫폼에 대해서는 참조하여 [安装指南]자세히 알아보세요.
- **apple-mt-plain**: 지원되는 플랫폼에 대해서는 참조하십시오.[安装指南]자세히 알아보기.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 지원되는 플랫폼은 다음을 참조하십시오.[安装指南]자세한 내용은 여기를 참조하십시오.
- **ct2-nllb-1.3b**: 지원 플랫폼에 대해서는 이 문서를 참조하십시오.[安装指南]더 많은 정보를 얻으세요.
- **ct2-nllb-600m**: 지원 플랫폼에 대해 참조하십시오.[安装指南]이 모든 것을 알고 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 有关支持的平台,请参阅[安装指南]了解详情。 ```
- **mlx-gemma-4-e2b-4bit**: 有关支持的平台,请参阅[安装指南]安装指南
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 지원되는 플랫폼에 대해서는 [安装指南]을 참조하여 자세한 정보를 확인하세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 관련된 지원 플랫폼의 내용은 [安装指南]에서 자세히 확인할 수 있습니다.
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 관련된 플랫폼에 대해 자세한 정보는 [安装指南]를 참조하십시오.
- **mlx-qwen3.5-2b-4bit**: 有关支持的平台，请参阅[安装指南]安装指南
- **mlx-qwen3.5-2b-4bit-mt**: 지원하는 플랫폼에 대한 정보는[安装指南]에서 확인해 주세요.
- **mlx-qwen3.5-4b-4bit**: 지원되는 플랫폼에 대한 자세한 내용은 다음을 참조하세요:[安装指南]설치 가이드
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 지원 가능한 플랫폼에 대한 자세한 내용은 [安装指南]를 참조하십시오.
- **ollama-gemma4-e2b**: 지원 플랫폼에 대해서는 [安装指南]를 참조하세요. 자세한 내용을 알아보세요.
- **ollama-gemma4-e4b**: 지원 플랫폼에 대한 자세한 내용은[安装指南]을(를) 참고하세요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 지원 플랫폼에 대한 자세한 내용은 [安装指南]를 참조하십시오.

**zh-Hans-link-03** (link)

- 원문: 如果遇到问题,请[在问题追踪页面提交反馈],并附上日志文件。
- **apple-fm**: 문제에 대한 답변을 찾으신다면, 문제 추적 페이지에 피드백을 제출하세요.[在问题追踪页面提交反馈], 로그 파일을 첨부하세요.
- **apple-mt-attr**: 문제가 발생하면, 주세요[在问题追踪页面提交反馈]하고, 로그 파일을 첨부해 .
- **apple-mt-plain**: 문제가 생기면, 제발[在问题追踪页面提交反馈], 그리고 로그 파일을 첨부한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 문제가 발생한 경우[在问题追踪页面提交反馈]로그 파일을 첨부하십시오.
- **ct2-nllb-1.3b**: 만약 문제가 있다면,[在问题追踪页面提交反馈]이 글은 롯데백화점과 롯데백화점의 롯데백화점입니다.
- **ct2-nllb-600m**: 만약 문제가 있다면,[在问题追踪页面提交反馈]로그 서류와 함께
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 간체(简体中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  **번역:**  “如果遇到问题，请联系我们。”  **설명:**  *   **“如果遇到问题”**:  “만약 문제가 발생하면”이라는 의미를 나타냅니다. *   **“请联系我们”**:  “우리에 연락해주세요”라는 의미를 나타냅니다. *   **“我们”**:  “우리는”이라는 의미를 나타냅니다.  **주석:**  *   (원문은 중국어 간체(简体中文)다.) *   (번역문만 출력하므로, 원문에 대한 정보는 제공하지 않습니다.)  **따옴표:**  *   (원문은 중국어 간체(简体中文)다.)  **생각 과정:**  원문은 중국어 간체(简体中文)로 되어 있으며, 번역은 원문 그대로 유지하는 것이 중요했습니다.  이전의 상황에 따라, 번역문은 문맥에 맞게 자연스럽게 한국어로 표현했습니다.[在问题追踪页面提交反馈]**번역:**  "추가 로그 파일도 함께 제공합니다."  **설명:**  *   **"추가 로그 파일"**은 "추가 로그 파일"이라는 의미로 번역되었습니다. *   **"추가 로그 파일"**은 "추가 로그 파일"이라는 의미로 번역되었습니다. *   **"추가 로그 파일"**은 "추가 로그 파일"이라는 의미로 번역되었습니다.  **주석:**  "추가 로그 파일도 함께 제공합니다."  **생각 과정:**  이 문장은 중국어 간체(简体中文)의 "어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라."를 반영하여, 문장 전체의 어조와 표현을 유지하도록 번역했습니다.  "추가 로그 파일"은 원문 그대로 유지하여 이해도를 높였습니다.
- **mlx-gemma-4-e2b-4bit**: 如果遇到问题,请[在问题追踪页面提交反馈]在问题追踪页面提交反馈
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 문제가 생기면 [在问题追踪页面提交反馈]을 하시고 로그 파일도 첨부해 주세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 원문 중국어 간체(简体中文): 如果遇到问题,请[在问题追踪页面提交反馈],并附上日志文件。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 질문이 발생했을 때, 해당 문제를 해결하기 위한 단계를 따르세요.[在问题追踪页面提交反馈]파일을 포함하여, 로그 파일을 첨부하라.
- **mlx-qwen3.5-2b-4bit**: 如果遇到问题，请[在问题追踪页面提交反馈]在问题追踪页面提交反馈
- **mlx-qwen3.5-2b-4bit-mt**: 문제를 발생 시에는[在问题追踪页面提交反馈]을 참조하여 로그 파일을 첨부하십시오.
- **mlx-qwen3.5-4b-4bit**: 문제가 발생하면 다음을 제출하여 피드백을 보내주세요:[在问题追踪页面提交反馈]문제 추적 페이지
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 문제가 있을 경우[在问题追踪页面提交反馈]그리고 로그 파일을 첨부합니다.
- **ollama-gemma4-e2b**: 문제가 발생하면, [在问题追踪页面提交反馈]로그 파일을 첨부하세요.
- **ollama-gemma4-e4b**: 문제가 발생하면,[在问题追踪页面提交反馈]에 피드백을 제출하고 로그 파일을 첨부해 주세요.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 문제가 발생하면 [在问题追踪页面提交反馈]에 문의하고, 로그 파일을 첨부해 주세요.

**zh-Hans-seq-01** (seq)

- 원문: 去年春天,我决定把一台旧笔记本改造成家用服务器,用来存放家人的照片。
- **apple-fm**: 작년 봄, 나는 오래된 노트북을 가정용 서버로 개조하여 가족 사진을 보관하기로 했다.
- **apple-mt-attr**: 작년 봄, 나는 오래된 노트북을 가정용 서버로 개조하여 가족들의 사진을 보관하기로 결정했다.
- **apple-mt-plain**: 작년 봄, 나는 오래된 노트북을 가정용 서버로 개조하여 가족들의 사진을 보관하기로 결정했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 작년 봄, 저는 가족의 사진을 저장하기 위해 오래된 노트북을 홈 서버로 변환하기로 결정했습니다.
- **ct2-nllb-1.3b**: 지난 봄, 저는 오래된 노트북을 가정용 서버로 바꾸고 가족 사진을 저장하기로 결정했습니다.
- **ct2-nllb-600m**: 지난 봄, 저는 오래된 노트북을 가정용 서버로 바꾸어 가족 사진을 저장하기로 결정했습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 2023년 4월, 저는 오래된 노트북을 가정용 서버로 바꾸기로 결정했어요.
- **mlx-gemma-4-e2b-4bit**: 去年春天,我决定把一台旧笔记本改造成家用服务器,用来存放家人的照片。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 지난해 봄, 저는 낡은 노트북을 가정용 서버로 개조하여 가족의 사진들을 저장하기로 결심했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 去年春天，我决定把一台旧笔记本改造成家用服务器，用来存放家人的照片。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 올해 봄, 나는 기존의 노트북을 업그레이드하여 가족的照片을 저장하는 홈 서버로 사용할 수 있도록 변환했다.
- **mlx-qwen3.5-2b-4bit**: 去年春天，我决定把一台旧笔记本改造成家用服务器，用来存放家人的照片。
- **mlx-qwen3.5-2b-4bit-mt**: 去年春天,我决定把一台旧笔记本改造成家用服务器,用来存放家人的照片。
- **mlx-qwen3.5-4b-4bit**: 去年春天,我决定把一台旧笔记本改造成家用服务器,用来存放家人的照片。
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 작년에 봄, 저는 오래된 노트북을 개조하여 가정용 서버로 만들기로 결정했습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 작년 봄, 저는 오래된 노트북을 가족 사진을 보관하는 가정용 서버로 개조하기로 결정했습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 지난 봄, 저는 오래된 노트북을 개조하여 가정용 서버로 만들기로 결정했습니다. 이를 통해 가족들의 사진을 보관할 수 있게 되었습니다.

**zh-Hans-seq-02** (seq)

- 원문: 这台 2014 年的ThinkBook配有 8 GB 内存,用来干这个活儿正合适。
- **apple-fm**: 2014년 모델ThinkBook8GB 메모리가 장착되어 있어, 이 용도에 딱 맞다.
- **apple-mt-attr**: 이 2014년형 ThinkBook은 8GB 메모리를 장착하고 있어서 이 일을 하기에 딱 맞습니다.
- **apple-mt-plain**: 이 2014년형 ThinkBook은 8GB 메모리를 장착하고 있어서 이 일을 하기에 딱 맞습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 이 2014년 ThinkBook은 8GB의 메모리를 갖추고 있어 이러한 작업에 적합합니다.
- **ct2-nllb-1.3b**: 이 2014년 힌크북은 8GB의 메모리를 탑재하고 있으며, 이 작업을 수행하는 데 적합합니다.
- **ct2-nllb-600m**: 2014년 출시된 이 ThinkBook은 8GB의 메모리를 탑재하여 이 작업을 잘 수행할 수 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 이 2014년 ThinkBook은 8GB RAM으로 작업을 제대로 할 수 있습니다.
- **mlx-gemma-4-e2b-4bit**: 这台 2014 年的ThinkBook配有 8 GB 内存,用来干这个活儿正合适。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 2014년형 ThinkBook은 8GB의 메모리를 갖추고 있어, 이 작업을 하기에 딱 맞는 장비입니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 这台 2014 年的ThinkBook配有 8 GB 内存,用来干这个活儿正合适。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 2014년의 ThinkBook는 8GB의 메모리로, 이 작업에 적합한 컴퓨터입니다.
- **mlx-qwen3.5-2b-4bit**: 这台 2014 年的ThinkBook配有 8 GB 内存，用来干这个活儿正合适。
- **mlx-qwen3.5-2b-4bit-mt**: 이 2014 년款的 ThinkBook 는 8 GB 메모리를 탑재하여 해당 작업을 수행하기에 적합합니다.
- **mlx-qwen3.5-4b-4bit**: 이 2014 년 모델 ThinkBook 는 8 GB 메모리를 탑재하여 이 용도에 딱 맞습니다.(누락)(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 이 2014년 ThinkBook은 8GB의 메모리를 가지고 있어, 이 작업을 하기에는 딱 좋습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 이 2014년식ThinkBook8 GB 메모리가 장착되어 있어, 이 용도에 딱 적합했습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 이 2014년 ThinkBook은 8GB의 메모리를 탑재하여, 이 작업을 수행하기에 적합합니다.

**zh-Hans-seq-03** (seq)

- 원문: 我先装了 [Debian 12],又搭了一个叫 Fernbox 的小型网页应用来浏览照片。
- **apple-fm**: 먼저[Debian 12]Debian 12
- **apple-mt-attr**: 나는 먼저 를 설치하고[Debian 12], 사진을 보려면 Fernbox라는 작은 웹 애플리케이션을 설치했다.
- **apple-mt-plain**: 제가 먼저 설치했어요. [Debian 12],또 Fernbox라는 소형 웹사이트 애플리케이션을 이용해 사진을 둘러보았다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 내가 먼저 가져갈게 [Debian 12]Fernbox 라는 작은 웹 애플리케이션을 만들어서 사진을 볼 수 있게 했습니다.
- **ct2-nllb-1.3b**: 제가 먼저 준비했습니다. [Debian 12]그리고 Fernbox라는 작은 웹 앱을 통해 사진을 볼 수 있습니다.
- **ct2-nllb-600m**: 제가 먼저 입었습니다. [Debian 12]또한, Fernbox라는 작은 웹 앱을 통해 사진을 검색할 수 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 간체(简体中文)다.  **번역:**  가서 먼저 준비했다. [Debian 12]어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 간체(简体中文)다.  이 문장은 "어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라." 라는 조건 하에, "어떤 웹 애플리케이션을 다시 만들었다."라는 의미로 해석될 수 있습니다.  **번역:**  "또 다른 웹 애플리케이션을 만들어 사진을 보기 위해."  **설명:**  *   **어조:**  "또 다른"이라는 표현은 "또 다른"이라는 것을 강조하는 어조입니다. *   **고유명사:** "Fernbox"은 웹 애플리케이션의 이름입니다. *   **숫자:** "또"는 "또"를 나타냅니다. *   **URL:** "Fernbox"은 웹 애플리케이션의 URL입니다. *   **코드:** "또"는 "또"를 나타냅니다.  **추가적인 고려 사항:**  이 문장은 상황에 따라 다양한 방식으로 번역될 수 있습니다.  예를 들어, "어떤 웹 애플리케이션을 다시 만들었다"는 의미를 강조하고 싶다면 "어떤 웹 애플리케이션을 다시 만들었다"를 그대로 번역하는 것이 더 적절할 수 있습니다.
- **mlx-gemma-4-e2b-4bit**: 我先装了[Debian 12]Debian 12
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 먼저 [Debian 12]를 설치하고, 사진을 보기 위한 Fernbox라는 작은 웹 애플리케이션도 추가했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 我先装了 [Debian 12]，又搭了一个叫 Fernbox 小型网页应用来浏览照片。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 我先装了 [Debian 12]，又搭了一个叫 Fernbox 的小型网页应用来浏览照片。
- **mlx-qwen3.5-2b-4bit**: 我先装了[Debian 12]，又搭了一个叫 Fernbox 的小型网页应用来浏览照片。
- **mlx-qwen3.5-2b-4bit-mt**: 먼저 [Debian 12]를 설치하고, Fernbox라는 이름의 소형 웹 애플리케이션을 구축하여 사진들을浏览합니다.
- **mlx-qwen3.5-4b-4bit**: 먼저 Debian 12 를 설치하고, Fernbox 라는 이름의 소형 웹 애플리케이션을 구축하여 사진을 브라우저로 열었습니다.[Debian 12](누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 저는 먼저 [Debian 12]을 설치하고, "Fernbox"라는 작은 웹 앱을 사용하여 사진을 보기 시작했습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 저는 먼저 "[Debian 12]"를 설치하고, 사진을 볼 수 있는 Fernbox라는 작은 웹 애플리케이션을 구축했습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 먼저 [Debian 12]을 설치하고, 사진을 보기 위해 "Fernbox"라는 작은 웹 애플리케이션을 사용했습니다.

**zh-Hans-seq-04** (seq)

- 원문: 妹妹一开始半信半疑,但一周后她承认,Fernbox 比她用过的任何云服务都快。
- **apple-fm**: 여동생은 처음에는 의심했지만, 일주일 후 그녀는 Fernbox가 그녀가 사용했던 모든 클라우드 서비스보다 훨씬 더 효율적이라고 인정했다.
- **apple-mt-attr**: 여동생은 처음에는 반신반의했지만, 일주일 후 그녀는 인정했다, Fernbox는 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다.
- **apple-mt-plain**: 여동생은 처음에는 반신반의했지만, 일주일 후 그녀는 인정했다, Fernbox는 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 여동생은 처음에는 반대했지만 일주일이 지나자 Fernbox가 그녀가 이전에 사용했던 어떤 클라우드 서비스보다도 빠르다고 인정했습니다.
- **ct2-nllb-1.3b**: 그녀의 여동생은 처음에는 회의적이었지만 일주일 후 그녀는 페른박스가 그녀가 사용한 모든 클라우드 서비스보다 더 빠르다고 인정했다.
- **ct2-nllb-600m**: 그녀의 여동생은 처음에는 반 회의적이었지만 일주일 후에 그녀는 Fernbox이 그녀가 사용한 모든 클라우드 서비스보다 더 빠르다는 것을 인정했습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 간체(简体中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  이전부터는 약간의 의심만 품고 있었지만, 한 주 뒤에 그녀가 인정했다. Fernbox는 그녀가 사용해본 어떤 다른 클라우드 서비스보다 훨씬 빠르다.
- **mlx-gemma-4-e2b-4bit**: 妹妹一开始半信半疑,但一周后她承认,Fernbox 比她用过的任何云服务都快。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 여동생은 처음에는 의심스러워했지만, 일주일 후에 그녀는 Fernbox이 자신이 사용한 어떤 클라우드 서비스보다도 빠르다고 인정했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 妹妹一开始半信半疑,但一周后她承认,Fernbox 比她用过的任何云服务都快。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 형제는 처음에는 반쪽으로 의심했지만, 한주 후에는 Fernbox가 그녀가 사용한 모든 클라우드 서비스보다 빠르다고 인정했다.
- **mlx-qwen3.5-2b-4bit**: 妹妹一开始半信半疑，但一周后她承认，Fernbox 比她用过的任何云服务都快。
- **mlx-qwen3.5-2b-4bit-mt**: 어머니는 처음에 반신반신한 상태였으나, 한 주 후에는 이를 인정했다. Fernbox 는 그녀가曾用한 모든 클라우드 서비스보다 빠르다.
- **mlx-qwen3.5-4b-4bit**: 제 자매는 처음에는 반신반의했지만, 일주일 후 그녀는 Fernbox 가 그녀가 사용했던 모든 클라우드 서비스보다 빠르다고 인정했습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 처음에는 약간 의심했지만, 일주일 후 그녀는 Fernbox가 그녀가 사용해 본 다른 클라우드 서비스보다 훨씬 빠르다는 것을 인정했습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 여동생은 처음에는 반신반의했지만, 일주일 후 Fernbox가 자신이 사용해 본 어떤 클라우드 서비스보다 빠다고 인정했습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 처음에는 의심스러워했지만, 한 주 후에는 Fernbox가 그녀가 사용해 본 다른 클라우드 서비스보다 훨씬 빠르다는 것을 인정했습니다.

**zh-Hans-seq-05** (seq)

- 원문: 现在,那台旧笔记本安安静静地待在架子上,而Fernbox已经成了全家人旅行回来后第一个打开的应用。
- **apple-fm**: 지금, 그 오래된 노트북은 조용히 선반에 올려져 있고, 그리고Fernbox이제 가족 모두가 여행에서 돌아온 후 가장 먼저 사용하는 앱이 되었다.
- **apple-mt-attr**: 지금, 그 오래된 노트북은 조용히 선반에 놓여 있고, Fernbox는 이미 가족이 여행에서 돌아온 후 첫 번째로 열리는 애플리케이션이 되었다.
- **apple-mt-plain**: 지금, 그 오래된 노트북은 조용히 선반에 놓여 있고, Fernbox는 이미 가족이 여행에서 돌아온 후 첫 번째로 열리는 애플리케이션이 되었다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 이제 그 오래된 노트북은 선반에 안전하게 놓여 있고 Fernbox는 가족이 여행을 마치고 집으로 돌아왔을 때 처음으로 열어보는 앱이 되었습니다.
- **ct2-nllb-1.3b**: 이제, 오래된 노트북이 조용히 선반에 앉아 있고, 페른박스는 가족이 여행에서 돌아온 후 첫 번째 앱이 되었습니다.
- **ct2-nllb-600m**: 이제 오래된 노트북은 조용하게 상자 위에 남아있으며, Fernbox은 온 가족이 돌아온 후 처음으로 오픈된 응용 프로그램입니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: block missing in output)
- **mlx-gemma-3-1b-4bit-mt**: 이제, 그 오래된 낡은 노트북은 조용히 책상 위에 놓여 있었고, Fernbox는 가족이 여행을 떠나 돌아온 후 처음으로 열린 앱이었습니다.
- **mlx-gemma-4-e2b-4bit**: 现在,那台旧笔记本安安静静地待在架子上,而Fernbox已经成了全家人旅行回来后第一个打开的应用。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 이제 그 낡은 노트북은 조용히 선반 위에 놓여 있고, Fernbox는 가족이 여행에서 돌아올 때 가장 먼저 열리는 앱이 되었습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: block missing in output)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 现在,那台旧笔记本安安静静地待在架子上,而Fernbox已经成了全家人旅行回来后第一个打开的应用。
- **mlx-qwen3-1.7b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-qwen3-1.7b-4bit-mt**: 현재, 그 노트북은 놓여 있는 채로架子 위에 놓여 있고, Fernbox는 모두가 여행 후 처음 실행되는 앱이 되었다.
- **mlx-qwen3.5-2b-4bit**: 现在，那台旧笔记本安安静静地待在架子上，而Fernbox已经成了全家人旅行回来后第一个打开的应用。
- **mlx-qwen3.5-2b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 간체(简体中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.
- **mlx-qwen3.5-4b-4bit**: 이제 그 오래된 노트북은 조용히 책상 위에 놓여 있으며, Fernbox 는 가족이 여행回来后 가장 먼저 열게 되는 애플리케이션이 되었습니다.(누락)(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 현재, 오래된 노트북은 책상 위에 조용히 놓여 있었고, Fernbox는 가족들이 여행을 마치고 돌아와서 가장 먼저 사용하는 앱이 되었습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 지금, 그 오래된 노트북은 선반 위에 조용히 놓여 있고,Fernbox온 가족이 여행에서 돌아온 후 가장 먼저 여는 앱이 되었습니다.
- **ollama-qwen3-1.7b**: (오류: fetch failed)
- **ollama-qwen3.5-2b**: (오류: block missing in output)
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 현재, 오래된 노트북은 조용히 책상 위에 놓여 있고, Fernbox는 가족들이 여행을 마치고 돌아와서 가장 먼저 사용하는 앱이 되었습니다.

### zh-Hant

**zh-Hant-tech-01** (tech)

- 원문: 若要安裝命令列工具,請執行 [npm install -g fernctl],接著用 [fernctl --version] 檢查版本。需要 2.4.1 或更新的版本。
- **apple-fm**: 명령줄 도구 설치하려면 다음 명령어를 실행하세요.[npm install -g fernctl], 다음 명령어로 버전 확인을 진행하세요.[fernctl --version](누락)
- **apple-mt-attr**: 명령줄 도구를 설치하려면 을 실행한 [npm install -g fernctl]후 사용하여 [fernctl --version]버전을 확인하십시오. 2.4.1 이상 버전이 필요합니다.
- **apple-mt-plain**: 명령줄 도구를 설치하려면 실행하십시오. [npm install -g fernctl],그 다음 사용 [fernctl --version] 버전 확인. 2.4.1 또는 이후 버전이 필요합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 명령줄 도구를 설치하려면 다음을 실행하십시오. [npm install -g fernctl]그래, 그렇지 [fernctl --version] 버전을 확인하세요. 버전 2.4.1 이상이 필요합니다.
- **ct2-nllb-1.3b**: 명령줄 도구를 설치하려면 실행하세요. [npm install -g fernctl]그리고 그 다음으로 [fernctl --version] 버전을 확인합니다. 2.4.1 또는 최신 버전이 필요합니다.
- **ct2-nllb-600m**: 명령줄 도구를 설치하려면 실행하십시오. [npm install -g fernctl]이 글은 [fernctl --version] 2.4.1 버전 또는 최신 버전이 필요합니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 若要安裝命令列工具, 請執行 [npm install -g fernctl],接著用 [fernctl --version] 檢查版本。需要 2.4.1 或更新的版本。  ```
- **mlx-gemma-4-e2b-4bit**: 若要安裝命令列工具,請執行 [npm install -g fernctl]npm install -g fernctl[fernctl --version],接著用 
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 명령줄 도구를 설치하려면 [npm install -g fernctl]을 실행한 다음 [fernctl --version]를 사용하여 버전을 확인하세요. 2.4.1 이상의 버전이 필요합니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 請輸入您想要的程式碼或指令，我會幫您翻譯成中文。 [npm install -g fernctl]請輸入您要翻譯的繁體中文文本，我會自動翻譯成自然韓國語，並輸出結果。 [fernctl --version] 이 문서의 요구 사항은 2.4.1 或更新的版本입니다.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 명령줄 도구를 설치하려면 다음 명령을 실행하라. [npm install -g fernctl],接著用 [fernctl --version] 버전 2.4.1 이상이 필요합니다.
- **mlx-qwen3.5-2b-4bit**: 若要安裝列頭工具，請執行[npm install -g fernctl]npm install -g fernctl[fernctl --version]接著用
- **mlx-qwen3.5-2b-4bit-mt**: 若要安裝列工具，請執行[npm install -g fernctl]，接著使用[fernctl --version]檢查版本。需要 2.4.1 或更新的版本。
- **mlx-qwen3.5-4b-4bit**: 설치 명령줄 도구를 설치하려면 다음을 실행하세요:[npm install -g fernctl]버전 확인을 위해 다음을 실행하세요:[fernctl --version]버전 확인을 위해 다음을 실행하세요. 2.4.1 버전 이상을 사용해야 합니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 명령줄 도구를 설치하려면 [npm install -g fernctl]을 실행하고, 그 다음 [fernctl --version]를 사용하여 버전을 확인해야 합니다. 2.4.1 버전 이상을 요구합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: 만약 명령어 도구를 설치하려면 [npm install -g fernctl]npm install -g fernctl[fernctl --version]을 실행해야 합니다.
- **ollama-qwen3.5-2b**: 若要安裝命令列工具，請執行[npm install -g fernctl]接著用[fernctl --version]檢查版本。需要 2.4.1 或更新的版本。
- **ollama-translategemma-4b**: 명령줄 도구를 설치하려면 다음 명령을 실행하세요:[npm install -g fernctl]그런 다음 다음 명령을 사용하여 버전 [fernctl --version]버전을 확인하세요. 2.4.1 이상 버전이 필요합니다.
- **ollama-translategemma-4b-mt**: 명령줄 도구를 설치하려면 [npm install -g fernctl]를 실행한 후, [fernctl --version]를 사용하여 버전을 확인하십시오. 2.4.1 버전 이상이 필요합니다.

**zh-Hant-tech-02** (tech)

- 원문: [timeout] 選項的單位為毫秒,預設值是 30000(30 秒),設為 0 則完全不限制逾時。
- **apple-fm**: [timeout]옵션은 밀리초 단위로 설정되며 기본값은 30,000(30초)입니다. 0으로 설정하면 시간 초과가 완전히 제한되지 않습니다.
- **apple-mt-attr**: [timeout]옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 완전히 시간 초과를 제한하지 않습니다.
- **apple-mt-plain**: [timeout] 옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 연체에 대해 완전히 제한되지 않습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: [timeout] 기본값은 30000(30초)이며, 0으로 설정하면 시간 제한이 없다.
- **ct2-nllb-1.3b**: [timeout] 이 옵션의 단위는 밀리 초이고 기본값은 30000 ((30초) 이며 0으로 설정하면 지연 제한이 없습니다.
- **ct2-nllb-600m**: [timeout] 선택의 단위는 밀리초이고 기본값은 30,000 (~30초) 이며, 0은 시간 제한이 전혀 없습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: [timeout] **텍스트:**  어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 번체(繁體中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  **번역:**  (원문 그대로 유지)  **참고:**  *   **고유명사:**  원문에 있는 고유명사 (예: 30000, 0)는 그대로 유지합니다. *   **숫자:**  원문에 있는 숫자 (예: 30000, 0)는 그대로 유지합니다. *   **URL:**  원문에 있는 URL은 그대로 유지합니다. *   **코드는:**  원문에 있는 코드는 그대로 유지합니다. *   **설명:**  원문에 있는 설명은 그대로 유지합니다. *   **주석:**  원문에 있는 주석은 그대로 유지합니다. *   **생각 과정:**  원문에 있는 생각 과정은 출력하지 않습니다.  **추가 설명:**  이 번역은 원문의 의미를 최대한 유지하면서, 한국어에 어울리는 표현으로 번역했습니다.  원문에 있는 고유명사, 숫자, URL, 코드는 그대로 유지하여, 번역의 정확성을 높였습니다.
- **mlx-gemma-4-e2b-4bit**: [timeout]選項的單位為毫秒,預設值是 30000(30 秒),設為 0 則完全不限制逾時.
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: [timeout] 옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 시간 초과가 전혀 제한되지 않습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: [timeout] 的單位為毫秒,預設值是 30000(30 秒),設為 0 則完全不限制逾時。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: [timeout] 선택의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0을 설정하면 완전히 시간제한이 제거됩니다.
- **mlx-qwen3.5-2b-4bit**: [timeout]選項的單位為毫秒，預設值是 30000(30 秒)，設為 0 則完全不限制逾時。
- **mlx-qwen3.5-2b-4bit-mt**: [timeout] 選項的單位為毫秒，預設值為 30000(30 秒)，設為 0 則完全不限制逾時。
- **mlx-qwen3.5-4b-4bit**: [timeout]옵션의 단위는 밀리초이며, 기본값은 30000(30 초)입니다. 0 으로 설정하면 타임아웃을 완전히 무효화할 수 있습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: [timeout] 옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 시간 제한이 없습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: [timeout]選項的單位為毫秒，預設值是 30000(30 秒)，設為 0 則完全不限制逾時。
- **ollama-translategemma-4b**: [timeout]timeout 옵션의 단위는 밀리초입니다. 기본값은 30000(30초)이며, 0으로 설정하면 시간 제한이 없습니다.
- **ollama-translategemma-4b-mt**: [timeout] 옵션의 단위는 밀리초이며, 기본값은 30000(30초)입니다. 0으로 설정하면 시간 초과에 대한 제한이 전혀 없습니다.

**zh-Hant-tech-03** (tech)

- 원문: 從 v1.x 升級之前,請先備份設定資料夾。遷移指令碼會直接覆寫所有檔案,而且無法復原。
- **apple-fm**: v1.x에서 이전 버전으로 업그레이드하기 전에 먼저 백업을 진행하세요.설정 폴더를 지정하세요.(누락)
- **apple-mt-attr**: v1.x로 업그레이드하기 전에 먼저 백업해 주세요설정 폴더를 . 트랜스포트 명령어 코드는 모든 파일을 직접 재작성하며 복원할 수 없습니다.
- **apple-mt-plain**: v1.x로 업그레이드하기 전에 설정 폴더를 먼저 백업해 주세요. 트랜스포트 명령어 코드는 모든 파일을 직접 재작성하며 복원할 수 없습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: v1.x에서 업그레이드하기 전에 설정 폴더를 백업하십시오. 마이그레이션 코드는 모든 파일을 직접 덮어쓰고 복원할 수 없습니다.
- **ct2-nllb-1.3b**: v1.x에서 업그레이드하기 전에 파일 저장소를 백업하십시오. 이동 명령 코드는 모든 파일을 바로 덮고 복구할 수 없습니다.
- **ct2-nllb-600m**: V1.x에서 업그레이드되기 전에, 먼저 기본 설정 데이터베이스를 예약하십시오.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: **From version 1.x upgrade, please first backup the configuration directory. The transition command will directly overwrite all files, and it cannot be recovered.**  **Explanation:**  *   **從 v1.x 升級之前:**  "From version 1.x upgrade before" -  "Before" is translated as "before" in Chinese. *   **請先備份設定資料夾:** "Please first backup the configuration directory." - "Please" is translated as "Please" in Chinese. *   **遷移指令碼會直接覆寫所有檔案:** "The transition command will directly overwrite all files." - "Transition command" is translated as "transition command" in Chinese. *   **而且無法復原:** "and it cannot be recovered." - "and" is translated as "and" in Chinese.  **Thought Process:**  The translation prioritizes maintaining the original meaning and structure of the Chinese text. I've focused on preserving the formal tone and the technical details.
- **mlx-gemma-4-e2b-4bit**: 從 v1.x 升級之前,請先備份設定資料夾。遷移指令碼會直接覆寫所有檔案,而且無法復原。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: v1.x로 업그레이드하기 전에, 먼저 설정 파일을 백업해 두세요. 이전 명령어는 모든 파일을 직접 덮어넣게 되며, 복구할 수 없습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 이 문장은 중국어 번체로 되어 있습니다. 자연스러운 한국어로 번역해 드리겠습니다.  원문: 從 v1.x 升級之前,請先備份設定資料夢。遷移指令碼會直接覆寫所有檔案,而且無法復原。  번역: Before upgrading to v1.x, please back up the setting data folder. The migration script will directly overwrite all files, and it cannot be restored.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 업데이트 전, 설정 파일 폴더를 밀어내세요. 이전 버전에서의 지시문은 모든 파일을 덮어쓰고 복구할 수 없습니다.
- **mlx-qwen3.5-2b-4bit**: 從 v1.x 升級之前，請先備份設定資料夾。遷移指令碼會直接覆寫所有檔案，而且無法復原。
- **mlx-qwen3.5-2b-4bit-mt**: v1.x 이전부터는 설정 데이터 폴더를 먼저 백업해야 합니다. 이동 명령이 모든 파일을 직접 덮어쓰므로 복구할 수 없습니다.
- **mlx-qwen3.5-4b-4bit**: v1.x 로 업그레이드하기 전에 설정 폴더를 백업하세요. 마이그레이션 스크립트는 모든 파일을 덮어쓰며 복구가 불가능합니다.(누락)(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: v1.x 버전으로 업그레이드하기 전에, 먼저 설정 폴더를 백업해 주세요. 이 이동 명령어는 모든 파일을 직접 덮어쓰고, 되돌릴 수 없습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 從 v1.x 升級之前，請先備份設定資料夾。遷移指令碼會直接覆寫所有檔案，而且無法復原。(누락)
- **ollama-translategemma-4b**: v1.x 버전에서 이전 버전으로 업그레이드하기 전에 먼저 백업하세요.설정 폴더를백업합니다. 이 명령어는 모든 파일을 덮어쓰고 복원할 수 없습니다.
- **ollama-translategemma-4b-mt**: v1.x 버전에서 v2.x 버전으로 업그레이드하기 전에, 반드시 설정 파일 폴더를 백업해 두십시오. 마이그레이션 스크립트는 모든 파일을 직접 덮어쓰기 때문에 복구할 수 없습니다.

**zh-Hant-tech-04** (tech)

- 원문: 如果常駐程式無法啟動,請確認連接埠 8443 沒有被其他處理程序佔用。記錄檔可在 http://localhost:8443/debug/logs 查看。
- **apple-fm**: 정기적으로 실행되는 프로그램이 시작되지 않으면 8443 포트가 다른 프로그램에 사용 중인지 확인하세요. 로그는 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **apple-mt-attr**: 상시 실행 프로그램이 시작되지 않으면, 포트 8443이 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그 파일은 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain**: 상시 실행 프로그램이 시작되지 않으면, 포트 8443이 다른 프로세스에 할당되지 않았는지 확인하십시오. 로그 파일은 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 레지스트리 프로그램이 실행되지 않으면, 다른 프로그램이 포트 8443에 연결되어 있지 않은지 확인하십시오. 로그 파일은 http://localhost:8443/debug/logs 에서 볼 수 있습니다.
- **ct2-nllb-1.3b**: 만약 로컬호스트가 시작되지 않는다면, 연결 패널 8443이 다른 처리 프로그램으로 점유되지 않았는지 확인하세요. 로그 파일은 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **ct2-nllb-600m**: 로컬호스트 (8443/debug/logs) 에서 기록 파일을 확인할 수 있습니다. http://localhost:8443/debug/logs
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 만약 항상 켜짐(常駐程式)이 실행되지 않으시면, 연결 포트 8443이 다른 처리 프로그램에 의해 사용되지 않았는지 확인하세요. 로그 파일은 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **mlx-gemma-4-e2b-4bit**: 如果常駐程式無法啟動,請確認連接埠 8443 沒有被其他處理程序佔用。記錄檔可在 http://localhost:8443/debug/logs 查看。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 정상적으로 실행되는 프로그램이 실행되지 않는다면, 포트 8443이 다른 처리 프로그램에 사용되고 있지 않은지 확인하세요. 로그 파일은 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 이 텍스트의 중국어 원문을 자연스러운 한국어로 번역하면 다음과 같습니다:  만약 상주 프로그램이 정상적으로 기동하지 않으면, 포트 8443이 다른 처리 프로그램에 점유되지 않았는지 확인하십시오. 로그 파일은 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 정체성 파일이 실행되지 않아, 8443 연결埠가 다른 프로세스에 의해 사용중인 경우 확인해보세요. 로그 파일은 http://localhost:8443/debug/logs에서 확인할 수 있습니다.
- **mlx-qwen3.5-2b-4bit**: 如果常駐程式無法啟動，請確認連接埠 8443 沒有被其他處理程序佔用。記錄檔可在 http://localhost:8443/debug/logs 查看。
- **mlx-qwen3.5-2b-4bit-mt**: 如果常駐程式無法啟動，請確認連接埠 8443 未被其他處理程序佔用。記錄檔可於 http://localhost:8443/debug/logs 查看。
- **mlx-qwen3.5-4b-4bit**: 常驻服务无法启动时，请确认端口 8443 未被其他进程占用。日志可在 http://localhost:8443/debug/logs 查看。
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 만약 프로그램이 정상적으로 실행되지 않는 경우, 포트 8443이 다른 프로그램에 의해 사용 중인지 확인해주세요. 로그 파일은 http://localhost:8443/debug/logs 에서 확인하실 수 있습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 如果常駐程式無法啟動，請確認連接埠 8443 沒有被其他處理程序佔用。記錄檔可在 http://localhost:8443/debug/logs 查看。
- **ollama-translategemma-4b**: 프로그램이 시작되지 않으면 포트 8443이 다른 프로세스에 의해 사용 중인지 확인하세요. 로그 파일은 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.
- **ollama-translategemma-4b-mt**: 만약 프로그램이 정상적으로 시작되지 않는 경우, 포트 8443이 다른 프로세스에 의해 사용되고 있는지 확인하십시오. 로그 파일은 http://localhost:8443/debug/logs 에서 확인할 수 있습니다.

**zh-Hant-tech-05** (tech)

- 원문: 每個執行緒都有各自約 64 MB 的快取,因此記憶體為 8 GB 的電腦最多只應執行八個執行緒。
- **apple-fm**: 각 스레드는 약 64MB의 캐시를 사용하므로 8GB 메모리를 가진 컴퓨터에서는 최대 8개의 스레드를 실행해야 합니다.
- **apple-mt-attr**: 각 실행 스레드는 각각 약 64MB의 캐시를 가지고 있으므로, 메모리가 8GB인 컴퓨터는 최대로 8개의 실행 스레드만 실행해야 합니다.
- **apple-mt-plain**: 각 실행 스레드는 각각 약 64MB의 캐시를 가지고 있으므로, 메모리가 8GB인 컴퓨터는 최대로 8개의 실행 스레드만 실행해야 합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 각 스레드는 약 64MB의 캐시를 가지고 있으므로 8GB의 메모리를 가진 컴퓨터는 최대 8개의 스레드를 실행할 수 있다.
- **ct2-nllb-1.3b**: 각 실행 노드는 각각 약 64 MB의 스냅샷을 가지고 있기 때문에 8 GB의 컴퓨터는 최대 8 개의 실행 노트를 실행해야 합니다.
- **ct2-nllb-600m**: 각 실행 스틱은 64MB 정도를 가지고 있기 때문에 최대 8GB의 메모리는 8개의 실행 스틱을 실행할 수 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  "각 실행기마다 자체적으로 64MB의 캐시가 있으며, 따라서 기억 장치는 8GB의 컴퓨터로 실행할 수 있는 최대 8개 실행기만 가능합니다."  **설명:**  *   **각 실행기:** "각 실행기"는 "각 실행기"로 번역되었습니다. *   **캐시:** "캐시"는 "캐시"로 번역되었습니다. *   **컴퓨터:** "컴퓨터"는 "컴퓨터"로 번역되었습니다. *   **64MB:** "64MB"는 "64MB"로 번역되었습니다. *   **만족:** "만족"은 "만족"로 번역되었습니다.  **추가 설명:**  이 번역은 원문의 의미를 최대한 유지하면서 한국어에 어울리는 표현으로 수정했습니다.
- **mlx-gemma-4-e2b-4bit**: 每個執行緒都有各自約 64 MB 的快取,因此記憶體為 8 GB 的電腦最多只應執行八個執行緒。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 각 작업 스레드는 약 64 MB의 캐시 공간을 가지고 있으므로, 8 GB의 메모리가 있는 컴퓨터에서는 최대 여덟 개의 작업 스레드만 실행될 수 있습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 每個執行緒都有各自約 64 MB 的快取,因此記憶體為 8 GB 的電腦最多只應執行八個執行登錄。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 각 실행 스레드가 각각 64MB의 캐시를 가진다. 따라서 8GB의 메모리 컴퓨터는 최대 8개의 실행 스레드만 실행할 수 있다.
- **mlx-qwen3.5-2b-4bit**: 每個執行緒都有各自約 64 MB 的快取，因此記憶體為 8 GB 的電腦最多只應執行八個執行緒。
- **mlx-qwen3.5-2b-4bit-mt**: 각 실행마다 약 64 MB 의 캐시를 갖게 되므로, 8 GB 의 메모리 공간은 최대 8 개의 실행을 처리할 수 있습니다.
- **mlx-qwen3.5-4b-4bit**: 각 스레드는 약 64 MB 의 캐시를 가지므로, 8 GB 메모리를 가진 컴퓨터는 최대 8 개 스레드만 실행할 수 있습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 각 스레드는 각각 약 64MB의 캐시를 가지므로, 8GB 메모리를 가진 컴퓨터는 최대 8개의 스레지만 실행해야 합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 每個執行緒都有各自約 64 MB 的快取，因此記憶體為 8 GB 的電腦最多只應執行八個執行緒。
- **ollama-translategemma-4b**: 각 스레드는 약 64MB의 캐시를 가지고 있습니다. 따라서 8GB 메모리를 가진 컴퓨터에는 최대 8개의 스레드만 실행할 수 있습니다.
- **ollama-translategemma-4b-mt**: 각 스레드는 약 64MB의 캐시를 가지고 있으므로, 8GB의 메모리를 가진 컴퓨터는 최대 8개의 스레드만 실행할 수 있습니다.

**zh-Hant-tech-06** (tech)

- 원문: 請求最多會以指數退避的方式重試三次;若全部失敗,錯誤會以 [TransientError] 的形式回傳給呼叫端。
- **apple-fm**: 요청은 최대 3회 급격히 실패하도록 재시도되며, 모든 시도가 실패하면 오류는 [TransientError]TransientError
- **apple-mt-attr**: 요청은 최대 지수적 회피 방식으로 세 번까지 재시도할 수 있습니다; 모두 실패하면 오류는 [TransientError]형태로 호출측으로 반환됩니다.
- **apple-mt-plain**: 요청은 최대 지수적 후퇴 방식으로 세 번까지 재시도할 수 있습니다; 모두 실패하면 오류는 [TransientError] 의 형식을 호출단으로 반환한다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 요청은 지수적으로 최대 세 번 재시도되며, 모두 실패하면 오류가 발생합니다. [TransientError] 전화번호는 전화번호판에 표시된다.
- **ct2-nllb-1.3b**: 이 요청은 최대 3차례에 걸쳐 지수 회피 방식으로 다시 시도됩니다. 모든 것이 실패하면 오류가 표시됩니다. [TransientError] 이 글은 이 페이지에서 볼 수 있습니다.
- **ct2-nllb-600m**: 가장 많은 경우 지수 회피 방식으로 세 번 반복되는 것을 요구합니다. [TransientError] 이 글은 이 글에서 나온다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: **최대 청구는 1000만 포인트로 다시 시도할 수 있습니다. 만약 모든 시도가 실패하면, 오류는 1000만 포인트로 다시 시도됩니다.**  **설명:**  *   **최대 청구:**  "최대 청구"는 "최대 청구"를 그대로 번역했습니다. *   **1000만 포인트:**  "1000만 포인트"는 "1000만 포인트"를 그대로 번역했습니다. *   **시도:**  "시도"는 "시도"를 그대로 번역했습니다. *   **오류:**  "오류"는 "오류"를 그대로 번역했습니다.  **주석:**  이 문장은 중국어 번체(繁體中文)에서 사용된 텍스트의 의미를 최대한 유지하려고 노력했습니다.  이 문장은 일반적으로 오류 발생 시 재시도하는 시스템의 메시지일 가능성이 높습니다. [TransientError] 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 번체(繁體中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.
- **mlx-gemma-4-e2b-4bit**: 請求最多會以指數退避的方式重試三次;若全部失敗,錯誤會以 [TransientError]TransientError
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 최대 3번까지 지수적 회피 방식으로 다시 시도할 수 있습니다. 만약 모든 시도가 실패하면, 오류는 [TransientError] 형태로 호출자에게 반환됩니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 請求最多會以指數退避的方式重試三次;若全部失敗,錯誤會以 [TransientError] 的形式回傳給呼叫端。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 請求最多會以指數退避的方式重試三次；若全部失敗，錯誤會以 [TransientError] 的形式回傳給呼叫端。
- **mlx-qwen3.5-2b-4bit**: 請求最多會以指數退避的方式重試三次；若全部失敗，錯誤會以[TransientError]TransientError
- **mlx-qwen3.5-2b-4bit-mt**: 請求最多會以指數退避的方式重試三次；若全部失敗，錯誤會以 [TransientError] 的形式回傳給呼叫端。
- **mlx-qwen3.5-4b-4bit**: 요청 최대 3 회 지수 백오프 방식으로 재시도합니다. 모두 실패하면 오류가 [TransientError](누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 가장 최대 3번의 시도 후, 지수 기반으로 재시도할 수 있습니다. 모든 시도가 실패하면, 오류는 [TransientError] 형태로 반환됩니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 請求最多會以指數退避的方式重試三次；若全部失敗，錯誤會以[TransientError]的形式回傳給呼叫端。
- **ollama-translategemma-4b**: 요청은 최대 3번의 지수 퇴치 방식으로 재시도됩니다. 모든 재시도가 실패하면 오류는 [TransientError]TransientError
- **ollama-translategemma-4b-mt**: 요청은 최대 3번까지 지수 방식으로 재시도할 수 있으며, 모든 시도가 실패하면 오류는 [TransientError] 형태로 호출 측에 반환됩니다.

**zh-Hant-news-01** (news)

- 원문: 市議會週二以 7 票對 2 票通過將公車路線延伸至東部郊區的方案,支持者表示,這將使通勤時間最多縮短 25%。
- **apple-fm**: 화요일, 시의회는 7표 대 2표로 버스 노선을 동부 외곽으로 연장하는 방안을 의결했으며, 지지자들은 이를 통해 출퇴근 시간이 최대 25% 단축될 것이라고 밝혔습니다.
- **apple-mt-attr**: 시 의회는 화요일 7대 2의 표 차이로 버스 노선을 동부 교외로 연장하는 방안을 통과시켰고, 지지자들은 이것이 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 말했다.
- **apple-mt-plain**: 시 의회는 화요일 7대 2의 표 차이로 버스 노선을 동부 교외로 연장하는 방안을 통과시켰고, 지지자들은 이것이 출퇴근 시간을 최대 25%까지 단축시킬 것이라고 말했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 시의회는 화요일 동부 교외로 버스 노선을 확장하는 법안을 7 대 2로 통과시켰으며, 지지자들은 이것이 통근 시간을 최대 25 % 줄일 것이라고 말했다.
- **ct2-nllb-1.3b**: 시의회는 화요일 7대 2의 찬성으로 버스 노선을 동부 교외까지 확장하는 방안을 통과시켰고 지지자들은 이 방안이 통근시간을 최대 25% 줄일 수 있다고 말했습니다.
- **ct2-nllb-600m**: 시회는 지난 2일 7~2 ψήφους 받아 동부 시외지역으로 버스 노선을 늘리는 방안을 통과시켰고, 지지자들은 최대 25%의 교통시간을 줄일 것이라고 말했습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 市議會週二以 7 票對 2 票通過將公車路線延伸至東部郊區的方案，支持者表示，這將使通勤時間最多縮短 25%。  **번역:**  의회는 다음 주 화요일에 7표 2표로 공공철도 노선을 확장하는 계획을 제안했으며, 지지자들은 이 계획이 이동 시간을 최대 25% 단축할 것이라고 주장했습니다.  **설명:**  *   **의회 (yìwéi):** 의회 (의회) *   **주요 내용:** 공공철도 노선 확장 계획 *   **지지자 (zhīdìzǐ):** 지지자 (지지자) *   **추가 설명:**  "이 계획이 이동 시간을 최대 25% 단축할 것이라고 주장했습니다."는 원래 문맥에 맞춰 핵심 내용을 요약했습니다.
- **mlx-gemma-4-e2b-4bit**: 市議會週二以 7 票對 2 票通過將公車路線延伸至東部郊區的方案,支持者表示,這將使通勤時間最多縮短 25%。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 시의회는 화요일에 7대 2의 표로 버스 노선을 동부 교외 지역까지 연장하는 방안을 통과시켰습니다. 지지자들은 이로 인해 출퇴근 시간이 최대 25% 단축될 것이라고 말했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 市議會週二以 7 票對 2 票通過將公車路線延伸至東部郊區的方案,支持者表示,這將使通勤時間最多縮短 25%。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 시의회는 월요일에 7표로 2표를 얻어 공용버스 경로를 동쪽의 주변 지역으로 확장하는 방안을 통과시켰다. 지지자들은 이로 인해 통근 시간이 최대 25% 줄어들 것이라고 설명했다.
- **mlx-qwen3.5-2b-4bit**: 市議會週二以 7 票對 2 票通過將公車路線延伸至東部郊區的方案，支持者表示，這將使通勤時間最多縮短 25%。
- **mlx-qwen3.5-2b-4bit-mt**: 시의회는 월요일에 7 대 2 로 통과해 버스를 동부郊区로 확장하는 계획을 지지하는 것으로 발표했습니다. 이를 통해通勤시간은 최대 25% 줄어듭니다.
- **mlx-qwen3.5-4b-4bit**: 시의회는 화요일 7 대 2 의 투표로 버스 노선을 동부 교외로 연장하는 계획을 통과시켰습니다. 지지자들은 이 조치로 통근 시간이 최대 25% 단축될 것이라고 밝혔습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 시의회는 화요일, 7표에 대한 2표로, 시내 버스 노선을 동부 교외 지역으로 확장하는 계획을 통과시켰습니다. 지지자들은 이 계획이 통근 시간을 최대 25% 단축할 것이라고 밝혔습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: 시의회는 화요일에 버스 노선을 동부 외곽 지역까지 연장하는 안건을 7대 2로 통과시켰으며, 지지자들은 이로 인해 통근 시간이 최대 25% 단축될 것이라고 밝혔
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 市議會週二以 7 票對 2 票通過將公車路線延伸至東部郊區的方案，支持者表示，這將使通勤時間最多縮短 25%。
- **ollama-translategemma-4b**: 시의회는 화요일, 버스 노선을 동부 교외로 확장하는 방안을 7표 대 2표로 통과시켰습니다. 지지자들은 이를 통해 통근 시간을 최대 25% 단축할 수 있다고 밝혔습니다.
- **ollama-translategemma-4b-mt**: 시의회는 화요일에 동부 외곽 지역으로 버스 노선을 확장하는 방안을 7표 대 2표로 통과시켰습니다. 찬성 측은 이를 통해 출퇴근 시간을 최대 25% 단축할 수 있다고 밝혔습니다.

**zh-Hant-news-02** (news)

- 원문: 哈爾沃森研究所的研究人員指出,一種新型電池在經過 2000 次充放電循環後,仍保有 90% 的電量,約為目前市售電池的兩倍。
- **apple-fm**: 하얼빈(Harbin) 연구소의 연구진은 새로운 유형의 배터리가 2,000회 충전-방전 사이클 후에도 90%의 용량을 유지하며 현재 시중에 나와 있는 배터리의 두 배에 달한다고 밝혔습니다.
- **apple-mt-attr**: 하르보르슨 연구소의 연구원들은 새로운 유형의 배터리가 2000회 충전·방전 주기를 거친 후에도 여전히 90%의 전력을 유지하고 있으며, 이는 현재 시중에 나와 있는 배터리의 약 두 배에 해당한다고 지적했다.
- **apple-mt-plain**: 하르보르슨 연구소의 연구원들은 새로운 유형의 배터리가 2000회 충전·방전 주기를 거친 후에도 여전히 90%의 전력을 유지하고 있으며, 이는 현재 시중에 나와 있는 배터리의 약 두 배에 해당한다고 지적했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 할워슨 연구소의 연구원들은 새로운 배터리가 2,000회의 충전 및 방전 사이클 이후에도 90%의 전력을 유지할 수 있다는 사실을 발견했습니다.
- **ct2-nllb-1.3b**: 해워슨 연구소의 연구자들은 새로운 종류의 배터리가 2000번의 충전 방하 순환을 거쳐도 90%의 전력을 유지할 수 있다는 것을 발견했습니다. 이는 현재 시장에서 판매되는 배터리의 두 배 정도입니다.
- **ct2-nllb-600m**: 하버슨 연구소 연구원들은 새로운 배터리가 2000회 충전 주기를 거쳐도 90%의 전력을 보유할 수 있다는 것을 지적하고 있으며, 이는 현재 시장에서 판매되는 배터리의 2배 정도입니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 연구원들은 하르워슨 연구소의 연구팀이, 2000회 충전 및 방전 주행을 거친 새로운 배터리가, 현재 시판되는 배터리의 90%의 전력을 유지한다고 밝혔습니다.
- **mlx-gemma-4-e2b-4bit**: 哈爾沃森研究所的研究人員指出,一種新型電池在經過 2000 次充放電循環後,仍保有 90% 的電量,約為目前市售電池的兩倍。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 할보센 연구소의 연구원들은 새로운 종류의 배터리가 2000회의 충·방전 주기를 거쳐도 90%의 전력을 유지한다고 지적했습니다. 이는 현재 시장에 판매되는 배터리보다 약 두 배나 많은 수치입니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 哈爾沃森研究所的研究人員指出,一種新型電池在經過 2000 多次充放電循環後,仍保有 90% 的電量,約為目前市售電池的兩倍。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 哈尔沃森研究所的研究人员指出，一种新型电池在经过2000次充放电循环后，仍保有90%的电量，约为目前市售电池的两倍。
- **mlx-qwen3.5-2b-4bit**: 哈爾沃森研究所的研究人員指出，一種新型電池在經過 2000 次充放電循環後，仍保有 90% 的電量，約為目前市售電池的兩倍。
- **mlx-qwen3.5-2b-4bit-mt**: 하르沃森研究所의 연구원들은, 새로운 유형의 전지가 2000 회 충전 - 방전 사이클을 거치더라도 90% 의 전량을 유지하며, 이는 현재 상용 전지의 두 배에 달한다고 밝혔다.
- **mlx-qwen3.5-4b-4bit**: 하얼슨 연구소의 연구원들은 새로운 배터리가 2000 회 충전/방전 사이클 후에도 90% 의 전력을 유지하며, 이는 현재 판매 중인 배터리보다 약 두 배 빠르다고 밝혔습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 할브러센 연구소의 연구진은 새로운 배터리가 2,000회 충방전 후에도 90%의 용량을 유지하며, 현재 시장에 판매되는 배터리의 두 배에 달한다고 밝혔습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 哈爾沃森研究所的研究人員指出，一種新型電池在經過 2000 次充放電循環後，仍保有 90% 的電量，約為目前市售電池的兩倍。
- **ollama-translategemma-4b**: 하르보슨 연구소의 연구원들은 새로운 배터리가 2000번의 충전 및 방전 사이클 후에도 90%의 용량을 유지하며, 이는 현재 시중 배터리의 두 배에 해당한다고 밝혔습니다.
- **ollama-translategemma-4b-mt**: 할워슨 연구소 연구진은 새로운 배터리가 2,000번의 충방전 사이클을 거친 후에도 90%의 용량을 유지하며, 이는 현재 시판되는 배터리의 두 배에 해당한다고 밝혔습니다.

**zh-Hant-news-03** (news)

- 원문: 不過,批評者指出,這項成果尚未經過同儕審查,而且原型的生產成本約為每千瓦小時 340 美元。
- **apple-fm**: 그러나 비판자들은 해당 연구 결과가 동료 검토를 거치지 않았으며, 프로토타입 생산 비용이 킬로와트시당 약 3,400달러라고 지적합니다.
- **apple-mt-attr**: 그러나 비판자들은 이 성과가 아직 동료 검토를 받지 못했으며, 원형의 생산 비용이 약 1킬로와트시당 340달러에 달한다고 지적했다.
- **apple-mt-plain**: 그러나 비판자들은 이 성과가 아직 동료 검토를 받지 못했으며, 원형의 생산 비용이 약 1킬로와트시당 340달러에 달한다고 지적했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 그러나 비평가들은 이 결과가 동료 검토를 거치지 않았으며, 프로토타입의 생산 비용은 킬로와트시당 약 340달러였다고 지적했다.
- **ct2-nllb-1.3b**: 그러나 비평가들은 이 결과물이 평론을 거치지 않았으며, 시제품의 생산 비용은 KWh당 약 340달러라고 지적한다.
- **ct2-nllb-600m**: 그러나 비평가들은 이 결과는 아직 검열되지 않았으며, 프로토타입 생산 비용은 1킬로와트당 340달러에 달한다고 지적했습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: (번역문)  이 결과는 아직 동료 검토를 거치지 않았고, 원본 제작 비용은 각 1000 와트 시밤에 약 340달러입니다.  (설명)  *   **결과:**  "결과"를 "result"로 번역했습니다. *   **고유명사:** "이 결과"를 "이 결과"로 번역했습니다. *   **숫자:** "340달러"를 "340달러"로 번역했습니다. *   **URL:** "이 결과"를 "이 결과"로 번역했습니다. *   **코드:** "340달러"를 "340달러"로 번역했습니다.  (주석)  이 결과는 아직 동료 검토를 거치지 않았고, 원본 제작 비용은 각 1000 와트 시밤에 약 340달러입니다. (이 부분은 원래 문맥에 맞춰 그대로 유지했습니다.)  (생각 과정)  원문은 중국어 번체(繁體中文)로 작성되었고, 번역은 원문의 의미를 최대한 유지하면서 자연스러운 한국어 표현으로 바꾸는 것을 목표로 했습니다.  특히 고유명사, 숫자, URL, 코드는 그대로 유지했습니다.
- **mlx-gemma-4-e2b-4bit**: 不過,批評者指出,這項成果尚未經過同儕審查,而且原型的生產成本約為每千瓦小時 340 美元。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 하지만, 비평가들은 이 성과가 동료 검토를 거치지 않았으며, 프로토타입의 생산 비용은 약 킬로와트시간당 340달러라고 지적했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 不過,批評者指出,這項成果尚未經過同儕審查,而且原型的生產成本約為每千瓦小時 340 美元。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 하지만 비판자들은 이 성과가 동료 검토를 받지 않았다는 점과, 원형 제작 비용이 각 토큰당 340 달러라는 점을 지적했다.
- **mlx-qwen3.5-2b-4bit**: 不過，批評者指出，這項成果尚未經過同儕審查，而且原型的生產成本約為每千瓦小時 340 美元。
- **mlx-qwen3.5-2b-4bit-mt**: 그러나 비판자들은 이 성과가 동료 검토를 거치지 않았으며, 원형 생산 비용이 약 340 달러/千瓦 시임을 지적하고 있다.
- **mlx-qwen3.5-4b-4bit**: 그러나 비판자들은 이 결과가 동료 검토를 거치지 않았으며, 프로토타입의 생산 비용이 시간당 340 달러에 달한다고 지적했습니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 그러나, 비평가들은 이 연구가 동료 심사를 거치지 않았으며, 기본 모델의 생산 비용은 약 1,000 와트시당 340달러라고 지적했습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 不過，批評者指出，這項成果尚未經過同儕審查，而且原型的生產成本約為每千瓦小時 340 美元。
- **ollama-translategemma-4b**: 그러나 비평가들은 이 결과가 아직 동료 검토를 거치지 않았으며, 프로토타입의 생산 비용이 1kWh당 약 340달러라고 지적했습니다.
- **ollama-translategemma-4b-mt**: 그러나 비평가들은 이 결과가 아직 동료 검토를 거치지 않았으며, 프로토타입 생산 비용이 약 340달러/kWh로, 상당히 높은 수준이라고 지적했습니다.

**zh-Hant-news-04** (news)

- 원문: 北部沿海地區預計到週四都會有大雨,陣風可達每小時 70 公里,氣溫約在攝氏 12 度上下。
- **apple-fm**: 북부 해안 지역은 목요일까지 폭우가 예상되며, 강풍은 시간당 70km에 이를 수 있고 기온은 약 12도 내외로 예상됩니다.
- **apple-mt-attr**: 북부 해안 지역은 목요일까지 폭우가 내릴 것으로 예상되며, 돌풍은 시속 70km에 달할 수 있고 기온은 약 12도 정도일 것으로 예상된다.
- **apple-mt-plain**: 북부 해안 지역은 목요일까지 폭우가 내릴 것으로 예상되며, 돌풍은 시속 70km에 달할 수 있고 기온은 약 12도 정도일 것으로 예상된다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 북부 해안 지역은 목요일까지 폭우가 예상되며, 시속 70킬로미터(43마일)에 이르는 바람과 섭씨 12도 이하의 기온이 예상됩니다.
- **ct2-nllb-1.3b**: 북부 해안 지역에서는 목요일까지 폭우가 쏟아지고 시속 70km의 바람이 불고 기온이 섭씨 12도를 넘을 것으로 예상된다.
- **ct2-nllb-600m**: 북부 해안 지역에서는 매주 목요일까지 강수량이 예상되며, 시속 70km의 바람이 발생하며, 기온이 12도 이하로 내려갈 것으로 예상된다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 전북 영서 지역에 예정된 폭우는 다음 주 토요일에 예상되며, 바람은 1시간에 70km까지 이동할 수 있습니다. 기온은 약 섭씨 12도에서 20도 사이로 예상됩니다.
- **mlx-gemma-4-e2b-4bit**: 北部沿海地區預計到週四都會有大雨,陣風可達每小時 70 公里,氣溫約在攝氏 12 度上下。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 북부 해안 지역에서는 목요일까지 강한 비가 내릴 예정이며, 바람의 속도는 시간당 70km에 달할 수 있고, 기온은 약 섭씨 12도 정도가 될 것입니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 北部沿海地區預計到週四都會有大雨，陣風可達每小時 70 公里，氣溫約在攝氏 12 度上下。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 북부 해안 지역은 목요일부터 대규모 기상 현상으로 인해 대규모 강우와 강한 부reeze가 오고, 최대 70킬로미터의 속도로 이동할 수 있는 강한 바람이 올 예정입니다. 기온은 약 12도의 수준이 될 예정입니다.
- **mlx-qwen3.5-2b-4bit**: 北部沿海地區預計到週四都會有大雨，陣風可達每小時 70 公里，氣溫約在攝氏 12 度上下。
- **mlx-qwen3.5-2b-4bit-mt**: 북부 해안 지역은 다음 주 일요일까지 큰 비가 예상되며, 바람은 시속 70 킬로미터까지 날릴 수 있으며, 기온은 섭씨 12 도 부근으로 유지될 것이다.
- **mlx-qwen3.5-4b-4bit**: 북부 해안 지역은 목요일까지도 강풍이 예상되며, 최대 시속 70 km 의 바람과 약 12 도의 기온이 예상됩니다.
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 북부 해안 지역은 이번 주 수요일까지 강한 비가 내리고, 최대 순간 풍속은 시속 70km, 기온은 약 12도 정도로 예상됩니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 北部沿海地區預計到週四都會有大雨，陣風可達每小時 70 公里，氣溫約在攝氏 12 度上下。
- **ollama-translategemma-4b**: 북부 해안 지역은 수요일까지 강우와 최대 70km/h의 강풍, 약 12도의 기온이 예상됩니다.
- **ollama-translategemma-4b-mt**: 북부 해안 지역은 이번 주 수요일까지 강한 비와 최대 순간풍속 70km/h의 강한 바람, 그리고 약 12도 정도의 기온이 예상됩니다.

**zh-Hant-news-05** (news)

- 원문: 該公司週一發布聲明表示,由於供應鏈問題持續,將把旗艦手機的上市延後至明年年初。
- **apple-fm**: 회사는 월요일 성명을 통해 공급망 문제로 인해 다음 사항을 연기한다고 밝혔습니다.선두 모델 스마트폰 출시내년 초로 예정
- **apple-mt-attr**: 해당 회사는 월요일 성명을 발표해 공급망 문제로 인해 것이라고 밝혔다플래그십 스마트폰 출시를 내년 초로 연기할 .
- **apple-mt-plain**: 해당 회사는 월요일 성명을 발표해 공급망 문제로 인해 플래그십 스마트폰 출시를 내년 초로 연기할 것이라고 밝혔다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 2011년 10월 1일에 확인함.  다음 날짜 값 확인 필요: \|date= (도움말) 2011년 10월 1일에 확인함.  다음 날짜 값 확인 필요: \|date= (도움말) 2011년 10월 1일에 확인함.
- **ct2-nllb-1.3b**: 회사 측은 월요일 (현지시간) 발표한 성명을 통해 공급 문제로 인해 플래그그램 휴대폰 출시 시기가 내년 초까지 연기될 것이라고 밝혔다.
- **ct2-nllb-600m**: 이 회사는 월요일에 발표한 발표에 따르면 공급 부족으로 인해 플래그십 휴대폰의 출시가 내년 초까지 연기될 것이라고 밝혔다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 이 회사는 다음 주에 발표한 공지에서, 공급망 문제로 인해 출시가 연기될 예정이라고 밝혔습니다.  (이 부분은 중국어 번체(繁體中文)를 그대로 유지합니다.)  **설명:**  *   **이 회사는 (이 회사는)**:  이 부분을 그대로 유지했습니다. *   **발표한 공지**:  발표 내용이 무엇인지 명확하게 전달하기 위해 "발표한 공지"로 번역했습니다. *   **공급망 문제**:  "공급망 문제"를 그대로 유지했습니다. *   **연기될 예정이라고 밝혔습니다**:  "연기될 예정이라고 밝혔습니다"는 문장 구조를 한국어로 자연스럽게 표현했습니다.  **주석:**  (이 부분은 원문 그대로 유지합니다.)  **생각 과정:**  원문은 중국어 번체(繁體中文)로 작성되었으므로, 그대로 번역하는 것이 가장 적절합니다.  번역할 때는 문맥과 의미를 최대한 살리면서, 원문의 어조와 고유명사를 유지하는 것이 중요합니다.
- **mlx-gemma-4-e2b-4bit**: 該公司週一發布聲明表示,由於供應鏈問題持續,將把旗艦手機的上市延後至明年年初。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 그 회사는 월요일에 발표한 성명에서 공급망 문제가 계속되고 있기 때문에 프리미어 스마트폰의 출시를 내년 초로 연기할 것이라고 밝혔습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 該公司週一發布聲明表示,由於供應鏈問題持續,將把旗艦手機的上市延後至明年年初。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 该公司周一发布声明表示，由于供应链问题持续，将把旗舰手机的上市推迟至明年年初。
- **mlx-qwen3.5-2b-4bit**: 該公司週一發布聲明表示，由於供應鏈問題持續，將把旗艦手機的上市延後至明年年初。
- **mlx-qwen3.5-2b-4bit-mt**: 該公司週一發布聲明稱，由於供應鏈問題持續，將把旗艦手機的上市延後至明年年初。
- **mlx-qwen3.5-4b-4bit**: 이 회사는 공급망 문제가 지속됨을 이유로 하여 (누락)(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 해당 회사는 다음 주 월요일, 공급망 문제 지속으로 인해 플래그십 스마트폰의 출시를 내년 초로 연기한다고 발표했습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 該公司週一發布聲明表示，由於供應鏈問題持續，將把旗艦手機的上市延後至明年年初。
- **ollama-translategemma-4b**: 이 회사는 공급망 문제로 인해 플래그십 스마트폰의 출시를 내년 초로 연기한다고 밝혔습니다.(누락)(누락)
- **ollama-translategemma-4b-mt**: 해당 회사는 지난주 성명을 통해, 공급망 문제로 인해 플래그십 스마트폰의 출시를 다음 해 초로 연기할 것이라고 발표했습니다.

**zh-Hant-news-06** (news)

- 원문: 為什麼許多小型麵包店撐不過五年?經濟學家認為,原因與麵包本身關係不大,更多在於房租、人力與微薄的利潤。
- **apple-fm**: 왜 많은 작은 빵집은 5년 안에 망하는 걸까요? 경제학자들은 그 원인이 빵 자체와 거의 관련이 없으며, 오히려 임대료와 수익이 적기 때문이라고 합니다.인력그리고 낮은 이익 때문입니다.
- **apple-mt-attr**: 왜 많은 소규모 빵집이 5년도 버티지 못하나요? 경제학자들은 그 이유는 빵 자체와는 별로 관련이 없으며, 임대료, ,  더  생각합니다인력그리고 적은 이익에기인한다고.
- **apple-mt-plain**: 왜 많은 소규모 빵집이 5년도 버티지 못하나요? 경제학자들은 그 이유는 빵 자체와는 별로 관련이 없으며, 임대료, 인력, 그리고 적은 이익에 더 기인한다고 생각합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 왜 많은 소규모 빵집들이 5년 이상 지속되지 못하는가? 경제학자들은 이유가 빵 자체보다는 임대료, 노동력, 낮은 이익에 있다고 주장한다.
- **ct2-nllb-1.3b**: 경제학자들은 그 이유는 빵 자체가 아니라 임대료, 인력, 그리고 낮은 수익 때문이라고 주장합니다.
- **ct2-nllb-600m**: 왜 많은 작은 빵집들이 5년 동안 문을 닫았을까요? 경제학자들은 빵 자체와 관련이 없는 것이 아니라 임대, 인력 및 소소한 수익 때문이라고 생각합니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 왜 많은 소규모 베이커리점이 5년 동안 버틸 수 없는가요? 경제학자들은 베이커리 자체와는 관련이 없다고 생각하며, 오히려 임대료, 인력과 미작성된 이익에 더 큰 비중을 두고 있다고 주장합니다.
- **mlx-gemma-4-e2b-4bit**: 為什麼許多小型麵包店撐不過五年?經濟學家認為,原因與麵包本身關係不大,更多在於房租、人力與微薄的利潤。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 왜 많은 소규모 빵집들이 5년을 버티지 못하는가? 경제학자들은 그 이유가 빵 자체와는 관련이 없으며, 오히려 임대료, 인력, 그리고 낮은 이익률 때문이라고 생각합니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 為什麼許多小型麵包店撐不過五年?經濟學家認為,原因與麵包本身關係不大,更多在於房租、人力與微薄的利潤。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 다수의 작은 빵집은 5년 이내에 지속되지 않는다고 경제학자들은 이유가 빵 자체와 무관하다고 설명하고, 주로 월세, 인력 비용, 그리고 약간의 이익이 적은 점이 문제라고 한다.
- **mlx-qwen3.5-2b-4bit**: 為什麼許多小型麵包店撐不過五年？經濟學家認為，原因與麵包本身關係不大，更多在於房租、人力與微薄的利潤。
- **mlx-qwen3.5-2b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 번체(繁體中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.
- **mlx-qwen3.5-4b-4bit**: 왜 많은 작은 빵집이 5 년을 넘기지 못하나요? 경제학자들은 이는 빵 자체와 관련이 적으며, 임대료, (누락)(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 많은 작은 빵집들이 5년 이상 버티기 어려운 이유는 무엇일까요? 경제학자들은 빵 자체보다는 임대료, 인력, 그리고 극히 적은 이익과 관련되어 있다고 분석합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 為什麼許多小型麵包店撐不過五年？經濟學家認為，原因與麵包本身關係不大，更多在於房租、人力與微薄的利潤。
- **ollama-translategemma-4b**: 왜 많은 소규모 빵집이 5년이 지나지 않아 문을 닫는가? 경제학자들은 그 이유는 빵 자체와 관련이 없으며, 주로 임대료, 인건비 및 미미한 이윤 때문이라고 말합니다.(누락)(누락)
- **ollama-translategemma-4b-mt**: 많은 소규모 빵집이 5년 이상 버티지 못하는 이유는 무엇일까요? 경제학자들은 이 원인이 빵 자체보다는 임대료, 인건비, 그리고 극히 미미한 이익에 더 큰 영향을 미친다고 분석합니다.

**zh-Hant-community-01** (community)

- 원문: 天啊,樹莓派終於開機了,結果一通電就冒煙。好啦也不是真的冒煙,但我的心已經碎了。
- **apple-fm**: 오, 라즈베리 파이를 드디어 작동시켰는데, 갑자기 불이 났어요. 물론 진짜 불은 아니지만, 내 마음은 이미 부서졌어요.
- **apple-mt-attr**: 세상에, 딸기 파이가 드디어 켜졌는데, 전기가 들어오자마자 연기가 피어올랐어. 그래도 진짜 연기는 아니지만, 내 마음은 이미 부서졌어.
- **apple-mt-plain**: 세상에, 딸기 파이가 드디어 켜졌는데, 전기가 들어오자마자 연기가 피어올랐어. 그래도 진짜 연기는 아니지만, 내 마음은 이미 부서졌어.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 세상에, 딸기 파이가 드디어 켜졌고, 전기가 켜지자 연기가 나기 시작했습니다.
- **ct2-nllb-1.3b**: 오, 오, 오, 오, 오, 오, 오, 오, 오, 오, 오, 오, 오, 오, 오, 오, 오, 오, 오, 오, 오, 오.
- **ct2-nllb-600m**: 오, 신이시여, 나무 이 마침내 문을 열었고, 그 결과 전기가 담배를 피우게 되었습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: **태아, 뇌류파가 시작됐어, 결과 한 통의 전기가 튀었어. 괜찮아, 그냥 속이 텅 비어버렸어.**  **설명:**  *   **태아 (taa):**  "아"를 뜻하는 중국어 발음으로, "아"를 표현하는 데 사용되었습니다. *   **뇌류파 (luo-li-pai):** "뇌류파"는 "뇌"와 "파"를 결합한 이름입니다. *   **개방됐어 (gao-fang-twae-o):** "열렸다"를 뜻하는 중국어 표현으로, "열렸다"를 의미합니다. *   **한 통의 전기가 튀었어 (hen tui-e-o tsuet-e-o):** "한 통의 전기"는 "한 통의 전기"를 의미하며, "전기"는 "전류"를 뜻하는 중국어입니다. *   **괜찮아 (guànxiao-o):** "괜찮아"는 "괜찮아"를 뜻하는 한국어 표현입니다. *   **속이 텅 비어버렸어 (cai-tng-bei-o-reung-o):** "속이 텅 비어버렸어"는 "속이 텅 비어버렸어"를 뜻하며, "텅 비어버렸어"는 "비어버렸어"를 뜻하는 한국어 표현입니다.  **주석:**  *   "태아"는 "아"를 표현하는 중국어 발음으로, "뇌류파"는 "뇌"와 "파"를 결합한 이름입니다. *   "한 통의 전기가 튀었어"는 "한 통의 전기가 튀었어"를 뜻하며, "전기"는 "전류"를 뜻하는 중국어입니다. *   "괜찮아"는 "괜찮아"를 뜻하는 한국어 표현입니다.  **생각 과정:**  이 문장은 중국어 번체(繁體中文)로 작성되었으며, "아"를 표현하는 중국어 발음(태아)과 "뇌류파"라는 이름이 포함되어 있습니다.  전기(전류)가 튀었다는 상황을 묘사하고 있으며, "괜찮아"라는 한국어 표현이 사용되었습니다.  이 문장은 텍스트의 의미를 전달하는 데 적합합니다.
- **mlx-gemma-4-e2b-4bit**: 天啊,樹莓派終於開機了,結果一通電就冒煙。好啦也不是真的冒煙,但我的心已經碎了。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 세상에, 러브베리 파이가 드디어 시작되었는데, 갑자기 연기가 나왔어요. 사실 정말 연기가 나온 건 아니지만, 내 마음은 이미 부서졌어요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 天啊,樹莓派終於開機了,結果一通電就冒煙。好啦也不是真的冒煙,但我的心已經碎了。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 천아, 텀블린이 finally 켜졌어. 결과적으로 한 번 켜도 바로 냄새 나서. 진짜 냄새는 아니지만, 내 마음이 이미 떨어졌어.
- **mlx-qwen3.5-2b-4bit**: 天啊，樹莓派終於開機了，結果一通電就冒煙。好啦也不是真的冒煙，但我的心已經碎了。
- **mlx-qwen3.5-2b-4bit-mt**: 아하, 루트피이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이이
- **mlx-qwen3.5-4b-4bit**: 천하무적! 라즈베리 파이终于在开机了，结果一通电就冒烟。好啦也不是真的冒烟，但我的心已经碎了。
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 맙소사, 라즈베리 파가 드디어 부팅되었지만, 한 번 충전하고 나니 금방 타버리는 것 같네요. 정확히는 타는 것 같진 않지만, 제 마음은 이미 부서졌어요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 天啊，樹莓派終於開機了，結果一通電就冒煙。好啦也不是真的冒煙，但我的心已經碎了。
- **ollama-translategemma-4b**: 드디어 라즈베리 파이가 켜졌는데, 전원을 켜자마자 펑! 이러네요. 뭐, 진짜 펑은 아니지만, 제 마음은 이미 멘탈붕괴 상태입니다.
- **ollama-translategemma-4b-mt**: 맙소사, 라즈베리 파이 마침내 켜졌는데, 그런데 전원을 연결하자마자 굉음이 나더니 완전히 망가졌어. 물론 실제로 연기가 나진 않았지만, 그래도 내 마음은 이미 산산이 조각났어.

**zh-Hant-community-02** (community)

- 원문: 說句可能會被罵的:用 Tab 或空白都可以,凌晨兩點還在吵這個的人,該去吃點宵夜然後睡覺了啦。
- **apple-fm**: 아마 욕먹을 수 있는 말인데, 탭이나 빈 공간을 사용할 수 있는데 새벽 2시쯤에 이 문제에 대해 이야기하는 사람이 있는데, 이제는 간식을 먹고 잠자리에 들 시간이 됐어요.
- **apple-mt-attr**: 날 때릴 수도 있는 말이지만: Tab 키나 빈칸을 사용해도 돼. 새벽 두 시에 아직도 이 일에 대해 논쟁하는 사람은, 이제 야식 좀 먹고 자러 가야 해.
- **apple-mt-plain**: 날 때릴 수도 있는 말이지만: Tab 키나 빈칸을 사용해도 돼. 새벽 두 시에 아직도 이 일에 대해 논쟁하는 사람은, 이제 야식 좀 먹고 자러 가야 해.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 태블릿이나 스페이스 바를 사용할 수 있으며, 새벽 2시에도 이 사람을 괴롭히는 사람은 점심을 먹고 잠을 자는 것이 좋습니다.
- **ct2-nllb-1.3b**: 이 문장은 타브나 빈자리를 사용할 수 있고, 새벽 2시에 이 사람을 먹이고 있는 사람은 저녁식사를 먹고 잠자리에 들어야 한다는 비난을 받을 수 있습니다.
- **ct2-nllb-600m**: 이 말은 모욕을 불러일으킬 수도 있습니다. "태브를 사용하거나 빈 공간으로 사용할 수 있지만, 새벽 2시에 이 일을 하는 사람은 저녁을 먹어야 하고 잠자리에 들어야 한다".
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: **번역:**  밤 2시쯤에 계속 싸우는 사람을, 늦게까지 기다리고 있는 사람에게, 저녁 먹으러 가서 잠들어야 할 때가 되었어.  **설명:**  *   **"밤 2시쯤에 계속 싸우는 사람을"**:  "밤 2시쯤에 계속 싸우는 사람을"은 "밤 2시쯤에 계속 싸우는 사람을"로 번역되었습니다. *   **"그의"**: "그의"는 "그의"로 번역되었습니다. *   **"저녁 먹으러 가서 잠들어야 할 때가 되었어."**: "저녁 먹으러 가서 잠들어야 할 때가 되었어."는 "저녁 먹으러 가서 잠들어야 할 때가 되었어."로 번역되었습니다.  **주석:**  *   "밤 2시쯤에 계속 싸우는 사람을"은 "밤 2시쯤에 계속 싸우는 사람을"로 번역되었습니다. *   "그의"는 "그의"로 번역되었습니다. *   "저녁 먹으러 가서 잠들어야 할 때가 되었어."는 "저녁 먹으러 가서 잠들어야 할 때가 되었어."로 번역되었습니다.  **생각 과정:**  원문은 중국어 번체(繁體中文)로 되어 있습니다.  이 문장은 한국어로 번역할 때, 원문의 의미를 최대한 유지하면서 자연스러운 표현을 위해 문장 구조를 약간 변경했습니다.  특히 "그의"와 "저녁 먹으러 가서 잠들어야 할 때가 되었어." 부분을 한국어로 자연스럽게 표현하기 위해 문장 구조를 변경했습니다.
- **mlx-gemma-4-e2b-4bit**: 說句可能會被罵的:用 Tab 或空白都可以,凌晨兩點還在吵這個的人,該去吃點宵夜然後睡覺了啦。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 비난받을 수도 있는 말이지만, Tab이나 빈칸을 사용해도 괜찮아요. 새벽 2시에까지 계속 시끄러운 사람은, 그냥 간식이나 먹고 잠을 자는 게 좋겠어요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 이 문장은 너무 길고 복잡해서, 그냥 "이 문장은 너무 길고 복잡해서, 그냥 '이 문장은 너무 길고 복잡해서, 그냥' 만 반복하네."라고 번역할 수밖에 없어.
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라.
- **mlx-qwen3.5-2b-4bit**: 說句可能會被罵的：用 Tab 或空白都可以，凌晨兩點還在吵這個的人，該去吃點宵夜然後睡覺了啦。
- **mlx-qwen3.5-2b-4bit-mt**: 사소한 말만 해도 비판받을 수 있습니다. TAB 또는 공백을 모두 사용해도 됩니다. 새벽 2 시까지 이걸로吵하는 사람, 이제 야식 먹고 잠자리에 들자야.
- **mlx-qwen3.5-4b-4bit**: 一句可能会挨骂的话：用 Tab 或空格都可以，凌晨两点还在吵这个的人，该去吃点宵夜然后睡觉了啦。
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 이렇게 말하면 야단을 살 수 있어요: Tab이나 공백을 사용해도 괜찮아요.凌晨兩點까지 계속 싸우는 사람들은 저녁 먹고 잠 잘 시간이에요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 說句可能會被罵的：用 Tab 或空白都可以，凌晨兩點還在吵這個的人，該去吃點宵夜然後睡覺了啦。
- **ollama-translategemma-4b**: 말을 좀 해보자: Tab이나 공백으로 구분해도 되지만, 새벽 2시에 이런 논쟁을 벌이는 사람들은 잠을 자야 합니다.
- **ollama-translategemma-4b-mt**: ("이런 말 하면 비난받을 수도 있지만") 탭이나 공백으로도 가능하지만, 새벽 2시까지 계속 논쟁하는 사람들은 잠시 밥을 먹고 잠시 쉬는 게 좋겠네요.

**zh-Hant-community-03** (community)

- 원문: 笑死,盯著錯誤訊息看了三個小時,結果只是少了一個分號。一個分號欸!我要去山上隱居了。
- **apple-fm**: 웃기다만, 오류 메시지를 3시간 동안 보고 있는데 결국 분모 하나가 빠져 있었다는 거예요. 한 분모 말이야! 이제 산으로 들어가 살아야겠어.
- **apple-mt-attr**: 웃겨 죽겠어, 잘못된 메시지를 세 시간이나 보고 있었는데, 결국 분기호 하나만 빠진 거야. 분기호라니! 나는 산으로 은둔하러 갈 거야.
- **apple-mt-plain**: 웃겨 죽겠어, 잘못된 메시지를 세 시간이나 보고 있었는데, 결국 분기호 하나만 빠진 거야. 분기호라니! 나는 산으로 은둔하러 갈 거야.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 3개월이 지나서야 눈을 뜨게 되었고, 3개월이 지나서야 눈을 뜨게 되었고, 3개월이 지나서야 눈을 뜨게 되었고, 3개월이 지나서야 눈을 뜨게 되었고, 3개월이 지나서야 눈을 뜨게 되었고, 3개월이 지나서야 눈을 뜨게 되었다.
- **ct2-nllb-1.3b**: 저는 웃고 웃으며 3시간 동안 잘못된 정보를 보고 있었고, 그 결과 1점만 남았습니다. 1점 !
- **ct2-nllb-600m**: 3시간 동안 틀린 정보를 보고 웃고 죽었고, 그 결과 한 점도 빠졌어요.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 웃기셨어요. 세 시간 동안 오류 메시지를 계속 들으면서, 결국 하나 이상의 분자를 하나만 잃었습니다. 분모가 뭐죠! 숲에 들어가고 싶네요.
- **mlx-gemma-4-e2b-4bit**: 笑死,盯著錯誤訊息看了三個小時,結果只是少了一個分號。一個分號欸!我要去山上隱居了。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 웃겨요. 오류 메시지를 3시간 동안 계속 바라보고 있었는데, 결국은 단순히 하나의 세미콜론이 빠진 것뿐이었어요. 세미콜론 하나라니! 이제 산에 가서 은둔할 거예요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 這段繁體中文的翻譯成韓國語是：  笑死，盯著錯誤訊息看了三個小時，結果只是少了一個分號。一個分號欸！我要去山上隱居了。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 웃어, 오류 메시지에 세 시간을 바라보았지만, 결국 단 한 개의 분號만 없었다. 한 개의 분號이야! 나를 산 위로 은어를 떠올리기로 했다.
- **mlx-qwen3.5-2b-4bit**: 笑死，盯著錯誤訊息看了三個小時，結果只是少了一個分號。一個分號欸！我要去山上隱居了。
- **mlx-qwen3.5-2b-4bit-mt**: 아프시, 오류 메시지를 보며 세 시간 동안 보류한 끝에, 한 개의 분號만 빠졌네요. 한 분號이요! 산에 은거할게요.
- **mlx-qwen3.5-4b-4bit**: 笑死，盯着错误信息看了三个小时，结果只是少了一个分号。一个分号啊！我要去山上隐居了。
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 너무 웃겨. 오류 메시지를 세 시간 동안 계속 보다가, 결국 한 개의 세미콜론이 빠진 것뿐이었어. 한 개의 세미콜론! 이제 내가 산으로 가서 은둔할 거야.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 笑死，盯著錯誤訊息看了三個小時，結果只是少了一個分號。一個分號欸！我要去山上隱居了。
- **ollama-translategemma-4b**: 진짜 웃기네요. 오류 메시지를 3시간 동안 붙잡고 있었는데, 그냥 한 자를 빠뜨린 거였어요! 한 자! 이제 산으로 가서 숨어야겠어요.
- **ollama-translategemma-4b-mt**: 너무 웃겨. 오류 메시지를 세 시간 동안 뚫어져라 봤는데, 결국에는 세미콜 하나가 빠진 것뿐이었어. 세미콜 하나! 이제 나는 산으로 들어가 은둔 생활을 해야겠어.

**zh-Hant-community-04** (community)

- 원문: 老實說,那次更新直接把我的環境搞爆了。已經退回舊版,出門吹了風,明天再戰。
- **apple-fm**: 솔직히 말해서, 그 업데이트로 인해내 환경이 완전히 망가졌어.거야. 이미 이전 버전을 복원하고 공기를 마셨으니, 내일 다시 시도해 볼게.
- **apple-mt-attr**: 솔직히 말해서, 그 업데이트가 제 환경을 완전히 망쳐버렸어요. 이미 이전 버전에 복구했고, 밖에 나가서 바람을 불어봤어요, 내일 다시 싸울게요.
- **apple-mt-plain**: 솔직히 말해서, 그 업데이트가 제 환경을 완전히 망쳐버렸어요. 이미 이전 버전에 복구했고, 밖에 나가서 바람을 불어봤어요, 내일 다시 싸울게요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 솔직히 말해서, 그 업데이트는 제 환경을 완전히 망가뜨렸습니다. 저는 이전 버전으로 돌아갔고, 내일 다시 싸울 것입니다.
- **ct2-nllb-1.3b**: 솔직히 말해서, 그 업데이트는 내 환경을 바로 날려버렸다.
- **ct2-nllb-600m**: 솔직히 말하면, 그 업데이트는 내 환경을 직접 파괴했습니다. 이전 버전으로 돌아갔고, 바람을 불어 넣고, 내일 다시 싸우고 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: **번역:**  실인, 그건 업데이트 직전, 내 환경을 완전히 망가뜨렸어. 옛날 버전으로 돌아가고, 바람을 쳐 봤더니, 내일 다시 싸울 거야.  **설명:**  *   **老實說 (실인):** "실인"은 "실인"이라는 표현으로, 상황을 진지하게 받아들이고 말할 때 사용되는 표현입니다. *   **那次更新 (그건 업데이트):** "그건 업데이트"는 "그번 업데이트"로 번역됩니다. *   **直接把我的環境搞爆了 (직접, 내 환경을 망가뜨렸어):** "직접, 내 환경을 망가뜨렸어"는 "직접, 내 환경을 망가뜨렸어"로 번역됩니다. *   **已經退回舊版 (옛날 버전으로 돌아가고):** "옛날 버전으로 돌아가고"는 "옛날 버전으로 돌아가고"로 번역됩니다. *   **出門吹了風 (바람을 쳐 봤더니):** "바람을 쳐 봤더니"는 "바람을 쳐 봤더니"로 번역됩니다. *   **明天再戰 (내일 다시 싸울 거야):** "내일 다시 싸울 거야"는 "내일 다시 싸울 거야"로 번역됩니다.  **추가적인 고려 사항:**  *   "실인"은 상황을 진지하게 받아들이는 표현이므로, 문맥에 따라 "실인"이라는 표현이 자연스럽게 어울릴 수 있습니다. *   "그건 업데이트"는 "그번 업데이트"로 번역하는 것이 더 자연스럽습니다.
- **mlx-gemma-4-e2b-4bit**: 老實說,那次更新直接把我的環境搞爆了。已經退回舊版,出門吹了風,明天再戰。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 솔직히 말해서, 그 업데이트로 인해 내 환경이 완전히 망가졌어요. 이제는 오래된 버전으로 돌아갔고, 내일 다시 싸울 예정이에요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 老實說,那次更新直接把我的環境搞爆了。已經退回舊版,出門吹了風,明天再戰。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: honest say, that update blew my environment apart. I've reverted to the old version, gone out for a walk, and will try again tomorrow.
- **mlx-qwen3.5-2b-4bit**: 老實說，那次更新直接把我的環境搞爆了。已經退回舊版，出門吹了風，明天再戰。
- **mlx-qwen3.5-2b-4bit-mt**: 어려운 일이라서, 그날의 업데이트가 제 환경을 완전히 망친 거야. 이미 이전 버전을 되돌려서, 바람을 쐈고, 다음 날 다시 도전할게.
- **mlx-qwen3.5-4b-4bit**: 老实说，那次更新(누락)(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 솔직히 말하면, 그 업데이트 때문에 제 환경이 완전히 망가졌어요. 이전 버전으로 되돌렸고, 밖에 나가서 공기 들이고, 내일 다시 싸울 거예요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 老實說，那次更新直接把我的環境搞爆了。已經退回舊版，出門吹了風，明天再戰。
- **ollama-translategemma-4b**: 솔직히 말해서, 이번 업데이트는 제 환경을 완전히 망쳐놨어요. 그래서 이전 버전으로 돌아갔고, 바람을 쐬면서 내일 다시 시도할 겁니다.(누락)(누락)
- **ollama-translategemma-4b-mt**: 솔직히 말씀드리면, 그 업데이트 때문에 제 환경이 완전히 망가졌어요. 그래서 이전 버전으로 되돌렸고, 밖에 나가서 바람을 쐬고 내일 다시 시도할게요.

**zh-Hant-community-05** (community)

- 원문: 真的啦。我家貓在路由器上趴了一個禮拜,Wi-Fi 居然比以前還穩。不要問,問就是貓的力量。
- **apple-fm**: 맞아. 우리 고양이가 라우터 위에 1주일 동안 있었는데, Wi-Fi가 예전보다 훨씬 안정적이었어. 궁금해하지 말고 궁금해하면 고양이의 힘 때문이야.
- **apple-mt-attr**: 정말이에요. 우리 고양이가 라우터 위에 일주일 동안 누워 있었는데, Wi-Fi가 예전보다도 더 안정적이에요. 물어보지 마세요, 물어보는 게 바로 고양이의 힘이에요.
- **apple-mt-plain**: 정말이에요. 우리 고양이가 라우터 위에 일주일 동안 누워 있었는데, Wi-Fi가 예전보다도 더 안정적이에요. 물어보지 마세요, 물어보는 게 바로 고양이의 힘이에요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 제 고양이가 일주일 동안 라우터 위에 누워있었고, 와이파이가 훨씬 더 안정적이었습니다.
- **ct2-nllb-1.3b**: 사실. 내 고양이는 일주일 동안 라우터에 연결되어 있었고, 와이파이는 이전보다 더 안정적이었습니다.
- **ct2-nllb-600m**: 사실, 우리 고양이는 일주일 동안 라우터에 연결되어 있었고, 와이파이는 이전보다 안정적이었습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 정말이에요. 저 집 고양이 며칠 전에 路由器에 엎드려 섰어요. 와이파이가 이전보다 훨씬 안정적이에요. 질문은 안 돼요, 질문은 그냥 고양이의 힘이 때문이에요.
- **mlx-gemma-4-e2b-4bit**: 真的啦。我家貓在路由器上趴了一個禮拜,Wi-Fi 居然比以前還穩。不要問,問就是貓的力量。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 정말이에요. 제 집 고양이가 한 주 동안 라우터 위에 누워 있었는데, Wi-Fi가 예전보다 더 안정적이었어요. 묻지 마세요, 그건 고양이의 힘 때문이에요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 真的啦。我家貓在路由器上趴了一個禮拜,Wi-Fi 居然比以前還穩。不要問,問就是貓的力量。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 는 라. 집의 고양이가 라우터에 한주 걸어 떨어지지 않았고, Wi-Fi가 이전보다 더 안정했다. 그냥 고양이가 라우터를 지켜주었기 때문이다.
- **mlx-qwen3.5-2b-4bit**: 真的啦。我家貓在路由器上趴了一個禮拜，Wi-Fi 居然比以前還穩。不要問，問就是貓的力量。
- **mlx-qwen3.5-2b-4bit-mt**: 真的啦。我家貓在路由器上趴了一個禮拜，Wi-Fi 居然比以前還穩。不要問，問就是貓的力量。
- **mlx-qwen3.5-4b-4bit**: 真的啦。我家的猫在路由器上趴了一周，Wi-Fi 居然比以前还稳。不要问，问就是猫的力量。
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 정말이야. 내 집 고양이가 라우터 위에 일주일 동안 누워 있었는데, Wi-Fi가 오히려 이전보다 더 안정적이야. 뭐, 고양이의 힘이라고.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 真的啦。我家貓在路由器上趴了一個禮拜，Wi-Fi 居然比以前還穩。不要問，問就是貓的力量。
- **ollama-translategemma-4b**: 진짜예요. 제 고양이가 라우터 위에 일주일 동안 엎드려 있었는데, Wi-Fi가 오히려 더 잘 됐어요. 믿지 않으시겠지만, 그게 고양이의 힘이에요.
- **ollama-translategemma-4b-mt**: 맞아요. 제 고양이가 라우터 위에 일주일 동안 누워 있었는데, 와이파이가 오히려 이전보다 더 안정적으로 작동하더라고요. 그냥 고양이의 마법이라고 생각하시면 돼요.

**zh-Hant-community-06** (community)

- 원문: 各位,我花了 1,800 元台幣買了一支敲起來像下雨聲的鍵盤,完全不後悔,同事就……不確定了。
- **apple-fm**: 여러분, 1,800위안짜리 창자 소리가 나는 키보드를 샀는데 전혀 후회하지 않아. 동료들은... ...확실하지 않아....
- **apple-mt-attr**: 여러분, 저는 1,800위안을 들여 비 오는 소리처럼 울리는 키보드를 하나 샀는데, 전혀 후회하지 않습니다. 동료들은…… 확신이 서지 않습니다.
- **apple-mt-plain**: 여러분, 저는 1,800위안을 들여 비 오는 소리처럼 울리는 키보드를 하나 샀는데, 전혀 후회하지 않습니다. 동료들은…… 확신이 서지 않습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 1000원짜리 지폐는 1000원짜리 지폐를 1000원짜리 지폐로 바꾸어서 발행하며, 1000원짜리 지폐는 1000원짜리 지폐를 1000원짜리 지폐로 바꿔서 발행한다.
- **ct2-nllb-1.3b**: 신사 숙녀 여러분, 저는 1,800원짜리 키보드를 샀습니다. 비처럼 울리는 키보드는 전혀 후회하지 않습니다. 동료들은... 확신이 없습니다.
- **ct2-nllb-600m**: 여러분, 저는 1800달러를 들여 비가 내리는 키보드를 샀습니다. 전혀 후회하지 않습니다. 동료들은... 확실하지 않습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 各位, 我花了 1,800 元台幣買了一支敲起來像下雨聲的鍵盤, 完全不後悔, 同事就……不確定了。  이것은 중국어 번체(繁體中文)의 텍스트입니다.  **번역:**  各位, 저는 1,800 위안(台币)을 지불하고, 빗소리를 내는 키보드처럼 묵직하게 울리는 장치를 구매했습니다. 전혀 후회하지 않았고, 동료들은……결심하지 못했습니다.  **설명:**  *   **各位 (Wǒuǐ):**  "各位"는 "各位"라는 뜻으로, "各位"라는 칭찬이나 존칭을 표현하는 말입니다. *   **我 (Wǒ):** "我"는 "我"라는 뜻으로, 문장 속에서 사용된 사람이나 상황을 나타냅니다. *   **花了 (Huā le):** "花了"는 "지불하다"라는 뜻으로, 돈을 지불했다는 의미입니다. *   **1,800 元台幣 (1,800 wén tàiběn):** "1,800 위안"은 1,800 위안이라는 숫자입니다. *   **鍵盤 (Jiànpán):** "키보드"라는 뜻입니다. *   **完全不後悔 (Wánquán bù hòutǐ):** "완전히 후悔하지 않았다"라는 뜻입니다. *   **同事 (Dōngwéi):** "동료"는 "동료"라는 뜻으로, "동료"라는 칭찬이나 존칭을 표현하는 말입니다. *   **就……不確定了 (Jiù……bùxinquìle):** "그렇다면……결심하지 못했습니다."라는 뜻입니다.  **추가적인 생각:**  이 문장은 중국어의 뉘앙스를 최대한 살려 표현했습니다. "후悔하지 않았다"라는 표현은 한국어의 "후회하지 않았다"와 유사하게, 상황에 대한 후기를 덧붙여 표현하는 방식입니다.
- **mlx-gemma-4-e2b-4bit**: 各位,我花了 1,800 元台幣買了一支敲起來像下雨聲的鍵盤,完全不後悔,同事就……不確定了。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 여러분, 저는 1,800 대만 원을 써서 비가 내리는 것처럼 소리가 나는 키보드를 구입했어요. 전혀 후회하지 않아요. 동료들은… 확신이 안 돼요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 各位,我花了 一千八百元台幣買了一支敲起來像下雨聲的鍵盤,完全不後悔,同事就……不確定了。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 各位, 我花了 1,800 元台幣買了一支敲起來像下雨聲的鍵盤,完全不後悔,同事就……不確定了。
- **mlx-qwen3.5-2b-4bit**: 各位，我花了 1,800 元台幣買了一支敲起來像下雨聲的鍵盤，完全不後悔，同事就……不確定了。
- **mlx-qwen3.5-2b-4bit-mt**: 各位, 我花費了 1,800 元台幣買了一支敲起來像下雨聲的鍵盤, 完全不後悔, 同事就……不確定了。
- **mlx-qwen3.5-4b-4bit**: 各位，我花了 1,800 元台币买了一支敲起来像下雨声的键盘，完全不后悔，同事就……(누락)(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 여러분, 저는 1,800 대만 달러로 아주 특별한 키보드를 구매했습니다. 마치 비가 내리는 소리가 들리는 것 같은, 정말 멋진 키보드예요. 정말 만족합니다. 동료들은… 잘 모르겠네요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 各位，我花了 1,800 元台幣買了一支敲起來像下雨聲的鍵盤，完全不後悔，同事就……不確定了。
- **ollama-translategemma-4b**: 여러분, 1800원짜리 키보드를 샀는데, 소리만 내는 녀석이네요. ㅋㅋㅋ.(누락)(누락)
- **ollama-translategemma-4b-mt**: 여러분, 저는 1,800 대만 달러를 들여서, 마치 비가 내리는 소리와 비슷한 소리를 내는 키보드를 샀는데, 정말 만족합니다. 동료들은… 아직은 반응이 썩 좋지는 않네요.

**zh-Hant-ui-01** (ui)

- 원문: 儲存變更
- **apple-fm**: 저장 변경
- **apple-mt-attr**: 변경 저장
- **apple-mt-plain**: 변경 저장
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 변경 사항 저장
- **ct2-nllb-1.3b**: 변경사항을 저장합니다
- **ct2-nllb-600m**: 변경사항을 저장
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 儲存變更 (Tùcún biǎohuàn)  이 문장은 "Storage Change"를 의미하는 것으로 해석될 수 있습니다.    **설명:**  *   **儲存 (Tùcún):** 저장, 저장 공간 *   **變更 (Biǎohuàn):** 변경  **주석:**  *   "Storage Change"는 시스템 관리, 데이터 저장, 또는 다른 관련 분야에서 발생할 수 있는 변경 사항을 나타낼 수 있습니다. *   이 문장은 특정 상황이나 시스템에 대한 정보 전달을 위해 사용될 수 있습니다.  **생각 과정:**  이 문장은 중국어 번체(繁體中文)를 그대로 유지하여, 원문의 의미를 최대한 정확하게 전달하고자 했습니다.
- **mlx-gemma-4-e2b-4bit**: 儲存變更
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 저장 변경
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 이 문서의 중국어 원문은 다음과 같다:  繁體中文：「儲存變更」這一節的內容為什麼？  번역된 한국어 문장은 다음과 같다:  이 부분의 내용은 왜 이렇게 되는가?
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 儲存變更
- **mlx-qwen3.5-2b-4bit**: 儲存變更
- **mlx-qwen3.5-2b-4bit-mt**: 儲存變更
- **mlx-qwen3.5-4b-4bit**: 保存更改
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 저장 변경
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 儲存變更
- **ollama-translategemma-4b**: 변경 사항 저장
- **ollama-translategemma-4b-mt**: 저장 변경

**zh-Hant-ui-02** (ui)

- 원문: 發生錯誤,請稍後再試。
- **apple-fm**: 오류가 발생했습니다. 잠시 후에 다시 시도해 주세요.
- **apple-mt-attr**: 오류가 발생했습니다. 잠시 후에 다시 시도해 주세요.
- **apple-mt-plain**: 오류가 발생했습니다. 잠시 후에 다시 시도해 주세요.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 오류가 발생하였습니다. 나중에 다시 시도해 주십시오.
- **ct2-nllb-1.3b**: 한 번 더 시도해 보세요.
- **ct2-nllb-600m**: 만약 오류가 발생하면 나중에 다시 시도해보세요.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: **참고:**  *   **중국어 번체 (繁體中文):**  "เกิดข้อผิดพลาด, โปรดลองใหม่ภายหลัง" *   **번역:**  "오류가 발생했습니다. 다시 시도해주세요."  **설명:**  *   **"เกิดข้อผิดพลาด" (Choke-pue-leup-leup)**: "오류가 발생했다"는 의미를 나타냅니다. *   **"โปรดลองใหม่ภายหลัง" (Pro-d-long-neua-phai-hâu)**: "다시 시도해주세요"는 "Please try again later"라는 의미로,  "프로드롱네우하"라는 표현이 적절합니다. *   **"화요" (Hwa-yo)**: "오류"를 나타냅니다. *   **"ลองใหม่ภายหลัง" (Long-neua-phai-hâu)**: "다시 시도해주세요"는 "Please try again later"라는 의미로,  "ลอง신하우"라는 표현이 적절합니다.  **추가 고려 사항:**  *   "오류"라는 단어가 중국어 번체에서 "프로드롱네우하"로 번역된 것을 그대로 사용했습니다. *   "화요"는 "오류"를 나타내는 단어입니다. *   "프로드롱네우하"는 "Please try again later"를 의미하는 표현입니다.
- **mlx-gemma-4-e2b-4bit**: 發生錯誤,請稍後再試。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 오류가 발생했습니다. 잠시 후에 다시 시도해 주세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 發生錯誤,請稍後再試。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 發生錯誤，請稍後再試。
- **mlx-qwen3.5-2b-4bit**: 發生錯誤，請稍後再試。
- **mlx-qwen3.5-2b-4bit-mt**: 發生錯誤，請稍後再試。
- **mlx-qwen3.5-4b-4bit**: 发生错误，请稍后再试。
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 發生錯誤，請稍後再試。
- **ollama-translategemma-4b**: 오류가 발생했습니다. 잠시 후 다시 시도하세요.
- **ollama-translategemma-4b-mt**: 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.

**zh-Hant-ui-03** (ui)

- 원문: 您有 3 則未讀訊息
- **apple-fm**: 3개의 미확인 메시지가 있습니다.
- **apple-mt-attr**: 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-plain**: 읽지 않은 메시지가 3개 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 읽지 않은 메시지가 3개 있습니다.
- **ct2-nllb-1.3b**: 당신은 3개의 글을 읽지 않았습니다.
- **ct2-nllb-600m**: 3개의 메세지가 읽히지 않았습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3 則未讀訊息  您有 3
- **mlx-gemma-4-e2b-4bit**: 您有 3 則未讀訊息
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 이메일을 읽지 않은 메시지가 3개 있습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 您有 3 則未讀訊息，請告訴我哪一則是您最想看的？
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 您有 3 則未讀訊息
- **mlx-qwen3.5-2b-4bit**: 您有 3 則未讀訊息
- **mlx-qwen3.5-2b-4bit-mt**: 3 개의 읽지 않은 메시지
- **mlx-qwen3.5-4b-4bit**: 您有 3 条未读消息
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 3개의 읽지 않은 메시지가 있습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 您有 3 則未讀訊息
- **ollama-translategemma-4b**: 읽지 않은 메시지가 3개 있습니다
- **ollama-translategemma-4b-mt**: 읽지 않은 메시지가 3건 있습니다.

**zh-Hant-link-01** (link)

- 원문: 按一下[這裡]即可繼續。
- **apple-fm**: 클릭하세요[這裡]여기
- **apple-mt-attr**: 눌러 주세요[這裡]그럼 계속할 수 있습니다.
- **apple-mt-plain**: 눌러 주세요[這裡]그럼 계속할 수 있습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 누르세요[這裡]이렇게 계속된다.
- **ct2-nllb-1.3b**: 누르세요.[這裡]그리고 계속하세요.
- **ct2-nllb-600m**: 다음 문자를 클릭하세요[這裡]그래서 계속할 수 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 번체(繁體中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한 것입니다.  **번역:**  다음은 텍스트를 자연스러운 한국어로 번역한[這裡]이어서 진행하십시오.
- **mlx-gemma-4-e2b-4bit**: 按一下[這裡]這裡
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 클릭하세요[這裡]계속할 수 있습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 번역문만 출력합니다.  번역문: 按一下[這裡]即可繼續。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 按下[這裡]即可繼續。
- **mlx-qwen3.5-2b-4bit**: 按一下[這裡]這裡
- **mlx-qwen3.5-2b-4bit-mt**: 按一下[這裡]即可繼續。
- **mlx-qwen3.5-4b-4bit**: 点击[這裡](누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 한 번 누르세요.[這裡]계속 진행하십시오.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 按一下[這裡]即可繼續。
- **ollama-translategemma-4b**: 클릭[這裡]여기
- **ollama-translategemma-4b-mt**: 버튼을 누르세요[這裡]계속 진행하시면 됩니다.

**zh-Hant-link-02** (link)

- 원문: 如需瞭解支援的平台,請參閱[安裝指南]。
- **apple-fm**: 지원 플랫폼에 대한 자세한 내용은 설치 가이드에서 확인하세요.[安裝指南]...
- **apple-mt-attr**: 지원되는 플랫폼을 알고 싶으시면 참조하십시오[安裝指南].
- **apple-mt-plain**: 지원되는 플랫폼을 확인하려면 참조하십시오.[安裝指南]。
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 지원되는 플랫폼에 대한 정보는 다음을 참조하십시오.[安裝指南]。
- **ct2-nllb-1.3b**: 지원 플랫폼에 대한 자세한 내용은 이 문서를 참조하십시오.[安裝指南]。
- **ct2-nllb-600m**: 지원 플랫폼에 대한 자세한 내용은 문서를 참조하십시오[安裝指南]。
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 번체(繁體中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  **번역:**  "이 텍스트는 중국어 번체(繁體中文)로 작성되었습니다.  원문은 그대로 유지해야 합니다.  이 텍스트는 다음과 같은 정보가 포함되어 있습니다:  *   **어조:**  (원문에 따라 어조를 명시적으로 표현할 필요는 없습니다.  번역의 목적에 따라 어조를 결정할 수 있습니다.) *   **고유명사:**  (원문에 따라 고유명사를 명시적으로 표현할 필요는 없습니다.) *   **숫자:**  (원문에 따라 숫자들을 그대로 번역합니다.) *   **URL:**  (원문에 따라 URL을 그대로 번역합니다.) *   **코드:**  (원문에 따라 코드를 그대로 번역합니다.)  이 텍스트는 중국어 번체(繁體中文)로 작성되었습니다.  원문은 그대로 유지해야 합니다.  이 텍스트는 다음과 같은 정보가 포함되어 있습니다:  *   **어조:**  (원문에 따라 어조를 명시적으로 표현할 필요는 없습니다.  번역의 목적에 따라 어조를 결정할 수 있습니다.) *   **고유명사:**  (원문에 따라 고유명사를 명시적으로 표현할 필요는 없습니다.) *   **숫자:**  (원문에 따라 숫자들을 그대로 번역합니다.) *   **URL:**  (원문에 따라 URL을 그대로 번역합니다.) *   **코드:**  (원문에 따라 코드를 그대로 번역합니다.)  이 텍스트는 중국어 번체(繁體中文)로 작성되었습니다.  원문은 그대로 유지해야 합니다.  이 텍스트는 다음과 같은 정보가 포함되어 있습니다:  *   **어조:**  (원문에 따라 어조를 명시적으로 표현할 필요는 없습니다.  번역의 목적에 따라 어조를 결정할 수 있습니다.) *   **고유명사:**  (원문에 따라 고유명사를 명시적으로 표현할 필요는 없습니다.) *   **숫자:**  (원문에 따라 숫자들을 그대로 번역합니다.) *   **URL:**  (원문에 따라 URL을 그대로 번역합니다.) *   **코드:**  (원문에 따라 코드를 그대로 번역합니다.)  이 텍스트는 중국어 번체(繁體中文)로 작성되었습니다.  원문은 그대로 유지해야 합니다.  이 텍스트는 다음과 같은 정보가 포함되어 있습니다:  *   **어조:**  (원문에 따라 어조를 명시적으로 표현할 필요는 없습니다.  번역의 목적에 따라 어조를 결정할 수 있습니다.) *   **고유명사:**  (원문에 따라 고유명사를 명시적으로 표현할 필요는 없습니다.) *   **숫자:**  (원문에 따라 숫자들을 그대로 번역합니다.) *   **URL:**  (원문에 따라 URL을 그대로 번역합니다.) *   **코드:**  (원문에 따라 코드를 그대로 번역합니다.)  이 텍스트는 중국어 번체(繁體中文)로 작성되었습니다.  원문은 그대로 유지해야 합니다.  이 텍스트는 다음과 같은 정보가 포함되어 있습니다:  *   **어조:**  (원문에 따라 어조를 명시적으로 표현할 필요는 없습니다.  번역의 목적에 따라 어조를 결정할 수 있습니다.) *   **고유명사:**  (원문에 따라 고유명사를 명시적으로 표현할 필요는 없습니다.) *   **숫자:**  (원문에 따라 숫자들을 그대로 번역합니다.) *   **URL:**  (원문에 따라 URL을 그대로 번역합니다.) *   **코드:**  (원문에 따라 코드를 그대로 번역합니다.)  이 텍스트는 중국어 번체(繁體中文)로 작성되었습니다.  원문은 그대로 유지해야 합니다.  이 텍스트는 다음과 같은 정보가 포함되어 있습니다:  *   **어조:**  (원문에 따라 어조를 명시적으로 표현할 필요는 없습니다.  번역의 목적에 따라 어조를 결정할 수 있습니다.) *   **고유명사:**  (원문에 따라 고유명사를 명시적으로 표현할 필요는 없습니다.) *[安裝指南]。
- **mlx-gemma-4-e2b-4bit**: 如需瞭解支援的平台,請參閱[安裝指南]安裝指南
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 지원되는 플랫폼에 대해 알고 싶으시면, [安裝指南]。
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 번역문만 출력합니다.  如需瞭解支援的平台,請參閱[安裝指南]。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 如需瞭解支援的平台,請參閱[安裝指南]。
- **mlx-qwen3.5-2b-4bit**: 如需瞭解支援的平台，請參閱[安裝指南]安裝指南
- **mlx-qwen3.5-2b-4bit-mt**: 如需瞭解支援的平台，請參閱[安裝指南]。
- **mlx-qwen3.5-4b-4bit**: 如需了解支持的平台，请参阅[安裝指南](누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 자세한 내용이 필요하시면 [安裝指南]。
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 如需瞭解支援的平台，請參閱[安裝指南]安裝指南
- **ollama-translategemma-4b**: 지원 플랫폼에 대한 자세한 내용은 [安裝指南]설치 가이드
- **ollama-translategemma-4b-mt**: 지원 플랫폼에 대한 자세한 내용은 [安裝指南]。

**zh-Hant-link-03** (link)

- 원문: 如果遇到問題,請[到問題追蹤頁面回報],並附上記錄檔。
- **apple-fm**: 문제 발생 시...[到問題追蹤頁面回報]...
- **apple-mt-attr**: 문제가 발생하면, [到問題追蹤頁面回報]하고, 위 기록 파일을 첨부하십시오.
- **apple-mt-plain**: 문제가 발생하면, 부탁드립니다.[到問題追蹤頁面回報], 그리고 위 기록 파일을 첨부합니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 문제가 발생한 경우[到問題追蹤頁面回報]레코드를 담당하고 있다.
- **ct2-nllb-1.3b**: 만약 문제가 생기면 연락해주세요.[到問題追蹤頁面回報]이 글은 카카오페이지에서 공개된 글입니다.
- **ct2-nllb-600m**: 만약 문제가 있다면, 부탁드립니다.[到問題追蹤頁面回報]이 글은 많은 사람들의 관심을 끌고 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 번체(繁體中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  **번역:**  “如果遇到問題, 請联系我们。”  **설명:**  *   **如果 (xūyào):**  만약, (만약의 상황을 나타내는 표현) *   **遇到問題 (yùqíng wènwèn):**  문제에 닥쳐서 *   **請 (qǐng):**  (부탁하다는 의미) *   **联系我们 (liánxiē wǒmen):**  우리에 연락하세요  **주석:**  *   이 문장은 문제 발생 시, 연락처를 문의하는 공식적인 표현입니다. *   원문은 중국어 번체(繁體中文)로 되어 있습니다. *   번역은 원문 그대로 유지했습니다.  **참고:**  이 문장은 중국어 번체(繁體中文)로 작성되었습니다.  번역은 중국어 번체(繁體中文)로 작성된 텍스트를 그대로 전달하는 것을 목표로 합니다.[到問題追蹤頁面回報]**번역:**  "위의 기록 파일과 함께 제공됩니다."  **설명:**  *   **"위의"**:  "위의"는 "above"를 의미하는 "위의"를 나타냅니다. *   **"기록 파일"**:  "record file"은 "record"를 의미하는 "기록 파일"을 나타냅니다. *   **"과 함께 제공됩니다."**:  "and together provided"는 "and together provided"를 나타냅니다.  **추가 설명:**  이 문장은 중국어 번체(繁體中文)의 문장 구조를 그대로 유지하고 있습니다.  "위의"는 "above"를 의미하는 "위의"를 나타내며, "기록 파일"은 "record file"을 의미하는 "기록 파일"을 나타냅니다.  이러한 문장 구조는 중국어에서 흔히 사용되는 표현 방식입니다.
- **mlx-gemma-4-e2b-4bit**: 如果遇到問題,請[到問題追蹤頁面回報]到問題追蹤頁面回報
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 문제가 생기면 [到問題追蹤頁面回報]을 하고 기록 파일을 첨부해 주세요.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 請問您有什麼問題嗎？[到問題追蹤頁面回報]請輸入您需要翻譯的繁體中文文本，並請輸入翻譯後的韓國語文本，然後請輸入翻譯結果。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 若有問題，請[到問題追蹤頁面回報]，並附上記錄檔。
- **mlx-qwen3.5-2b-4bit**: 如果遇到問題，請[到問題追蹤頁面回報]到問題追蹤頁面回報
- **mlx-qwen3.5-2b-4bit-mt**: 만약 문제가 발생하면,[到問題追蹤頁面回報]을 사용하여 기록 파일을 첨부하십시오.
- **mlx-qwen3.5-4b-4bit**: 如果遇到问题，请[到問題追蹤頁面回報](누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 문제가 발생했을 경우, [到問題追蹤頁面回報]에 문의하시고 관련 기록 파일을 첨부해 주세요.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 如果遇到問題，請[到問題追蹤頁面回報]到問題追蹤頁面回報
- **ollama-translategemma-4b**: 문제 발생 시 [到問題追蹤頁面回報]문제 추적 페이지
- **ollama-translategemma-4b-mt**: 문제가 발생하면,[到問題追蹤頁面回報]또한, 관련 기록 파일을 첨부합니다.

**zh-Hant-seq-01** (seq)

- 원문: 去年春天,我決定把一台舊筆電改造成家用伺服器,用來存放家人的照片。
- **apple-fm**: 작년 봄, 저는 오래된 노트북을 가정용 서버로 개조하여 가족 사진을 저장하기로 결정했어요.
- **apple-mt-attr**: 작년 봄, 나는 오래된 노트북을 가정용 서버로 개조하여 가족의 사진을 보관하기로 결정했다.
- **apple-mt-plain**: 작년 봄, 나는 오래된 노트북을 가정용 서버로 개조하여 가족의 사진을 보관하기로 결정했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 작년 봄, 저는 가족의 사진을 저장하기 위해 오래된 노트북을 가정용 서버로 바꾸기로 결정했습니다.
- **ct2-nllb-1.3b**: 지난 봄, 저는 오래된 노트북을 가정용 서버로 바꾸고 가족 사진을 저장하기로 결정했습니다.
- **ct2-nllb-600m**: 지난 봄, 저는 오래된 노트북을 가정용 서버로 바꾸어 가족들의 사진을 저장하기로 결정했습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 2023년 봄, 저는 오래된 데스크탑 컴퓨터를 가정용 서버로 바꾸기로 결정했어요. 사진을 보관하기 위해 사용하기 위해.  **Explanation:**  *   **去年春天 (Yìqī Chūqī):**  "2023년 봄" (2023년 봄) *   **我決定 (Wǒ juédìng):** "저는 결정했어요" (저는 결정했어요) *   **把一台舊筆電改造成家用伺服器 (Bǎ yīlái jiùbǐdiàn gēoshìwéiyòng):** "전 오래된 데스크탑 컴퓨터를 가정용 서버로 바꾸었어요" (전 오래된 데스크탑 컴퓨터를 가정용 서버로 바꾸었어요) *   **用來存放家人的照片 (Yòng lái gòujiā rén de zhàopǐng):** "사진을 보관하기 위해 사용하기 위해" (사진을 보관하기 위해 사용하기 위해)  **Thought Process:**  The original Chinese sentence is a simple statement of intent.  The translation aims to preserve the original meaning and tone while maintaining a natural flow in Korean. I prioritized maintaining the original Chinese characters and the overall context.
- **mlx-gemma-4-e2b-4bit**: 去年春天,我決定把一台舊筆電改造成家用伺服器,用來存放家人的照片。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 지난해 봄에, 저는 오래된 노트북을 가정용 서버로 바꾸기로 결심했어요. 그 서버를 이용해 가족들의 사진을 저장할 예정입니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 去年春天我決定把一台舊筆電改造成家用伺服器,用來存放家人的照片。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 올해 봄, 나는 가족的照片를 저장하기 위한 가용 서버로 기존의 노트북을 재설치했다.
- **mlx-qwen3.5-2b-4bit**: 去年春天，我決定把一台舊筆電改造成家用伺服器，用來存放家人的照片。
- **mlx-qwen3.5-2b-4bit-mt**: 去年春天,我决定将一台旧笔记本电脑改造为家用服务器,用来存放家人的照片。
- **mlx-qwen3.5-4b-4bit**: 去年春天，我决定将一台旧笔记本电脑改造成家用服务器，用于存储家人的照片。
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 작년 봄, 저는 오래된 노트북을 개조하여 가정용 서버로 만들기로 결정했습니다. 가족 사진을 보관하기 위해서입니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 去年春天，我決定把一台舊筆電改造成家用伺服器，用來存放家人的照片。
- **ollama-translategemma-4b**: 지난 봄, 저는 오래된 노트북을 집 서버로 개조하기로 결정했습니다. 2014년 ThinkBook 8GB 메모리를 사용하기에 충분했습니다.
- **ollama-translategemma-4b-mt**: 지난 봄, 저는 오래된 노트북을 개조하여 가정용 서버로 만들기로 결정했습니다. 이를 통해 가족들의 사진을 보관할 수 있게 되었습니다.

**zh-Hant-seq-02** (seq)

- 원문: 這台 2014 年的ThinkBook配備 8 GB 記憶體,拿來做這件事剛剛好。
- **apple-fm**: 2014년의ThinkBook8GB 메모리를 갖추고 있어서 딱 맞았어요.
- **apple-mt-attr**: 이 2014년형 ThinkBook은 8GB 메모리를 장착하고 있어, 이 일을 하기에 딱 맞습니다.
- **apple-mt-plain**: 이 2014년형 ThinkBook은 8GB 메모리를 장착하고 있어, 이 일을 하기에 딱 맞습니다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 이 2014 ThinkBook은 8GB의 메모리를 갖추고 있어 이러한 작업에 적합합니다.
- **ct2-nllb-1.3b**: 2014년에 출시된 이 힌크북은 8GB의 메모리를 탑재하고 있습니다.
- **ct2-nllb-600m**: 2014년에 출시된 ThinkBook은 8GB의 메모리를 가지고 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 이 2014년 ThinkBook은 8GB 메모리 장착되어 있어, 이 일을 아주 잘 할 수 있습니다.
- **mlx-gemma-4-e2b-4bit**: 這台 2014 年的ThinkBook配備 8 GB 記憶體,拿來做這件事剛剛好。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 2014년형 ThinkBook은 8GB의 메모리를 갖추고 있어, 이 작업을 할 때 딱 맞는 기기입니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 這台 2014 年的ThinkBook配備 8 GB 記憶體,拿來做這件事剛剛好。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 2014년의 ThinkBook는 8GB의 메모리로 사용되며, 이는 해당 작업에 적절하게 사용된다.
- **mlx-qwen3.5-2b-4bit**: 這台 2014 年的ThinkBook配備 8 GB 記憶體，拿來做這件事剛剛好。
- **mlx-qwen3.5-2b-4bit-mt**: 2014 년 출시의 ThinkBook 는 8GB 메모리를 탑재하여 이 작업을 완벽하게 수행할 수 있습니다.
- **mlx-qwen3.5-4b-4bit**: 这台 2014 年的(누락)(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 이 2014년 ThinkBook은 8GB의 메모리를 갖추고, 이 작업을 위해 완벽하게 적합합니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 這台 2014 年的ThinkBook配備 8 GB 記憶體，拿來做這件事剛剛好。
- **ollama-translategemma-4b**: 저는 Debian 12를 설치하고, 사진을 저장하는 Fernbox라는 작은 웹 애플리케이션을 설정했습니다.(누락)(누락)
- **ollama-translategemma-4b-mt**: 이 2014년 ThinkBook은 8GB의 메모리를 갖추고 있어, 이 작업을 수행하기에 완벽합니다.

**zh-Hant-seq-03** (seq)

- 원문: 我先安裝了 [Debian 12],再架設一個叫 Fernbox 的小型網頁應用程式來瀏覽相片。
- **apple-fm**: 먼저 설치했습니다[Debian 12]...
- **apple-mt-attr**: 먼저 를 설치한 [Debian 12]후, 사진을 보려면 Fernbox라는 작은 웹 애플리케이션을 설치했습니다.
- **apple-mt-plain**: 제가 먼저 설치했어요. [Debian 12], Fernbox라는 이름의 소형 웹사이트 애플리케이션을 하나 더 설치하여 사진을 감상하십시오.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 제가 설치했어요. [Debian 12]또한 Fernbox라는 이름의 작은 웹 애플리케이션을 설치하여 사진을 볼 수 있다.
- **ct2-nllb-1.3b**: 저는 그것을 설치했습니다. [Debian 12]이 사진들을 검색하기 위해 Fernbox라는 작은 웹 애플리케이션을 설치했습니다.
- **ct2-nllb-600m**: 제가 먼저 설치했습니다. [Debian 12]그리고 Fernbox라는 작은 웹 애플리케이션을 만들어서 사진을 탐색할 수 있습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 我先安裝了 [Debian 12], 再架設一個叫 Fernbox 的小型網頁應用程式來瀏覽相片。  이전 단계에서 Fernbox라는 작은 웹 애플리케이션을 설치했습니다.  이어서 사진을 보기 위해 Fernbox를 사용합니다.
- **mlx-gemma-4-e2b-4bit**: 我先安裝了 [Debian 12]Debian 12
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 먼저 [Debian 12]을 설치하고, 사진을 둘러볼 수 있는 Fernbox이라는 작은 웹 애플리케이션도 설치했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 我先安裝了 [Debian 12],再架設一個叫 Fernbox 的小型網頁應用程式來瀏覽相片。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 我先安裝了 [Debian 12]，再架設一個叫 Fernbox 的小型網頁應用程式來瀏覽相片。
- **mlx-qwen3.5-2b-4bit**: 我先安裝了[Debian 12]Debian 12
- **mlx-qwen3.5-2b-4bit-mt**: 我先安裝了 [Debian 12]，再架設一個叫 Fernbox 的小型網頁應用程式來瀏覽相片。
- **mlx-qwen3.5-4b-4bit**: 我先安装了[Debian 12](누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 먼저 [Debian 12]을 설치하고, Fernbox라는 작은 웹 애플리케이션을 설치하여 사진을 보기로 했습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 我先安裝了[Debian 12]Debian 12
- **ollama-translategemma-4b**: 처음에는 제 여동생이 의심했지만, 일주일 후 그녀는 Fernbox가 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다고 인정했습니다.[Debian 12](누락)
- **ollama-translategemma-4b-mt**: 먼저 [Debian 12]을 설치한 후, 사진을 보기 위한 작은 웹 애플리케이션인 "Fernbox"를 구축했습니다.

**zh-Hant-seq-04** (seq)

- 원문: 妹妹起初半信半疑,但一週後她承認,Fernbox 比她用過的任何雲端服務都快。
- **apple-fm**: 동생은 처음에는 회의적이었지만, 일주일 후에는 Fernbox가 그녀가 사용했던 어떤 클라우드 서비스보다 훨씬 좋다고 인정했어요.
- **apple-mt-attr**: 여동생은 처음에는 반신반의했지만, 일주일 후 그녀는 Fernbox가 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다고 인정했다.
- **apple-mt-plain**: 여동생은 처음에는 반신반의했지만, 일주일 후 그녀는 Fernbox가 그녀가 사용해 본 어떤 클라우드 서비스보다 빠르다고 인정했다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 여동생은 처음에는 의심스럽게 생각했지만 일주일이 지나자 Fernbox가 그녀가 이전에 사용했던 어떤 클라우드 서비스보다도 빠르다는 것을 인정했습니다.
- **ct2-nllb-1.3b**: 그녀의 여동생은 처음에는 의심했지만 일주일 후 페른박스가 그녀가 사용한 모든 클라우드 서비스보다 더 빠르다는 것을 인정했습니다.
- **ct2-nllb-600m**: 언니는 처음에는 반정신적이었지만 일주일 후에 Fernbox이 그녀가 사용한 클라우드 서비스보다 더 빠르다는 사실을 인정했습니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 어조, 고유명사, 숫자, URL, 코드는 원문 그대로 유지하라. 원문은 중국어 번체(繁體中文)다. 번역문만 출력하라. 설명, 주석, 따옴표, 생각 과정은 출력하지 마라.  妹妹起初半信半疑,但一週後她承認,Fernbox 比她用過的任何雲端服務都快。  이 문장은 다음과 같이 번역할 수 있습니다.  "처음에는 약간의 의심을 품은 것처럼 보였지만, 한 주 후 그녀가 인정했습니다. Fernbox는 그녀가 사용했던 어떤 다른 클라우드 서비스보다 훨씬 뛰어났습니다."  **설명:**  *   **妹妹 (mèi-jin):**  "동생"이라는 뜻입니다. *   **起初 (qǐ-chū):** "처음부터" 또는 "초기부터"라는 뜻입니다. *   **半信半疑 (bàn xìn bànyí):** "약간의 의심과 의심을 동시에 품고 있다"라는 뜻입니다. *   **但 (dàn):** "그러나" 또는 "하지만"이라는 뜻입니다. *   **一週後 (yī-xuwé hòu):** "한 주 후"라는 뜻입니다. *   **彼女 (hé-qí):** "그녀"라는 뜻입니다. *   **承認 (chuán'):** "인정하다"라는 뜻입니다. *   **Fernbox (Fēnr-bōx):** "Fernbox"이라는 이름입니다. *   **比 (bǐ):** "보다"라는 뜻입니다. *   **彼女用過的 (hé-qí yòngchué de):** "그녀가 사용했던"이라는 뜻입니다. *   **任何 (éiyǒu):** "어떤 것"이라는 뜻입니다. *   **雲端服務 (yún-xuán fúwù):** "클라우드 서비스"이라는 뜻입니다. *   **都快 (dōu kuài):** "완전히 다쳤다" 또는 "완전히 낡았다"라는 뜻입니다.  **주석:**  *   "起初半信半疑"는 "처음에는 약간의 의심과 의심을 동시에 품고 있다"라는 의미로 해석됩니다. *   "一週後彼女承認"은 "한 주 후 그녀가 인정했다"라는 의미로 해석됩니다. *   "Fernbox 比她用過的任何雲端服務都快"은 "Fernbox는 그녀가 사용했던 어떤 다른 클라우드 서비스보다 훨씬 뛰어났습니다"라는 의미로 해석됩니다.  **생각 과정:**  원문의 의미를 최대한 살리면서, 한국어에 자연스럽게 어울리는 표현을 선택했습니다.  문맥에 따라 다양한 번역이 가능하지만, 이 번역은 원문의 의미를 가장 정확하게 전달하는 것으로 판단했습니다.
- **mlx-gemma-4-e2b-4bit**: 妹妹起初半信半疑,但一週後她承認,Fernbox 比她用過的任何雲端服務都快。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 여동생은 처음에는 의심했지만, 일주일 후에 그녀는 Fernbox가 자신이 사용한 모든 클라우드 서비스보다 더 빠르다고 인정했습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 妹妹起初半信半疑,但一週後她承認,Fernbox 比她用過的任何雲端服務都快。
- **mlx-qwen3-1.7b-4bit**: (오류: block missing in output)
- **mlx-qwen3-1.7b-4bit-mt**: 동생은 처음에는 반나절로 의심했지만, 한달 후에는 Fernbox가 그녀가 사용한 모든 클라우드 서비스보다 빠르다는 것을 인정했다.
- **mlx-qwen3.5-2b-4bit**: 妹妹起初半信半疑，但一週後她承認，Fernbox 比她用過的任何雲端服務都快。
- **mlx-qwen3.5-2b-4bit-mt**: 妹妹起初半信半疑，但一週後她承認，Fernbox 比她用過的任何雲端服務都快。
- **mlx-qwen3.5-4b-4bit**: 妹妹起初半信半疑，但一周后她承认，Fernbox 比她使用过的任何云服务都快。
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 처음에 여동생은 의심했지만, 한 주 후에는 Fernbox이 다른 클라우드 서비스보다 훨씬 빠르다는 것을 인정했습니다.
- **ollama-gemma4-e2b**: (오류: block missing in output)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 妹妹起初半信半疑，但一週後她承認，Fernbox 比她用過的任何雲端服務都快。
- **ollama-translategemma-4b**: 지금은 오래된 노트북이 조용히 책상 위에 놓여 있고, Fernbox는 가족이 여행을 마치고 돌아왔을 때 가장 먼저 켜는 프로그램입니다.
- **ollama-translategemma-4b-mt**: 처음에는 의심스러워했지만, 한 주 후에는 Fernbox가 그녀가 사용해 본 다른 클라우드 서비스보다 훨씬 빠르다는 것을 인정했습니다.

**zh-Hant-seq-05** (seq)

- 원문: 現在,那台舊筆電安靜地放在架子上,而Fernbox已經成為全家人旅行回來後第一個開啟的應用程式。
- **apple-fm**: 지금, 그 오래된 노트북은 조용히 선반 위에 놓여 있고, 그리고Fernbox이제 가족 모두가 여행에서 돌아오자마자 가장 먼저 사용하는 애플리케이션이 되었습니다.
- **apple-mt-attr**: 지금, 그 오래된 노트북은 조용히 선반 위에 놓여 있고, Fernbox는 이미 가족이 여행에서 돌아온 후 가장 먼저 실행하는 애플리케이션이 되었다.
- **apple-mt-plain**: 지금, 그 오래된 노트북은 조용히 선반 위에 놓여 있고, Fernbox는 이미 가족이 여행에서 돌아온 후 가장 먼저 실행하는 애플리케이션이 되었다.
- **apple-mt-plain-lowlatency**: (오류: TranslationError(cause: Translation.TranslationError.Cause.notInstalled, sourceLanguage: nil, targetLanguage: nil))
- **ct2-m2m100-418m**: (오류: HTTP 500: {"error": "ValueError: Couldn't instantiate the backend tokenizer from one of: \n(1) a `tokenizers` library serialization file, \n(2) a slow tokenizer instance to convert or \n(3) an equivalent slow tokenizer class to instantiate and convert. \nYou need to have sentencepiece or tiktoken installed to)
- **ct2-madlad-3b**: 이제 그 오래된 노트북은 선반에 조용히 놓여 있고 Fernbox는 가족이 여행에서 돌아왔을 때 처음으로 열리는 앱이 되었습니다.
- **ct2-nllb-1.3b**: 현재, 오래된 노트북은 조용하게 책상 위에 놓여 있으며, Fernbox은 가족 여행에서 돌아온 후 처음으로 열리는 앱이 되었습니다.
- **ct2-nllb-600m**: 현재는 오래된 노트북이 쉴 새 없이 상자 위에 놓여 있고, Fernbox은 가족 모두가 여행에 돌아온 후 처음으로 오픈한 앱입니다.
- **mlx-exaone-4.0-1.2b-4bit**: (오류: HTTP 404: {"error": "generation thread died"})
- **mlx-gemma-3-1b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-gemma-3-1b-4bit-mt**: 현재, 그 오래된 노트북은 조용히 있는 나무 상에 놓여 있고, Fernbox는 가족 여행이 돌아온 후 처음 열린 앱입니다.
- **mlx-gemma-4-e2b-4bit**: 現在,那台舊筆電安靜地放在架子上,而Fernbox已經成為全家人旅行回來後第一個開啟的應用程式。
- **mlx-hy-mt2-1.8b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-hy-mt2-1.8b-4bit-mt**: 지금, 그 오래된 노트북은 조용히 선반 위에 놓여 있고, Fernbox는 가족이 여행에서 돌아왔을 때 가장 먼저 열리는 애플리케이션이 되었습니다.
- **mlx-hyperclovax-seed-1.5b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit**: (오류: JSON parse failure after retry: unexpected JSON structure)
- **mlx-kanana-2-3b-4bit-mt**: 現在，那台舊筆電安靜地放在架子上，而Fernbox已經成為全家人旅行回來後第一個開啟的應多用程式。
- **mlx-qwen3-1.7b-4bit**: 現在,那台舊筆電安靜地放在架子上,而 Fernbox 已經成為全家人旅行回來後第一個開啟的應用程式。
- **mlx-qwen3-1.7b-4bit-mt**: 현재, 그 노트북은 놓여 있고, Fernbox는 모두가 여행归来後 첫으로 실행되는 앱이 됨.
- **mlx-qwen3.5-2b-4bit**: 現在，那台舊筆電安靜地放在架子上，而Fernbox已經成為全家人旅行回來後第一個開啟的應用程式。
- **mlx-qwen3.5-2b-4bit-mt**: 現在，那台舊筆電安靜地放在架子上，而 Fernbox 已經成為全家人旅行回來後第一個開啟的應用程式。
- **mlx-qwen3.5-4b-4bit**: 现在，那台旧笔记本电脑安静地放在架子上，而(누락)(누락)
- **mlx-translategemma-4b-4bit**: (오류: HTTP 404: {"error": "Conversations must start with a user prompt."})
- **mlx-translategemma-4b-4bit-mt**: 현재, 그 오래된 노트북은 책상 위에 조용히 놓여 있고, Fernbox는 가족들이 여행을 마치고 돌아와서 가장 먼저 실행되는 앱이 되었습니다.
- **ollama-gemma4-e2b**: 이제 그 낡은 노트북은 조용히 선반 위에 놓여 있고, (누락)(누락)
- **ollama-gemma4-e4b**: (오류: block missing in output)
- **ollama-qwen3-1.7b**: (오류: block missing in output)
- **ollama-qwen3.5-2b**: 現在，那台舊筆電安靜地放在架子上，而Fernbox已經成為全家人旅行回來後第一個開啟的應用程式。
- **ollama-translategemma-4b**: (오류: block missing in output)
- **ollama-translategemma-4b-mt**: 현재, 오래된 노트북은 조용히 책상 위에 놓여 있고, Fernbox는 온 가족이 여행을 마치고 돌아왔을 때 가장 먼저 실행하는 앱이 되었습니다.

