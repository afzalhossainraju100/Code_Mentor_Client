import { Link } from 'react-router-dom'
import { Logo } from './Logo'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-ink-400">Learn to code by fixing real bugs. Hints that teach, tests that verify, a profile that remembers.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-400" aria-label="Footer">
          <a href="/#features" className="hover:text-ink-100">Features</a>
          <a href="/#how-it-works" className="hover:text-ink-100">How it works</a>
          <Link to="/signup" className="hover:text-ink-100">Create account</Link>
          <Link to="/login" className="hover:text-ink-100">Log in</Link>
        </nav>
      </div>
      <div className="border-t border-ink-800/70 py-5 text-center text-xs text-ink-500">
        © {YEAR} Code Mentor · Built for beginners who want to think like debuggers
      </div>
    </footer>
  )
}
