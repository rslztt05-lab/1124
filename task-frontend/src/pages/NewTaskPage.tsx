import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { api, errorMessage } from '../api.ts'
import { TASK_PRIORITIES, TASK_STATUSES, type TaskInput } from '../types.ts'

const EMPTY: TaskInput = {
  title: '',
  project: '',
  due: '',
  status: 'To Do',
  priority: 'Medium',
  description: '',
}

function NewTaskPage() {
  const navigate = useNavigate()
  const [value, setValue] = useState<TaskInput>(EMPTY)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof TaskInput>(key: K, v: TaskInput[K]) {
    setValue((prev) => ({ ...prev, [key]: v }))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const task = await api.createTask(value)
      navigate(`/tasks/${task.id}`)
    } catch (err) {
      setError(errorMessage(err))
      setBusy(false)
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>New Task</h1>
      </div>
      <form className="form" onSubmit={submit}>
        <label>
          Task title
          <input required value={value.title} onChange={(e) => set('title', e.target.value)} />
        </label>
        <label>
          Project
          <input required value={value.project} onChange={(e) => set('project', e.target.value)} />
        </label>
        <div className="form-row">
          <label>
            Due date
            <input type="date" required value={value.due} onChange={(e) => set('due', e.target.value)} />
          </label>
          <label>
            Status
            <select value={value.status} onChange={(e) => set('status', e.target.value as TaskInput['status'])}>
              {TASK_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select value={value.priority} onChange={(e) => set('priority', e.target.value as TaskInput['priority'])}>
              {TASK_PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Description
          <textarea rows={4} value={value.description} onChange={(e) => set('description', e.target.value)} />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn-primary" disabled={busy}>
          {busy ? 'Saving…' : 'Create task'}
        </button>
      </form>
    </>
  )
}

export default NewTaskPage
