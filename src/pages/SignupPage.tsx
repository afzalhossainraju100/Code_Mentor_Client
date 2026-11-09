import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { auth } from '../auth/firebase'
import { AuthForm } from '../components/AuthForm'
import { useUser } from '../auth/useUser'

export function SignupPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!auth) {
      setError('Firebase is not configured. Add the VITE_FIREBASE values to your .env file.')
      return
    }
    setSubmitting(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch {
      setError('Unable to create your account. Check the email and password requirements.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col px-6 py-20">
      <h1 className="text-4xl font-black text-white">Create your account</h1>
      <p className="mt-3 mb-8 text-slate-400">Start building better debugging habits.</p>
      <AuthForm mode="signup" email={email} password={password} confirmPassword={confirmPassword} error={error} submitting={submitting} onEmailChange={setEmail} onPasswordChange={setPassword} onConfirmPasswordChange={setConfirmPassword} onSubmit={handleSubmit} />
      <p className="mt-6 text-center text-sm text-slate-400">Already have an account? <Link to="/login" className="text-cyan-300 hover:underline">Log in</Link></p>
    </main>
  )
}
