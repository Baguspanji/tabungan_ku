<template>
  <!-- Add/Edit Member Modal -->
  <div v-if="isVisible" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="handleClose">
      </div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-4 py-4 sm:p-6 sm:pb-4">
            <div class="mt-3 text-center sm:mt-0 sm:text-left flex-1">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ isEditMode ? 'Edit Member' : 'Tambah Member Baru' }}
              </h3>
              <div class="mt-4 space-y-4">
                <!-- Nama Member -->
                <div>
                  <label for="memberName" class="block text-sm font-medium text-gray-700 mb-1">
                    Nama Member <span class="text-red-500">*</span>
                  </label>
                  <input id="memberName" v-model="form.name" type="text" required placeholder="Masukkan nama member"
                    class="block w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 sm:text-sm"
                    :class="{
                      'border-red-500 focus:ring-red-500 focus:border-red-500': nameError,
                      'border-gray-300': !nameError
                    }" />
                  <p v-if="nameError" class="mt-1 text-sm text-red-600">{{ nameError }}</p>
                </div>

                <!-- Catatan -->
                <div>
                  <label for="memberNote" class="block text-sm font-medium text-gray-700 mb-1">
                    Catatan (opsional)
                  </label>
                  <textarea id="memberNote" v-model="form.note" rows="3" placeholder="Tambahkan catatan untuk member"
                    class="block w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 sm:text-sm resize-none"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit" :disabled="isProcessing || !form.name.trim()"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="isProcessing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{
                isProcessing ? (isEditMode ? 'Menyimpan...' : 'Menambahkan...') :
                  (isEditMode ? 'Simpan Perubahan'
                    : 'Tambah Member')
              }}
            </button>
            <button type="button" @click="handleClose"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useMembersStore, type Member } from '@/stores/members'

// Props
interface Props {
  isVisible: boolean
  isEditMode: boolean
  member?: Member | null
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
  isEditMode: false,
  member: null
})

// Emits
const emit = defineEmits<{
  close: []
  submit: [memberData: { name: string; note: string }]
}>()

// Store
const membersStore = useMembersStore()

// Local state
const form = ref({
  name: '',
  note: ''
})
const nameError = ref('')
const isProcessing = ref(false)

// Watch for member changes to populate form in edit mode
watch(() => props.member, (newMember) => {
  if (newMember && props.isEditMode) {
    form.value.name = newMember.name
    form.value.note = newMember.note
  }
}, { immediate: true })

// Watch for visibility changes to reset form
watch(() => props.isVisible, (isVisible) => {
  if (isVisible) {
    nameError.value = ''
    if (!props.isEditMode) {
      form.value.name = ''
      form.value.note = ''
    }
    // Focus on name input when modal opens
    nextTick(() => {
      const nameInput = document.getElementById('memberName')
      if (nameInput) {
        nameInput.focus()
      }
    })
  }
})

// Methods
const validateMemberName = (name: string): string => {
  if (!name.trim()) {
    return 'Nama member wajib diisi'
  }

  const existingMember = membersStore.members.find(
    member => member.name.toLowerCase() === name.toLowerCase().trim() &&
      member.id !== (props.isEditMode ? props.member?.id : undefined)
  )

  if (existingMember) {
    return 'Member dengan nama tersebut sudah ada'
  }

  return ''
}

const handleSubmit = async () => {
  nameError.value = ''

  // Validate form
  const error = validateMemberName(form.value.name)
  if (error) {
    nameError.value = error
    return
  }

  isProcessing.value = true

  try {
    if (props.isEditMode && props.member) {
      // Update existing member
      await membersStore.updateMember(props.member.id, {
        name: form.value.name.trim(),
        note: form.value.note.trim()
      })
    } else {
      // Add new member
      await membersStore.addMember({
        name: form.value.name.trim(),
        note: form.value.note.trim(),
        savings: []
      })
    }

    // Emit success and close modal
    emit('submit', {
      name: form.value.name.trim(),
      note: form.value.note.trim()
    })
    handleClose()
  } catch (error: unknown) {
    console.error('Error saving member:', error)
    nameError.value = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan member'
  } finally {
    isProcessing.value = false
  }
}

const handleClose = () => {
  form.value.name = ''
  form.value.note = ''
  nameError.value = ''
  isProcessing.value = false
  emit('close')
}

// Expose methods for parent component
defineExpose({
  handleClose
})
</script>
