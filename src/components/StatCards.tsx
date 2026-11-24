import { TASK_STATUSES, type Task, type TaskStatus } from '../types.ts'

interface Props {
  tasks: Task[]
  active: TaskStatus | 'All'
  onSelect: (status: TaskStatus | 'All') => void
}

const LABEL: Record<TaskStatus, string> = {
  'To Do': 'To Do',
  'In Progress': 'In Progress',
  Complete: 'Completed',
  Overdue: 'Overdue',
}

function StatCards({ tasks, active, onSelect }: Props) {
  return (
    <div className="stats">
      {TASK_STATUSES.map((s) => (
        <button
          key={s}
          className={active === s ? 'stat on' : 'stat'}
          aria-pressed={active === s}
          onClick={() => onSelect(active === s ? 'All' : s)}
        >
          <span>{LABEL[s]}</span>
          <b>{tasks.filter((t) => t.status === s).length}</b>
        </button>
      ))}
    </div>
  )
}

export default StatCards
