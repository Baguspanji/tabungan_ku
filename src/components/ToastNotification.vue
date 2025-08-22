<template>
  <!-- Toast Container -->
  <div v-if="toastStore.toasts.length > 0" class="fixed top-4 right-4 z-50 space-y-2" aria-live="polite"
    aria-label="Notifications">
    <Transition v-for="toast in toastStore.toasts" :key="toast.id" name="toast" appear>
      <div v-if="toast.isVisible"
        class="min-w-96 w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
        :class="{
          'border-l-4 border-green-500': toast.type === 'success',
          'border-l-4 border-red-500': toast.type === 'error',
          'border-l-4 border-yellow-500': toast.type === 'warning',
          'border-l-4 border-blue-500': toast.type === 'info'
        }">
        <div class="p-4">
          <div class="flex items-start">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <!-- Success Icon -->
              <svg v-if="toast.type === 'success'" class="h-6 w-6 text-green-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              <!-- Error Icon -->
              <svg v-else-if="toast.type === 'error'" class="h-6 w-6 text-red-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              <!-- Warning Icon -->
              <svg v-else-if="toast.type === 'warning'" class="h-6 w-6 text-yellow-400" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>

              <!-- Info Icon -->
              <svg v-else-if="toast.type === 'info'" class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <!-- Content -->
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">
                {{ toast.title }}
              </p>
              <p v-if="toast.message" class="mt-1 text-sm text-gray-500">
                {{ toast.message }}
              </p>
            </div>

            <!-- Close Button -->
            <div class="ml-4 flex-shrink-0 flex">
              <button @click="toastStore.removeToast(toast.id)"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                :class="{
                  'focus:ring-green-500': toast.type === 'success',
                  'focus:ring-red-500': toast.type === 'error',
                  'focus:ring-yellow-500': toast.type === 'warning',
                  'focus:ring-blue-500': toast.type === 'info'
                }">
                <span class="sr-only">Close</span>
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
</script>

<style scoped>
/* Toast transition animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
