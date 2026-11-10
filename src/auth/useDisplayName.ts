import { useUser } from './useUser'

/** Best available name: MongoDB profile → Firebase profile → email prefix. */
export function useDisplayName() {
  const { user, profile } = useUser()
  return profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Learner'
}
