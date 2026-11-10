import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, firebaseConfigError } from './firebase'

export class AuthConfigError extends Error {}

export function requireAuth() {
  if (!auth) throw new AuthConfigError(firebaseConfigError())
  return auth
}

/** Google popup sign-in. Works for both sign-up and login: Firebase creates the account on first use. */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  return signInWithPopup(requireAuth(), provider)
}
