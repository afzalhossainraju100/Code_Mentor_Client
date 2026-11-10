import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { requireAuth, signInWithGoogle } from '../auth/authActions'
import { getAuthErrorMessage } from '../auth/authErrors'
import { useUser } from '../auth/useUser'
import { AuthForm, type AuthFields, type BusyMethod } from '../components/AuthForm'

const MIN_PASSWORD_LENGTH = 8

export function SignupPage() {
  const { user, syncProfile } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'
  const [values, setValues] = useState<AuthFields>({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [busyMethod, setBusyMethod] = useState<BusyMethod>(null)
  const [creating, setCreating] = useState(false)

  // While the new account is being finished (name + profile sync), stay on this page.
  if (user && !creating) return <Navigate to={from} replace />

  function validate() {
    if (values.name.trim().length < 2) return 'Enter your name (at least 2 characters).'
    if (values.password.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`
    if (values.password !== values.confirmPassword) return 'The two passwords do not match.'
    return ''
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const problem = validate()
    setError(problem)
    if (problem) return

    setBusyMethod('email')
    setCreating(true)
    try {
      const credential = await createUserWithEmailAndPassword(requireAuth(), values.email.trim(), values.password)
      const name = values.name.trim()
      await updateProfile(credential.user, { displayName: name })
      await syncProfile(name)
      navigate(from, { replace: true })
    } catch (authError) {
      setCreating(false)
      setError(getAuthErrorMessage(authError, 'signup'))
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
      setError(getAuthErrorMessage(authError, 'signup', 'google'))
    } finally {
      setBusyMethod(null)
    }
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-100">Create your account</h1>
      <p className="mt-2 mb-8 text-ink-400">Free forever. Start fixing your first bug in under a minute.</p>
      <AuthForm
        mode="signup"
        values={values}
        onChange={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
        error={error}
        busyMethod={busyMethod}
        onSubmit={handleSubmit}
        onGoogleSignIn={handleGoogle}
      />
      <p className="mt-7 text-center text-sm text-ink-400">
        Already have an account?{' '}
        <Link to="/login" state={location.state} className="font-semibold text-brand-300 hover:text-brand-200">Log in</Link>
      </p>
    </>
  )
}
