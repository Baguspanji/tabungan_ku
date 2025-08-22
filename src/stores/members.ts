import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './auth'

// Types
export interface Saving {
  date: string // ISO string format
  bills: {
    tabungan: number
    jimpitan: number
  }
}

export interface Member {
  id: string
  name: string
  note: string
  savings: Saving[]
}

export interface Activity {
  id: string
  description: string
  datetime: string
}

export interface DashboardStats {
  totalMembers: number
  totalTabungan: number
  totalJimpitan: number
  totalKeseluruhan: number
}

export const useMembersStore = defineStore('members', () => {
  // State
  const members = ref<Member[]>([])
  const isLoading = ref(false)
  const isInitialized = ref(false)
  const recentActivities = ref<Activity[]>([])

  // Getters
  const totalMembers = computed(() => members.value.length)

  const totalTabungan = computed(() => {
    return members.value.reduce((total, member) => {
      return total + member.savings.reduce((memberTotal, saving) => {
        return memberTotal + (saving.bills.tabungan || 0)
      }, 0)
    }, 0)
  })

  const totalJimpitan = computed(() => {
    return members.value.reduce((total, member) => {
      return total + member.savings.reduce((memberTotal, saving) => {
        return memberTotal + (saving.bills.jimpitan || 0)
      }, 0)
    }, 0)
  })

  const totalKeseluruhan = computed(() => totalTabungan.value + totalJimpitan.value)

  const dashboardStats = computed((): DashboardStats => ({
    totalMembers: totalMembers.value,
    totalTabungan: totalTabungan.value,
    totalJimpitan: totalJimpitan.value,
    totalKeseluruhan: totalKeseluruhan.value
  }))

  // Chart data for dashboard
  const topMembersByTotal = computed(() => {
    return members.value
      .map(member => {
        const total = member.savings.reduce((sum, saving) => {
          return sum + saving.bills.tabungan + saving.bills.jimpitan
        }, 0)
        return {
          label: member.name,
          value: total
        }
      })
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Top 5 members
  })

  const savingsBreakdown = computed(() => [
    { label: 'Tabungan', value: totalTabungan.value },
    { label: 'Jimpitan', value: totalJimpitan.value }
  ])

  // Helper function to get members collection reference
  const getMembersCollectionRef = () => {
    const authStore = useAuthStore()
    if (!authStore.userId) {
      throw new Error('User not authenticated')
    }
    return collection(db, 'users', authStore.userId, 'members')
  }

  // Actions
  const fetchMembers = async () => {
    isLoading.value = true
    try {
      const membersRef = getMembersCollectionRef()
      const q = query(membersRef, orderBy('name'))
      const querySnapshot = await getDocs(q)

      members.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        note: doc.data().note || '',
        savings: doc.data().savings || []
      }))

      isInitialized.value = true
    } catch (error) {
      console.error('Error fetching members:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      // Check for duplicate name (case-insensitive)
      const existingMember = members.value.find(
        member => member.name.toLowerCase() === memberData.name.toLowerCase()
      )
      if (existingMember) {
        throw new Error('Member dengan nama tersebut sudah ada')
      }

      const membersRef = getMembersCollectionRef()
      const docRef = await addDoc(membersRef, {
        name: memberData.name.trim(),
        note: memberData.note.trim(),
        savings: []
      })

      const newMember: Member = {
        id: docRef.id,
        name: memberData.name.trim(),
        note: memberData.note.trim(),
        savings: []
      }

      members.value.push(newMember)

      // Add activity
      addActivity(`Member baru "${newMember.name}" ditambahkan`)

      return newMember
    } catch (error) {
      console.error('Error adding member:', error)
      throw error
    }
  }

  const updateMember = async (memberId: string, memberData: Partial<Omit<Member, 'id'>>) => {
    try {
      const memberIndex = members.value.findIndex(m => m.id === memberId)
      if (memberIndex === -1) {
        throw new Error('Member tidak ditemukan')
      }

      // Check for duplicate name if name is being updated
      if (memberData.name) {
        const existingMember = members.value.find(
          (member, index) =>
            index !== memberIndex &&
            member.name.toLowerCase() === memberData.name!.toLowerCase()
        )
        if (existingMember) {
          throw new Error('Member dengan nama tersebut sudah ada')
        }
      }

      const authStore = useAuthStore()
      const memberRef = doc(db, 'users', authStore.userId!, 'members', memberId)

      const updateData: Partial<Omit<Member, 'id'>> = {}
      if (memberData.name !== undefined) updateData.name = memberData.name.trim()
      if (memberData.note !== undefined) updateData.note = memberData.note.trim()
      if (memberData.savings !== undefined) updateData.savings = memberData.savings

      await updateDoc(memberRef, updateData)

      // Update local state
      Object.assign(members.value[memberIndex], updateData)

      addActivity(`Member "${members.value[memberIndex].name}" diperbarui`)

      return members.value[memberIndex]
    } catch (error) {
      console.error('Error updating member:', error)
      throw error
    }
  }

  const deleteMember = async (memberId: string) => {
    try {
      const memberIndex = members.value.findIndex(m => m.id === memberId)
      if (memberIndex === -1) {
        throw new Error('Member tidak ditemukan')
      }

      const memberName = members.value[memberIndex].name
      const authStore = useAuthStore()
      const memberRef = doc(db, 'users', authStore.userId!, 'members', memberId)

      await deleteDoc(memberRef)

      // Remove from local state
      members.value.splice(memberIndex, 1)

      addActivity(`Member "${memberName}" dihapus`)
    } catch (error) {
      console.error('Error deleting member:', error)
      throw error
    }
  }

  const addSaving = async (memberId: string, savingData: Omit<Saving, 'date'>, customDate?: string) => {
    try {
      const memberIndex = members.value.findIndex(m => m.id === memberId)
      if (memberIndex === -1) {
        throw new Error('Member tidak ditemukan')
      }

      // Validate that at least one amount is provided
      if (!savingData.bills.tabungan && !savingData.bills.jimpitan) {
        throw new Error('Minimal salah satu dari tabungan atau jimpitan harus diisi')
      }

      const newSaving: Saving = {
        date: customDate ? new Date(customDate).toISOString() : new Date().toISOString(),
        bills: {
          tabungan: savingData.bills.tabungan || 0,
          jimpitan: savingData.bills.jimpitan || 0
        }
      }

      const member = members.value[memberIndex]
      member.savings.push(newSaving)

      // Update Firebase
      await updateMember(memberId, { savings: member.savings })

      const totalAmount = newSaving.bills.tabungan + newSaving.bills.jimpitan
      addActivity(`Member "${member.name}" menambah tabungan Rp ${formatCurrency(totalAmount)}`)

      return newSaving
    } catch (error) {
      console.error('Error adding saving:', error)
      throw error
    }
  }

  const deleteSaving = async (memberId: string, savingIndex: number) => {
    try {
      const memberIndex = members.value.findIndex(m => m.id === memberId)
      if (memberIndex === -1) {
        throw new Error('Member tidak ditemukan')
      }

      const member = members.value[memberIndex]
      if (savingIndex < 0 || savingIndex >= member.savings.length) {
        throw new Error('Data tabungan tidak ditemukan')
      }

      const deletedSaving = member.savings[savingIndex]
      member.savings.splice(savingIndex, 1)

      // Update Firebase
      await updateMember(memberId, { savings: member.savings })

      const totalAmount = deletedSaving.bills.tabungan + deletedSaving.bills.jimpitan
      addActivity(`Member "${member.name}" menghapus tabungan Rp ${formatCurrency(totalAmount)}`)
    } catch (error) {
      console.error('Error deleting saving:', error)
      throw error
    }
  }

  const addActivity = (description: string) => {
    const activity: Activity = {
      id: Date.now().toString(),
      description,
      datetime: new Date().toISOString()
    }

    recentActivities.value.unshift(activity)

    // Keep only last 10 activities
    if (recentActivities.value.length > 10) {
      recentActivities.value = recentActivities.value.slice(0, 10)
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const reset = () => {
    members.value = []
    recentActivities.value = []
    isLoading.value = false
    isInitialized.value = false
  }

  return {
    // State
    members,
    isLoading,
    isInitialized,
    recentActivities,

    // Getters
    totalMembers,
    totalTabungan,
    totalJimpitan,
    totalKeseluruhan,
    dashboardStats,
    topMembersByTotal,
    savingsBreakdown,

    // Actions
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,
    addSaving,
    deleteSaving,
    formatCurrency,
    reset
  }
})
