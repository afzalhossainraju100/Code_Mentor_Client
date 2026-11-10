import { canonical, preview } from './canonical.ts'
import { CodeSyntaxError, instrument, STEP, TICK } from './instrument.ts'
import type { RunError, RunReport, TestInput, TestRunResult, TraceResult, TraceStep } from './types.ts'

// Executes learner code. Runs inside a Web Worker in the browser (see runner.worker.ts),
// so a crash or heavy loop can never freeze the page. Pure functions: also testable in Node.

const LOOP_LIMIT = 200_000 // loop iterations per test before we call it an infinite loop
const STEP_LIMIT = 800 // statements recorded by the visualizer
const MAX_LOGS = 100

class LoopLimitError extends Error {
  constructor() {
    super(`A loop ran more than ${LOOP_LIMIT.toLocaleString('en-US')} times, so it was stopped. This is probably an infinite loop.`)
    this.name = 'InfiniteLoopError'
  }
}

class StepLimitError extends Error {
  constructor() {
    super(`Stopped after ${STEP_LIMIT} steps.`)
    this.name = 'StepLimitError'
  }
}

type Factory = (console: Record<string, (...args: unknown[]) => void>, tick: () => void, step: StepFn) => unknown
type StepFn = (line: number, fn: string, snapshot: () => Record<string, unknown>) => void

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/

// "use strict" on the same line as the code keeps the line offset small and predictable:
// new Function wraps the body in two header lines, so code line 1 is function line 3.
const LINE_OFFSET = 2

function compile(instrumented: string, entry: string): Factory {
  if (!IDENTIFIER.test(entry)) throw new Error('Invalid entry function name')
  // eslint-disable-next-line no-new-func -- running learner code is the purpose of this module
  return new Function('console', TICK, STEP, `"use strict";${instrumented}\n;return typeof ${entry} === "function" ? ${entry} : undefined;`) as Factory
}

function errorLine(error: unknown): number | null {
  const stack = (error as Error)?.stack ?? ''
  const match = stack.match(/(?:<anonymous>|Function):(\d+):\d+/)
  if (!match) return null
  const line = Number(match[1]) - LINE_OFFSET
  return line > 0 ? line : null
}

function describeError(error: unknown): RunError {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, line: errorLine(error) }
  }
  return { name: 'Error', message: String(error), line: null }
}

function createConsole(logs: string[]) {
  const write = (...args: unknown[]) => {
    if (logs.length < MAX_LOGS) logs.push(args.map((arg) => (typeof arg === 'string' ? arg : preview(arg, 200))).join(' '))
  }
  return { log: write, info: write, warn: write, error: write, debug: write }
}

function prepare(code: string, entry: string, mode: 'guard' | 'trace') {
  try {
    return { factory: compile(instrument(code, mode), entry) }
  } catch (error) {
    if (error instanceof CodeSyntaxError) return { syntaxError: { message: error.message, line: error.line } }
    if (error instanceof SyntaxError) return { syntaxError: { message: error.message, line: null } }
    throw error
  }
}

const noopStep: StepFn = () => {}

/** Run every test input. Outputs are canonical strings so the server can compare them exactly. */
export function runTests(code: string, entry: string, tests: TestInput[]): RunReport {
  const prepared = prepare(code, entry, 'guard')
  if (!prepared.factory) return { syntaxError: prepared.syntaxError ?? null, missingEntry: false, results: [] }

  const results: TestRunResult[] = []
  for (const test of tests) {
    const logs: string[] = []
    let ticks = 0
    const tick = () => {
      ticks += 1
      if (ticks > LOOP_LIMIT) throw new LoopLimitError()
    }
    try {
      // Re-create the program for every test so tests cannot affect each other.
      const fn = prepared.factory(createConsole(logs), tick, noopStep)
      if (typeof fn !== 'function') return { syntaxError: null, missingEntry: true, results: [] }
      ticks = 0
      const output = (fn as (...args: unknown[]) => unknown)(...structuredClone(test.args))
      results.push({ testId: test.id, output: canonical(output), error: null, timedOut: false, logs })
    } catch (error) {
      results.push({ testId: test.id, output: null, error: describeError(error), timedOut: error instanceof LoopLimitError, logs })
    }
  }
  return { syntaxError: null, missingEntry: false, results }
}

/** Record every statement of one call so the visualizer can replay it step by step. */
export function traceCall(code: string, entry: string, args: unknown[]): TraceResult {
  const empty = { steps: [], logs: [], returnValue: null, error: null, truncated: false, lineCounts: {} }
  const prepared = prepare(code, entry, 'trace')
  if (!prepared.factory) return { ...empty, syntaxError: prepared.syntaxError ?? null, missingEntry: false }

  const steps: TraceStep[] = []
  const logs: { afterStep: number; text: string }[] = []
  const lineCounts: Record<number, number> = {}
  let ticks = 0
  let recording = false

  const step: StepFn = (line, fn, snapshot) => {
    if (!recording) return
    if (steps.length >= STEP_LIMIT) throw new StepLimitError()
    const raw = snapshot()
    const vars: Record<string, string> = {}
    for (const [name, value] of Object.entries(raw)) {
      if (typeof value !== 'function') vars[name] = preview(value)
    }
    steps.push({ line, fn, vars })
    lineCounts[line] = (lineCounts[line] ?? 0) + 1
  }
  const tick = () => {
    ticks += 1
    if (ticks > LOOP_LIMIT) throw new LoopLimitError()
  }
  const consoleLogs: string[] = []
  const fakeConsole = createConsole(consoleLogs)
  const tracedConsole = Object.fromEntries(
    Object.entries(fakeConsole).map(([key, write]) => [
      key,
      (...items: unknown[]) => {
        const before = consoleLogs.length
        write(...items)
        if (consoleLogs.length > before) logs.push({ afterStep: steps.length, text: consoleLogs.at(-1) ?? '' })
      },
    ]),
  )

  let returnValue: string | null = null
  let error: RunError | null = null
  let truncated = false
  try {
    const fn = prepared.factory(tracedConsole, tick, step)
    if (typeof fn !== 'function') return { ...empty, syntaxError: null, missingEntry: true }
    recording = true
    ticks = 0
    returnValue = preview((fn as (...values: unknown[]) => unknown)(...structuredClone(args)), 200)
  } catch (caught) {
    if (caught instanceof StepLimitError) truncated = true
    else error = describeError(caught)
  }
  return { syntaxError: null, missingEntry: false, steps, logs, returnValue, error, truncated, lineCounts }
}
