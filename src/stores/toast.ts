import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  isVisible?: boolean
}

export const useToastStore = defineStore('toast', () => {
  // State
  const toasts = ref<Toast[]>([])

  // Actions
  const addToast = (toast: Omit<Toast, 'id' | 'isVisible'>): string => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      isVisible: true,
      duration: toast.duration || (toast.type === 'error' ? 5000 : 3000)
    }

    toasts.value.push(newToast)

    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value[index].isVisible = false
      // Remove from array after animation
      setTimeout(() => {
        const currentIndex = toasts.value.findIndex(toast => toast.id === id)
        if (currentIndex > -1) {
          toasts.value.splice(currentIndex, 1)
        }
      }, 300) // Match animation duration
    }
  }

  const clearAllToasts = () => {
    toasts.value.forEach(toast => {
      toast.isVisible = false
    })
    // Clear array after animations
    setTimeout(() => {
      toasts.value = []
    }, 300)
  }

  // Helper methods for different toast types
  const showSuccess = (title: string, message: string = '', duration?: number) => {
    return addToast({ title, message, type: 'success', duration })
  }

  const showError = (title: string, message: string = '', duration?: number) => {
    return addToast({ title, message, type: 'error', duration })
  }

  const showWarning = (title: string, message: string = '', duration?: number) => {
    return addToast({ title, message, type: 'warning', duration })
  }

  const showInfo = (title: string, message: string = '', duration?: number) => {
    return addToast({ title, message, type: 'info', duration })
  }

  return {
    // State
    toasts,

    // Actions
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
})
