import type { RunReport, TestInput, TraceResult, WorkerRequest, WorkerResponse } from './types.ts'

// Main-thread API for running learner code in a fresh, disposable Web Worker.
// Each run gets a new worker, which is terminated afterwards (or after a timeout).

const TIMEOUT_MS = 5000

function runInWorker(request: WorkerRequest): Promise<RunReport | TraceResult | 'timeout'> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./runner.worker.ts', import.meta.url), { type: 'module' })
    const timer = window.setTimeout(() => {
      worker.terminate()
      resolve('timeout')
    }, TIMEOUT_MS)

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      window.clearTimeout(timer)
      worker.terminate()
      if (event.data.ok) resolve(event.data.result)
      else reject(new Error(event.data.error))
    }
    worker.onerror = (event) => {
      window.clearTimeout(timer)
      worker.terminate()
      reject(new Error(event.message || 'The code runner crashed.'))
    }
    worker.postMessage(request)
  })
}

const TIMEOUT_ERROR = {
  name: 'TimeoutError',
  message: 'The code took longer than 5 seconds and was stopped.',
  line: null,
}

export async function runTestsSafely(code: string, entry: string, tests: TestInput[]): Promise<RunReport> {
  const result = await runInWorker({ kind: 'test', code, entry, tests })
  if (result === 'timeout') {
    return {
      syntaxError: null,
      missingEntry: false,
      results: tests.map((test) => ({ testId: test.id, output: null, error: TIMEOUT_ERROR, timedOut: true, logs: [] })),
    }
  }
  return result as RunReport
}

export async function traceSafely(code: string, entry: string, args: unknown[]): Promise<TraceResult> {
  const result = await runInWorker({ kind: 'trace', code, entry, args })
  if (result === 'timeout') {
    return { syntaxError: null, missingEntry: false, steps: [], logs: [], returnValue: null, error: TIMEOUT_ERROR, truncated: true, lineCounts: {} }
  }
  return result as TraceResult
}
