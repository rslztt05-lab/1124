import { Navigate, Outlet } from 'react-router'
import { useAuth } from './AuthContext.ts'

function RequireAuth() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default RequireAuth
