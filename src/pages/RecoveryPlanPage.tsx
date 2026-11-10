import { LuCalendarDays, LuCircleCheck, LuHourglass } from 'react-icons/lu'
import { PageHeader } from '../components/PageHeader'
import { EmptyState, ErrorState, LoadingState } from '../components/PageState'
import { PlanList } from '../components/PlanList'
import { useApi } from '../hooks/useApi'
import { tzParam } from '../lib/api'
import { formatDay } from '../lib/format'
import type { PlanData } from '../types'

const RULES = [
  { title: 'Spaced review', text: 'A concept you got wrong comes back after 1, 3, 7 and 14 days. Each successful review pushes it further out.' },
  { title: 'Verify', text: 'If you solved only one bug about a concept, you get its twin to prove you understand it.' },
  { title: 'Weakness focus', text: 'Your top weakness gets a challenge one step harder if you are improving, or one step easier to rebuild the foundation.' },
  { title: 'New ground', text: 'Remaining minutes go to the best new challenge for your level, keeping the session at 10–15 minutes.' },
]

export function RecoveryPlanPage() {
  const { data, error, loading, reload } = useApi<PlanData>(`/api/v1/progress/plan?${tzParam()}`)

  if (loading && !data) return <LoadingState label="Building today’s plan…" />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!data) return null

  const { plan, reviews } = data
  const progress = plan.items.length ? Math.round((plan.completed / plan.items.length) * 100) : 0
  const allDone = plan.items.length > 0 && plan.completed === plan.items.length

  return (
    <>
      <PageHeader
        eyebrow={formatDay(plan.date)}
        title="Today’s Adaptive Recovery Plan"
        description={`A personal ${plan.totalMinutes}-minute session built from your weaknesses. Focus today: ${plan.focus}.`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="card p-5" aria-labelledby="today-title">
          <div className="flex items-center justify-between gap-3">
            <h2 id="today-title" className="font-bold text-ink-100">Practice queue</h2>
            <span className="text-sm text-ink-400 tabular-nums">{plan.completed}/{plan.items.length} complete</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-700">
            <div className="h-full rounded-full bg-emerald-400 transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          {allDone && (
            <p className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-3 text-sm text-emerald-200">
              <LuCircleCheck aria-hidden="true" /> Plan complete for today. Great work! Tomorrow’s plan adapts to what you did today.
            </p>
          )}
          <div className="mt-5">
            <PlanList plan={plan} />
          </div>
        </section>

        <div className="space-y-6">
          <section className="card p-5" aria-labelledby="reviews-title">
            <h2 id="reviews-title" className="flex items-center gap-2 font-bold text-ink-100">
              <LuCalendarDays className="text-brand-300" aria-hidden="true" /> Spaced-review schedule
            </h2>
            {reviews.length === 0 ? (
              <div className="mt-4">
                <EmptyState icon={<LuHourglass />} title="Nothing to review yet">Concepts you get wrong will be scheduled here for review.</EmptyState>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {reviews.map((review) => (
                  <li key={review.concept} className="rounded-xl border border-ink-700 bg-ink-850 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-ink-100">{review.conceptName}</span>
                      <span className={`text-xs font-semibold ${review.due ? 'text-amber-300' : 'text-ink-400'}`}>
                        {review.due ? 'Due now' : formatDay(review.dueDate)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1" aria-label={`Review ${review.stage} of ${review.stages}`}>
                        {Array.from({ length: review.stages }, (_, index) => (
                          <span key={index} className={`h-1.5 w-6 rounded-full ${index < review.stage - 1 ? 'bg-emerald-400' : index === review.stage - 1 ? 'bg-amber-400' : 'bg-ink-700'}`} />
                        ))}
                      </div>
                      <span className="text-[11px] text-ink-500">review {review.stage} of {review.stages}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card p-5" aria-labelledby="rules-title">
            <h2 id="rules-title" className="font-bold text-ink-100">How your plan adapts</h2>
            <ol className="mt-4 space-y-3.5">
              {RULES.map((rule, index) => (
                <li key={rule.title} className="flex gap-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink-700 text-xs font-bold text-ink-200">{index + 1}</span>
                  <span>
                    <strong className="text-ink-100">{rule.title}.</strong> <span className="text-ink-400">{rule.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  )
}
