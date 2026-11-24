import { useState } from 'react'

const DASHBOARD_ITEMS = ['Overview', 'My Tasks', 'Activity']
const OTHER_ITEMS = ['Projects', 'Tasks', 'Calendar', 'Analytics', 'Team', 'Files', 'Integrations', 'Settings']

function Sidebar() {
  const [active, setActive] = useState('My Tasks')
  const [open, setOpen] = useState(true)

  return (
    <aside className="side">
      <div className="brand">Atlas</div>

      <nav aria-label="Main">
        <button className="nav nav-group" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span>Dashboard</span>
          <span className={open ? 'chev open' : 'chev'} aria-hidden="true">⌃</span>
        </button>

        {open &&
          DASHBOARD_ITEMS.map((item) => (
            <button
              key={item}
              className={active === item ? 'nav sub on' : 'nav sub'}
              aria-current={active === item ? 'page' : undefined}
              onClick={() => setActive(item)}
            >
              <span>{item}</span>
              {item === 'My Tasks' && <span className="count">6</span>}
            </button>
          ))}

        <hr />

        {OTHER_ITEMS.map((item) => (
          <button
            key={item}
            className={active === item ? 'nav on' : 'nav'}
            aria-current={active === item ? 'page' : undefined}
            onClick={() => setActive(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
