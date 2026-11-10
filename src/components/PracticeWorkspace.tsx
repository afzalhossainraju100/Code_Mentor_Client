import { useState } from 'react'
import { LuEyeOff, LuLoaderCircle, LuPlay, LuRotateCcw, LuScanEye, LuSend } from 'react-icons/lu'
import { apiFetch } from '../lib/api'
import { formatArgs } from '../lib/format'
import { canonical, pretty } from '../lib/runner/canonical'
import { runTestsSafely } from '../lib/runner/codeRunner'
import type { ChallengeDetail, Hint, SubmissionResponse } from '../types'
import { ConceptStatusBadge, DifficultyBadge } from './Badges'
import { CodeEditor } from './CodeEditor'
import { ExecutionVisualizer } from './ExecutionVisualizer'
import { HintPanel } from './HintPanel'
import { RunResults, type LocalRun } from './RunResults'
import { SuccessPanel } from './SuccessPanel'
import { VerificationReport } from './VerificationReport'

// Small per-learner conveniences in the browser: the code draft and revealed hints survive a reload.
const draftKey = (id: string) => `cm:draft:${id}`
const hintsKey = (id: string) => `cm:hints:${id}`

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable (private mode); the workspace still works.
  }
}

type Tab = 'results' | 'visualizer'

export function PracticeWorkspace({ challenge }: { challenge: ChallengeDetail }) {
  const [code, setCode] = useState(() => readStorage(draftKey(challenge.id), challenge.starterCode))
  const [hints, setHints] = useState<Hint[]>(() => readStorage(hintsKey(challenge.id), []))
  const [hintBusy, setHintBusy] = useState(false)
  const [hintError, setHintError] = useState('')
  const [tab, setTab] = useState<Tab>('results')
  const [run, setRun] = useState<LocalRun | null>(null)
  const [submission, setSubmission] = useState<SubmissionResponse | null>(null)
  const [busy, setBusy] = useState<'run' | 'submit' | null>(null)
  const [submitError, setSubmitError] = useState('')
  const [startedAt] = useState(() => Date.now())

  const errorLine =
    run?.syntaxError?.line ??
    submission?.result.syntaxError?.line ??
    run?.examples.find((example) => example.error)?.errorLine ??
    null

  function updateCode(value: string) {
    setCode(value)
    writeStorage(draftKey(challenge.id), value)
  }

  function resetCode() {
    updateCode(challenge.starterCode)
    writeStorage(draftKey(challenge.id), null)
    setRun(null)
    setSubmission(null)
  }

  async function runExamples() {
    setTab('results')
    setBusy('run')
    setSubmitError('')
    setSubmission(null)
    try {
      const report = await runTestsSafely(code, challenge.entry, challenge.examples)
      setRun({
        syntaxError: report.syntaxError,
        missingEntry: report.missingEntry,
        entry: challenge.entry,
        examples: challenge.examples.map((example) => {
          const result = report.results.find((item) => item.testId === example.id)
          const expected = canonical(example.expected)
          return {
            id: example.id,
            call: `${challenge.entry}(${formatArgs(example.args)})`,
            expected,
            actual: result?.output ?? null,
            error: result?.error ? `${result.error.name}: ${result.error.message}` : null,
            errorLine: result?.error?.line ?? null,
            passed: Boolean(result && !result.error && result.output === expected),
            logs: result?.logs ?? [],
          }
        }),
      })
    } finally {
      setBusy(null)
    }
  }

  async function submit() {
    setTab('results')
    setBusy('submit')
    setSubmitError('')
    setRun(null)
    try {
      const report = await runTestsSafely(code, challenge.entry, [...challenge.examples, ...challenge.hiddenTests])
      const response = await apiFetch<SubmissionResponse>(`/api/v1/challenges/${challenge.id}/submissions`, {
        method: 'POST',
        body: {
          code,
          hintsUsed: hints.length,
          timeSpentSec: Math.round((Date.now() - startedAt) / 1000),
          report: {
            syntaxError: report.syntaxError,
            missingEntry: report.missingEntry,
            results: report.results.map(({ testId, output, error, timedOut }) => ({ testId, output, error, timedOut })),
          },
        },
      })
      setSubmission(response)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  async function requestHint() {
    setHintBusy(true)
    setHintError('')
    try {
      const { hint } = await apiFetch<{ hint: Hint }>(`/api/v1/challenges/${challenge.id}/hints`, {
        method: 'POST',
        body: { level: hints.length + 1, code },
      })
      const next = [...hints, hint]
      setHints(next)
      writeStorage(hintsKey(challenge.id), next)
    } catch (error) {
      setHintError(error instanceof Error ? error.message : 'Could not load a hint.')
    } finally {
      setHintBusy(false)
    }
  }

  const tabClass = (value: Tab) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${tab === value ? 'bg-ink-700 text-ink-100' : 'text-ink-400 hover:text-ink-100'}`

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(300px,380px)_1fr]">
      {/* Left: the problem */}
      <div className="space-y-5 lg:sticky lg:top-6">
        <section className="card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={challenge.difficulty} />
            <ConceptStatusBadge status={challenge.conceptStatus} />
          </div>
          <p className="mt-3 text-xs font-medium text-ink-400">{challenge.topicLabel} · {challenge.conceptName}</p>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight text-ink-100">{challenge.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">{challenge.description}</p>

          <h2 className="mt-5 text-xs font-semibold tracking-wider text-ink-400 uppercase">Examples</h2>
          <ul className="mt-2 space-y-1.5">
            {challenge.examples.map((example) => (
              <li key={example.id} className="rounded-lg bg-ink-850 px-3 py-2 font-mono text-xs text-ink-200">
                {challenge.entry}({formatArgs(example.args)}) <span className="text-ink-500">→</span> {pretty(canonical(example.expected))}
              </li>
            ))}
          </ul>
          <p className="mt-3 flex items-center gap-2 text-xs text-ink-400">
            <LuEyeOff aria-hidden="true" /> {challenge.hiddenTests.length} hidden tests (including edge cases) run when you submit.
          </p>
        </section>

        <HintPanel
          hints={hints}
          total={challenge.hintCount}
          busy={hintBusy}
          error={hintError}
          onRequest={requestHint}
          onOpenVisualizer={() => setTab('visualizer')}
        />
      </div>

      {/* Right: the workspace */}
      <div className="min-w-0 space-y-5">
        <CodeEditor value={code} onChange={updateCode} errorLine={errorLine} />

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={runExamples} disabled={busy !== null} className="btn-secondary">
            {busy === 'run' ? <LuLoaderCircle className="animate-spin" aria-hidden="true" /> : <LuPlay aria-hidden="true" />} Run examples
          </button>
          <button type="button" onClick={submit} disabled={busy !== null} className="btn-primary">
            {busy === 'submit' ? <LuLoaderCircle className="animate-spin" aria-hidden="true" /> : <LuSend aria-hidden="true" />} Submit for verification
          </button>
          <button type="button" onClick={() => setTab('visualizer')} className="btn-ghost">
            <LuScanEye aria-hidden="true" /> Visualize
          </button>
          <button type="button" onClick={resetCode} className="btn-ghost ml-auto" title="Restore the original buggy code">
            <LuRotateCcw aria-hidden="true" /> Reset
          </button>
        </div>

        {submitError && <p role="alert" className="rounded-xl border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-200">{submitError}</p>}
        {submission?.result.passed && <SuccessPanel submission={submission} />}

        <section className="card p-4 sm:p-5">
          <div className="mb-4 flex gap-1 rounded-xl bg-ink-850 p-1" role="tablist" aria-label="Output">
            <button type="button" role="tab" aria-selected={tab === 'results'} className={tabClass('results')} onClick={() => setTab('results')}>Test results</button>
            <button type="button" role="tab" aria-selected={tab === 'visualizer'} className={tabClass('visualizer')} onClick={() => setTab('visualizer')}>Visual analyzer</button>
          </div>

          <div role="tabpanel" hidden={tab !== 'results'}>
            {submission ? (
              <VerificationReport result={submission.result} entry={challenge.entry} />
            ) : run ? (
              <RunResults run={run} />
            ) : (
              <p className="py-6 text-center text-sm text-ink-400">
                <strong className="text-ink-200">Run examples</strong> checks the visible examples instantly.{' '}
                <strong className="text-ink-200">Submit</strong> also runs the hidden tests and records your progress.
              </p>
            )}
          </div>
          <div role="tabpanel" hidden={tab !== 'visualizer'}>
            <ExecutionVisualizer code={code} entry={challenge.entry} examples={challenge.examples} />
          </div>
        </section>
      </div>
    </div>
  )
}
