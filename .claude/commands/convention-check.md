---
description: 현재 변경분을 CLAUDE.md 룰과 대조 감사하고 위반 사항 보고 (읽기 전용)
argument-hint: [검사할 경로 또는 PR 번호 (생략 시 현재 diff)]
---

`convention-check` 스킬을 사용해 WorkLog+ 코드의 컨벤션 위반을 검사하세요.

검사 범위: **$ARGUMENTS** (비어 있으면 현재 변경분 = `git diff` + staged).

지침:
1. `convention-check` 스킬을 실행해 점검 항목을 로드합니다.
2. 변경 파일을 읽고 `pnpm lint`, `pnpm typecheck` 결과를 교차 확인합니다(읽기 전용).
3. 위반을 차단/경고/제안 심각도로 분류해 표로 보고합니다. **코드는 수정하지 않습니다.**
4. 깊은 리뷰가 필요하면 `convention-reviewer` 서브에이전트에 위임합니다.

수정이 필요하면 사용자 승인 후 별도로 진행하세요.
