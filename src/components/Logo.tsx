import { LuCode } from 'react-icons/lu'
import { Link } from 'react-router-dom'

export function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-2.5" aria-label="Code Mentor home">
      <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-brand-400 to-brand-600 text-ink-950 shadow-[0_0_24px_-6px] shadow-brand-500/70 transition-transform group-hover:scale-105">
        <LuCode size={20} strokeWidth={2.6} aria-hidden="true" />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-ink-100">
        Code<span className="text-brand-300">Mentor</span>
      </span>
    </Link>
  )
}
