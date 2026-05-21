# 부서 공동 업무 플래너

부서원들이 함께 사용하는 웹 기반 업무 관리 시스템입니다.

## 기술 스택

- **Frontend / Backend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (화이트 + 블루 톤)
- **Database / Auth**: Supabase (PostgreSQL, Supabase Auth + Google OAuth)
- **배포**: Vercel

## 주요 기능

- Google OAuth 기반 로그인
- 최초 로그인 시 이름·부서 입력 (취소 시 자동 로그아웃)
- 업무 등록 / 조회 / 수정 / 삭제
- 담당자, 상태(todo, in_progress, done, delayed)별 필터링
- PC: 좌측 사이드바 / 모바일: 하단 탭 바 반응형 레이아웃

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사해 `.env.local`을 만든 뒤 값을 채워주세요.

```bash
cp .env.example .env.local
```

| 키 | 설명 |
| -- | -- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 키 |
| `NEXT_PUBLIC_SITE_URL` | 배포 URL (로컬은 `http://localhost:3000`) |

### 3. Supabase 설정

1. Supabase 대시보드 → SQL Editor에서 `supabase/schema.sql`을 실행
2. Authentication → Providers에서 Google 활성화
3. Authentication → URL Configuration의 Redirect URL에 다음 추가
   - `http://localhost:3000/auth/callback`
   - `https://<배포 도메인>/auth/callback`

### 4. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000` 접속.

## 데이터베이스 구조

`supabase/schema.sql`에 정의되어 있습니다.

- `users`: 사용자 프로필 (auth.users와 1:1, Google 식별자 연결)
- `tasks`: 업무 (담당자 FK, 상태 체크 제약)
- 모든 테이블에 RLS 활성화 및 인증 사용자 권한 부여 SQL 포함

## 디렉터리 구조

```
src/
  app/
    api/            # Next.js API Routes (tasks / users)
    auth/callback/  # Supabase OAuth 콜백
    login/          # 로그인 페이지
    onboarding/     # 최초 사용자 정보 입력
    tasks/          # 업무 리스트 (메인)
  components/       # AppShell, TaskCard, TaskModal
  lib/
    supabase/       # 브라우저/서버/미들웨어 클라이언트
    types.ts        # 공통 타입 및 상태 라벨
  middleware.ts     # Supabase 세션 갱신 미들웨어
supabase/
  schema.sql        # DB 스키마 + RLS 정책 + 권한 부여
```
