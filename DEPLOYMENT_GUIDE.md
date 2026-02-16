# 배포 가이드

## 🚀 자동 배포 설정

### Chromatic (Storybook)

#### 설정 완료 사항
- ✅ GitHub Actions 워크플로우 설정 (`.github/workflows/chromatic.yml`)
- ✅ 공식 `chromaui/action` 사용
- ✅ 모노레포 환경 최적화

#### 배포 트리거
- **main 브랜치 push**: 자동 배포
- **Pull Request**: 시각적 회귀 테스트

#### 워크플로우 동작
1. 코드 체크아웃 (전체 히스토리 포함)
2. pnpm 설치 및 캐싱
3. 의존성 설치 (`--frozen-lockfile`)
4. Storybook 빌드
5. Chromatic에 배포 및 시각적 테스트

#### 필요한 Secret
- `CHROMATIC_PROJECT_TOKEN`: Chromatic 프로젝트 토큰
  - 설정 위치: GitHub Repository Settings → Secrets and variables → Actions

---

### Vercel (Next.js Web App)

#### 설정 완료 사항
- ✅ `apps/web/vercel.json` 설정
- ✅ `.vercelignore` 설정
- ✅ 모노레포 빌드 명령어 최적화

#### Vercel 프로젝트 설정

##### 1. Root Directory
```
apps/web
```

##### 2. Build & Development Settings
- **Framework Preset**: Next.js
- **Build Command**: 자동 감지 (vercel.json에서 설정됨)
- **Output Directory**: `.next` (자동)
- **Install Command**: 자동 감지 (vercel.json에서 설정됨)

##### 3. Environment Variables
필요한 환경 변수:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080  # 개발
NEXT_PUBLIC_API_URL=https://api.yourdomain.com  # 프로덕션
```

##### 4. Git 설정
- **Production Branch**: `main`
- **Preview Branches**: `dev`, `feature/*`

---

## 🔧 배포 에러 해결

### Chromatic 에러

#### 문제 1: "No stories found"
**원인**: Storybook 빌드 디렉토리를 찾지 못함

**해결**: ✅ 완료
- `storybookBuildDir` 명시적으로 지정
- 빌드 단계를 별도로 분리

#### 문제 2: "Git history not found"
**원인**: Shallow clone으로 인한 히스토리 부족

**해결**: ✅ 완료
- `fetch-depth: 0` 추가

#### 문제 3: 의존성 설치 실패
**원인**: 모노레포 의존성 해결 문제

**해결**: ✅ 완료
- `--frozen-lockfile` 사용
- pnpm 캐싱 활성화

---

### Vercel 에러

#### 문제 1: "Build failed - Module not found"
**원인**: 모노레포 workspace 의존성 해결 실패

**해결**: ✅ 완료
- `vercel.json`에 올바른 빌드 명령어 설정
- 루트에서 빌드하도록 경로 수정

#### 문제 2: "Build timeout"
**원인**: 불필요한 앱들도 함께 빌드 시도

**해결**: ✅ 완료
- `.vercelignore`에 backend, mobile, storybook 제외
- `--filter` 옵션으로 web만 빌드

#### 문제 3: "Install command failed"
**원인**: pnpm 버전 불일치

**해결**: ✅ 완료
- `vercel.json`에 install 명령어 명시
- `--frozen-lockfile`로 정확한 버전 설치

---

## 📝 배포 체크리스트

### Chromatic 배포 전
- [ ] Storybook이 로컬에서 정상 빌드되는지 확인
  ```bash
  pnpm build --filter=@worklog-plus/storybook
  ```
- [ ] GitHub Secret에 `CHROMATIC_PROJECT_TOKEN` 설정
- [ ] main 브랜치에 머지 또는 PR 생성

### Vercel 배포 전
- [ ] Next.js 앱이 로컬에서 정상 빌드되는지 확인
  ```bash
  pnpm build --filter=@worklog-plus/web
  ```
- [ ] Vercel 프로젝트 생성 및 GitHub 연동
- [ ] Root Directory를 `apps/web`로 설정
- [ ] 환경 변수 설정 (`NEXT_PUBLIC_API_URL` 등)
- [ ] main 브랜치에 머지 또는 PR 생성

---

## 🛠️ 로컬 테스트

### Chromatic 로컬 테스트
```bash
# Storybook 빌드
pnpm build --filter=@worklog-plus/storybook

# Chromatic에 수동 배포 (선택사항)
pnpm chromatic
```

### Vercel 로컬 테스트
```bash
# Vercel CLI 설치
npm i -g vercel

# 로컬에서 Vercel 환경으로 빌드
cd apps/web
vercel build

# 로컬에서 프로덕션 빌드 테스트
pnpm build --filter=@worklog-plus/web
cd apps/web
pnpm start
```

---

## 🔍 배포 상태 확인

### Chromatic
- **대시보드**: https://www.chromatic.com/
- **빌드 상태**: GitHub Actions 탭에서 확인
- **시각적 테스트**: PR에 자동으로 코멘트 추가됨

### Vercel
- **대시보드**: https://vercel.com/dashboard
- **배포 로그**: Vercel 프로젝트 페이지에서 확인
- **프리뷰 URL**: PR에 자동으로 코멘트 추가됨

---

## 📚 참고 자료

### Chromatic
- [Chromatic 공식 문서](https://www.chromatic.com/docs/)
- [GitHub Action 설정](https://www.chromatic.com/docs/github-actions)
- [모노레포 설정](https://www.chromatic.com/docs/monorepos)

### Vercel
- [Vercel 공식 문서](https://vercel.com/docs)
- [모노레포 배포](https://vercel.com/docs/monorepos)
- [Next.js 배포](https://vercel.com/docs/frameworks/nextjs)

---

## 🐛 트러블슈팅

### 배포가 계속 실패하는 경우

1. **로컬에서 먼저 테스트**
   ```bash
   pnpm install
   pnpm typecheck
   pnpm build
   ```

2. **캐시 삭제 후 재시도**
   ```bash
   pnpm clean
   rm -rf node_modules
   pnpm install
   ```

3. **GitHub Actions 로그 확인**
   - Repository → Actions 탭
   - 실패한 워크플로우 클릭
   - 각 단계별 로그 확인

4. **Vercel 로그 확인**
   - Vercel Dashboard → Deployments
   - 실패한 배포 클릭
   - Build Logs 확인

---

## 🔄 배포 워크플로우

### 일반적인 배포 흐름
```
1. feature 브랜치에서 작업
   ↓
2. dev 브랜치로 PR (Squash Merge)
   → Vercel Preview 배포 (dev 환경)
   ↓
3. dev에서 테스트 및 검증
   ↓
4. main 브랜치로 PR (Merge Commit)
   → Chromatic 시각적 테스트
   → Vercel Preview 배포 (프로덕션 환경)
   ↓
5. main에 머지
   → Chromatic 프로덕션 배포
   → Vercel 프로덕션 배포
```

---

**작성일**: 2026-02-16
**최종 수정**: 2026-02-16
