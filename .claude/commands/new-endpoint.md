---
description: 새 백엔드 API 리소스를 계층 아키텍처대로 추가 (add-api-resource 스킬 기동)
argument-hint: <리소스명> [필드/요구사항]
---

`add-api-resource` 스킬을 사용해 WorkLog+ 백엔드에 새 리소스 **$ARGUMENTS** 를 추가하세요.

진행 지침:
1. 먼저 `add-api-resource` 스킬을 실행해 절차와 레퍼런스 패턴(project 계열)을 로드합니다.
2. 리소스에 DB 모델이 없다면 `add-prisma-model` 스킬로 모델을 먼저 추가합니다.
3. schema → service → controller → route → `routes/index.ts` 등록 → `packages/types`/`packages/api` 연결 → 서비스 단위 테스트 순으로 구현합니다.
4. 복잡하면 `backend-engineer` 서브에이전트에 위임해도 됩니다.
5. 완료 전 `convention-check` 스킬로 룰을 검증하고, `pnpm --filter @worklog-plus/backend typecheck && test` 를 실행합니다.

요구사항이 모호하면 구현 전에 필드/권한/검증 규칙을 먼저 확인하세요.
