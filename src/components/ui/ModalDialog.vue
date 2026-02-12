<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          @click="handleBackdropClick">
      </div>

      <div class="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center transform transition-all animate-pop-in">
        <div class="mb-4 flex justify-center">
          <div v-if="type === 'loading'" class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <svg class="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div v-else-if="type === 'success'" class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl">
            ✅
          </div>
          <div v-else-if="type === 'error'" class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl">
            ⚠️
          </div>
          <div v-else class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
            ℹ️
          </div>
        </div>

        <h3 v-if="title" class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
        <p v-if="message" class="text-gray-500 mb-6 leading-relaxed">{{ message }}</p>

        <div class="mt-4">
          <slot name="footer">
            <button
              @click="$emit('close')"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform transform active:scale-95"
            >
              D'acord
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
  type: {
    type: String,
    default: 'info' // 'success', 'error', 'info', 'loading'
  }
})

const emit = defineEmits(['close'])

// Evitem tancar el modal clicant fora si està carregant
const handleBackdropClick = () => {
  if (props.type !== 'loading') {
    emit('close')
  }
}
</script>

<style scoped>
@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-pop-in {
  animation: pop-in 0.2s ease-out forwards;
}
</style>