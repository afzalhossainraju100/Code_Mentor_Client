import { runTests, traceCall } from './execute.ts'
import type { WorkerRequest, WorkerResponse } from './types.ts'

// Runs learner code off the main thread. If the code hangs, the page stays responsive
// and codeRunner.ts terminates this worker after a timeout.

const scope = self as unknown as {
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null
  postMessage: (message: WorkerResponse) => void
}

scope.onmessage = (event) => {
  const request = event.data
  try {
    const result = request.kind === 'test'
      ? runTests(request.code, request.entry, request.tests)
      : traceCall(request.code, request.entry, request.args)
    scope.postMessage({ ok: true, result })
  } catch (error) {
    scope.postMessage({ ok: false, error: error instanceof Error ? error.message : String(error) })
  }
}
