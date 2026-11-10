import { LuArrowRight, LuBadgeCheck, LuBookOpen, LuPartyPopper, LuRepeat } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import type { SubmissionResponse } from '../types'

/** Shown after a passing submission: why the fix works, then "prove it" with a twin challenge. */
export function SuccessPanel({ submission }: { submission: SubmissionResponse }) {
  const { verification, next, mastery } = submission
  return (
    <section className="rounded-2xl border border-emerald-400/30 bg-linear-to-br from-emerald-400/10 to-transparent p-5" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-200">
          <LuPartyPopper aria-hidden="true" /> Bug fixed! All {submission.result.testsTotal} tests pass.
        </h2>
        <span className="text-xs text-ink-400">
          Attempt #{submission.attemptNumber} · {mastery.label} mastery {mastery.mastery}%
        </span>
      </div>

      {submission.explanation && (
        <div className="mt-4">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-ink-400 uppercase"><LuBookOpen aria-hidden="true" /> Why it works</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-200">{submission.explanation}</p>
        </div>
      )}
      {submission.lesson && (
        <p className="mt-3 rounded-lg border-l-2 border-emerald-400 bg-emerald-400/5 px-3 py-2 text-sm text-ink-200">
          Remember: {submission.lesson}
        </p>
      )}

      {verification?.status === 'pending' && verification.twin && (
        <div className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
          <p className="flex items-center gap-2 font-semibold text-amber-200"><LuRepeat aria-hidden="true" /> Understanding check</p>
          <p className="mt-1 text-sm text-ink-300">{verification.message}</p>
          <Link to={`/practice/${verification.twin.challengeId}`} className="btn-primary mt-3">
            Prove it: {verification.twin.title} <LuArrowRight aria-hidden="true" />
          </Link>
        </div>
      )}
      {verification?.status === 'verified' && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4">
          <LuBadgeCheck className="mt-0.5 shrink-0 text-emerald-300" size={20} aria-hidden="true" />
          <p className="text-sm text-emerald-100">{verification.message}</p>
        </div>
      )}

      {next && verification?.status !== 'pending' && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink-700 pt-4">
          <p className="text-sm text-ink-300">
            Up next: <strong className="text-ink-100">{next.title}</strong> <span className="text-ink-500">· {next.topicLabel}</span>
          </p>
          <Link to={`/practice/${next.challengeId}`} className="btn-secondary">
            Next challenge <LuArrowRight aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  )
}
