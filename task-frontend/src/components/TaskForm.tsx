import { useState } from 'react'
import type { FormEvent } from 'react'
import { TASK_PRIORITIES, TASK_STATUSES } from '../types.ts'
import type { TaskInput } from '../types.ts'

interface Props {
    initial?: Partial<TaskInput>
    submitLabel: string
    busy?: boolean
    onSubmit: (input: TaskInput) => void | Promise<void>
}

const today = () => new Date().toISOString().slice(0, 10)

function TaskForm({ initial, submitLabel, busy = false, onSubmit }: Props) {
    const [title, setTitle] = useState(initial?.title ?? '')
    const [project, setProject] = useState(initial?.project ?? '')
    const [due, setDue] = useState(initial?.due ?? today())
    const [status, setStatus] = useState<TaskInput['status']>(initial?.status ?? 'To Do')
    const [priority, setPriority] = useState<TaskInput['priority']>(initial?.priority ?? 'Medium')
    const [description, setDescription] = useState(initial?.description ?? '')

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        onSubmit({
            title: title.trim(),
            project: project.trim(),
            due,
            status,
            priority,
            description: description.trim(),
        })
    }

    const field = { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 } as const

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
            <label style={field}>
                Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>

            <label style={field}>
                Project
                <input value={project} onChange={(e) => setProject(e.target.value)} />
            </label>

            <label style={field}>
                Due date
                <input type="date" value={due} onChange={(e) => setDue(e.target.value)} required />
            </label>

            <label style={field}>
                Status
                <select value={status} onChange={(e) => setStatus(e.target.value as TaskInput['status'])}>
                    {TASK_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </label>

            <label style={field}>
                Priority
                <select value={priority} onChange={(e) => setPriority(e.target.value as TaskInput['priority'])}>
                    {TASK_PRIORITIES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </label>

            <label style={field}>
                Description
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>

            <button type="submit" disabled={busy}>
                {busy ? 'Saving...' : submitLabel}
            </button>
        </form>
    )
}

export default TaskForm