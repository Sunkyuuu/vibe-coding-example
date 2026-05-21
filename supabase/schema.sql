-- =====================================================================
-- 부서 공동 업무 플래너 - 데이터베이스 스키마 및 RLS 정책
-- =====================================================================

-- 확장
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- users 테이블
-- ---------------------------------------------------------------------
create table if not exists public.users (
  id           uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email        text not null,
  name         text not null,
  department   text not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists users_auth_user_id_idx on public.users(auth_user_id);

-- ---------------------------------------------------------------------
-- tasks 테이블
-- ---------------------------------------------------------------------
create table if not exists public.tasks (
  id           uuid primary key default gen_random_uuid(),
  assignee_id  uuid references public.users(id) on delete set null,
  title        text not null,
  content      text,
  deadline     timestamptz,
  status       text not null default 'todo'
    check (status in ('todo','in_progress','done','delayed')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists tasks_assignee_id_idx on public.tasks(assignee_id);
create index if not exists tasks_status_idx      on public.tasks(status);
create index if not exists tasks_deadline_idx    on public.tasks(deadline);

-- ---------------------------------------------------------------------
-- updated_at 자동 갱신 트리거
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- RLS 활성화 및 권한 부여
-- ---------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.tasks enable row level security;

-- users 정책: 로그인한 사용자는 모든 부서원 정보를 조회/등록 가능,
-- 본인 행만 수정/삭제 가능
drop policy if exists "users_select_authenticated" on public.users;
create policy "users_select_authenticated"
  on public.users for select
  to authenticated
  using (true);

drop policy if exists "users_insert_self" on public.users;
create policy "users_insert_self"
  on public.users for insert
  to authenticated
  with check (auth_user_id = auth.uid());

drop policy if exists "users_update_self" on public.users;
create policy "users_update_self"
  on public.users for update
  to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

drop policy if exists "users_delete_self" on public.users;
create policy "users_delete_self"
  on public.users for delete
  to authenticated
  using (auth_user_id = auth.uid());

-- tasks 정책: 로그인한 사용자는 모든 업무 CRUD 가능 (공동 업무 플래너)
drop policy if exists "tasks_select_authenticated" on public.tasks;
create policy "tasks_select_authenticated"
  on public.tasks for select
  to authenticated
  using (true);

drop policy if exists "tasks_insert_authenticated" on public.tasks;
create policy "tasks_insert_authenticated"
  on public.tasks for insert
  to authenticated
  with check (true);

drop policy if exists "tasks_update_authenticated" on public.tasks;
create policy "tasks_update_authenticated"
  on public.tasks for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "tasks_delete_authenticated" on public.tasks;
create policy "tasks_delete_authenticated"
  on public.tasks for delete
  to authenticated
  using (true);

-- 권한 부여 (RLS와 함께 동작)
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.users to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
