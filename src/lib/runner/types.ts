export type RunError = { name: string; message: string; line: number | null }

export type SyntaxProblem = { message: string; line: number | null }

export type TestInput = { id: string; args: unknown[] }

export type TestRunResult = {
  testId: string
  output: string | null
  error: RunError | null
  timedOut: boolean
  logs: string[]
}

export type RunReport = {
  syntaxError: SyntaxProblem | null
  missingEntry: boolean
  results: TestRunResult[]
}

export type TraceStep = { line: number; fn: string; vars: Record<string, string> }

export type TraceResult = {
  syntaxError: SyntaxProblem | null
  missingEntry: boolean
  steps: TraceStep[]
  logs: { afterStep: number; text: string }[]
  returnValue: string | null
  error: RunError | null
  truncated: boolean
  lineCounts: Record<number, number>
}

export type WorkerRequest =
  | { kind: 'test'; code: string; entry: string; tests: TestInput[] }
  | { kind: 'trace'; code: string; entry: string; args: unknown[] }

export type WorkerResponse = { ok: true; result: RunReport | TraceResult } | { ok: false; error: string }
