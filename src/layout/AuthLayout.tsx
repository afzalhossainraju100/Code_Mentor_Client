import { LuFingerprint, LuLightbulb, LuShieldCheck } from 'react-icons/lu'
import { Link, Outlet } from 'react-router-dom'
import { Logo } from '../components/Logo'

const points = [
  { icon: LuLightbulb, title: 'Hints that teach', text: 'Clue → concept → direction. Never the full answer.' },
  { icon: LuShieldCheck, title: 'Hidden tests', text: 'Your fix must work for inputs you have not seen.' },
  { icon: LuFingerprint, title: 'Your weakness profile', text: 'Every mistake becomes evidence for what to practise next.' },
]

/** Split screen for login, sign-up and password reset. */
export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden border-r border-ink-800 bg-ink-900 p-12 lg:flex lg:flex-col">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-40 size-[520px] rounded-full bg-brand-600/20 blur-3xl" />
        <div className="relative">
          <Logo />
        </div>
        <div className="relative my-auto max-w-md">
          <p className="eyebrow">Debugging practice for beginners</p>
          <h2 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight text-ink-100">
            Every bug you fix makes you a <span className="text-brand-300">better programmer.</span>
          </h2>
          <ul className="mt-10 space-y-6">
            {points.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-ink-600 bg-ink-800 text-brand-300">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span>
                  <strong className="block text-sm text-ink-100">{title}</strong>
                  <span className="text-sm text-ink-400">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-ink-500">“Hints point you toward the idea. You stay in control of the code.”</p>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="mx-auto my-auto w-full max-w-md py-10">
          <Outlet />
        </div>
        <p className="text-center text-xs text-ink-500">
          <Link to="/" className="hover:text-ink-300">← Back to home</Link>
        </p>
      </main>
    </div>
  )
}
