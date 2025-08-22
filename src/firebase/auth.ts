import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import type { User, UserCredential } from 'firebase/auth'
import { auth } from './config'

// Types
export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
}

export interface LoginCredentials {
  username: string
  password: string
}

// Convert username to email format for Firebase Auth
export const convertUsernameToEmail = (username: string): string => {
  return `${username.trim()}@tabungan.app`
}

// Sign in with username and password
export const loginWithUsername = async (credentials: LoginCredentials): Promise<UserCredential> => {
  const email = convertUsernameToEmail(credentials.username)
  return await signInWithEmailAndPassword(auth, email, credentials.password)
}

// Sign out
export const logout = async (): Promise<void> => {
  return await signOut(auth)
}

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// Listen to auth state changes
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Convert Firebase User to AuthUser
export const mapFirebaseUser = (user: User | null): AuthUser | null => {
  if (!user) return null

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName
  }
}
