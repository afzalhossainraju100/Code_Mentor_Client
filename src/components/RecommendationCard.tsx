import { LuArrowRight, LuClock, LuTarget } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import type { Recommendation } from '../types'
import { DifficultyBadge } from './Badges'

/** Personalized Bug Challenge Engine: the next best challenge and why it was chosen. */
export function RecommendationCard({ recommendation, title = 'Recommended next' }: { recommendation: Recommendation; title?: string }) {
  return (
    <section className="card relative overflow-hidden p-5">
      <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 size-48 rounded-full bg-brand-500/15 blur-2xl" />
      <p className="eyebrow flex items-center gap-2"><LuTarget aria-hidden="true" /> {title}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold text-ink-100">{recommendation.title}</h2>
        <DifficultyBadge difficulty={recommendation.difficulty} />
      </div>
      <p className="mt-1 flex items-center gap-2 text-xs text-ink-400">
        {recommendation.topicLabel} · {recommendation.conceptName}
        <span className="flex items-center gap-1"><LuClock aria-hidden="true" /> ~{recommendation.estMinutes} min</span>
      </p>
      <ul className="mt-3 space-y-1 text-sm leading-relaxed text-ink-300">
        {recommendation.reasons.map((reason) => <li key={reason}>• {reason}</li>)}
      </ul>
      <Link to={`/practice/${recommendation.challengeId}`} className="btn-primary relative mt-4">
        Start challenge <LuArrowRight aria-hidden="true" />
      </Link>
    </section>
  )
}
