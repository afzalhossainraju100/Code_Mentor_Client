import { masteryColor } from '../lib/format'

type MasteryItem = { topic: string; label: string; mastery: number; started: boolean }

export function MasteryBars({ items }: { items: MasteryItem[] }) {
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li key={item.topic} className="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-3 text-sm">
          <span className="font-medium text-ink-200">{item.label}</span>
          <span
            className="h-2 overflow-hidden rounded-full bg-ink-700"
            role="progressbar"
            aria-label={`${item.label} mastery`}
            aria-valuenow={item.mastery}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span
              className={`block h-full rounded-full transition-[width] duration-700 ${masteryColor(item.mastery, item.started)}`}
              style={{ width: `${Math.max(item.started ? 3 : 0, item.mastery)}%` }}
            />
          </span>
          <span className="text-right font-semibold tabular-nums text-ink-300">{item.started ? `${item.mastery}%` : '—'}</span>
        </li>
      ))}
    </ul>
  )
}
