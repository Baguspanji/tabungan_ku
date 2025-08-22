<template>
  <!-- Members Table -->
  <div v-if="data.length > 0" class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="column in columns" :key="column.key" scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {{ column.title }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="item in paginatedData" :key="getItemKey(item)" class="hover:bg-gray-50">
          <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-nowrap">
            <slot :name="column.key" :item="item" :value="getColumnValue(item, column.key)">
              <span class="text-sm text-gray-900">{{ getColumnValue(item, column.key) }}</span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
      <div class="flex-1 flex justify-between sm:hidden">
        <!-- Mobile pagination -->
        <button @click="goToPreviousPage" :disabled="currentPage <= 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          Previous
        </button>
        <button @click="goToNextPage" :disabled="currentPage >= totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          Next
        </button>
      </div>

      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Menampilkan
            <span class="font-medium">{{ startIndex }}</span>
            sampai
            <span class="font-medium">{{ endIndex }}</span>
            dari
            <span class="font-medium">{{ data.length }}</span>
            hasil
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <!-- Previous Button -->
            <button @click="goToPreviousPage" :disabled="currentPage <= 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Page Numbers -->
            <template v-for="page in visiblePages" :key="page">
              <button v-if="page !== '...'" @click="goToPage(Number(page))" :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              ]">
                {{ page }}
              </button>
              <span v-else
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            </template>

            <!-- Next Button -->
            <button @click="goToNextPage" :disabled="currentPage >= totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else class="text-center py-12">
    <slot name="empty-state">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">{{ emptyStateTitle }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ emptyStateDescription }}</p>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

// Types
interface Column {
  key: string
  title: string
}

interface TableItem {
  [key: string]: unknown
}

interface Props {
  data: TableItem[]
  columns: Column[]
  itemsPerPage?: number
  currentPage: number
  keyField?: string
  emptyStateTitle?: string
  emptyStateDescription?: string
}

interface Emits {
  (e: 'update:currentPage', page: number): void
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 5,
  keyField: 'id',
  emptyStateTitle: 'Tidak ada data',
  emptyStateDescription: 'Belum ada data untuk ditampilkan.'
})

const emit = defineEmits<Emits>()

// Computed properties
const totalPages = computed(() => {
  return Math.ceil(props.data.length / props.itemsPerPage)
})

const paginatedData = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return props.data.slice(start, end)
})

const startIndex = computed(() => {
  return ((props.currentPage - 1) * props.itemsPerPage) + 1
})

const endIndex = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.data.length)
})

const visiblePages = computed((): (number | string)[] => {
  const total = totalPages.value
  const current = props.currentPage
  const delta = 2 // Number of pages to show around current page

  if (total <= 7) {
    // Show all pages if total is small
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = []

  // Always show first page
  pages.push(1)

  if (current > delta + 2) {
    pages.push('...')
  }

  // Show pages around current page
  const start = Math.max(2, current - delta)
  const end = Math.min(total - 1, current + delta)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - delta - 1) {
    pages.push('...')
  }

  // Always show last page if total > 1
  if (total > 1) {
    pages.push(total)
  }

  return pages
})

// Methods
const getItemKey = (item: TableItem): string | number => {
  const key = item[props.keyField] || item.id
  if (typeof key === 'string' || typeof key === 'number') {
    return key
  }
  return JSON.stringify(item)
}

const getColumnValue = (item: TableItem, key: string): unknown => {
  // Handle nested properties (e.g., 'user.name')
  return key.split('.').reduce((obj: unknown, k: string) => {
    if (obj && typeof obj === 'object' && k in obj) {
      return (obj as Record<string, unknown>)[k]
    }
    return undefined
  }, item)
}

const goToPage = (page: number): void => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}

const goToPreviousPage = (): void => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

const goToNextPage = (): void => {
  if (props.currentPage < totalPages.value) {
    emit('update:currentPage', props.currentPage + 1)
  }
}

// Watch for data changes and reset to first page if needed
watch(() => props.data.length, (newLength, oldLength) => {
  if (newLength !== oldLength && props.currentPage > totalPages.value) {
    emit('update:currentPage', 1)
  }
})
</script>
