import { CONCEPT_STATUS, DIFFICULTY_STYLES, PLAN_KIND } from '../lib/format'
import type { ConceptStatus, Difficulty, PlanItem } from '../types'

const base = 'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap'

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const style = DIFFICULTY_STYLES[difficulty]
  return <span className={`${base} ${style.className}`}>{style.label}</span>
}

export function ConceptStatusBadge({ status }: { status: ConceptStatus }) {
  const style = CONCEPT_STATUS[status]
  return (
    <span className={`${base} ${style.className}`} title={style.description}>
      {style.label}
    </span>
  )
}

export function PlanKindBadge({ kind }: { kind: PlanItem['kind'] }) {
  const style = PLAN_KIND[kind]
  return <span className={`${base} ${style.className}`}>{style.label}</span>
}
