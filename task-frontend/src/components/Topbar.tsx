import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext.ts'

function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  function search(e: FormEvent) {
    e.preventDefault()
    navigate(q.trim() ? `/tasks?q=${encodeURIComponent(q.trim())}` : '/tasks')
  }

  return (
    <header className="top">
      <form className="top-form" onSubmit={search} role="search">
        <input
          className="top-search"
          type="search"
          placeholder="Search tasks"
          aria-label="Search tasks"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </form>
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
  )
}

export default Topbar
