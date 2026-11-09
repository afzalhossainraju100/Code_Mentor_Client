import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthForm } from '../components/AuthForm'
import { auth } from '../auth/firebase'
import { useUser } from '../auth/useUser'

export function LoginPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!auth) {
      setError('Firebase is not configured. Add the VITE_FIREBASE values to your .env file.')
      return
    }
    setSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch {
      setError('Unable to log in. Check your email and password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col px-6 py-20">
      <h1 className="text-4xl font-black text-white">Welcome back</h1>
      <p className="mt-3 mb-8 text-slate-400">Log in to continue learning.</p>
      <AuthForm mode="login" email={email} password={password} error={error} submitting={submitting} onEmailChange={setEmail} onPasswordChange={setPassword} onSubmit={handleSubmit} />
      <p className="mt-6 text-center text-sm text-slate-400">New to Code Mentor? <Link to="/signup" className="text-cyan-300 hover:underline">Create an account</Link></p>
    </main>
  )
}
