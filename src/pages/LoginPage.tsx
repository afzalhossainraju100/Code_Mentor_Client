import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { requireAuth, signInWithGoogle } from '../auth/authActions'
import { getAuthErrorMessage } from '../auth/authErrors'
import { useUser } from '../auth/useUser'
import { AuthForm, type AuthFields, type BusyMethod } from '../components/AuthForm'

export function LoginPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'
  const [values, setValues] = useState<AuthFields>({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [busyMethod, setBusyMethod] = useState<BusyMethod>(null)

  // The form shows immediately; an already signed-in visitor is redirected once Firebase confirms it.
  if (user) return <Navigate to={from} replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusyMethod('email')
    try {
      await signInWithEmailAndPassword(requireAuth(), values.email.trim(), values.password)
      navigate(from, { replace: true })
    } catch (authError) {
      setError(getAuthErrorMessage(authError, 'login'))
    } finally {
      setBusyMethod(null)
    }
  }

  async function handleGoogle() {
    setError('')
    setBusyMethod('google')
    try {
      await signInWithGoogle()
      navigate(from, { replace: true })
    } catch (authError) {
      setError(getAuthErrorMessage(authError, 'login', 'google'))
    } finally {
      setBusyMethod(null)
    }
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-100">Welcome back</h1>
      <p className="mt-2 mb-8 text-ink-400">Log in to continue your debugging practice.</p>
      <AuthForm
        mode="login"
        values={values}
        onChange={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
        error={error}
        busyMethod={busyMethod}
        onSubmit={handleSubmit}
        onGoogleSignIn={handleGoogle}
        passwordFooter={
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-xs font-medium text-brand-300 hover:text-brand-200">Forgot password?</Link>
          </div>
        }
      />
      <p className="mt-7 text-center text-sm text-ink-400">
        New to Code Mentor?{' '}
        <Link to="/signup" state={location.state} className="font-semibold text-brand-300 hover:text-brand-200">Create an account</Link>
      </p>
    </>
  )
}
