import { LuCircleCheck, LuCircleMinus, LuCircleX, LuEyeOff, LuMessageCircle } from 'react-icons/lu'
import { formatArgs } from '../lib/format'
import { pretty } from '../lib/runner/canonical'
import type { GradeResult, VerificationCheck } from '../types'

const CHECK_STYLE: Record<VerificationCheck['status'], { icon: typeof LuCircleCheck; className: string }> = {
  pass: { icon: LuCircleCheck, className: 'border-emerald-400/25 bg-emerald-400/5 text-emerald-300' },
  fail: { icon: LuCircleX, className: 'border-rose-400/25 bg-rose-400/5 text-rose-300' },
  skipped: { icon: LuCircleMinus, className: 'border-ink-600 bg-ink-850 text-ink-400' },
}

/** Intelligent Code Verification report: syntax, safety, logic, boundaries, output format. */
export function VerificationReport({ result, entry }: { result: GradeResult; entry: string }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {result.checks.map((check) => {
          const style = CHECK_STYLE[check.status]
          const Icon = style.icon
          return (
            <div key={check.key} className={`rounded-xl border p-3 ${style.className}`} title={check.detail}>
              <Icon aria-hidden="true" />
              <p className="mt-1.5 text-xs font-semibold text-ink-100">{check.label}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-ink-400">{check.detail}</p>
            </div>
          )
        })}
      </div>

      {result.diagnostics.length > 0 && (
        <div className="rounded-xl border border-brand-400/25 bg-brand-400/5 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-200">
            <LuMessageCircle aria-hidden="true" /> Mentor feedback
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-200">
            {result.diagnostics.map((message) => <li key={message}>• {message}</li>)}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wider text-ink-400 uppercase">
          Tests · {result.testsPassed}/{result.testsTotal} passed
        </p>
        <ul className="space-y-1.5">
          {result.tests.map((test, index) => (
            <li key={test.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-ink-850 px-3 py-2 text-sm">
              {test.passed ? <LuCircleCheck className="shrink-0 text-emerald-300" aria-label="passed" /> : <LuCircleX className="shrink-0 text-rose-300" aria-label="failed" />}
              {test.visible ? (
                <span className="font-mono text-xs text-ink-200">
                  {entry}({formatArgs(test.args ?? [])}) → expected {pretty(test.expected ?? '')}
                  {!test.passed && <span className="text-rose-200">, got {test.error ? test.error.name : pretty(test.actual ?? 'nothing')}</span>}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-ink-300">
                  <LuEyeOff aria-hidden="true" /> Hidden test {index + 1}
                  {test.timedOut ? ' · never finished' : test.error ? ` · ${test.error.name}` : ''}
                </span>
              )}
              <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${test.category === 'boundary' ? 'bg-amber-400/10 text-amber-300' : 'bg-ink-700 text-ink-300'}`}>
                {test.category}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
