import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext.ts'

const NAV = [
  { to: '/', label: 'Overview' },
  { to: '/tasks', label: 'My Tasks' },
  { to: '/tasks/new', label: 'New Task' },
  { to: '/profile', label: 'Profile' },
]

function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="shell">
      <aside className="side">
        <Link to="/" className="brand">Atlas</Link>
        <nav aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end className={({ isActive }) => (isActive ? 'nav on' : 'nav')}>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main">
        <header className="top">
          <button className="btn-outline" onClick={() => navigate('/tasks/new')}>+ Create New</button>
          <Link to="/profile" className="who">
            <span className="avatar">{user?.name[0]?.toUpperCase()}</span>
            <span>
              <b>{user?.name}</b>
              <small>{user?.role}</small>
            </span>
          </Link>
          <button
            className="btn-ghost"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            Log out
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
