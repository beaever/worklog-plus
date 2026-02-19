# 환경 변수 설정 가이드

## 개요

WorkLog+ 프로젝트는 웹 애플리케이션과 모바일 애플리케이션으로 구성되어 있으며, 각각 환경 변수 설정이 필요합니다.

## 웹 애플리케이션 (Next.js)

### 설정 파일 생성

```bash
cd apps/web
cp .env.example .env.local
```

### 환경 변수 설명

| 변수명 | 설명 | 기본값 | 필수 여부 |
|--------|------|--------|-----------|
| `NEXT_PUBLIC_API_URL` | 백엔드 API 서버 주소 | `http://localhost:4000` | ✅ 필수 |
| `NODE_ENV` | 애플리케이션 실행 환경 | `development` | ✅ 필수 |

### 환경별 설정

#### 개발 환경 (Development)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NODE_ENV=development
```

#### 프로덕션 환경 (Production)
```env
NEXT_PUBLIC_API_URL=https://api.worklog-plus.com
NODE_ENV=production
```

## 모바일 애플리케이션 (React Native/Expo)

### 설정 파일 생성

```bash
cd apps/mobile
cp .env.example .env
```

### 환경 변수 설명

| 변수명 | 설명 | 기본값 | 필수 여부 |
|--------|------|--------|-----------|
| `EXPO_PUBLIC_WEB_URL` | WebView에서 로드할 웹 앱 주소 | `http://localhost:3001` | ✅ 필수 |
| `EXPO_PUBLIC_ENV` | 앱 실행 환경 | `development` | ✅ 필수 |

### 환경별 설정

#### 개발 환경 (Development)
```env
EXPO_PUBLIC_WEB_URL=http://localhost:3001
EXPO_PUBLIC_ENV=development
```

#### 프로덕션 환경 (Production)
```env
EXPO_PUBLIC_WEB_URL=https://worklog-plus.com
EXPO_PUBLIC_ENV=production
```

## 주의사항

1. **`.env.local` 및 `.env` 파일은 절대 Git에 커밋하지 마세요**
   - 이 파일들은 `.gitignore`에 포함되어 있습니다
   - 민감한 정보(API 키, 비밀번호 등)가 포함될 수 있습니다

2. **환경 변수 변경 후 재시작 필요**
   - Next.js: 개발 서버를 재시작해야 합니다
   - Expo: 앱을 다시 빌드하거나 재시작해야 합니다

3. **`NEXT_PUBLIC_` 접두사**
   - Next.js에서 클라이언트 사이드에서 접근 가능한 환경 변수는 반드시 `NEXT_PUBLIC_` 접두사가 필요합니다
   - 서버 사이드 전용 환경 변수는 접두사 없이 사용합니다

4. **`EXPO_PUBLIC_` 접두사**
   - Expo에서 앱 내에서 접근 가능한 환경 변수는 `EXPO_PUBLIC_` 접두사가 필요합니다

## 검증 방법

### 웹 애플리케이션
```bash
cd apps/web
pnpm dev
```

브라우저 콘솔에서 확인:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL);
```

### 모바일 애플리케이션
```bash
cd apps/mobile
pnpm start
```

앱 내에서 확인:
```javascript
console.log(process.env.EXPO_PUBLIC_WEB_URL);
```

## 문제 해결

### API 연결 실패
- `NEXT_PUBLIC_API_URL`이 올바르게 설정되었는지 확인
- 백엔드 서버가 실행 중인지 확인
- CORS 설정이 올바른지 확인

### 환경 변수가 undefined
- `.env.local` 또는 `.env` 파일이 올바른 위치에 있는지 확인
- 변수명에 오타가 없는지 확인
- 접두사(`NEXT_PUBLIC_`, `EXPO_PUBLIC_`)가 올바른지 확인
- 개발 서버를 재시작했는지 확인
