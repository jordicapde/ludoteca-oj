<template>
  <!-- Botó de la vista principal que obre el modal -->
  <button
    @click="openConfirmation"
    :disabled="disabled"
    class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
  >
    {{ buttonLabel }}
  </button>

  <ModalDialog
    :is-open="modalState.isOpen"
    :title="currentTitle"
    :message="currentMessage"
    :type="currentType"
    @close="finish">

    <!-- Botons confirmar/cancelar -->
    <template #footer>
      <div v-if="modalState.step === 'confirm'" class="flex gap-3">
        <button
          @click="resetAndCloseModal"
          class="flex-1 bg-white text-gray-700 border border-gray-300 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50"
        >
          Cancel·lar
        </button>
        <button
          @click="executeAction"
          class="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-green-700"
        >
          Sí, endavant
        </button>
      </div>

      <div v-else-if="modalState.step === 'loading'" class="text-gray-900 text-xl font-bold py-2">
        Guardant...
      </div>

      <button
        v-else
        @click="finish"
        class="w-full font-bold py-3 px-4 rounded-xl shadow-lg transition-transform transform active:scale-95"
        :class="modalState.step === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'"
      >
        D'acord
      </button>

    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive, computed } from 'vue'
import ModalDialog from './ModalDialog.vue'

const props = defineProps({
  buttonLabel: { type: String, default: 'Confirmar' },
  disabled: { type: Boolean, default: false },

  // Acció a executar quan es confirma
  action: { type: Function, required: true },

  // Missatges personalitzats
  confirmTitle: { type: String, default: 'Estàs segur?' },
  confirmMessage: { type: String, default: 'Vols confirmar aquesta acció?' },
  successTitle: { type: String, default: '' },
  successMessage: { type: String, default: '' },
  errorTitle: { type: String, default: 'Error' },
  errorMessage: { type: String, default: 'Hi ha hagut algun problema' }
})

const emit = defineEmits(['success', 'error'])

// Màquina d'estats del modal: 'idle' | 'confirm' | 'loading' | 'success' | 'error'
const modalState = reactive({
  isOpen: false,
  step: 'idle',
  errorDetail: ''
})

// -- LÒGICA COMPUTADA PER ALS TEXTOS I ICONES --
const currentTitle = computed(() => {
  if (modalState.step === 'confirm') return props.confirmTitle
  if (modalState.step === 'loading') return ''
  if (modalState.step === 'success') return props.successTitle
  if (modalState.step === 'error') return props.errorTitle
  return ''
})

const currentMessage = computed(() => {
  if (modalState.step === 'confirm') return props.confirmMessage
  if (modalState.step === 'loading') return ''
  if (modalState.step === 'success') return props.successMessage
  if (modalState.step === 'error') return props.errorMessage
  return ''
})

const currentType = computed(() => {
  if (modalState.step === 'confirm') return 'info'
  if (modalState.step === 'loading') return 'loading'
  if (modalState.step === 'success') return 'success'
  if (modalState.step === 'error') return 'error'
  return 'info'
})

// -- ACCIONS --
const openConfirmation = () => {
  modalState.step = 'confirm'
  modalState.isOpen = true
}

const executeAction = async () => {
  modalState.step = 'loading'

  try {
    await props.action()
    // Si tot va bé, passem a èxit
    modalState.step = 'success'
  } catch (err) {
    console.error(err)
    modalState.errorDetail = err.message
    modalState.step = 'error'
    emit('error', err)
  }
}

const finish = () => {
  if (modalState.step === 'success') {
    emit('success')
  }
  resetAndCloseModal()
}

const resetAndCloseModal = () => {
  modalState.isOpen = false
  // Reset per la pròxima vegada (amb un petit retard per l'animació)
  setTimeout(() => {
    modalState.step = 'idle'
  }, 300)
}
</script>