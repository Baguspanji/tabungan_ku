import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from 'firebase/auth'
import {
  loginWithUsername,
  logout as firebaseLogout,
  onAuthChange,
  getCurrentUser,
  mapFirebaseUser
} from '@/firebase/auth'
import type { LoginCredentials, AuthUser } from '@/firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || null)
  const userId = computed(() => user.value?.uid || null)

  // Actions
  const initializeAuth = () => {
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthChange((firebaseUser: User | null) => {
        user.value = mapFirebaseUser(firebaseUser)

        if (!isInitialized.value) {
          isInitialized.value = true
          resolve()
        }
      })

      // Store unsubscribe function for cleanup if needed
      return unsubscribe
    })
  }

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    try {
      const userCredential = await loginWithUsername(credentials)
      user.value = mapFirebaseUser(userCredential.user)
      return userCredential
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    try {
      await firebaseLogout()
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  const refreshUser = () => {
    const currentUser = getCurrentUser()
    user.value = mapFirebaseUser(currentUser)
  }

  return {
    // State
    user,
    isLoading,
    isInitialized,

    // Getters
    isAuthenticated,
    userEmail,
    userId,

    // Actions
    initializeAuth,
    login,
    logout,
    refreshUser
  }
})
