import { LuLightbulb, LuLoaderCircle, LuScanEye } from 'react-icons/lu'
import type { Hint } from '../types'

type HintPanelProps = {
  hints: Hint[]
  total: number
  busy: boolean
  error: string
  onRequest: () => void
  onOpenVisualizer: () => void
}

const NEXT_LABEL = ['Where should I look?', 'What concept is involved?', 'What should I change?']

/** Progressive Hint Mentor: clue → concept → direction, and every hint is counted. */
export function HintPanel({ hints, total, busy, error, onRequest, onOpenVisualizer }: HintPanelProps) {
  const used = hints.length
  const remaining = total - used

  return (
    <section className="card p-5" aria-labelledby="hints-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="hints-title" className="flex items-center gap-2 text-sm font-bold text-ink-100">
          <LuLightbulb className="text-amber-300" aria-hidden="true" /> Hint Mentor
        </h2>
        <span className="text-xs text-ink-400 tabular-nums">{used}/{total} used</span>
      </div>

      <div className="mt-3 flex gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className={`h-1 flex-1 rounded-full ${index < used ? 'bg-amber-400' : 'bg-ink-700'}`} />
        ))}
      </div>

      {hints.length > 0 && (
        <ol className="mt-4 space-y-3">
          {hints.map((hint) => (
            <li key={hint.level} className="rounded-xl border border-ink-700 bg-ink-850 p-3.5">
              <p className="text-[11px] font-bold tracking-wider text-amber-300 uppercase">
                Hint {hint.level} · {hint.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-200">{hint.text}</p>
              {hint.lesson && <p className="mt-2 border-t border-ink-700 pt-2 text-xs leading-relaxed text-ink-400">Concept: {hint.lesson}</p>}
            </li>
          ))}
        </ol>
      )}

      {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}

      {remaining > 0 ? (
        <>
          <button type="button" onClick={onRequest} disabled={busy} className="btn-secondary mt-4 w-full">
            {busy ? <LuLoaderCircle className="animate-spin" aria-hidden="true" /> : <LuLightbulb aria-hidden="true" />}
            {NEXT_LABEL[used] ?? 'Next hint'}
          </button>
          <p className="mt-3 text-xs leading-relaxed text-ink-500">
            Hints never show the answer. Each one slightly lowers the mastery credit for this challenge.{' '}
            <button type="button" onClick={onOpenVisualizer} className="inline-flex items-center gap-1 font-medium text-brand-300 hover:text-brand-200">
              <LuScanEye aria-hidden="true" /> Try the visualizer first
            </button>
          </p>
        </>
      ) : (
        <p className="mt-4 text-xs text-ink-400">All hints used. You have everything you need. Make the change and submit!</p>
      )}
    </section>
  )
}
