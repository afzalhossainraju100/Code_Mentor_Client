import { Outlet } from 'react-router-dom'
import { Navigation } from '../components/Navigation'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navigation />
      <Outlet />
    </div>
  )
}
