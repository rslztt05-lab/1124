import { useState } from 'react'
import { useNavigate } from 'react-router'
import { api, errorMessage } from '../api.ts'
import TaskForm from '../components/TaskForm.tsx'
import type { TaskInput } from '../types.ts'

function NewTaskPage() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function create(value: TaskInput) {
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
      {error && <p className="error" role="alert">{error}</p>}
      <TaskForm submitLabel="Create task" busy={busy} onSubmit={create} />
    </>
  )
}

export default NewTaskPage
