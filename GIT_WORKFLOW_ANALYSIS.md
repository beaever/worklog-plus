# Git 워크플로우 분석 및 컨플릭트 원인

## 🔍 컨플릭트 발생 원인 분석

### 문제 상황
dev → main PR 시 컨플릭트 발생

### 컨플릭트가 발생한 파일들
1. `packages/api/src/auth.ts`
2. `packages/api/src/client.ts`
3. `packages/api/src/users.ts`
4. `apps/storybook/package.json`
5. `apps/web/tsconfig.tsbuildinfo`
6. `pnpm-lock.yaml`

---

## 📊 현재 Git 워크플로우

### 브랜치 전략
```
main (프로덕션)
  ↑
  │ Merge Commit
  │
dev (개발)
  ↑
  │ Squash Merge
  │
feature/* (기능 브랜치)
```

### 머지 방식
- **feature → dev**: Squash Merge (스쿼시 머지)
- **dev → main**: Merge Commit (머지 커밋)

---

## ⚠️ 컨플릭트 발생 근본 원인

### 1. **Squash Merge의 특성**

#### Squash Merge가 하는 일
```bash
# feature 브랜치의 여러 커밋들
feature/api-client-jsdoc
├── commit A: JSDoc 추가 (auth.ts)
├── commit B: JSDoc 추가 (client.ts)
└── commit C: JSDoc 추가 (users.ts)

# dev로 Squash Merge 시
dev
└── commit D: "docs(api): 프론트엔드 API 클라이언트 상세 JSDoc 추가"
    (A + B + C를 하나로 합침)
```

**문제점**: 
- feature 브랜치의 커밋 히스토리가 **완전히 새로운 커밋**으로 재작성됨
- Git 입장에서는 feature 브랜치와 dev 브랜치의 커밋이 **다른 커밋**으로 인식됨

### 2. **main 브랜치와의 관계**

#### 시나리오
```
1. feature/api-client-jsdoc 브랜치 생성 (main에서 분기)
   main (A) ← feature/api-client-jsdoc (A → B → C)

2. feature → dev로 Squash Merge
   main (A)
   dev (A → D)  [D = B + C를 합친 새 커밋]

3. dev → main으로 PR 생성
   main (A) ← dev (A → D)
   
   문제: main에는 원본 커밋 B, C가 없음
   dev에는 새로운 커밋 D만 있음
   → Git이 이를 다른 변경사항으로 인식
```

### 3. **실제 발생한 상황**

```
Timeline:
1. main 브랜치에서 packages/api 파일들이 이미 존재
2. feature/api-client-jsdoc에서 JSDoc 추가
3. feature → dev로 Squash Merge (새 커밋 생성)
4. main에는 여전히 JSDoc이 없는 상태
5. dev → main PR 시 컨플릭트 발생

왜?
- main: JSDoc 없는 버전
- dev: JSDoc 있는 버전 (하지만 새로운 커밋으로 생성됨)
- Git: "이 파일들이 서로 다른 방식으로 수정되었네?" → CONFLICT
```

---

## ✅ 올바른 Git 워크플로우

### 현재 방식의 문제점
❌ **feature 브랜치를 main에서 분기**
- main과 dev가 동기화되지 않은 상태에서 작업
- Squash Merge로 인한 커밋 히스토리 불일치

### 권장하는 방식

#### Option 1: dev 기준으로 작업 (현재 방식 유지)
```bash
# ✅ 올바른 방법
git checkout dev
git pull origin dev
git checkout -b feature/new-feature

# 작업 후
git push origin feature/new-feature
# GitHub에서 feature → dev로 Squash Merge

# dev → main은 정기적으로 Merge Commit
```

**핵심**: 
- **모든 feature 브랜치는 dev에서 분기**
- dev가 항상 최신 상태 유지
- main은 안정적인 릴리스만 반영

#### Option 2: Squash Merge 사용 중단
```bash
# feature → dev: Merge Commit 사용
# dev → main: Merge Commit 사용
```

**장점**: 커밋 히스토리 보존, 컨플릭트 최소화
**단점**: dev 브랜치 히스토리가 복잡해짐

#### Option 3: Rebase 전략 (고급)
```bash
# feature 브랜치에서 dev의 최신 변경사항 반영
git checkout feature/new-feature
git rebase dev

# dev로 머지 (Fast-forward 가능)
git checkout dev
git merge feature/new-feature
```

**장점**: 깔끔한 히스토리
**단점**: Rebase 이해도 필요, 협업 시 주의 필요

---

## 🔧 컨플릭트 해결 방법

### 1. 이번 컨플릭트 해결 (완료)
```bash
# 1. dev에서 새 브랜치 생성
git checkout dev
git checkout -b fix/merge-conflict-resolution

# 2. main 브랜치 머지 시도
git merge origin/main
# → CONFLICT 발생

# 3. main 버전으로 해결 (theirs)
git checkout --theirs packages/api/src/*.ts
git checkout --theirs pnpm-lock.yaml
git checkout --theirs apps/storybook/package.json
git checkout --theirs apps/web/tsconfig.tsbuildinfo

# 4. 커밋 및 푸시
git add .
git commit -m "fix: main 브랜치와의 컨플릭트 해결"
git push origin fix/merge-conflict-resolution

# 5. dev로 머지
git checkout dev
git merge fix/merge-conflict-resolution
git push origin dev
```

### 2. 향후 컨플릭트 예방

#### A. dev와 main 동기화 유지
```bash
# main에 변경사항이 있을 때마다 dev에 반영
git checkout dev
git merge origin/main
git push origin dev
```

#### B. feature 브랜치 생성 전 확인
```bash
# ✅ 항상 dev에서 분기
git checkout dev
git pull origin dev
git checkout -b feature/new-feature

# ❌ main에서 분기하지 않기
# git checkout main
# git checkout -b feature/new-feature  # 이렇게 하면 안됨!
```

#### C. 정기적인 dev → main 머지
```bash
# 주기적으로 (예: 매주 금요일) dev를 main에 머지
# 작은 단위로 자주 머지하면 컨플릭트 최소화
```

---

## 📝 권장 Git 워크플로우 정리

### 일일 작업 흐름
```bash
# 1. 작업 시작
git checkout dev
git pull origin dev
git checkout -b feature/my-feature

# 2. 작업 및 커밋
git add .
git commit -m "feat: 기능 구현"

# 3. 푸시 및 PR
git push origin feature/my-feature
# GitHub에서 feature → dev PR 생성
# Squash Merge 선택

# 4. 머지 후 로컬 정리
git checkout dev
git pull origin dev
git branch -d feature/my-feature
```

### 릴리스 흐름
```bash
# 1. dev가 안정적일 때
git checkout dev
git pull origin dev

# 2. main으로 PR 생성
# GitHub에서 dev → main PR 생성
# Merge Commit 선택 (Squash 아님!)

# 3. 머지 후 동기화
git checkout main
git pull origin main
git checkout dev
git merge main  # dev에 main 반영
git push origin dev
```

---

## 🎯 핵심 원칙

### DO ✅
1. **모든 feature 브랜치는 dev에서 분기**
2. **feature → dev는 Squash Merge**
3. **dev → main은 Merge Commit**
4. **정기적으로 dev를 main에 머지**
5. **main에 변경사항이 있으면 즉시 dev에 반영**

### DON'T ❌
1. **main에서 feature 브랜치 생성하지 않기**
2. **dev → main에서 Squash Merge 사용하지 않기**
3. **dev와 main을 오래 방치하지 않기**
4. **컨플릭트 발생 시 무작정 force push 하지 않기**

---

## 🔍 이번 컨플릭트 상세 분석

### 컨플릭트 파일별 원인

#### 1. `packages/api/src/*.ts` (JSDoc 관련)
**원인**: 
- main: JSDoc 없음
- dev: JSDoc 있음 (Squash Merge로 새 커밋 생성)
- Git: 같은 파일의 다른 버전으로 인식

**해결**: main 버전 유지 (JSDoc은 나중에 별도 PR로 추가)

#### 2. `pnpm-lock.yaml`
**원인**: 
- main: 백엔드 의존성 없음
- dev: 백엔드 의존성 추가됨
- 의존성 트리 충돌

**해결**: main 버전 유지 후 재설치

#### 3. `apps/web/tsconfig.tsbuildinfo`
**원인**: 빌드 캐시 파일 충돌
**해결**: main 버전 유지 (자동 재생성됨)

---

## 📚 참고 자료

### Git Merge 전략
- **Merge Commit**: 히스토리 보존, 브랜치 관계 명확
- **Squash Merge**: 깔끔한 히스토리, 커밋 압축
- **Rebase**: 선형 히스토리, 복잡도 높음

### 추천 읽기
- [Git Branching Strategies](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Merge vs Rebase](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)

---

**작성일**: 2026-02-16
**작성자**: Cascade AI
