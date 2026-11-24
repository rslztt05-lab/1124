import type { TaskStatus } from '../types.ts'

const COLORS: Record<TaskStatus, { bg: string; fg: string }> = {
    'To Do': { bg: '#e5e7eb', fg: '#374151' },
    'In Progress': { bg: '#dbeafe', fg: '#1d4ed8' },
    Complete: { bg: '#dcfce7', fg: '#15803d' },
    Overdue: { bg: '#fee2e2', fg: '#b91c1c' },
}

function StatusBadge({ status }: { status: TaskStatus }) {
    const c = COLORS[status]
    return (
        <span
            style={{
                background: c.bg,
                color: c.fg,
                padding: '2px 10px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: 'nowrap',
            }}
        >
            {status}
        </span>
    )
}

export default StatusBadge