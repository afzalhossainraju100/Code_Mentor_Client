import type { FormEvent, ReactNode } from 'react'
import { LuCircleAlert, LuLoaderCircle, LuMail, LuUser } from 'react-icons/lu'
import { GoogleButton } from './GoogleButton'
import { PasswordInput } from './PasswordInput'

export type AuthFields = { name: string; email: string; password: string; confirmPassword: string }
export type BusyMethod = 'email' | 'google' | null

type AuthFormProps = {
  mode: 'login' | 'signup'
  values: AuthFields
  onChange: (field: keyof AuthFields, value: string) => void
  error: string
  busyMethod: BusyMethod
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onGoogleSignIn: () => void
  /** Extra content under the password field, e.g. "Forgot password?" */
  passwordFooter?: ReactNode
}

export function AuthForm({ mode, values, onChange, error, busyMethod, onSubmit, onGoogleSignIn, passwordFooter }: AuthFormProps) {
  const isSignup = mode === 'signup'
  const busy = busyMethod !== null

  return (
    <div className="space-y-5">
      <GoogleButton onClick={onGoogleSignIn} busy={busyMethod === 'google'} disabled={busy} />

      <div className="flex items-center gap-3 text-[11px] font-semibold tracking-widest text-ink-500" aria-hidden="true">
        <span className="h-px flex-1 bg-ink-700" />
        OR WITH EMAIL
        <span className="h-px flex-1 bg-ink-700" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
        {isSignup && (
          <div>
            <label htmlFor="auth-name" className="label">Full name</label>
            <div className="relative">
              <LuUser className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-500" aria-hidden="true" />
              <input id="auth-name" required maxLength={80} autoComplete="name" value={values.name} onChange={(event) => onChange('name', event.target.value)} className="input pl-10" placeholder="Your name" />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="auth-email" className="label">Email</label>
          <div className="relative">
            <LuMail className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-500" aria-hidden="true" />
            <input id="auth-email" required type="email" autoComplete="email" value={values.email} onChange={(event) => onChange('email', event.target.value)} className="input pl-10" placeholder="you@example.com" />
          </div>
        </div>

        <div>
          <PasswordInput
            label="Password"
            value={values.password}
            onChange={(value) => onChange('password', value)}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            showStrength={isSignup}
          />
          {passwordFooter}
        </div>

        {isSignup && (
          <PasswordInput label="Confirm password" value={values.confirmPassword} onChange={(value) => onChange('confirmPassword', value)} autoComplete="new-password" />
        )}

        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-200">
            <LuCircleAlert className="mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <button disabled={busy} type="submit" className="btn-primary w-full py-3">
          {busyMethod === 'email' && <LuLoaderCircle className="animate-spin" aria-hidden="true" />}
          {busyMethod === 'email' ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
