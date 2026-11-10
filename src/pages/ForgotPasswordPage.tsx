import { sendPasswordResetEmail } from 'firebase/auth'
import { useState, type FormEvent } from 'react'
import { LuCircleAlert, LuCircleCheck, LuMail } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { requireAuth } from '../auth/authActions'
import { getAuthErrorMessage } from '../auth/authErrors'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setStatus('sending')
    try {
      await sendPasswordResetEmail(requireAuth(), email.trim())
      setStatus('sent')
    } catch (authError) {
      const code = (authError as { code?: string }).code
      // Do not reveal whether an account exists for this email.
      if (code === 'auth/user-not-found') {
        setStatus('sent')
        return
      }
      setError(getAuthErrorMessage(authError, 'reset'))
      setStatus('idle')
    }
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-100">Reset your password</h1>
      <p className="mt-2 mb-8 text-ink-400">Enter your email and we will send you a link to choose a new password.</p>

      {status === 'sent' ? (
        <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-200">
          <LuCircleCheck className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>If an account exists for <strong>{email}</strong>, a reset link is on its way. Check your inbox and spam folder.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="label">Email</label>
            <div className="relative">
              <LuMail className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-500" aria-hidden="true" />
              <input id="reset-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input pl-10" placeholder="you@example.com" />
            </div>
          </div>
          {error && (
            <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-200">
              <LuCircleAlert className="mt-0.5 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}
          <button type="submit" disabled={status === 'sending'} className="btn-primary w-full py-3">
            {status === 'sending' ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

      <p className="mt-7 text-center text-sm text-ink-400">
        Remembered it? <Link to="/login" className="font-semibold text-brand-300 hover:text-brand-200">Back to log in</Link>
      </p>
    </>
  )
}
