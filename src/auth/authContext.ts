import type { User } from 'firebase/auth'
import { createContext } from 'react'

export type Profile = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export type StorageMode = 'mongodb' | 'memory' | 'unavailable'

export type UserContextValue = {
  user: User | null
  loading: boolean
  /** Profile stored in MongoDB (null until the first sync finishes). */
  profile: Profile | null
  /** Where the server keeps progress. "memory" means MongoDB is not connected (dev only). */
  storage: StorageMode | null
  /** Create or refresh the MongoDB profile. Pass a name right after sign-up. */
  syncProfile: (displayName?: string) => Promise<void>
}

export const UserContext = createContext<UserContextValue | undefined>(undefined)
