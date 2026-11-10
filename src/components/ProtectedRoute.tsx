import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../auth/useUser'
import { LoadingState } from './PageState'

/** Only signed-in learners can see the app pages. Others are sent to /login and come back afterwards. */
export function ProtectedRoute() {
  const { user, loading } = useUser()
  const location = useLocation()

  if (loading) return <LoadingState label="Checking your sign-in…" />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  return <Outlet />
}
