import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { api, errorMessage } from '../api.ts'
import TaskForm from '../components/TaskForm.tsx'
import type { Task, TaskInput } from '../types.ts'

function TaskDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState<Task | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let ignore = false
    api
      .getTask(id)
      .then((data) => {
        if (!ignore) setTask(data)
      })
      .catch((err) => {
        if (!ignore) setError(errorMessage(err))
      })
    return () => {
      ignore = true
    }
  }, [id])

  async function save(value: TaskInput) {
    setBusy(true)
    setSaved(false)
    try {
      setTask(await api.updateTask(id, value))
      setSaved(true)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!window.confirm('Delete this task? This cannot be undone.')) return
    await api.deleteTask(id)
    navigate('/tasks')
  }

  if (error) {
    return (
      <>
        <p className="error">{error}</p>
        <Link to="/tasks">Back to My Tasks</Link>
      </>
    )
  }
  if (!task) return <p className="muted">Loading…</p>

  return (
    <>
      <div className="page-head">
        <h1>{task.title}</h1>
        <button className="btn-danger" onClick={remove}>Delete task</button>
      </div>
      {saved && <p className="ok" role="status">Changes saved.</p>}
      <TaskForm key={task.id + task.status + task.title} initial={task} submitLabel="Save changes" busy={busy} onSubmit={save} />
    </>
  )
}

export default TaskDetailPage
