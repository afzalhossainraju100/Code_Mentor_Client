import { LuTriangleAlert } from 'react-icons/lu'
import { useUser } from '../auth/useUser'

/** Warns during development when the server cannot reach MongoDB and keeps progress in memory. */
export function StorageBanner() {
  const { storage } = useUser()
  if (storage !== 'memory') return null
  return (
    <div role="status" className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3.5 text-sm text-amber-200">
      <LuTriangleAlert className="mt-0.5 shrink-0" aria-hidden="true" />
      <p>
        <strong className="font-semibold">Progress is not being saved permanently.</strong> The server cannot reach MongoDB, so it is
        using temporary memory that resets on restart. Check <code className="rounded bg-amber-400/15 px-1">MONGODB_URI</code> and
        Atlas → Network Access.
      </p>
    </div>
  )
}
