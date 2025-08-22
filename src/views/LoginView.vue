<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          Tabungan Ku
        </h2>
      </div>
      <p class="mt-2 text-center text-sm text-gray-600">
        Masuk ke akun Anda untuk mengelola tabungan
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Alert Component -->
        <div v-if="alert.show" :class="[
          'mb-4 p-4 rounded-md transition-all duration-300',
          alert.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        ]">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg v-if="alert.type === 'success'" class="h-5 w-5 text-green-400" fill="currentColor"
                viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
              </svg>
              <svg v-else class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p :class="alert.type === 'success' ? 'text-green-800' : 'text-red-800'" class="text-sm font-medium">
                {{ alert.message }}
              </p>
            </div>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div class="mt-1">
              <input id="username" v-model="loginForm.username" name="username" type="text" required
                class="appearance-none block w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Masukkan username" :disabled="isLoading" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1 relative">
              <input id="password" v-model="loginForm.password" name="password"
                :type="showPassword ? 'text' : 'password'" required
                class="appearance-none block w-full px-3 py-2 pr-10 text-gray-800 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Masukkan password" :disabled="isLoading" />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button type="button" @click="togglePasswordVisibility"
                  class="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                  :disabled="isLoading">
                  <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div>
            <button type="submit" :disabled="isLoading || !isFormValid"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              <span v-if="!isLoading">Masuk</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Memproses...
              </span>
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Belum punya akun?</span>
            </div>
          </div>

          <div class="mt-6">
            <p class="text-center text-sm text-gray-600">
              Hubungi administrator untuk mendaftar akun baru
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/firebase/auth'

// Types
interface LoginForm {
  username: string
  password: string
}

interface Alert {
  show: boolean
  message: string
  type: 'success' | 'error'
}

interface FirebaseError {
  code: string
  message: string
}

// Composables
const router = useRouter()
const authStore = useAuthStore()

// Reactive state
const loginForm = ref<LoginForm>({
  username: '',
  password: ''
})

const showPassword = ref(false)
const isLoading = ref(false)

const alert = ref<Alert>({
  show: false,
  message: '',
  type: 'error'
})

// Computed properties
const isFormValid = computed(() => {
  return loginForm.value.username.trim() !== '' && loginForm.value.password !== ''
})

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const showAlert = (message: string, type: 'success' | 'error' = 'error') => {
  alert.value = {
    show: true,
    message,
    type
  }

  // Auto hide alert after 5 seconds
  setTimeout(() => {
    alert.value.show = false
  }, 5000)
}

const clearAlert = () => {
  alert.value.show = false
}

const handleLoginError = (error: FirebaseError) => {
  console.error('Login error:', error)

  let message = 'Terjadi kesalahan saat login. Silakan coba lagi.'

  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      message = 'Username atau password salah.'
      break
    case 'auth/too-many-requests':
      message = 'Terlalu banyak percobaan login. Coba lagi nanti.'
      break
    case 'auth/invalid-email':
      message = 'Format username tidak valid.'
      break
    case 'auth/network-request-failed':
      message = 'Koneksi jaringan bermasalah. Periksa koneksi internet Anda dan coba lagi.'
      break
    case 'auth/timeout':
      message = 'Permintaan timeout. Silakan coba lagi.'
      break
    case 'auth/unavailable':
      message = 'Layanan autentikasi tidak tersedia. Coba lagi nanti.'
      break
    default:
      message = `Terjadi kesalahan: ${error.message}`
      break
  }

  showAlert(message, 'error')
}

const handleLogin = async () => {
  if (!isFormValid.value || isLoading.value) return

  clearAlert()
  isLoading.value = true

  try {
    const credentials: LoginCredentials = {
      username: loginForm.value.username,
      password: loginForm.value.password
    }

    // Authenticate with auth store
    await authStore.login(credentials)
    console.log('Login successful')

    showAlert('Login berhasil. Mengalihkan...', 'success')

    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)

  } catch (error: unknown) {
    const firebaseError = error as FirebaseError
    handleLoginError(firebaseError)
  } finally {
    isLoading.value = false
  }
}

// Check if user is already logged in when component mounts
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>
