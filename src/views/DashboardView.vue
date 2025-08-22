<template>
  <AppLayout>
    <!-- Loading State -->
    <div v-if="membersStore.isLoading" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Memuat data...</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <!-- Welcome Message -->
      <div class="px-4 pb-6 sm:px-0">
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold">{{ getGreeting() }}!</h1>
              <p class="text-blue-100 mt-1">{{ getCurrentDateFormatted() }}</p>
              <p class="text-blue-200 mt-2 text-sm">
                Selamat datang di dashboard aplikasi tabungan Anda
              </p>
            </div>
            <div class="hidden sm:block">
              <svg class="h-16 w-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                </path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Stats -->
      <DashboardStats :stats="stats" />

      <!-- Member List -->
      <div class="px-4 pb-6 sm:px-0">
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Daftar Member</h3>

              <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <!-- Search Input -->
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                      </path>
                    </svg>
                  </div>
                  <input v-model="searchQuery" type="text" placeholder="Cari member..."
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                <!-- Button Tambah Member -->
                <button @click="openAddMemberModal"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap">
                  <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                    </path>
                  </svg>
                  Tambah Member
                </button>
              </div>
            </div>

            <!-- Search Results Info -->
            <div v-if="searchQuery && filteredMembers.length !== membersStore.members.length" class="mb-4">
              <p class="text-sm text-gray-600">
                Menampilkan {{ filteredMembers.length }} dari {{ membersStore.members.length }} member
                <button @click="searchQuery = ''" class="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  (Reset)
                </button>
              </p>
            </div>

            <!-- Members Table -->
            <AppTable v-if="filteredMembers.length > 0" :data="filteredMembers" :columns="tableColumns"
              :items-per-page="itemsPerPage" v-model:current-page="currentPage"
              empty-state-title="Tidak ada member ditemukan"
              empty-state-description="Tidak ada member yang cocok dengan pencarian">
              <!-- Member Column -->
              <template #member="{ item }">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-sm font-medium text-white">
                        {{ ((item as unknown) as Member).name.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ ((item as unknown) as Member).name }}</div>
                    <div v-if="((item as unknown) as Member).note" class="text-sm text-gray-500">
                      {{ ((item as unknown) as Member).note }}
                    </div>
                  </div>
                </div>
              </template>

              <!-- Total Tabungan Column -->
              <template #totalTabungan="{ item }">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(getMemberTabungan(((item as unknown) as Member))) }}
                </div>
              </template>

              <!-- Total Jimpitan Column -->
              <template #totalJimpitan="{ item }">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(getMemberJimpitan(((item as unknown) as Member))) }}
                </div>
              </template>

              <!-- Total Keseluruhan Column -->
              <template #totalKeseluruhan="{ item }">
                <div class="text-sm font-semibold text-blue-600">
                  {{ formatCurrency(getMemberTotal(((item as unknown) as Member))) }}
                </div>
              </template>

              <!-- Transaksi Column -->
              <template #transaksi="{ item }">
                <button @click="openTransactionHistoryModal(((item as unknown) as Member))"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200 cursor-pointer">
                  <svg class="-ml-0.5 mr-1.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01">
                    </path>
                  </svg>
                  {{ ((item as unknown) as Member).savings.length }} transaksi
                </button>
              </template>

              <!-- Actions Column -->
              <template #actions="{ item }">
                <div class="flex items-center space-x-2">
                  <!-- Edit Button -->
                  <button @click="openEditMemberModal(((item as unknown) as Member))"
                    class="text-blue-600 hover:text-blue-900 text-sm font-medium">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                      </path>
                    </svg>
                  </button>

                  <!-- Delete Button (only show if no transactions) -->
                  <button v-if="((item as unknown) as Member).savings.length === 0"
                    @click="openDeleteConfirmModal(((item as unknown) as Member))"
                    class="text-red-600 hover:text-red-900 text-sm font-medium">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                      </path>
                    </svg>
                  </button>

                  <!-- Cannot Delete Info (if has transactions) -->
                  <span v-else class="text-gray-400 text-xs" title="Tidak dapat dihapus karena memiliki transaksi">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z">
                      </path>
                    </svg>
                  </span>
                </div>
              </template>
            </AppTable>

            <!-- Empty State for Search -->
            <div v-else-if="searchQuery && filteredMembers.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                </path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada member ditemukan</h3>
              <p class="mt-1 text-sm text-gray-500">
                Tidak ada member yang cocok dengan pencarian "{{ searchQuery }}"
              </p>
              <div class="mt-6">
                <button @click="searchQuery = ''"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Reset Pencarian
                </button>
              </div>
            </div>

            <!-- Empty State for No Members -->
            <div v-else-if="membersStore.members.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                </path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada member</h3>
              <p class="mt-1 text-sm text-gray-500">Mulai dengan menambahkan member pertama untuk mengelola tabungan.
              </p>
              <div class="mt-6 flex justify-center space-x-4">
                <router-link to="/members"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                    </path>
                  </svg>
                  Tambah Member Pertama
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Member Modal -->
      <MemberModal :is-visible="showMemberModal" :is-edit-mode="isEditMode" :member="selectedMember"
        @close="closeMemberModal" @submit="handleMemberSubmit" />

      <!-- Delete Confirmation Modal -->
      <ConfirmModal :is-visible="showDeleteConfirmModal" title="Hapus Member"
        :message="`Apakah Anda yakin ingin menghapus member ${selectedMember?.name}? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus" processing-text="Menghapus..." @close="closeDeleteConfirmModal"
        @confirm="handleDeleteMember" />

      <!-- Transaction History Modal -->
      <TransactionHistoryModal :is-visible="showTransactionHistoryModal" :member="selectedMember"
        @close="closeTransactionHistoryModal" />
    </main>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMembersStore, type Member } from '@/stores/members'
import AppLayout from '@/components/AppLayout.vue'
import AppTable from '@/components/AppTable.vue'
import MemberModal from '@/components/MemberModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import DashboardStats from '@/components/DashboardStats.vue'
import TransactionHistoryModal from '@/components/TransactionHistoryModal.vue'

// Composables
const router = useRouter()
const authStore = useAuthStore()
const membersStore = useMembersStore()

// Local state
const searchQuery = ref('')
const showMemberModal = ref(false)
const showDeleteConfirmModal = ref(false)
const showTransactionHistoryModal = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(5)
const selectedMember = ref<Member | null>(null)
const isEditMode = ref(false)

// Table columns configuration
const tableColumns = ref([
  { key: 'member', title: 'Member' },
  { key: 'totalTabungan', title: 'Total Tabungan' },
  { key: 'totalJimpitan', title: 'Total Jimpitan' },
  { key: 'totalKeseluruhan', title: 'Total Keseluruhan' },
  { key: 'transaksi', title: 'Transaksi' },
  { key: 'actions', title: 'Aksi' }
])

// Computed properties from store
const stats = computed(() => membersStore.dashboardStats)

// Filtered members based on search
const filteredMembers = computed(() => {
  if (!searchQuery.value.trim()) {
    return membersStore.members
  }

  const query = searchQuery.value.toLowerCase().trim()
  return membersStore.members.filter(member =>
    member.name.toLowerCase().includes(query) ||
    member.note.toLowerCase().includes(query)
  )
})

// Watch search query changes and reset pagination
watch(searchQuery, () => {
  currentPage.value = 1
})

// Helper methods for member calculations
const getMemberTabungan = (member: Member): number => {
  return member.savings.reduce((total, saving) => {
    return total + (saving.bills.tabungan || 0)
  }, 0)
}

const getMemberJimpitan = (member: Member): number => {
  return member.savings.reduce((total, saving) => {
    return total + (saving.bills.jimpitan || 0)
  }, 0)
}

const getMemberTotal = (member: Member): number => {
  return getMemberTabungan(member) + getMemberJimpitan(member)
}

// Methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}

const getCurrentDateFormatted = (): string => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date())
}

const loadDashboardData = async () => {
  try {
    if (!membersStore.isInitialized) {
      await membersStore.fetchMembers()
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    // TODO: Show error notification to user
  }
}

// Modal methods
const closeMemberModal = () => {
  showMemberModal.value = false
  selectedMember.value = null
  isEditMode.value = false
}

const openAddMemberModal = () => {
  isEditMode.value = false
  selectedMember.value = null
  showMemberModal.value = true
}

const openEditMemberModal = (member: Member) => {
  isEditMode.value = true
  selectedMember.value = member
  showMemberModal.value = true
}

const openDeleteConfirmModal = (member: Member) => {
  selectedMember.value = member
  showDeleteConfirmModal.value = true
}

const closeDeleteConfirmModal = () => {
  showDeleteConfirmModal.value = false
  selectedMember.value = null
}

const openTransactionHistoryModal = (member: Member) => {
  selectedMember.value = member
  showTransactionHistoryModal.value = true
}

const closeTransactionHistoryModal = () => {
  showTransactionHistoryModal.value = false
  selectedMember.value = null
}

const handleMemberSubmit = () => {
  // This is handled by the MemberModal component
  // Just close the modal since the component handles the API call
  closeMemberModal()
  // TODO: Show success notification
}

const handleDeleteMember = async () => {
  if (!selectedMember.value) return

  try {
    await membersStore.deleteMember(selectedMember.value.id)
    closeDeleteConfirmModal()
    // TODO: Show success notification
  } catch (error: unknown) {
    console.error('Error deleting member:', error)
    // TODO: Show error notification
  }
}

// Lifecycle
onMounted(async () => {
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  await loadDashboardData()
})
</script>
