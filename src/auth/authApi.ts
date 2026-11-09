import type { User } from 'firebase/auth'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function fetchWithAuth(user: User, path: string, options: RequestInit = {}) {
  const token = await user.getIdToken()
  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${token}`)
  headers.set('Content-Type', 'application/json')

  return fetch(`${apiUrl}${path}`, { ...options, headers })
}
