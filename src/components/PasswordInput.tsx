import { useId, useState } from 'react'
import { LuEye, LuEyeOff, LuLock } from 'react-icons/lu'

type PasswordInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: 'current-password' | 'new-password'
  showStrength?: boolean
}

function strengthOf(password: string) {
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-rose-400' }
  if (score === 2) return { level: 2, label: 'Fair', color: 'bg-amber-400' }
  if (score === 3) return { level: 3, label: 'Good', color: 'bg-sky-400' }
  return { level: 4, label: 'Strong', color: 'bg-emerald-400' }
}

export function PasswordInput({ label, value, onChange, autoComplete, showStrength = false }: PasswordInputProps) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const strength = strengthOf(value)

  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <div className="relative">
        <LuLock className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-500" aria-hidden="true" />
        <input
          id={id}
          required
          minLength={6}
          type={visible ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className="input pr-11 pl-10"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-ink-400 hover:text-ink-100"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}
        </button>
      </div>
      {showStrength && value && (
        <div className="mt-2 flex items-center gap-3" aria-live="polite">
          <div className="grid flex-1 grid-cols-4 gap-1">
            {[1, 2, 3, 4].map((step) => (
              <span key={step} className={`h-1 rounded-full ${step <= strength.level ? strength.color : 'bg-ink-700'}`} />
            ))}
          </div>
          <span className="w-12 text-right text-xs text-ink-400">{strength.label}</span>
        </div>
      )}
    </div>
  )
}
