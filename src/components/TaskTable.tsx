import { useState } from 'react'
import { formatDate, type Task } from '../types.ts'

function TaskTable({ tasks }: { tasks: Task[] }) {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const pages = Math.max(1, Math.ceil(tasks.length / pageSize))
  const current = Math.min(page, pages)
  const rows = tasks.slice((current - 1) * pageSize, current * pageSize)

  return (
    <>
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
            {rows.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>
                  <span className="logo" aria-hidden="true">{t.project[0]}</span>
                  {t.project}
                </td>
                <td>{formatDate(t.due)}</td>
                <td>
                  <span className={`badge badge-${t.status.replace(' ', '').toLowerCase()}`}>
                    <i aria-hidden="true" />
                    {t.status}
                  </span>
                </td>
                <td><span className="prio">{t.priority}</span></td>
                <td className="more"><button aria-label={`Actions for ${t.title}`}>⋮</button></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">No tasks match these filters. Clear a filter to see more.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="foot">
        <div className="pager">
          <button onClick={() => setPage(current - 1)} disabled={current === 1} aria-label="Previous page">‹</button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button key={n} className={n === current ? 'on' : ''} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button onClick={() => setPage(current + 1)} disabled={current === pages} aria-label="Next page">›</button>
        </div>
        <span>Total {tasks.length} Data</span>
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

export default TaskTable
