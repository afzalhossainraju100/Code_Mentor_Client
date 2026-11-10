import { auth } from '../auth/firebase'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type RequestOptions = { method?: 'GET' | 'POST'; body?: unknown }

/** Calls the Code Mentor API with the signed-in user's Firebase ID token. */
export async function apiFetch<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  const user = auth?.currentUser
  if (user) headers.set('Authorization', `Bearer ${await user.getIdToken()}`)

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the Code Mentor server. Make sure it is running, then try again.')
  }

  const data = (await response.json().catch(() => null)) as { error?: string } | null
  if (!response.ok) {
    throw new ApiError(response.status, data?.error ?? `Request failed with status ${response.status}.`)
  }
  return data as T
}

/** The learner's time-zone offset, so "today" and streaks match their own calendar. */
export function tzParam() {
  return `tz=${new Date().getTimezoneOffset()}`
}
