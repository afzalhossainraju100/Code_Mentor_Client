import { useState } from 'react'
import { LuMenu, LuX } from 'react-icons/lu'
import { Outlet, useLocation } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { Sidebar, SidebarLinks, SignOutButton } from '../components/Sidebar'
import { StorageBanner } from '../components/StorageBanner'
import { UserAvatar } from '../components/UserAvatar'

/** Signed-in app shell: sidebar on desktop, top bar with a drawer on mobile. */
export function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const wide = pathname.startsWith('/practice/')

  return (
    <div className="min-h-screen">
      <Sidebar />

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-800 bg-ink-950/85 px-4 backdrop-blur-xl lg:hidden">
        <Logo to="/dashboard" />
        <div className="flex items-center gap-2">
          <UserAvatar size="sm" />
          <button
            type="button"
            className="btn-ghost px-2.5"
            aria-expanded={menuOpen}
            aria-controls="app-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <LuX size={20} /> : <LuMenu size={20} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div id="app-menu" className="sticky top-16 z-20 border-b border-ink-800 bg-ink-900 px-4 py-4 lg:hidden">
          <SidebarLinks onNavigate={() => setMenuOpen(false)} />
          <div className="mt-3 border-t border-ink-700 pt-3">
            <SignOutButton />
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className={`mx-auto px-4 py-7 sm:px-6 lg:py-9 ${wide ? 'max-w-[1400px]' : 'max-w-6xl'}`}>
          <StorageBanner />
          <Outlet />
        </div>
      </main>
    </div>
  )
}
