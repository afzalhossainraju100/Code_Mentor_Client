import { useState } from 'react'
import { LuArrowRight, LuMenu, LuX } from 'react-icons/lu'
import { Link, NavLink } from 'react-router-dom'
import { useUser } from '../auth/useUser'
import { Logo } from './Logo'
import { UserAvatar } from './UserAvatar'

const sectionLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#profile-demo', label: 'Skill profile' },
]

/** Public top navigation (landing page and 404). */
export function Navigation() {
  const { user } = useUser()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {sectionLinks.map((link) => (
            <a key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm text-ink-300 hover:text-ink-100">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <UserAvatar size="sm" />
              <Link to="/dashboard" className="btn-primary">
                Dashboard <LuArrowRight aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-ghost">Log in</NavLink>
              <Link to="/signup" className="btn-primary">Start free</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn-ghost px-2.5 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <LuX size={20} /> : <LuMenu size={20} />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-ink-800 px-4 pb-5 md:hidden">
          <div className="flex flex-col py-2">
            {sectionLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 text-ink-200">
                {link.label}
              </a>
            ))}
          </div>
          {user ? (
            <Link to="/dashboard" className="btn-primary w-full" onClick={() => setOpen(false)}>Go to dashboard</Link>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" className="btn-secondary" onClick={() => setOpen(false)}>Log in</Link>
              <Link to="/signup" className="btn-primary" onClick={() => setOpen(false)}>Start free</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
