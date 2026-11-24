import { useState, type FormEvent } from 'react'
import { errorMessage } from '../api.ts'
import { useAuth } from '../auth/AuthContext.ts'

function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [role, setRole] = useState(user?.role ?? '')
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  async function save(e: FormEvent) {
    e.preventDefault()
    try {
      await updateProfile({ name, role })
      setMessage({ kind: 'ok', text: 'Profile saved.' })
    } catch (err) {
      setMessage({ kind: 'error', text: errorMessage(err) })
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>Profile</h1>
      </div>
      <form className="form" onSubmit={save}>
        <label>
          Name
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email
          <input value={user?.email ?? ''} disabled />
        </label>
        <label>
          Role
          <input value={role} onChange={(e) => setRole(e.target.value)} />
        </label>
        {message && <p className={message.kind} role="status">{message.text}</p>}
        <button className="btn-primary">Save changes</button>
      </form>
    </>
  )
}

export default ProfilePage
