import { useState } from 'react'
import { Link, NavLink } from 'react-router'

const DASHBOARD_ITEMS = [
  { to: '/', label: 'Overview' },
  { to: '/tasks', label: 'My Tasks' },
  { to: '/tasks/new', label: 'New Task' },
]

function Sidebar() {
  const [open, setOpen] = useState(true)

  return (
    <aside className="side">
      <Link to="/" className="brand">Atlas</Link>

      <nav aria-label="Main">
        <button className="nav nav-group" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span>Dashboard</span>
          <span className={open ? 'chev open' : 'chev'} aria-hidden="true">⌃</span>
        </button>

        {open &&
          DASHBOARD_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end className={({ isActive }) => (isActive ? 'nav sub on' : 'nav sub')}>
              {item.label}
            </NavLink>
          ))}

        <hr />

        <NavLink to="/profile" end className={({ isActive }) => (isActive ? 'nav on' : 'nav')}>
          Profile
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
