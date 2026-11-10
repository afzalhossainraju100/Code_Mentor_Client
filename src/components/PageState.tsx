import type { ReactNode } from 'react'
import { LuCircleAlert, LuLoaderCircle, LuRefreshCw } from 'react-icons/lu'

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-sm text-ink-400">
      <LuLoaderCircle className="animate-spin" aria-hidden="true" />
      {label}
    </span>
  )
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <Spinner label={label} />
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="card mx-auto max-w-lg p-8 text-center">
      <LuCircleAlert className="mx-auto mb-3 text-rose-300" size={28} aria-hidden="true" />
      <h2 className="text-lg font-bold text-ink-100">Something went wrong</h2>
      <p className="mt-2 text-sm text-ink-400">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-5">
          <LuRefreshCw aria-hidden="true" /> Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-600 p-8 text-center">
      <div className="mx-auto mb-3 grid size-11 place-items-center rounded-xl bg-ink-800 text-brand-300">{icon}</div>
      <h3 className="font-semibold text-ink-100">{title}</h3>
      {children && <div className="mt-2 text-sm text-ink-400">{children}</div>}
    </div>
  )
}
