import { useEffect, useMemo, useState } from 'react'
import { LuChevronLeft, LuChevronRight, LuLoaderCircle, LuPause, LuPlay, LuScanEye, LuSkipBack, LuSkipForward, LuSparkles, LuTerminal } from 'react-icons/lu'
import { formatArgs } from '../lib/format'
import { canonical, pretty } from '../lib/runner/canonical'
import { traceSafely } from '../lib/runner/codeRunner'
import type { TraceResult, TraceStep } from '../lib/runner/types'
import type { ChallengeDetail } from '../types'
import { CodeView } from './CodeView'

const NO_STEPS: TraceStep[] = []

type ExecutionVisualizerProps = {
  code: string
  entry: string
  examples: ChallengeDetail['examples']
}

type Session = { trace: TraceResult; code: string; call: string; expected: string | null }

/** Visual Bug Execution Analyzer: replay a single call line by line and watch the variables change. */
export function ExecutionVisualizer({ code, entry, examples }: ExecutionVisualizerProps) {
  const [argsText, setArgsText] = useState(() => JSON.stringify(examples[0]?.args ?? []))
  const [session, setSession] = useState<Session | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [busy, setBusy] = useState(false)
  const [inputError, setInputError] = useState('')

  const steps = session?.trace.steps ?? NO_STEPS
  const lastIndex = Math.max(0, steps.length - 1)
  const current = steps[stepIndex]
  const previous = stepIndex > 0 ? steps[stepIndex - 1] : undefined
  const atEnd = stepIndex >= lastIndex

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setStepIndex((index) => {
        if (index >= lastIndex) {
          setPlaying(false)
          return index
        }
        return index + 1
      })
    }, 650)
    return () => window.clearInterval(timer)
  }, [playing, lastIndex])

  const countsSoFar = useMemo(() => {
    const counts: Record<number, number> = {}
    for (const step of steps.slice(0, stepIndex + 1)) counts[step.line] = (counts[step.line] ?? 0) + 1
    return counts
  }, [steps, stepIndex])

  async function visualize(args: unknown[], expected: unknown = undefined) {
    setBusy(true)
    setPlaying(false)
    try {
      const trace = await traceSafely(code, entry, args)
      setSession({
        trace,
        code,
        call: `${entry}(${formatArgs(args)})`,
        expected: expected === undefined ? null : canonical(expected),
      })
      setStepIndex(0)
    } catch (error) {
      setInputError(error instanceof Error ? error.message : 'Could not run the visualizer.')
    } finally {
      setBusy(false)
    }
  }

  function togglePlay() {
    if (atEnd) {
      setStepIndex(0)
      setPlaying(true)
      return
    }
    setPlaying((value) => !value)
  }

  function runCustom() {
    setInputError('')
    try {
      const parsed: unknown = JSON.parse(argsText)
      if (!Array.isArray(parsed)) throw new Error('not an array')
      const match = examples.find((example) => canonical(example.args) === canonical(parsed))
      void visualize(parsed, match?.expected)
    } catch {
      setInputError('Arguments must be a JSON array, for example [5] or [[1, 2, 3]].')
    }
  }

  const insights = session ? buildInsights(session, steps.length) : []
  const logsSoFar = session?.trace.logs.filter((log) => log.afterStep <= stepIndex + 1) ?? []

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1">
          <p className="mb-2 text-xs font-semibold text-ink-300">Choose an input to replay</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example.id}
                type="button"
                disabled={busy}
                onClick={() => {
                  setArgsText(JSON.stringify(example.args))
                  void visualize(example.args, example.expected)
                }}
                className="rounded-lg border border-ink-600 bg-ink-850 px-2.5 py-1.5 font-mono text-xs text-ink-200 hover:border-brand-400/60"
              >
                {entry}({formatArgs(example.args)})
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="visualizer-args">Custom arguments as a JSON array</label>
          <input id="visualizer-args" value={argsText} onChange={(event) => setArgsText(event.target.value)} className="input w-40 py-2 font-mono text-xs" placeholder="[5]" />
          <button type="button" onClick={runCustom} disabled={busy} className="btn-primary py-2">
            {busy ? <LuLoaderCircle className="animate-spin" aria-hidden="true" /> : <LuScanEye aria-hidden="true" />} Visualize
          </button>
        </div>
      </div>
      {inputError && <p role="alert" className="text-sm text-rose-300">{inputError}</p>}

      {!session && !busy && (
        <div className="rounded-xl border border-dashed border-ink-600 p-6 text-center text-sm text-ink-400">
          Pick an input above. You will see which line runs, how many times, and how every variable changes. It is the best way to understand <em>why</em> a loop gives the wrong result.
        </div>
      )}

      {session?.trace.syntaxError && (
        <p role="alert" className="rounded-xl border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-200">
          Syntax error{session.trace.syntaxError.line ? ` on line ${session.trace.syntaxError.line}` : ''}: {session.trace.syntaxError.message}. Fix it before visualizing.
        </p>
      )}
      {session?.trace.missingEntry && (
        <p role="alert" className="rounded-xl border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-200">Function {entry} was not found.</p>
      )}

      {session && steps.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-ink-700 bg-ink-850 p-2">
            <button type="button" className="btn-ghost px-2.5 py-2" onClick={() => setStepIndex(0)} disabled={stepIndex === 0} aria-label="First step"><LuSkipBack /></button>
            <button type="button" className="btn-ghost px-2.5 py-2" onClick={() => setStepIndex((index) => Math.max(0, index - 1))} disabled={stepIndex === 0} aria-label="Previous step"><LuChevronLeft /></button>
            <button type="button" className="btn-secondary px-3 py-2" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <LuPause /> : <LuPlay />}
            </button>
            <button type="button" className="btn-ghost px-2.5 py-2" onClick={() => setStepIndex((index) => Math.min(lastIndex, index + 1))} disabled={atEnd} aria-label="Next step"><LuChevronRight /></button>
            <button type="button" className="btn-ghost px-2.5 py-2" onClick={() => setStepIndex(lastIndex)} disabled={atEnd} aria-label="Last step"><LuSkipForward /></button>
            <input
              type="range"
              min={0}
              max={lastIndex}
              value={stepIndex}
              onChange={(event) => {
                setPlaying(false)
                setStepIndex(Number(event.target.value))
              }}
              className="mx-2 min-w-32 flex-1 accent-brand-400"
              aria-label="Step"
            />
            <span className="px-2 text-xs text-ink-300 tabular-nums">Step {stepIndex + 1} / {steps.length}</span>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
            <CodeView code={session.code} activeLine={current?.line} lineCounts={countsSoFar} errorLine={atEnd ? session.trace.error?.line : null} />

            <div className="space-y-3">
              <div className="rounded-xl border border-ink-700 bg-ink-850 p-3.5">
                <div className="flex items-center justify-between text-xs text-ink-400">
                  <span>Variables before line <strong className="text-ink-100">{current?.line}</strong> runs</span>
                  <span className="font-mono text-brand-300">{current?.fn}</span>
                </div>
                <table className="mt-2.5 w-full font-mono text-sm">
                  <tbody>
                    {Object.entries(current?.vars ?? {}).map(([name, value]) => {
                      const changed = previous && previous.fn === current?.fn && previous.vars[name] !== value
                      return (
                        <tr key={name} className="border-t border-ink-700/70 first:border-t-0">
                          <td className="py-1.5 pr-3 text-sky-300">{name}</td>
                          <td className={`py-1.5 break-all ${changed ? 'font-semibold text-amber-300' : 'text-ink-100'}`}>
                            {pretty(value)}
                            {changed && <span className="ml-2 text-[10px] font-sans font-medium text-amber-400/80">changed</span>}
                          </td>
                        </tr>
                      )
                    })}
                    {Object.keys(current?.vars ?? {}).length === 0 && (
                      <tr><td className="py-1.5 text-xs font-sans text-ink-500">No variables yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {atEnd && (
                <div className="rounded-xl border border-ink-700 bg-ink-850 p-3.5 font-mono text-sm">
                  <p className="text-xs font-sans text-ink-400">{session.call}</p>
                  {session.trace.error ? (
                    <p className="mt-1 text-rose-300">{session.trace.error.name}: {session.trace.error.message}</p>
                  ) : session.trace.truncated ? (
                    <p className="mt-1 text-amber-300">Stopped: too many steps</p>
                  ) : (
                    <p className="mt-1 text-ink-100">
                      returned <span className={session.expected && session.expected !== session.trace.returnValue ? 'text-rose-300' : 'text-emerald-300'}>{pretty(session.trace.returnValue ?? 'undefined')}</span>
                      {session.expected && <span className="text-ink-400"> · expected {pretty(session.expected)}</span>}
                    </p>
                  )}
                </div>
              )}

              {logsSoFar.length > 0 && (
                <div className="rounded-xl bg-ink-950 p-3 font-mono text-xs text-ink-300">
                  <p className="mb-1 flex items-center gap-1.5 text-[10px] tracking-wider text-ink-500 uppercase"><LuTerminal aria-hidden="true" /> console</p>
                  {logsSoFar.map((log, index) => <div key={index} className="break-all">{log.text}</div>)}
                </div>
              )}
            </div>
          </div>

          {insights.length > 0 && (
            <div className="rounded-xl border border-brand-400/25 bg-brand-400/5 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-brand-200"><LuSparkles aria-hidden="true" /> What the analyzer noticed</p>
              <ul className="mt-2 space-y-1 text-sm text-ink-200">
                {insights.map((insight) => <li key={insight}>• {insight}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function buildInsights({ trace, expected }: Session, totalSteps: number): string[] {
  const insights: string[] = []
  const counts = Object.entries(trace.lineCounts).map(([line, count]) => ({ line: Number(line), count }))
  const hottest = counts.sort((a, b) => b.count - a.count)[0]
  if (hottest && hottest.count > 1) {
    insights.push(`Line ${hottest.line} ran ${hottest.count} times. If this is a loop, is that the number of iterations you expected?`)
  }
  if (trace.truncated) {
    insights.push(`The replay stopped after ${totalSteps} steps, so the code probably never finishes. Step through and look for the variable that never changes.`)
  }
  if (trace.error) {
    insights.push(`The code crashed${trace.error.line ? ` on line ${trace.error.line}` : ''} with ${trace.error.name}: ${trace.error.message}`)
  }
  if (!trace.error && !trace.truncated && expected && trace.returnValue !== null && trace.returnValue !== expected) {
    insights.push(`It returned ${pretty(trace.returnValue)} but ${pretty(expected)} was expected. Compare the variables in the last steps with what you expected.`)
  }
  if (!trace.error && !trace.truncated && expected && trace.returnValue === expected) {
    insights.push('This input gives the expected result. Try another input, especially an edge case.')
  }
  return insights
}
