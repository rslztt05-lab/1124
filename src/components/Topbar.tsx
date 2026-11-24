import { USER } from '../data.ts'

function Topbar() {
  return (
    <header className="top">
      <input className="top-search" type="search" placeholder="Search  (Ctrl + F)" aria-label="Search" />
      <button className="btn-outline">+ Create New</button>
      <button className="icon-btn" aria-label="Notifications">🔔</button>
      <div className="who">
        <span className="avatar">{USER.name[0]}</span>
        <span>
          <b>{USER.name}</b>
          <small>{USER.role}</small>
        </span>
      </div>
    </header>
  )
}

export default Topbar
