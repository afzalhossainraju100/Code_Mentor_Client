import { LuCircleCheck, LuCircleDot, LuClock } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import type { ChallengeSummary } from '../types'
import { DifficultyBadge } from './Badges'

const STATUS = {
  solved: { icon: LuCircleCheck, label: 'Solved', className: 'text-emerald-300' },
  attempted: { icon: LuCircleDot, label: 'In progress', className: 'text-amber-300' },
  new: { icon: LuCircleDot, label: 'New', className: 'text-ink-500' },
}

export function ChallengeCard({ challenge }: { challenge: ChallengeSummary }) {
  const status = STATUS[challenge.status]
  const StatusIcon = status.icon
  return (
    <Link
      to={`/practice/${challenge.id}`}
      className="card group flex flex-col p-4 transition-colors hover:border-brand-400/50 hover:bg-ink-850"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-ink-100 group-hover:text-brand-200">{challenge.title}</h3>
        <DifficultyBadge difficulty={challenge.difficulty} />
      </div>
      <p className="mt-1.5 text-xs text-ink-400">{challenge.conceptName}</p>
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className={`flex items-center gap-1.5 font-medium ${status.className}`}>
          <StatusIcon aria-hidden="true" /> {status.label}
        </span>
        <span className="flex items-center gap-1 text-ink-500">
          <LuClock aria-hidden="true" /> ~{challenge.estMinutes} min
        </span>
      </div>
    </Link>
  )
}
