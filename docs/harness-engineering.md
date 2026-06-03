# WorkLog+ 하네스 엔지니어링 기획서

> 작성일: 2026-06-03 · 대상: WorkLog+ 모노레포 · 언어 규칙: 한국어

## 1. 개요

### 하네스 엔지니어링이란
**하네스 엔지니어링(Harness Engineering)** 은 AI 코딩 에이전트(Claude Code)가 프로젝트의 규칙과 패턴을 *반복적으로, 정확히, 자율적으로* 수행하도록 **프로젝트 주변 환경(하네스)을 설계**하는 작업이다. 사람이 매번 같은 지시를 반복하는 대신, 규칙을 **재사용 가능한 자산**(스킬·서브에이전트·커맨드·설정·메모리)으로 코드화한다.

핵심 발상: *"모델을 더 잘 구슬리기"가 아니라 "모델이 일할 작업대(harness)를 잘 만든다."* 작업대가 좋으면 평범한 지시로도 룰을 지키는 결과가 나온다.

### WorkLog+에 적용하는 이유
WorkLog+는 `CLAUDE.md`에 아키텍처/코드/API/보안/DB/테스트 룰이 매우 상세히 정의되어 있고, 백엔드 계층(`routes → controllers → services → prisma`)과 프론트 데이터 흐름(`packages/api → hooks → 컴포넌트`)이 일관되게 확립되어 있다. 즉 **규칙과 모범 패턴은 이미 존재**한다. 그러나 그것을 에이전트가 매번 7개 계층 파일에 걸쳐 정확히 재현하도록 돕는 **하네스 계층이 비어 있었다**. 이 기획서는 그 공백을 채운다.

---

## 2. 현황 진단

### 강점
- **명확한 룰 문서**: 루트 `CLAUDE.md`가 사실상 헌법 역할. 모든 자산이 이를 단일 진실 공급원(SSOT)으로 참조.
- **일관된 계층 아키텍처**: 백엔드 7개 도메인(auth/project/worklog/member/user/activity/dashboard)이 동일 패턴.
- **모노레포 + 공용 패키지**: `types/api/ui/components/hooks/store/config`로 코드 중복 방지.
- **테스트/CI 기반**: Vitest + GitHub Actions(lint→typecheck→test→build).

### 하네스 관점의 공백 (이번에 해소)
| 공백 | 영향 | 해소 |
|------|------|------|
| 스킬 부재 | 새 리소스/기능마다 패턴을 수동 재현 | 스킬 5종 |
| 서브에이전트 부재 | 도메인 전문성·병렬화 활용 못 함 | 에이전트 4종 |
| 커맨드 부재 | 표준 작업 흐름을 매번 설명 | 커맨드 3종 |
| 최소 권한 | 안전한 명령도 매번 승인 프롬프트 | 공유 settings 권한 확대(별도 승인 필요) |

> 참고: 자동 메모리에는 "API 인증만 구현"으로 기록되어 있으나, 실측상 project/worklog/member 등 다수 API가 이미 구현되어 있다. 메모리 갱신 권장.

---

## 3. 하네스 아키텍처 (6계층 모델)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CLAUDE.md (룰)        — 단일 진실 공급원. 모든 자산이 참조 │
│ 2. Memory (맥락)         — 세션 간 지속되는 프로젝트 맥락      │
│ 3. Skills (워크플로우)   — "이 작업은 이렇게 한다"의 절차     │
│ 4. Agents (전문가)       — 도메인별 격리 컨텍스트 + 병렬 실행 │
│ 5. Commands (단축)       — 표준 흐름의 1줄 진입점             │
│ 6. Settings/Hooks (자동) — 권한·자동 검증으로 마찰 제거       │
└─────────────────────────────────────────────────────────────┘
```

- **CLAUDE.md → Skills**: 룰을 "절차"로 번역. 스킬은 룰을 다시 쓰지 않고 *적용 순서와 체크리스트*를 제공.
- **Skills → Agents**: 에이전트는 스킬을 호출하는 도메인 전문가. 격리된 컨텍스트에서 병렬 작업 가능.
- **Commands → Skills/Agents**: 커맨드는 사람이 흐름을 1줄로 기동하는 진입점.
- **Settings/Hooks**: 권한 allowlist로 반복 승인을 줄이고, (옵션) 훅으로 lint/format을 자동화.

---

## 4. 산출물 카탈로그

### 스킬 (`.claude/skills/*/SKILL.md`)
| 스킬 | 목적 | 트리거 예시 |
|------|------|-------------|
| `add-api-resource` | 백엔드 리소스 수직 슬라이스(schema→service→controller→route→test + types/api 연결) | "API 엔드포인트 추가", `/new-endpoint` |
| `add-prisma-model` | Prisma 모델 + 마이그레이션(@map/onDelete 규칙) | "DB 테이블/모델 추가" |
| `add-web-feature` | Next.js 기능(api→Query 훅→페이지/컴포넌트) | "웹 페이지/폼 구현" |
| `add-ui-component` | `packages/ui` shadcn 스타일 공용 컴포넌트 | "공용 버튼/모달 추가" |
| `convention-check` | CLAUDE.md 룰 대조 감사(읽기 전용) | "커밋 전 점검", `/convention-check` |

### 서브에이전트 (`.claude/agents/*.md`)
| 에이전트 | 역할 | 활용 스킬 |
|----------|------|-----------|
| `backend-engineer` | Express/Prisma 계층 구현 | add-api-resource, add-prisma-model |
| `frontend-engineer` | Next.js/Query/Zustand/shadcn | add-web-feature, add-ui-component |
| `test-writer` | Vitest 단위/통합 테스트 | — (prisma mock 패턴 내재화) |
| `convention-reviewer` | 룰 준수 리뷰(읽기 전용) | convention-check |

### 슬래시 커맨드 (`.claude/commands/*.md`)
| 커맨드 | 동작 |
|--------|------|
| `/new-endpoint <리소스>` | add-api-resource 기동 |
| `/convention-check [범위]` | 변경분 룰 감사 |
| `/fullstack-feature <기능>` | 백엔드+프론트 풀스택 오케스트레이션 |

---

## 5. 표준 작업 흐름

### 풀스택 기능 추가 (`/fullstack-feature`)
```
1. 계획        Plan 모드로 설계 → 승인 (비자명한 경우)
2. 태스크 추적  TaskCreate로 하위 작업 등록
3. 백엔드      backend-engineer
               └ add-prisma-model → add-api-resource
               └ packages/types · packages/api 로 계약 확정
4. 프론트      frontend-engineer  (계약 확정 후, 독립 부분은 병렬)
               └ add-web-feature · add-ui-component
5. 테스트      test-writer (서비스 단위 + 주요 통합)
6. 검증        convention-check / convention-reviewer
               + pnpm typecheck && lint && test
7. 커밋        기능 단위 한국어 커밋 (푸시는 요청 시)
```

### 단일 백엔드 리소스 (`/new-endpoint`)
`add-api-resource` 스킬 → 8단계 절차 → `convention-check` → 타입체크/테스트.

### 원칙 (CLAUDE.md "작업 진행 룰" 준수)
1. 복잡한 작업은 **계획 먼저**.
2. **태스크 추적**(pending→in_progress→completed).
3. 의존성 없는 작업은 **병렬 에이전트**.
4. 각 작업 완료 전 **룰 준수 검증**.
5. **커밋 단위**는 기능 단위.

---

## 6. 컨벤션 자동 강제

### 권한 allowlist (`.claude/settings.json`)
반복적으로 안전한 명령(pnpm/turbo/prisma 개발 명령, git 읽기·add·commit, 읽기 도구)을 allow에 추가해 승인 프롬프트를 줄인다. 위험 명령(`git push`, `rm -rf`, `.env` 읽기)은 deny로 차단한다.

> 이 파일 생성은 권한 확장이라 **사용자 직접 승인**이 필요하다(에이전트 자동 작성이 보안상 차단됨). 아래 7절 부록의 내용을 검토 후 적용 권장.

### Hooks (옵션, 향후)
- **PostToolUse(Edit|Write)**: 편집된 `.ts/.tsx`에 ESLint 자동 실행 → 즉시 피드백.
- **현재 보류 사유**: 레포에 **Prettier 설정 파일이 없다**(루트 `format` 스크립트는 있으나 config 부재). 먼저 `.prettierrc` 를 도입한 뒤 format/lint 훅을 활성화하는 것을 권장한다.

---

## 7. 로드맵

| 단계 | 내용 | 상태 |
|------|------|------|
| 1 | 스킬·에이전트·커맨드·기획서 구축 | ✅ 완료 |
| 2 | 공유 권한 settings.json 적용 | ⏳ 사용자 승인 대기(부록 참조) |
| 3 | Prettier 설정 도입 → format/lint 훅 활성화 | 📋 권장 |
| 4 | 미구현 비즈니스 기능을 표준 흐름으로 구현 | 📋 진행 예정 |
| 5 | 메모리(`known_issues`, `project_overview`) 현행화 | 📋 권장 |
| 6 | 대규모 작업 시 Workflow 오케스트레이션 도입(병렬 리뷰/마이그레이션) | 💡 향후 |

---

## 부록: 권장 `.claude/settings.json`

> 권한 확장은 보안 민감 작업이라 직접 검토 후 적용하세요.

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm install)", "Bash(pnpm --filter *)",
      "Bash(pnpm dev*)", "Bash(pnpm build*)", "Bash(pnpm lint*)",
      "Bash(pnpm typecheck*)", "Bash(pnpm test*)",
      "Bash(pnpm prisma:*)", "Bash(pnpm db:*)", "Bash(turbo *)",
      "Bash(npx prisma *)",
      "Bash(git status*)", "Bash(git diff*)", "Bash(git log*)",
      "Bash(git add *)", "Bash(git commit -m *)",
      "Read", "Grep", "Glob"
    ],
    "deny": [
      "Bash(git push*)", "Bash(rm -rf *)",
      "Read(.env)", "Read(.env.*)", "Read(**/.env)", "Read(**/.env.*)"
    ]
  }
}
```
