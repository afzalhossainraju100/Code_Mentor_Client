import type { AnalyticsData } from '../types'

/** Learning DNA: six traits that describe HOW someone learns, not just how much. */
export function DnaTraits({ traits }: { traits: AnalyticsData['dna'] }) {
  return (
    <ul className="space-y-4">
      {traits.map((trait) => (
        <li key={trait.key}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-semibold text-ink-100">{trait.label}</span>
            <span className="text-sm font-bold tabular-nums text-brand-200">{trait.value === null ? '—' : `${trait.value}`}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-700">
            <div className="h-full rounded-full bg-linear-to-r from-brand-600 to-brand-300" style={{ width: `${trait.value ?? 0}%` }} />
          </div>
          <p className="mt-1 text-xs text-ink-500">{trait.value === null ? 'Not enough data yet.' : trait.description}</p>
        </li>
      ))}
    </ul>
  )
}
