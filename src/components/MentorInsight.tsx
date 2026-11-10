import { LuBrain } from 'react-icons/lu'
import type { Insight } from '../types'

const toneRing = {
  neutral: 'border-brand-400/25 from-brand-500/10',
  warning: 'border-amber-400/25 from-amber-400/10',
  positive: 'border-emerald-400/25 from-emerald-400/10',
}

export function MentorInsight({ insight }: { insight: Insight }) {
  return (
    <div className={`rounded-xl border bg-linear-to-br to-transparent p-4 ${toneRing[insight.tone]}`}>
      <div className="flex items-start gap-3">
        <LuBrain className="mt-0.5 shrink-0 text-brand-300" size={20} aria-hidden="true" />
        <div>
          <h3 className="text-sm font-bold text-ink-100">AI Mentor Insight</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-200">{insight.text}</p>
          <p className="mt-2 text-[11px] text-ink-500">{insight.basedOn}</p>
        </div>
      </div>
    </div>
  )
}
