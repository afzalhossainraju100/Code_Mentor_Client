import { LuArrowRight, LuMinus, LuTrendingDown, LuTrendingUp } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { FAILURE_LABELS, formatRelative } from '../lib/format'
import type { Weakness } from '../types'
import { CodeView } from './CodeView'

const SEVERITY = {
  high: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
  medium: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  low: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
}

const TREND = {
  improving: { icon: LuTrendingUp, label: 'Improving', className: 'text-emerald-300' },
  steady: { icon: LuMinus, label: 'Steady', className: 'text-ink-400' },
  struggling: { icon: LuTrendingDown, label: 'Struggling', className: 'text-rose-300' },
}

/** One entry of the Weakness Fingerprint, backed by real failed attempts as evidence. */
export function WeaknessCard({ weakness }: { weakness: Weakness }) {
  const trend = TREND[weakness.trend]
  const TrendIcon = trend.icon
  const practiceId = weakness.evidence[0]?.challengeId

  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-ink-100">{weakness.label}</h3>
          <p className="mt-0.5 text-xs text-ink-400">{weakness.conceptName}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${SEVERITY[weakness.severity]}`}>{weakness.severity}</span>
          <span className={`flex items-center gap-1 text-xs font-medium ${trend.className}`}><TrendIcon aria-hidden="true" /> {trend.label}</span>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
        {[
          ['Failed', `${weakness.fails}/${weakness.attempts}`],
          ['Challenges', weakness.challengeCount],
          ['Repeated', weakness.repeatedChallenges],
          ['Hints', weakness.hintsUsed],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-ink-850 px-2 py-2">
            <dt className="text-[10px] tracking-wider text-ink-500 uppercase">{label}</dt>
            <dd className="text-sm font-bold tabular-nums text-ink-100">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 rounded-lg border-l-2 border-brand-400 bg-brand-400/5 px-3 py-2 text-sm text-ink-200">{weakness.lesson}</p>

      {weakness.evidence.length > 0 && (
        <details className="mt-4 group">
          <summary className="cursor-pointer text-sm font-medium text-brand-300 hover:text-brand-200">
            Evidence from your code ({weakness.evidence.length})
          </summary>
          <ul className="mt-3 space-y-3">
            {weakness.evidence.map((item) => (
              <li key={item.attemptId || item.createdAt} className="rounded-xl border border-ink-700 bg-ink-850 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-ink-100">{item.challengeTitle}</span>
                  <span className="text-ink-500">
                    {item.failureKind ? FAILURE_LABELS[item.failureKind] ?? item.failureKind : 'Failed'} · {item.testsPassed}/{item.testsTotal} tests · {formatRelative(item.createdAt)}
                  </span>
                </div>
                {item.diagnostic && <p className="mt-2 text-xs leading-relaxed text-ink-300">{item.diagnostic}</p>}
                {item.codeExcerpt && <CodeView code={item.codeExcerpt} className="mt-2 max-h-56 text-xs" />}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-ink-500">
        <span>Confidence: {weakness.confidence} · last seen {formatRelative(weakness.lastSeenAt)}</span>
        {practiceId && (
          <Link to={`/practice/${practiceId}`} className="inline-flex items-center gap-1 font-semibold text-brand-300 hover:text-brand-200">
            Practise <LuArrowRight aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  )
}
