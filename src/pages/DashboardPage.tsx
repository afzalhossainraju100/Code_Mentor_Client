import { useState } from 'react'
import { LuArrowRight, LuCalendarCheck, LuFingerprint, LuFlame, LuListChecks } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { useDisplayName } from '../auth/useDisplayName'
import { PageHeader } from '../components/PageHeader'
import { ErrorState, LoadingState } from '../components/PageState'
import { PlanList } from '../components/PlanList'
import { RecommendationCard } from '../components/RecommendationCard'
import { SkillProfileCard } from '../components/SkillProfileCard'
import { useApi } from '../hooks/useApi'
import { tzParam } from '../lib/api'
import type { DashboardData } from '../types'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardPage() {
  const name = useDisplayName()
  const [today] = useState(() => ({
    greeting: greeting(),
    label: new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
  }))
  const { data, error, loading, reload } = useApi<DashboardData>(`/api/v1/progress/dashboard?${tzParam()}`)

  if (loading && !data) return <LoadingState label="Loading your skill profile…" />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!data) return null

  const { profile, plan, recommendation, topWeakness } = data
  const planProgress = plan.items.length ? Math.round((plan.completed / plan.items.length) * 100) : 0

  return (
    <>
      <PageHeader
        eyebrow={today.label}
        title={`${today.greeting}, ${name.split(' ')[0]}`}
        description={profile.submissions === 0 ? 'Welcome! Your skill profile fills in as you fix bugs. Start with today’s warm-up.' : 'Here is where your debugging skills stand today.'}
        actions={
          <>
            <span className="chip border-amber-400/30 bg-amber-400/10 py-2 text-amber-200">
              <LuFlame aria-hidden="true" /> {profile.streak}-day streak
            </span>
            <Link to="/challenges" className="btn-secondary"><LuListChecks aria-hidden="true" /> All challenges</Link>
          </>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.3fr_1fr]">
        <SkillProfileCard profile={profile} insight={data.insight} />

        <div className="space-y-6">
          {recommendation && <RecommendationCard recommendation={recommendation} />}

          <section className="card p-5" aria-labelledby="plan-title">
            <div className="flex items-center justify-between gap-3">
              <h2 id="plan-title" className="flex items-center gap-2 font-bold text-ink-100">
                <LuCalendarCheck className="text-brand-300" aria-hidden="true" /> Today’s recovery plan
              </h2>
              <span className="text-xs text-ink-400">{plan.completed}/{plan.items.length} done · {plan.totalMinutes} min</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-700">
              <div className="h-full rounded-full bg-emerald-400 transition-[width]" style={{ width: `${planProgress}%` }} />
            </div>
            <div className="mt-4">
              <PlanList plan={plan} compact />
            </div>
            <Link to="/plan" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-300 hover:text-brand-200">
              Why these challenges? <LuArrowRight aria-hidden="true" />
            </Link>
          </section>

          {topWeakness && (
            <Link to="/analytics" className="card group flex items-start gap-4 p-5 transition-colors hover:border-rose-400/40">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-400/10 text-rose-300">
                <LuFingerprint size={20} aria-hidden="true" />
              </span>
              <span>
                <span className="text-xs font-semibold tracking-wider text-ink-400 uppercase">Top weakness</span>
                <span className="mt-0.5 block font-bold text-ink-100">{topWeakness.label}</span>
                <span className="mt-1 block text-sm text-ink-400">
                  {topWeakness.fails} failed of {topWeakness.attempts} attempts. See the evidence in your Learning DNA.
                </span>
              </span>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
