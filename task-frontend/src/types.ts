export const TASK_STATUSES = ['To Do', 'In Progress', 'Complete', 'Overdue'] as const
export const TASK_PRIORITIES = ['High', 'Medium', 'Low'] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export interface Task {
  id: string
  title: string
  project: string
  due: string // YYYY-MM-DD
  status: TaskStatus
  priority: TaskPriority
  description: string
}

export type TaskInput = Omit<Task, 'id'>

export interface User {
  name: string
  email: string
  role: string
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
