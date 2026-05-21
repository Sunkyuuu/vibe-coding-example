"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { AppUser } from "@/lib/types";

export function AppShell({
  profile,
  children,
}: {
  profile: Pick<AppUser, "name" | "department" | "email">;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 사이드바 (PC) */}
      <aside className="hidden md:flex md:flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 px-5 py-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
            T
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">업무 플래너</p>
            <p className="text-xs text-slate-400">Team Planner</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 text-sm">
          <a
            href="/tasks"
            className="flex items-center gap-3 rounded-lg bg-brand-50 px-3 py-2.5 font-medium text-brand-700"
          >
            <span>📋</span> 업무 리스트
          </a>
        </nav>

        <div className="mt-auto rounded-xl bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-800 truncate">{profile.name}</p>
          <p className="text-xs text-slate-500 truncate">{profile.department}</p>
          <p className="mt-0.5 text-[11px] text-slate-400 truncate">{profile.email}</p>
          <button
            onClick={handleLogout}
            className="mt-3 w-full rounded-md bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* 모바일 상단 헤더 */}
      <header className="md:hidden sticky top-0 z-20 flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center text-sm font-bold">
            T
          </div>
          <p className="text-sm font-semibold text-slate-900">업무 플래너</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
        >
          로그아웃
        </button>
      </header>

      <main className="md:pl-64 pb-24 md:pb-10">{children}</main>

      {/* 모바일 하단 탭바 */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-slate-200">
        <div className="grid grid-cols-1">
          <a
            href="/tasks"
            className="flex flex-col items-center justify-center py-3 text-xs font-medium text-brand-700"
          >
            <span className="text-lg leading-none">📋</span>
            <span className="mt-1">업무</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
