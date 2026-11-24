import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { api, errorMessage } from '../api.ts'
import PriorityBadge from '../components/PriorityBadge.tsx'
import StatusBadge from '../components/StatusBadge.tsx'
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  formatDate,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '../types.ts'

const SUMMARY_LABEL: Record<TaskStatus, string> = {
  'To Do': 'To Do',
  'In Progress': 'In Progress',
  Complete: 'Completed',
  Overdue: 'Overdue',
}

function TasksPage() {
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [project, setProject] = useState('All')
  const [status, setStatus] = useState<TaskStatus | 'All'>('All')
  const [priority, setPriority] = useState<TaskPriority | 'All'>('All')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let ignore = false
    api
      .listTasks()
      .then((data) => {
        if (!ignore) setTasks(data)
      })
      .catch((err) => {
        if (!ignore) setError(errorMessage(err))
      })
    return () => {
      ignore = true
    }
  }, [])

  const projects = useMemo(() => [...new Set((tasks ?? []).map((t) => t.project))].sort(), [tasks])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (tasks ?? []).filter(
      (t) =>
        (status === 'All' || t.status === status) &&
        (priority === 'All' || t.priority === priority) &&
        (project === 'All' || t.project === project) &&
        (q === '' || `${t.title} ${t.project}`.toLowerCase().includes(q)),
    )
  }, [tasks, query, status, priority, project])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pages)
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize)

  function reset<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v)
      setPage(1)
    }
  }

  if (error) return <p className="error">{error}</p>
  if (!tasks) return <p className="muted">Loading…</p>

  return (
    <>
      <div className="page-head">
        <h1>My Tasks</h1>
        <Link to="/tasks/new" className="btn-primary">+ Create New Task</Link>
      </div>

      <div className="toolbar">
        <select aria-label="Project" value={project} onChange={(e) => reset(setProject)(e.target.value)}>
          <option value="All">All Project</option>
          {projects.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select aria-label="Status" value={status} onChange={(e) => reset(setStatus)(e.target.value as TaskStatus | 'All')}>
          <option value="All">All Status</option>
          {TASK_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          aria-label="Priority"
          value={priority}
          onChange={(e) => reset(setPriority)(e.target.value as TaskPriority | 'All')}
        >
          <option value="All">All Priority</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <input
          className="search"
          placeholder="Search task / project"
          value={query}
          onChange={(e) => reset(setQuery)(e.target.value)}
        />
      </div>

      <div className="summary">
        {TASK_STATUSES.map((s) => (
          <button
            key={s}
            className={status === s ? 'summary-item on' : 'summary-item'}
            onClick={() => reset(setStatus)(status === s ? 'All' : s)}
          >
            <span>{SUMMARY_LABEL[s]}</span>
            <b>{tasks.filter((t) => t.status === s).length}</b>
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Project</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Priority</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => (
              <tr key={t.id}>
                <td><Link to={`/tasks/${t.id}`}>{t.title}</Link></td>
                <td>
                  <span className="logo" aria-hidden="true">{t.project[0]}</span>
                  {t.project}
                </td>
                <td>{formatDate(t.due)}</td>
                <td><StatusBadge status={t.status} /></td>
                <td><PriorityBadge priority={t.priority} /></td>
                <td className="more"><Link to={`/tasks/${t.id}`} aria-label={`Open ${t.title}`}>⋮</Link></td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">No tasks match these filters. Clear a filter or create a task.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="foot">
        <div className="pager">
          <button onClick={() => setPage(Math.max(1, current - 1))} disabled={current === 1} aria-label="Previous page">‹</button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button key={n} className={n === current ? 'on' : ''} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button onClick={() => setPage(Math.min(pages, current + 1))} disabled={current === pages} aria-label="Next page">›</button>
        </div>
        <span>Total {filtered.length} Data</span>
        <select
          aria-label="Page size"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setPage(1)
          }}
        >
          {[5, 10, 20].map((n) => (
            <option key={n} value={n}>Show {n} Data</option>
          ))}
        </select>
      </footer>
    </>
  )
}

export default TasksPage
