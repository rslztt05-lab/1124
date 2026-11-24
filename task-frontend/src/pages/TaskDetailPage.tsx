import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { api, errorMessage } from '../api.ts'
import { TASK_PRIORITIES, TASK_STATUSES, formatDate, type Task, type TaskInput } from '../types.ts'

function TaskDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState<Task | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  async function update(patch: Partial<TaskInput>) {
    try {
      setTask(await api.updateTask(id, patch))
    } catch (err) {
      setError(errorMessage(err))
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

      <dl className="detail">
        <dt>Project</dt>
        <dd>{task.project}</dd>
        <dt>Due date</dt>
        <dd>{formatDate(task.due)}</dd>
        <dt>Status</dt>
        <dd>
          <select value={task.status} onChange={(e) => update({ status: e.target.value as Task['status'] })}>
            {TASK_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </dd>
        <dt>Priority</dt>
        <dd>
          <select value={task.priority} onChange={(e) => update({ priority: e.target.value as Task['priority'] })}>
            {TASK_PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </dd>
        <dt>Description</dt>
        <dd>{task.description || <span className="muted">No description.</span>}</dd>
      </dl>

      <Link to="/tasks">← Back to My Tasks</Link>
    </>
  )
}

export default TaskDetailPage
