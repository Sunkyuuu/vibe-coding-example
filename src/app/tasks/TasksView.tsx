"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import {
  STATUS_LABEL,
  STATUS_OPTIONS,
  type Task,
  type TaskStatus,
} from "@/lib/types";

interface UserOption {
  id: string;
  name: string;
  department: string;
}

type StatusFilter = "all" | TaskStatus;
type AssigneeFilter = "all" | "none" | string;

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [tRes, uRes] = await Promise.all([
      fetch("/api/tasks", { cache: "no-store" }),
      fetch("/api/users", { cache: "no-store" }),
    ]);
    const tBody = await tRes.json();
    const uBody = await uRes.json();
    setTasks(tBody.tasks ?? []);
    setUsers(uBody.users ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (assigneeFilter === "none" && t.assignee_id) return false;
      if (assigneeFilter !== "all" && assigneeFilter !== "none" && t.assignee_id !== assigneeFilter)
        return false;
      return true;
    });
  }, [tasks, statusFilter, assigneeFilter]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditing(task);
    setModalOpen(true);
  }

  async function handleDelete(task: Task) {
    if (!confirm(`"${task.title}" 업무를 삭제하시겠습니까?`)) return;
    const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } else {
      alert("삭제에 실패했습니다.");
    }
  }

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      all: tasks.length,
      todo: 0,
      in_progress: 0,
      done: 0,
      delayed: 0,
    };
    for (const t of tasks) counts[t.status]++;
    return counts;
  }, [tasks]);

  return (
    <div className="px-4 sm:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">업무 리스트</h1>
          <p className="mt-1 text-sm text-slate-500">
            우리 부서의 모든 업무를 한 곳에서 관리하세요.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
        >
          <span className="text-lg leading-none">＋</span> 업무 등록
        </button>
      </div>

      {/* 필터 영역 */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-4 sm:p-5 mb-5">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">상태별</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
                label={`전체 (${statusCounts.all})`}
              />
              {STATUS_OPTIONS.map((s) => (
                <FilterChip
                  key={s}
                  active={statusFilter === s}
                  onClick={() => setStatusFilter(s)}
                  label={`${STATUS_LABEL[s]} (${statusCounts[s]})`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">담당자별</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={assigneeFilter === "all"}
                onClick={() => setAssigneeFilter("all")}
                label="전체"
              />
              <FilterChip
                active={assigneeFilter === "none"}
                onClick={() => setAssigneeFilter("none")}
                label="미지정"
              />
              {users.map((u) => (
                <FilterChip
                  key={u.id}
                  active={assigneeFilter === u.id}
                  onClick={() => setAssigneeFilter(u.id)}
                  label={u.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 업무 카드 그리드 */}
      {loading ? (
        <div className="text-center text-sm text-slate-400 py-20">불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl ring-1 ring-slate-100 py-16 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm text-slate-500">
            {tasks.length === 0 ? "등록된 업무가 없습니다. 첫 업무를 등록해보세요." : "조건에 맞는 업무가 없습니다."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={loadAll}
        task={editing}
        users={users}
      />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full px-3 py-1.5 text-xs font-medium transition " +
        (active
          ? "bg-brand-600 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200")
      }
    >
      {label}
    </button>
  );
}
