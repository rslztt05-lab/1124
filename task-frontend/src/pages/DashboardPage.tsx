import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api, errorMessage } from '../api.ts'
import { useAuth } from '../auth/AuthContext.ts'
import StatCards from '../components/StatCards.tsx'
import { formatDate, type Task } from '../types.ts'

function DashboardPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  if (error) return <p className="error">{error}</p>
  if (!tasks) return <p className="muted">Loading…</p>

  const upcoming = [...tasks]
    .filter((t) => t.status !== 'Complete')
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 5)

  return (
    <>
      <div className="page-head">
        <h1>Hi, {user?.name}</h1>
        <Link to="/tasks/new" className="btn-primary">+ Create New Task</Link>
      </div>

      <StatCards tasks={tasks} active="All" onSelect={() => undefined} />

      <h2>Next up</h2>
      {upcoming.length === 0 ? (
        <p className="muted">Nothing left to do. Create a task to get started.</p>
      ) : (
        <ul className="list">
          {upcoming.map((t) => (
            <li key={t.id}>
              <Link to={`/tasks/${t.id}`}>{t.title}</Link>
              <span className="muted">{t.project}</span>
              <span className="muted">{formatDate(t.due)}</span>
              <span className={`badge badge-${t.status.replace(' ', '').toLowerCase()}`}>
                <i aria-hidden="true" />
                {t.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default DashboardPage
