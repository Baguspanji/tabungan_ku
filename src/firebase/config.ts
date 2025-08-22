import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'tabungan-ku-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'tabungan-ku-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'tabungan-ku-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef123456'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Development: Connect to Firebase emulators if explicitly enabled
// Set VITE_USE_EMULATORS=true in your .env file to use emulators
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true' && !auth.emulatorConfig) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
    connectFirestoreEmulator(db, 'localhost', 8080)
    console.log('🔥 Connected to Firebase emulators')
  } catch (error) {
    console.warn('⚠️ Firebase emulators not available, using production services:', error)
  }
} else if (import.meta.env.DEV) {
  console.log('🚀 Using production Firebase services in development mode')
}

export default app
