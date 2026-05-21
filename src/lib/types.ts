export type TaskStatus = "todo" | "in_progress" | "done" | "delayed";

export interface AppUser {
  id: string;
  auth_user_id: string;
  email: string;
  name: string;
  department: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  assignee_id: string | null;
  title: string;
  content: string | null;
  deadline: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  assignee?: Pick<AppUser, "id" | "name" | "department"> | null;
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "할 일",
  in_progress: "진행 중",
  done: "완료",
  delayed: "지연",
};

export const STATUS_BADGE: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  in_progress: "bg-brand-100 text-brand-700 ring-1 ring-brand-200",
  done: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  delayed: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
};

export const STATUS_OPTIONS: TaskStatus[] = ["todo", "in_progress", "done", "delayed"];
