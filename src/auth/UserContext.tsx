import { onAuthStateChanged, type User } from 'firebase/auth'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiFetch } from '../lib/api'
import { UserContext, type Profile, type StorageMode } from './authContext'
import { auth } from './firebase'

type SyncResponse = { user: Profile; storage: StorageMode }

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(Boolean(auth))
  const [profile, setProfile] = useState<Profile | null>(null)
  const [storage, setStorage] = useState<StorageMode | null>(null)

  const syncProfile = useCallback(async (displayName?: string) => {
    const current = auth?.currentUser
    if (!current) return
    try {
      const response = await apiFetch<SyncResponse>('/api/v1/users/sync', {
        method: 'POST',
        body: { displayName: displayName ?? current.displayName, photoURL: current.photoURL },
      })
      setProfile(response.user)
      setStorage(response.storage)
    } catch {
      // The app still works for browsing; API errors are shown on the pages that need data.
    }
  }, [])

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser)
        setLoading(false)
        if (nextUser) {
          void syncProfile()
        } else {
          setProfile(null)
          setStorage(null)
        }
      },
      () => {
        setUser(null)
        setLoading(false)
      },
    )
  }, [syncProfile])

  const value = useMemo(
    () => ({ user, loading, profile, storage, syncProfile }),
    [user, loading, profile, storage, syncProfile],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
