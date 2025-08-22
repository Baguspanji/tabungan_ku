<template>
  <!-- Transaction History Modal -->
  <div v-if="isVisible" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="handleClose">
      </div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="bg-white px-4 py-4 sm:p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Detail Transaksi - {{ member?.name }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                History transaksi tabungan dan jimpitan
              </p>
            </div>
            <button @click="handleClose" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                </path>
              </svg>
            </button>
          </div>

          <!-- Summary Cards -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z">
                    </path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-blue-900">Total Tabungan</p>
                  <p class="text-lg font-semibold text-blue-700">{{ formatCurrency(totalTabungan) }}</p>
                </div>
              </div>
            </div>

            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z">
                    </path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-900">Total Jimpitan</p>
                  <p class="text-lg font-semibold text-green-700">{{ formatCurrency(totalJimpitan) }}</p>
                </div>
              </div>
            </div>

            <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                    </path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-purple-900">Total Keseluruhan</p>
                  <p class="text-lg font-semibold text-purple-700">{{ formatCurrency(totalKeseluruhan) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Transaction Form -->
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-md font-medium text-gray-900">
                {{ isEditing ? 'Edit Transaksi' : 'Tambah Transaksi Baru' }}
              </h4>
              <button @click="toggleForm" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                {{ showForm ? 'Tutup Form' : 'Tambah Transaksi' }}
              </button>
            </div>

            <form v-if="showForm" @submit.prevent="handleSubmitTransaction" class="space-y-4">
              <!-- Date Input (full width) -->
              <div>
                <label for="date" class="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Transaksi
                </label>
                <input id="date" v-model="form.date" type="datetime-local"
                  class="block w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="{
                    'border-red-500 focus:ring-red-500 focus:border-red-500': formErrors.date,
                    'border-gray-300': !formErrors.date
                  }" />
                <p v-if="formErrors.date" class="mt-1 text-sm text-red-600">{{ formErrors.date }}</p>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <!-- Tabungan Input -->
                <div>
                  <label for="tabungan" class="block text-sm font-medium text-gray-700 mb-1">
                    Tabungan
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">Rp</span>
                    </div>
                    <input id="tabungan" v-model.number="form.tabungan" type="number" min="0" step="1000"
                      placeholder="0"
                      class="block w-full pl-8 pr-3 py-2 text-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      :class="{
                        'border-red-500 focus:ring-red-500 focus:border-red-500': formErrors.tabungan,
                        'border-gray-300': !formErrors.tabungan
                      }" />
                  </div>
                  <p v-if="formErrors.tabungan" class="mt-1 text-sm text-red-600">{{ formErrors.tabungan }}</p>
                </div>

                <!-- Jimpitan Input -->
                <div>
                  <label for="jimpitan" class="block text-sm font-medium text-gray-700 mb-1">
                    Jimpitan
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">Rp</span>
                    </div>
                    <input id="jimpitan" v-model.number="form.jimpitan" type="number" min="0" step="1000"
                      placeholder="0"
                      class="block w-full pl-8 pr-3 py-2 text-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      :class="{
                        'border-red-500 focus:ring-red-500 focus:border-red-500': formErrors.jimpitan,
                        'border-gray-300': !formErrors.jimpitan
                      }" />
                  </div>
                  <p v-if="formErrors.jimpitan" class="mt-1 text-sm text-red-600">{{ formErrors.jimpitan }}</p>
                </div>
              </div>

              <!-- General Error -->
              <p v-if="formErrors.general" class="text-sm text-red-600">{{ formErrors.general }}</p>

              <!-- Form Actions -->
              <div class="flex items-center justify-end space-x-3 pt-2">
                <button type="button" @click="resetForm"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Reset
                </button>
                <button type="submit" :disabled="isSubmitting || (!form.tabungan && !form.jimpitan)"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  {{ isSubmitting ? 'Menyimpan...' : (isEditing ? 'Update Transaksi' : 'Tambah Transaksi') }}
                </button>
              </div>

              <!-- Helper Text -->
              <p class="text-xs text-gray-500 mt-2">
                * Minimal salah satu dari tabungan atau jimpitan harus diisi
              </p>
            </form>
          </div>

          <!-- Transaction Table -->
          <div class="overflow-hidden">
            <div v-if="sortedTransactions.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tabungan
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jimpitan
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(transaction, index) in sortedTransactions" :key="`${transaction.date}-${index}`"
                    class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ sortedTransactions.length - index }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(transaction.date) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span v-if="transaction.bills.tabungan > 0" class="text-blue-600">
                        {{ formatCurrency(transaction.bills.tabungan) }}
                      </span>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span v-if="transaction.bills.jimpitan > 0" class="text-green-600">
                        {{ formatCurrency(transaction.bills.jimpitan) }}
                      </span>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600">
                      {{ formatCurrency(transaction.bills.tabungan + transaction.bills.jimpitan) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      <div class="flex items-center justify-end space-x-2">
                        <button @click="startEditTransaction(index)"
                          class="text-blue-600 hover:text-blue-900 font-medium" title="Edit transaksi">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                            </path>
                          </svg>
                        </button>
                        <button @click="confirmDeleteTransaction(index)"
                          class="text-red-600 hover:text-red-900 font-medium ml-2" title="Hapus transaksi">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                            </path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01">
                </path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada transaksi</h3>
              <p class="mt-1 text-sm text-gray-500">Member ini belum memiliki history transaksi.</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:justify-between sm:items-center">
          <div class="text-sm text-gray-500">
            Total {{ sortedTransactions.length }} transaksi
          </div>
          <button type="button" @click="handleClose"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import type { Member, Saving } from '@/stores/members'
import { useMembersStore } from '@/stores/members'
import { useToastStore } from '@/stores/toast'

// Props
interface Props {
  isVisible: boolean
  member?: Member | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

const membersStore = useMembersStore()
const toastStore = useToastStore()

// Form state
const showForm = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingIndex = ref(-1)

const form = reactive({
  date: '',
  tabungan: 0,
  jimpitan: 0,
})

const formErrors = reactive({
  date: '',
  tabungan: '',
  jimpitan: '',
  general: '',
})

// Computed properties
const sortedTransactions = computed((): Saving[] => {
  if (!props.member?.savings) return []

  // Sort by date descending (newest first)
  return [...props.member.savings].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

const totalTabungan = computed((): number => {
  if (!props.member?.savings) return 0
  return props.member.savings.reduce((total, saving) => {
    return total + (saving.bills.tabungan || 0)
  }, 0)
})

const totalJimpitan = computed((): number => {
  if (!props.member?.savings) return 0
  return props.member.savings.reduce((total, saving) => {
    return total + (saving.bills.jimpitan || 0)
  }, 0)
})

const totalKeseluruhan = computed((): number => {
  return totalTabungan.value + totalJimpitan.value
})

// Methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Form functions
const toggleForm = () => {
  showForm.value = !showForm.value
  if (showForm.value) {
    resetForm()
    // Set default date to now
    form.date = new Date().toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:mm
  }
}

const resetForm = () => {
  isEditing.value = false
  editingIndex.value = -1
  form.date = new Date().toISOString().slice(0, 16)
  form.tabungan = 0
  form.jimpitan = 0
  formErrors.date = ''
  formErrors.tabungan = ''
  formErrors.jimpitan = ''
  formErrors.general = ''
}

const validateForm = (): boolean => {
  // Clear previous errors
  formErrors.date = ''
  formErrors.tabungan = ''
  formErrors.jimpitan = ''
  formErrors.general = ''

  if (!form.date) {
    formErrors.date = 'Tanggal transaksi harus diisi'
    return false
  }

  if (!form.tabungan && !form.jimpitan) {
    formErrors.general = 'Minimal salah satu dari tabungan atau jimpitan harus diisi'
    return false
  }

  if (form.tabungan < 0) {
    formErrors.tabungan = 'Tabungan tidak boleh negatif'
    return false
  }

  if (form.jimpitan < 0) {
    formErrors.jimpitan = 'Jimpitan tidak boleh negatif'
    return false
  }

  return true
}

const handleSubmitTransaction = async () => {
  if (!validateForm() || !props.member) return

  isSubmitting.value = true
  formErrors.general = ''

  try {
    if (isEditing.value) {
      // Edit existing transaction
      await editTransaction()
      toastStore.showSuccess('Transaksi Berhasil Diperbarui', 'Data transaksi telah diperbarui')
    } else {
      // Add new transaction
      await addTransaction()
      const amount = (form.tabungan || 0) + (form.jimpitan || 0)
      toastStore.showSuccess('Transaksi Berhasil Ditambahkan', `Transaksi sebesar ${formatCurrency(amount)} telah ditambahkan`)
    }

    // Reset form and close it
    resetForm()
    showForm.value = false

    // No need to refresh data - store methods already update local state
  } catch (error) {
    console.error('Error submitting transaction:', error)
    const errorMessage = error instanceof Error ? error.message : 'Gagal menyimpan transaksi. Silakan coba lagi.'
    toastStore.showError('Gagal Menyimpan Transaksi', errorMessage)
    formErrors.general = errorMessage
  } finally {
    isSubmitting.value = false
  }
}

const addTransaction = async () => {
  if (!props.member) return

  await membersStore.addSaving(props.member.id, {
    bills: {
      tabungan: form.tabungan || 0,
      jimpitan: form.jimpitan || 0,
    }
  }, form.date)
}

const editTransaction = async () => {
  if (!props.member || editingIndex.value === -1) return

  const updatedSavings = [...props.member.savings]
  updatedSavings[editingIndex.value] = {
    date: new Date(form.date).toISOString(),
    bills: {
      tabungan: form.tabungan || 0,
      jimpitan: form.jimpitan || 0,
    }
  }

  await membersStore.updateMember(props.member.id, {
    savings: updatedSavings
  })
}

const startEditTransaction = (index: number) => {
  if (!props.member?.savings) return

  const transaction = sortedTransactions.value[index]
  // Find the actual index in the original array
  const actualIndex = props.member.savings.findIndex(s =>
    s.date === transaction.date &&
    s.bills.tabungan === transaction.bills.tabungan &&
    s.bills.jimpitan === transaction.bills.jimpitan
  )

  isEditing.value = true
  editingIndex.value = actualIndex
  showForm.value = true

  // Convert ISO date to datetime-local format
  form.date = new Date(transaction.date).toISOString().slice(0, 16)
  form.tabungan = transaction.bills.tabungan
  form.jimpitan = transaction.bills.jimpitan
}

const confirmDeleteTransaction = async (index: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) return

  if (!props.member?.savings) return

  const transaction = sortedTransactions.value[index]
  // Find the actual index in the original array
  const actualIndex = props.member.savings.findIndex(s =>
    s.date === transaction.date &&
    s.bills.tabungan === transaction.bills.tabungan &&
    s.bills.jimpitan === transaction.bills.jimpitan
  )

  if (actualIndex === -1) return

  try {
    const totalAmount = transaction.bills.tabungan + transaction.bills.jimpitan
    await membersStore.deleteSaving(props.member.id, actualIndex)
    toastStore.showSuccess('Transaksi Berhasil Dihapus', `Transaksi sebesar ${formatCurrency(totalAmount)} telah dihapus`)
    // No need to refresh data - deleteSaving already updates local state
  } catch (error) {
    console.error('Error deleting transaction:', error)
    const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus transaksi. Silakan coba lagi.'
    toastStore.showError('Gagal Menghapus Transaksi', errorMessage)
  }
}

const handleClose = () => {
  resetForm()
  showForm.value = false
  emit('close')
}
</script>
