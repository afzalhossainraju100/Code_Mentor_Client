import { LuArrowRight, LuCircle, LuCircleCheck, LuClock } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import type { DailyPlan } from '../types'
import { DifficultyBadge, PlanKindBadge } from './Badges'

/** Today's recovery plan items. `compact` hides the reasons (dashboard preview). */
export function PlanList({ plan, compact = false }: { plan: DailyPlan; compact?: boolean }) {
  return (
    <ol className="space-y-2.5">
      {plan.items.map((item) => (
        <li key={item.challengeId}>
          <Link
            to={`/practice/${item.challengeId}`}
            className={`group flex gap-3 rounded-xl border p-3.5 transition-colors ${
              item.done ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-ink-700 bg-ink-850 hover:border-brand-400/50'
            }`}
          >
            <span className="mt-0.5">
              {item.done ? <LuCircleCheck className="text-emerald-300" aria-label="Done" /> : <LuCircle className="text-ink-500" aria-label="Not done" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className={`font-semibold ${item.done ? 'text-ink-300 line-through decoration-ink-500' : 'text-ink-100'}`}>{item.title}</span>
                <PlanKindBadge kind={item.kind} />
                {!compact && <DifficultyBadge difficulty={item.difficulty} />}
              </span>
              <span className="mt-1 flex items-center gap-2 text-xs text-ink-400">
                {item.topicLabel} · {item.conceptName}
                <span className="flex items-center gap-1"><LuClock aria-hidden="true" /> {item.estMinutes} min</span>
              </span>
              {!compact && <span className="mt-2 block text-sm leading-relaxed text-ink-300">{item.reason}</span>}
            </span>
            <LuArrowRight className="mt-1 shrink-0 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-300" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ol>
  )
}
