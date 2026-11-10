import type { ConceptInfo } from '../types'
import { ConceptStatusBadge } from './Badges'

/** Real Understanding Verification overview: every concept and whether it is proven. */
export function ConceptMap({ concepts, topics }: { concepts: ConceptInfo[]; topics: { topic: string; label: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => (
        <div key={topic.topic} className="rounded-xl border border-ink-700 bg-ink-850 p-4">
          <h3 className="text-sm font-bold text-ink-100">{topic.label}</h3>
          <ul className="mt-3 space-y-2.5">
            {concepts.filter((concept) => concept.topic === topic.topic).map((concept) => (
              <li key={concept.concept} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate text-ink-300" title={concept.name}>{concept.name}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="text-[11px] text-ink-500 tabular-nums">{concept.solved}/{concept.total}</span>
                  <ConceptStatusBadge status={concept.status} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
