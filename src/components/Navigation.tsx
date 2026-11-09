import { signOut } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { auth } from '../auth/firebase'
import { useUser } from '../auth/useUser'

export function Navigation() {
  const { user } = useUser()

  async function handleSignOut() {
    if (auth) {
      await signOut(auth)
    }
  }

  return (
    <header className="border-b border-slate-800 bg-slate-950/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-xl font-black text-white">Code Mentor</Link>
        <div className="flex items-center gap-5 text-sm text-slate-300">
          {user ? (
            <button type="button" onClick={handleSignOut} className="rounded-lg border border-slate-700 px-4 py-2 hover:border-cyan-300 hover:text-cyan-300">
              Sign out
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-cyan-300">Log in</Link>
              <Link to="/signup" className="rounded-lg bg-cyan-300 px-4 py-2 font-bold text-slate-950 hover:bg-cyan-200">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
