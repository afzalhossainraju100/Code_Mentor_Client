import { AuthConfigError } from './authActions'

export type AuthMode = 'login' | 'signup' | 'reset'
export type AuthMethod = 'email' | 'google'

export function getAuthErrorMessage(error: unknown, mode: AuthMode, method: AuthMethod = 'email'): string {
  if (error instanceof AuthConfigError) return error.message

  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : ''

  switch (code) {
    case 'auth/missing-email':
      return 'Enter your email address.'
    case 'auth/missing-password':
      return 'Enter your password.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support if you think this is a mistake.'
    case 'auth/invalid-email':
      return 'Enter a valid email address.'
    case 'auth/email-already-in-use':
      return 'An account already uses this email. Log in instead or use another email.'
    case 'auth/weak-password':
    case 'auth/password-does-not-meet-requirements':
      return 'Choose a stronger password that meets your Firebase password policy.'
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'The email or password is incorrect.'
    case 'auth/operation-not-allowed':
      return method === 'google'
        ? 'Google sign-in is disabled. Enable the Google provider in Firebase Authentication.'
        : 'Email and password sign-in is disabled. Enable the Email/Password provider in Firebase Authentication.'
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled before it finished. Try again when you are ready.'
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in popup. Allow popups for this site and try again.'
    case 'auth/cancelled-popup-request':
      return 'A Google sign-in window was already open. Finish it or try again.'
    case 'auth/unauthorized-domain':
      return 'This website is not authorized for Firebase sign-in. Add its domain in Firebase Authentication settings.'
    case 'auth/account-exists-with-different-credential':
      return 'An account with this email already uses another sign-in method. Sign in with that method first.'
    case 'auth/operation-not-supported-in-this-environment':
      return 'Google popup sign-in is not supported in this browser. Try a current browser with popups enabled.'
    case 'auth/too-many-requests':
      return 'There have been too many attempts. Wait a little and try again.'
    case 'auth/network-request-failed':
      return 'Could not reach Firebase. Check your internet connection and try again.'
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
      return 'The Firebase web API key is invalid. Check the client Firebase configuration.'
    default:
      if (mode === 'reset') return 'We could not send the reset email. Check the address and try again.'
      return mode === 'signup'
        ? 'We could not create your account. Check your details and try again.'
        : 'We could not sign you in. Check your details and try again.'
  }
}
