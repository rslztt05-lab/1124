import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <div className="auth">
      <div>
        <h1>Page not found</h1>
        <p className="muted">The page you opened does not exist.</p>
        <Link to="/">Go to Overview</Link>
      </div>
    </div>
  )
}

export default NotFoundPage
