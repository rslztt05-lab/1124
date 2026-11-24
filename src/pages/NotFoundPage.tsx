import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <>
      <div className="page-head">
        <h1>Page not found</h1>
      </div>
      <p className="muted">The page you opened does not exist.</p>
      <Link to="/">Go to Overview</Link>
    </>
  )
}

export default NotFoundPage
