# WorkLog+ API 테스트 가이드

## 서버 실행

```bash
cd apps/backend
pnpm dev
```

서버 주소: `http://localhost:8080`

---

## 인증 API

### 1. 회원가입

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "새로운 사용자"
  }'
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "newuser@example.com",
      "name": "새로운 사용자",
      "role": "USER"
    }
  }
}
```

### 2. 로그인

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@worklog.com",
    "password": "admin123!@#"
  }'
```

**테스트 계정:**
- 시스템 관리자: `admin@worklog.com` / `admin123!@#`
- 프로젝트 매니저: `manager@worklog.com` / `manager123!@#`
- 일반 사용자 1: `user1@worklog.com` / `user123!@#`
- 일반 사용자 2: `user2@worklog.com` / `user123!@#`

### 3. 현재 사용자 정보 조회

```bash
# 먼저 로그인하여 토큰 받기
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 4. 토큰 갱신

```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

### 5. 로그아웃

```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

---

## 헬스 체크

```bash
curl http://localhost:8080/health
```

**응답:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-16T10:44:39.379Z",
  "environment": "development"
}
```

---

## Postman Collection

### 환경 변수 설정

```
API_URL: http://localhost:8080
ACCESS_TOKEN: (로그인 후 자동 설정)
REFRESH_TOKEN: (로그인 후 자동 설정)
```

### 자동 토큰 설정 스크립트

로그인 요청의 Tests 탭에 추가:

```javascript
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.environment.set("ACCESS_TOKEN", response.data.accessToken);
  pm.environment.set("REFRESH_TOKEN", response.data.refreshToken);
}
```

---

## 에러 응답 예시

### 400 Bad Request (검증 실패)

```json
{
  "success": false,
  "error": "입력 데이터가 유효하지 않습니다",
  "details": [
    {
      "field": "email",
      "message": "유효한 이메일 주소를 입력해주세요"
    },
    {
      "field": "password",
      "message": "비밀번호는 최소 8자 이상이어야 합니다"
    }
  ]
}
```

### 401 Unauthorized (인증 실패)

```json
{
  "success": false,
  "error": "이메일 또는 비밀번호가 올바르지 않습니다"
}
```

### 409 Conflict (중복)

```json
{
  "success": false,
  "error": "이미 사용 중인 이메일입니다"
}
```

---

## 다음 구현 예정 API

- [ ] 사용자 API (`/api/users`)
- [ ] 프로젝트 API (`/api/projects`)
- [ ] 업무일지 API (`/api/worklogs`)
- [ ] 대시보드 API (`/api/dashboard`)
