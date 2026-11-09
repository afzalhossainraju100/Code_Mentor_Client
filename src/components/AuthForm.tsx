import type { FormEvent } from 'react'

type AuthFormProps = {
  mode: 'login' | 'signup'
  email: string
  password: string
  confirmPassword?: string
  error: string
  submitting: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange?: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function AuthForm({
  mode,
  email,
  password,
  confirmPassword = '',
  error,
  submitting,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: AuthFormProps) {
  const isSignup = mode === 'signup'

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block text-sm font-medium text-slate-300">
        Email
        <input required type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300" />
      </label>
      <label className="block text-sm font-medium text-slate-300">
        Password
        <input required minLength={6} type="password" value={password} onChange={(event) => onPasswordChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300" />
      </label>
      {isSignup && (
        <label className="block text-sm font-medium text-slate-300">
          Confirm password
          <input required minLength={6} type="password" value={confirmPassword} onChange={(event) => onConfirmPasswordChange?.(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300" />
        </label>
      )}
      {error && <p role="alert" className="rounded-lg bg-rose-400/10 p-3 text-sm text-rose-300">{error}</p>}
      <button disabled={submitting} type="submit" className="w-full rounded-lg bg-cyan-300 px-4 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? 'Please wait...' : isSignup ? 'Create account' : 'Log in'}
      </button>
    </form>
  )
}
