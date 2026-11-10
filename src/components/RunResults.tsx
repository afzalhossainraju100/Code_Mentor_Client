import { LuCircleCheck, LuCircleX, LuTerminal, LuTriangleAlert } from 'react-icons/lu'
import { pretty } from '../lib/runner/canonical'

export type ExampleResult = {
  id: string
  call: string
  expected: string
  actual: string | null
  error: string | null
  errorLine: number | null
  passed: boolean
  logs: string[]
}

export type LocalRun = {
  syntaxError: { message: string; line: number | null } | null
  missingEntry: boolean
  entry: string
  examples: ExampleResult[]
}

/** Result of "Run examples": only the visible tests, checked instantly in the browser. */
export function RunResults({ run }: { run: LocalRun }) {
  if (run.syntaxError) {
    return (
      <Problem title={`Syntax error${run.syntaxError.line ? ` on line ${run.syntaxError.line}` : ''}`}>
        {run.syntaxError.message}. The code could not run. Check brackets, parentheses and quotes around that line.
      </Problem>
    )
  }
  if (run.missingEntry) {
    return <Problem title="Function not found">Keep a function named <code className="font-mono">{run.entry}</code> so the tests can call it.</Problem>
  }

  const passed = run.examples.filter((example) => example.passed).length
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-300">
        <strong className={passed === run.examples.length ? 'text-emerald-300' : 'text-amber-300'}>
          {passed}/{run.examples.length} examples pass.
        </strong>{' '}
        {passed === run.examples.length ? 'Now submit to run the hidden tests too.' : 'Compare what you got with what was expected.'}
      </p>
      {run.examples.map((example) => (
        <div key={example.id} className={`rounded-xl border p-3.5 ${example.passed ? 'border-emerald-400/25 bg-emerald-400/5' : 'border-rose-400/25 bg-rose-400/5'}`}>
          <div className="flex items-center gap-2 font-mono text-sm text-ink-100">
            {example.passed ? <LuCircleCheck className="text-emerald-300" aria-label="passed" /> : <LuCircleX className="text-rose-300" aria-label="failed" />}
            {example.call}
          </div>
          <dl className="mt-2 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1 font-mono text-xs">
            <dt className="text-ink-500">expected</dt>
            <dd className="break-all text-ink-200">{pretty(example.expected)}</dd>
            <dt className="text-ink-500">{example.error ? 'error' : 'got'}</dt>
            <dd className={`break-all ${example.passed ? 'text-emerald-200' : 'text-rose-200'}`}>{example.error ?? pretty(example.actual ?? '')}</dd>
          </dl>
          {example.logs.length > 0 && (
            <div className="mt-2.5 rounded-lg bg-ink-950 p-2.5 font-mono text-xs text-ink-300">
              <p className="mb-1 flex items-center gap-1.5 text-[10px] tracking-wider text-ink-500 uppercase"><LuTerminal aria-hidden="true" /> console</p>
              {example.logs.map((log, index) => <div key={index} className="break-all">{log}</div>)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function Problem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm">
      <LuTriangleAlert className="mt-0.5 shrink-0 text-rose-300" aria-hidden="true" />
      <div>
        <p className="font-semibold text-rose-200">{title}</p>
        <p className="mt-1 text-rose-100/80">{children}</p>
      </div>
    </div>
  )
}
