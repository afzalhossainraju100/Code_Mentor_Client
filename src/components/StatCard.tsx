import type { ReactNode } from 'react'

type StatCardProps = {
  label: string
  value: ReactNode
  icon?: ReactNode
  hint?: string
  tone?: 'default' | 'good' | 'warn'
}

const tones = {
  default: 'text-ink-100',
  good: 'text-emerald-300',
  warn: 'text-amber-300',
}

export function StatCard({ label, value, icon, hint, tone = 'default' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-850 p-4" title={hint}>
      <div className="flex items-center justify-between gap-2 text-ink-400">
        <span className="text-xs font-medium">{label}</span>
        {icon && <span className="text-brand-300" aria-hidden="true">{icon}</span>}
      </div>
      <div className={`mt-2 text-2xl font-extrabold tracking-tight tabular-nums ${tones[tone]}`}>{value}</div>
    </div>
  )
}
