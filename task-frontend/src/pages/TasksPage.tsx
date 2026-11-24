import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { api, errorMessage } from '../api.ts'
import StatCards from '../components/StatCards.tsx'
import TaskTable from '../components/TaskTable.tsx'
import { TASK_PRIORITIES, TASK_STATUSES, type Task, type TaskPriority, type TaskStatus } from '../types.ts'

function TasksPage() {
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useSearchParams()
  const [project, setProject] = useState('All')
  const [status, setStatus] = useState<TaskStatus | 'All'>('All')
  const [priority, setPriority] = useState<TaskPriority | 'All'>('All')

  const query = params.get('q') ?? ''

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
        (project === 'All' || t.project === project) &&
        (status === 'All' || t.status === status) &&
        (priority === 'All' || t.priority === priority) &&
        (q === '' || `${t.title} ${t.project}`.toLowerCase().includes(q)),
    )
  }, [tasks, project, status, priority, query])

  if (error) return <p className="error">{error}</p>
  if (!tasks) return <p className="muted">Loading…</p>

  return (
    <>
      <div className="page-head">
        <h1>My Tasks</h1>
        <Link to="/tasks/new" className="btn-primary">+ Create New Task</Link>
      </div>

      <div className="toolbar">
        <select aria-label="Project" value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="All">All Project</option>
          {projects.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus | 'All')}>
          <option value="All">All Status</option>
          {TASK_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select aria-label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority | 'All')}>
          <option value="All">All Priority</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <input
          className="search"
          placeholder="Search task / project"
          value={query}
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
        />
      </div>

      <StatCards tasks={tasks} active={status} onSelect={setStatus} />

      {/* key өөрчлөгдөхөд хүснэгт 1-р хуудас руу буцна */}
      <TaskTable key={`${project}|${status}|${priority}|${query}`} tasks={filtered} />
    </>
  )
}

export default TasksPage
