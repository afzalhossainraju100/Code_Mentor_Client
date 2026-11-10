import { useMemo, useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import { ChallengeCard } from '../components/ChallengeCard'
import { PageHeader } from '../components/PageHeader'
import { EmptyState, ErrorState, LoadingState } from '../components/PageState'
import { useApi } from '../hooks/useApi'
import type { ChallengeStatus, ChallengeSummary, Difficulty } from '../types'

type Filter<T extends string> = T | 'all'

export function ChallengesPage() {
  const { data, error, loading, reload } = useApi<{ challenges: ChallengeSummary[] }>('/api/v1/challenges')
  const [topic, setTopic] = useState<Filter<string>>('all')
  const [difficulty, setDifficulty] = useState<Filter<Difficulty>>('all')
  const [status, setStatus] = useState<Filter<ChallengeStatus>>('all')

  const challenges = useMemo(() => data?.challenges ?? [], [data])
  const topics = useMemo(() => [...new Map(challenges.map((item) => [item.topic, item.topicLabel])).entries()], [challenges])
  const filtered = challenges.filter(
    (item) =>
      (topic === 'all' || item.topic === topic) &&
      (difficulty === 'all' || item.difficulty === difficulty) &&
      (status === 'all' || item.status === status),
  )

  if (loading && !data) return <LoadingState label="Loading challenges…" />
  if (error) return <ErrorState message={error} onRetry={reload} />

  const solved = challenges.filter((item) => item.status === 'solved').length

  return (
    <>
      <PageHeader
        eyebrow="Bug challenges"
        title="Find the bug. Fix it. Prove it."
        description={`Every challenge contains one kind of bug. ${solved} of ${challenges.length} solved so far. Not sure where to start? Your dashboard recommends the best next one.`}
      />

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {[['all', 'All topics'] as const, ...topics].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTopic(id)}
              aria-pressed={topic === id}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                topic === id ? 'border-brand-400 bg-brand-400/15 text-brand-200' : 'border-ink-600 text-ink-300 hover:border-ink-500 hover:text-ink-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="difficulty-filter">Difficulty</label>
          <select id="difficulty-filter" value={difficulty} onChange={(event) => setDifficulty(event.target.value as Filter<Difficulty>)} className="input w-auto py-2 text-sm">
            <option value="all">Any difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <label className="sr-only" htmlFor="status-filter">Status</label>
          <select id="status-filter" value={status} onChange={(event) => setStatus(event.target.value as Filter<ChallengeStatus>)} className="input w-auto py-2 text-sm">
            <option value="all">Any status</option>
            <option value="new">New</option>
            <option value="attempted">In progress</option>
            <option value="solved">Solved</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<LuSearch />} title="No challenges match these filters">Try another topic, difficulty or status.</EmptyState>
      ) : (
        <div className="space-y-10">
          {topics
            .filter(([id]) => filtered.some((item) => item.topic === id))
            .map(([id, label]) => {
              const inTopic = filtered.filter((item) => item.topic === id)
              const allInTopic = challenges.filter((item) => item.topic === id)
              return (
                <section key={id} aria-labelledby={`topic-${id}`}>
                  <div className="mb-4 flex items-baseline justify-between">
                    <h2 id={`topic-${id}`} className="text-lg font-bold text-ink-100">{label}</h2>
                    <span className="text-xs text-ink-400">
                      {allInTopic.filter((item) => item.status === 'solved').length}/{allInTopic.length} solved
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {inTopic.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
                  </div>
                </section>
              )
            })}
        </div>
      )}
    </>
  )
}
