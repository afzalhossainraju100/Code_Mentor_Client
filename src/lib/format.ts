import type { ConceptStatus, Difficulty, PlanItem } from '../types'

export function formatDuration(totalSeconds: number | null | undefined): string {
  if (totalSeconds == null) return '—'
  const seconds = Math.max(0, Math.round(totalSeconds))
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  if (minutes < 60) return rest ? `${minutes}m ${rest}s` : `${minutes}m`
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

export function formatRelative(date: string | Date): string {
  const then = new Date(date).getTime()
  const diff = Date.now() - then
  const minutes = Math.round(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatDay(key: string): string {
  return new Date(`${key}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export function percentText(value: number | null | undefined): string {
  return value == null ? '—' : `${value}%`
}

export const DIFFICULTY_STYLES: Record<Difficulty, { label: string; className: string }> = {
  easy: { label: 'Easy', className: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' },
  medium: { label: 'Medium', className: 'border-amber-400/30 bg-amber-400/10 text-amber-300' },
  hard: { label: 'Hard', className: 'border-rose-400/30 bg-rose-400/10 text-rose-300' },
}

export const CONCEPT_STATUS: Record<ConceptStatus, { label: string; className: string; description: string }> = {
  'not-started': { label: 'Not started', className: 'text-ink-400 bg-ink-800 border-ink-600', description: 'No attempts yet.' },
  learning: { label: 'Learning', className: 'text-sky-300 bg-sky-400/10 border-sky-400/30', description: 'Attempted, not solved yet.' },
  'solved-once': { label: 'Needs proof', className: 'text-amber-300 bg-amber-400/10 border-amber-400/30', description: 'Solved once. Solve a second variation to verify.' },
  verified: { label: 'Verified', className: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30', description: 'Two different bugs fixed: real understanding.' },
  'needs-review': { label: 'Needs review', className: 'text-rose-300 bg-rose-400/10 border-rose-400/30', description: 'Solved before, but a later attempt or twin failed.' },
}

export const PLAN_KIND: Record<PlanItem['kind'], { label: string; className: string }> = {
  'warm-up': { label: 'Warm-up', className: 'text-sky-300 bg-sky-400/10 border-sky-400/30' },
  review: { label: 'Spaced review', className: 'text-amber-300 bg-amber-400/10 border-amber-400/30' },
  verify: { label: 'Verify', className: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30' },
  focus: { label: 'Weakness focus', className: 'text-rose-300 bg-rose-400/10 border-rose-400/30' },
  stretch: { label: 'New ground', className: 'text-brand-300 bg-brand-400/10 border-brand-400/30' },
}

export const FAILURE_LABELS: Record<string, string> = {
  syntax: 'Syntax error',
  'missing-entry': 'Function missing',
  timeout: 'Infinite loop',
  runtime: 'Runtime error',
  output: 'Wrong output type',
  boundary: 'Boundary case',
  logic: 'Logic error',
}

/** Bar colour for a 0–100 mastery value (green strong, orange developing, red weak). */
export function masteryColor(value: number, started = true): string {
  if (!started) return 'bg-ink-600'
  if (value >= 70) return 'bg-emerald-400'
  if (value >= 50) return 'bg-amber-400'
  return 'bg-rose-400'
}

export function formatArgs(args: unknown[]): string {
  return args.map((arg) => JSON.stringify(arg)).join(', ')
}
