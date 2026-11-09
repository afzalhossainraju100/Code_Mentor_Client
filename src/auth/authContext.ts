import { createContext } from 'react'
import type { User } from 'firebase/auth'

export type UserContextValue = {
  user: User | null
  loading: boolean
}

export const UserContext = createContext<UserContextValue | undefined>(undefined)
