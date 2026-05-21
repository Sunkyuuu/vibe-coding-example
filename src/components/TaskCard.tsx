"use client";

import { STATUS_BADGE, STATUS_LABEL, type Task } from "@/lib/types";

export function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const deadlineText = task.deadline
    ? new Date(task.deadline).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "마감 미정";

  const overdue =
    task.deadline &&
    task.status !== "done" &&
    new Date(task.deadline).getTime() < Date.now();

  return (
    <div className="group rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm hover:shadow-md transition p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900 line-clamp-2">{task.title}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[task.status]}`}>
          {STATUS_LABEL[task.status]}
        </span>
      </div>

      {task.content && (
        <p className="mt-2 text-sm text-slate-600 line-clamp-3 whitespace-pre-line">{task.content}</p>
      )}

      <div className="mt-4 space-y-1.5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span>👤</span>
          <span>
            {task.assignee ? (
              <>
                <span className="font-medium text-slate-700">{task.assignee.name}</span>
                <span className="text-slate-400"> · {task.assignee.department}</span>
              </>
            ) : (
              <span className="text-slate-400">담당자 미지정</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>⏰</span>
          <span className={overdue ? "text-rose-600 font-medium" : ""}>
            {deadlineText}
            {overdue && " (지난 마감)"}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(task)}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(task)}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
