import type { Task, TaskInput, User } from './types.ts'

/*
 * Түр зуурын "backend": localStorage дээр ажиллана.
 * Жинхэнэ сервертэй холбохдоо доорх функцүүдийн дотор fetch() бичээд,
 * гадна талын гарын үсгийг (signature) өөрчлөхгүй орхино.
 */

const TASKS_KEY = 'atlas.tasks'
const USER_KEY = 'atlas.user'

const seed: Task[] = [
  ['Design System Audit', 'Amazon Dashboard', '2026-01-10', 'Complete', 'High'],
  ['Landing Page Copywriting', 'Microsoft', '2026-01-12', 'Complete', 'High'],
  ['Mobile App Redesign', 'Apple', '2026-01-14', 'Complete', 'High'],
  ['Key Metrics Layout', 'Facebook Dashboard', '2026-01-16', 'Overdue', 'Low'],
  ['Wireframe v2 Upload', 'Netflix', '2026-01-17', 'In Progress', 'Low'],
  ['QA Testing', 'Nvidia', '2026-01-17', 'In Progress', 'Low'],
  ['Prototype Review', 'Behance', '2026-01-18', 'In Progress', 'Medium'],
  ['Copywriting Review', 'Google Dashboard', '2026-01-24', 'To Do', 'Medium'],
  ['UX Audit', 'Grab Map App', '2026-01-25', 'To Do', 'Medium'],
  ['Review Landing Page', 'Lego', '2026-01-04', 'Complete', 'Medium'],
  ['Onboarding Flow', 'Spotify', '2026-01-28', 'To Do', 'High'],
  ['Icon Set Cleanup', 'Figma', '2026-01-30', 'Complete', 'Low'],
].map(([title, project, due, status, priority], i) => ({
  id: String(i + 1),
  title,
  project,
  due,
  status,
  priority,
  description: '',
})) as Task[]

function load(): Task[] {
  const raw = localStorage.getItem(TASKS_KEY)
  if (raw) return JSON.parse(raw) as Task[]
  localStorage.setItem(TASKS_KEY, JSON.stringify(seed))
  return seed
}

function save(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

function wait<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function fail(message: string, ms = 150): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms))
}

export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Something went wrong. Try again.'
}

export const api = {
  listTasks(): Promise<Task[]> {
    return wait(load())
  },

  getTask(id: string): Promise<Task> {
    const task = load().find((t) => t.id === id)
    return task ? wait(task) : fail('Task not found.')
  },

  createTask(input: TaskInput): Promise<Task> {
    const task: Task = { ...input, id: crypto.randomUUID() }
    save([task, ...load()])
    return wait(task)
  },

  updateTask(id: string, patch: Partial<TaskInput>): Promise<Task> {
    const tasks = load()
    const idx = tasks.findIndex((t) => t.id === id)
    if (idx === -1) return fail('Task not found.')
    tasks[idx] = { ...tasks[idx], ...patch }
    save(tasks)
    return wait(tasks[idx])
  },

  deleteTask(id: string): Promise<void> {
    save(load().filter((t) => t.id !== id))
    return wait(undefined)
  },

  currentUser(): User | null {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  },

  login(email: string, password: string): Promise<User> {
    if (!email.includes('@')) return fail('Enter a valid email address.')
    if (password.length < 4) return fail('Password must be at least 4 characters.')
    const stored = api.currentUser()
    const user: User =
      stored && stored.email === email
        ? stored
        : { name: email.split('@')[0], email, role: 'Lead Product' }
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return wait(user)
  },

  register(name: string, email: string, password: string): Promise<User> {
    if (!name.trim()) return fail('Enter your name.')
    if (!email.includes('@')) return fail('Enter a valid email address.')
    if (password.length < 4) return fail('Password must be at least 4 characters.')
    const user: User = { name: name.trim(), email, role: 'Lead Product' }
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return wait(user)
  },

  updateUser(patch: Partial<User>): Promise<User> {
    const current = api.currentUser()
    if (!current) return fail('You are signed out.')
    const user = { ...current, ...patch }
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return wait(user)
  },

  logout() {
    localStorage.removeItem(USER_KEY)
  },
}
