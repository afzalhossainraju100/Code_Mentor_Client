import { LuActivity, LuBug, LuCircleCheck, LuCircleX, LuClock, LuDna, LuFlame, LuLightbulb, LuRepeat, LuTarget } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { ActivityHeatmap } from '../components/ActivityHeatmap'
import { ConceptMap } from '../components/ConceptMap'
import { DnaTraits } from '../components/DnaTraits'
import { PageHeader } from '../components/PageHeader'
import { EmptyState, ErrorState, LoadingState } from '../components/PageState'
import { SkillHeatmap } from '../components/SkillHeatmap'
import { StatCard } from '../components/StatCard'
import { TopicProgress } from '../components/TopicProgress'
import { WeaknessCard } from '../components/WeaknessCard'
import { useApi } from '../hooks/useApi'
import { tzParam } from '../lib/api'
import { FAILURE_LABELS, formatDuration, formatRelative, percentText } from '../lib/format'
import type { AnalyticsData } from '../types'

export function AnalyticsPage() {
  const { data, error, loading, reload } = useApi<AnalyticsData>(`/api/v1/progress/analytics?${tzParam()}`)

  if (loading && !data) return <LoadingState label="Analysing your learning DNA…" />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!data) return null

  const { stats } = data
  const header = (
    <PageHeader
      eyebrow="Learning DNA & progress analytics"
      title="How you learn, not just how much"
      description="Every number on this page comes from your own submissions: attempts, failures, hints and solving time."
    />
  )

  if (stats.submissions === 0) {
    return (
      <>
        {header}
        <EmptyState icon={<LuDna />} title="Your Learning DNA appears after your first submission">
          <Link to="/challenges" className="btn-primary mt-3">Fix your first bug</Link>
        </EmptyState>
      </>
    )
  }

  return (
    <>
      {header}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Submissions" value={stats.submissions} icon={<LuActivity />} />
        <StatCard label="Bugs fixed" value={stats.bugsFixed} icon={<LuBug />} tone="good" />
        <StatCard label="Success rate" value={percentText(stats.successRate)} icon={<LuCircleCheck />} hint="Passing submissions out of all submissions." />
        <StatCard label="Avg solve time" value={formatDuration(stats.avgSolveTimeSec)} icon={<LuClock />} />
        <StatCard label="Hint dependency" value={percentText(stats.hintDependency)} icon={<LuLightbulb />} tone={(stats.hintDependency ?? 0) > 60 ? 'warn' : 'default'} hint="Solved challenges that needed at least one hint." />
        <StatCard label="Streak" value={`${stats.currentStreak}d`} icon={<LuFlame />} hint={`Longest streak: ${stats.longestStreak} days`} />
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_1.3fr]">
        <section className="card p-5" aria-labelledby="dna-title">
          <h2 id="dna-title" className="mb-5 flex items-center gap-2 font-bold text-ink-100"><LuDna className="text-brand-300" aria-hidden="true" /> Learning DNA</h2>
          <DnaTraits traits={data.dna} />
        </section>
        <div className="space-y-6">
          <section className="card p-5" aria-labelledby="activity-title">
            <h2 id="activity-title" className="mb-4 font-bold text-ink-100">Daily coding activity</h2>
            <ActivityHeatmap activity={data.activity} />
          </section>
          <section className="card p-5" aria-labelledby="heatmap-title">
            <h2 id="heatmap-title" className="mb-3 font-bold text-ink-100">Skill heatmap</h2>
            <SkillHeatmap rows={data.skillHeatmap} />
          </section>
        </div>
      </div>

      <section className="card mt-6 p-5" aria-labelledby="topics-title">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="topics-title" className="font-bold text-ink-100">Topic-wise improvement</h2>
          <span className="text-xs text-ink-400">{stats.repeatedMistakes} challenges with repeated mistakes · first-try rate {percentText(stats.firstTryRate)}</span>
        </div>
        <TopicProgress topics={data.topics} />
      </section>

      <section className="mt-10" aria-labelledby="weakness-title">
        <h2 id="weakness-title" className="flex items-center gap-2 text-xl font-extrabold text-ink-100"><LuTarget className="text-rose-300" aria-hidden="true" /> Weakness Fingerprint</h2>
        <p className="mt-1 mb-5 text-sm text-ink-400">Built from failed attempts, repeated mistakes, solving time and hint usage. Open the evidence to see the code behind each one.</p>
        {data.weaknesses.length === 0 ? (
          <EmptyState icon={<LuCircleCheck />} title="No weaknesses detected yet">Keep going. Patterns appear once there are a few attempts to learn from.</EmptyState>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {data.weaknesses.map((weakness) => <WeaknessCard key={weakness.concept} weakness={weakness} />)}
          </div>
        )}
      </section>

      <section className="mt-10" aria-labelledby="concepts-title">
        <h2 id="concepts-title" className="flex items-center gap-2 text-xl font-extrabold text-ink-100"><LuRepeat className="text-emerald-300" aria-hidden="true" /> Understanding verification</h2>
        <p className="mt-1 mb-5 text-sm text-ink-400">A concept is verified only when you fix two different bugs about it. One fix might be a lucky guess; two show real understanding.</p>
        <ConceptMap concepts={data.concepts} topics={data.topics} />
      </section>

      <section className="card mt-10 overflow-hidden" aria-labelledby="recent-title">
        <h2 id="recent-title" className="border-b border-ink-700 px-5 py-4 font-bold text-ink-100">Recent submissions</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-xs text-ink-400">
              <tr>
                <th scope="col" className="px-5 py-2.5 font-medium">Challenge</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Result</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Tests</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Hints</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Time</th>
                <th scope="col" className="px-5 py-2.5 text-right font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {data.recentAttempts.map((attempt) => (
                <tr key={attempt.id} className="border-t border-ink-700/70">
                  <td className="px-5 py-3">
                    <Link to={`/practice/${attempt.challengeId}`} className="font-medium text-ink-100 hover:text-brand-200">{attempt.title}</Link>
                  </td>
                  <td className="px-3 py-3">
                    {attempt.passed ? (
                      <span className="flex items-center gap-1.5 text-emerald-300"><LuCircleCheck aria-hidden="true" /> Passed</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-rose-300"><LuCircleX aria-hidden="true" /> {FAILURE_LABELS[attempt.failureKind ?? ''] ?? 'Failed'}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 tabular-nums text-ink-300">{attempt.testsPassed}/{attempt.testsTotal}</td>
                  <td className="px-3 py-3 tabular-nums text-ink-300">{attempt.hintsUsed}</td>
                  <td className="px-3 py-3 tabular-nums text-ink-300">{formatDuration(attempt.timeSpentSec)}</td>
                  <td className="px-5 py-3 text-right text-ink-400">{formatRelative(attempt.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
