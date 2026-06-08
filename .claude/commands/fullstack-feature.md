---
description: 기능 하나를 백엔드+프론트 풀스택으로 구현 (계획 → 병렬 전문 에이전트 → 룰 검증)
argument-hint: <기능 설명>
---

WorkLog+에 풀스택 기능 **$ARGUMENTS** 를 하네스 엔지니어링 흐름으로 구현하세요.

표준 오케스트레이션:
1. **계획**: 비자명하면 먼저 플랜 모드로 설계해 승인받습니다. 기능을 백엔드/DB 작업과 프론트엔드 작업으로 분해합니다.
2. **태스크 추적**: `TaskCreate`로 하위 작업을 등록하고 시작 시 `in_progress`, 완료 시 `completed`로 갱신합니다.
3. **백엔드 우선**: DB 모델/마이그레이션과 API 계약이 프론트의 선행 조건이면, `backend-engineer` 에이전트로 먼저 구현합니다(`add-prisma-model`, `add-api-resource` 활용). `packages/types`/`packages/api`까지 연결해 계약을 확정합니다.
4. **프론트 진행**: 계약 확정 후 `frontend-engineer` 에이전트로 훅/페이지/컴포넌트를 구현합니다(`add-web-feature`, `add-ui-component`). 백엔드와 의존성이 없는 부분은 병렬로 진행할 수 있습니다.
5. **테스트**: `test-writer` 에이전트로 서비스 단위 테스트 및 주요 통합 테스트를 추가합니다.
6. **검증**: `convention-check` 스킬(또는 `convention-reviewer` 에이전트)로 룰 위반을 점검하고, `pnpm typecheck && lint && test`를 실행합니다.
7. **커밋**: 기능 단위로 한국어 커밋 메시지로 커밋합니다(여러 기능 혼재 금지). 푸시는 사용자 요청 시에만.

의존성 없는 작업은 병렬로, 있는 작업은 순서대로 진행하세요. 요구사항이 모호하면 구현 전에 확인하세요.
