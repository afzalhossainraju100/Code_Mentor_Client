import { getAnalytics, isSupported } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebase handles authentication only. Learner data lives in MongoDB via the Code Mentor API.
// These web config values are public by design; protect the project with Firebase
// authorized domains and API key restrictions in the Google Cloud console.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const requiredAuthConfig = {
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  VITE_FIREBASE_APP_ID: firebaseConfig.appId,
}

export const missingFirebaseConfig = Object.entries(requiredAuthConfig)
  .filter(([, value]) => !value)
  .map(([name]) => name)

export const firebaseApp = missingFirebaseConfig.length === 0 ? initializeApp(firebaseConfig) : null
export const auth = firebaseApp ? getAuth(firebaseApp) : null

export function firebaseConfigError() {
  return missingFirebaseConfig.length
    ? `Firebase is not configured. Add these values to the client .env file: ${missingFirebaseConfig.join(', ')}.`
    : 'Firebase Authentication could not be initialized. Check the client Firebase configuration.'
}

if (firebaseApp && firebaseConfig.measurementId) {
  void isSupported()
    .then((supported) => {
      if (supported) getAnalytics(firebaseApp)
    })
    .catch(() => {})
}
