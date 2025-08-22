<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex-shrink-0 flex items-center">
          <h1 class="text-xl font-bold text-gray-900">Tabungan Ku</h1>
        </div>

        <!-- User Menu -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <span class="text-sm text-gray-700 mr-4">
              Selamat datang, <span class="font-medium">{{ userDisplayName }}</span>
            </span>
          </div>
          <button @click="handleLogout" :disabled="isLoading"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50">
            <span v-if="!isLoading">Logout</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Loading...
            </span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Composables
const router = useRouter()
const authStore = useAuthStore()

// State
const isLoading = ref(false)
// const showMobileMenu = ref(false)

// Computed
const userDisplayName = computed(() => {
  if (authStore.user?.email) {
    // Extract username from email (remove @tabungan.app)
    return authStore.user.email.replace('@tabungan.app', '')
  }
  return 'User'
})

// Methods
const handleLogout = async () => {
  isLoading.value = true
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
