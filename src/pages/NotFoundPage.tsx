import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="font-mono text-sm text-brand-300">ReferenceError: page is not defined</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-100">404 · Page not found</h1>
      <p className="mt-3 text-ink-400">This page does not exist. Maybe the link has an off-by-one error?</p>
      <Link to="/" className="btn-primary mt-8">Back to home</Link>
    </main>
  )
}
