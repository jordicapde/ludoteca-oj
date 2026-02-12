<template>
  <div class="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm transition-opacity">
    <div
      class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"
      :class="borderColor"
    ></div>

    <p
      v-if="text"
      class="mt-4 font-semibold text-sm tracking-wide"
      :class="textColor"
    >
      {{ text }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Carregant...'
  },
  color: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'accent', 'green', 'red'].includes(v)
  }
})

const colorsMap = {
  primary:   { border: 'border-t-primary-600',  text: 'text-primary-600' },
  secondary: { border: 'border-t-secondary-500', text: 'text-secondary-600' },
  accent:    { border: 'border-t-accent-500',   text: 'text-accent-600' },
  // Colors d'estat de Tailwind per defecte
  green:     { border: 'border-t-emerald-500',  text: 'text-emerald-600' },
  red:       { border: 'border-t-red-500',      text: 'text-red-600' }
}

const borderColor = computed(() => colorsMap[props.color]?.border)
const textColor = computed(() => colorsMap[props.color]?.text)
</script>