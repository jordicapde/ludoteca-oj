<template>
  <div class="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm transition-opacity">
    <div
      class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"
      :class="borderColor"
    ></div>

    <p
      v-if="text"
      class="mt-4 font-semibold text-sm tracking-wide animate-pulse"
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
    default: 'blue', // 'green', 'blue', 'purple', 'red'
    validator: (value) => ['green', 'blue', 'purple', 'red', 'gray'].includes(value)
  }
})

const colorsMap = {
  green:  { border: 'border-t-green-600',  text: 'text-green-600' },
  blue:   { border: 'border-t-blue-600',   text: 'text-blue-600' },
  purple: { border: 'border-t-purple-600', text: 'text-purple-600' },
  red:    { border: 'border-t-red-600',    text: 'text-red-600' },
  gray:   { border: 'border-t-gray-600',   text: 'text-gray-600' }
}

const borderColor = computed(() => colorsMap[props.color]?.border)
const textColor = computed(() => colorsMap[props.color]?.text)
</script>