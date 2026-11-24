import type { TaskPriority } from '../types.ts'

const COLORS: Record<TaskPriority, { bg: string; fg: string }> = {
    High: { bg: '#fee2e2', fg: '#b91c1c' },
    Medium: { bg: '#fef3c7', fg: '#b45309' },
    Low: { bg: '#dcfce7', fg: '#15803d' },
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
    const c = COLORS[priority]
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
            {priority}
        </span>
    )
}

export default PriorityBadge