import { FcGoogle } from 'react-icons/fc'

export function GoogleButton({ onClick, busy, disabled }: { onClick: () => void; busy: boolean; disabled: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="btn-secondary w-full py-3">
      <FcGoogle size={19} aria-hidden="true" />
      {busy ? 'Connecting to Google…' : 'Continue with Google'}
    </button>
  )
}
