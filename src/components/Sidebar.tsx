import { signOut } from 'firebase/auth'
import type { IconType } from 'react-icons'
import { LuCalendarCheck, LuDna, LuLayoutDashboard, LuListChecks, LuLogOut } from 'react-icons/lu'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../auth/firebase'
import { useDisplayName } from '../auth/useDisplayName'
import { useUser } from '../auth/useUser'
import { Logo } from './Logo'
import { UserAvatar } from './UserAvatar'

const APP_LINKS: { to: string; label: string; icon: IconType }[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LuLayoutDashboard },
  { to: '/challenges', label: 'Bug Challenges', icon: LuListChecks },
  { to: '/plan', label: 'Recovery Plan', icon: LuCalendarCheck },
  { to: '/analytics', label: 'Learning DNA', icon: LuDna },
]

export function SidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {APP_LINKS.map(({ to, label, icon: Icon }) => (
        <li key={to}>
          <NavLink
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-400/12 text-brand-200' : 'text-ink-300 hover:bg-ink-800 hover:text-ink-100'
              }`
            }
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export function SignOutButton({ className = 'btn-ghost w-full justify-start' }: { className?: string }) {
  const navigate = useNavigate()
  async function handleSignOut() {
    if (auth) await signOut(auth)
    navigate('/', { replace: true })
  }
  return (
    <button type="button" onClick={handleSignOut} className={className}>
      <LuLogOut size={17} aria-hidden="true" /> Sign out
    </button>
  )
}

/** Desktop sidebar for the signed-in app. */
export function Sidebar() {
  const { user } = useUser()
  const name = useDisplayName()
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-ink-800 bg-ink-900/60 px-4 py-5 lg:flex">
      <div className="px-2">
        <Logo to="/dashboard" />
      </div>
      <nav className="mt-8 flex-1" aria-label="App">
        <SidebarLinks />
      </nav>
      <div className="rounded-xl border border-ink-700 bg-ink-850 p-3">
        <div className="flex items-center gap-3">
          <UserAvatar />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-100">{name}</p>
            <p className="truncate text-xs text-ink-400">{user?.email}</p>
          </div>
        </div>
        <div className="mt-3 border-t border-ink-700 pt-2">
          <SignOutButton />
        </div>
      </div>
    </aside>
  )
}
