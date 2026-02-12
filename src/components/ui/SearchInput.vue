<template>
  <div class="relative mb-6 z-20">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>

    <div class="relative">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        :placeholder="placeholder"
        class="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 outline-none transition-all shadow-sm"
        :class="themeClasses"
        autocomplete="off"
      >

      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      <div
        v-if="modelValue && (results.length > 0 || showNoResults)"
        class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-30"
      >
        <div v-if="results.length > 0" class="flex flex-col">
          <div
            v-for="(item, index) in results"
            :key="item.id || index"
            class="border-b border-gray-50 last:border-0 transition-colors"
            :class="hoverThemeClasses"
          >
            <slot name="item" :item="item"></slot>
          </div>
        </div>

        <div v-else class="p-4 text-center text-gray-500">
          <slot name="no-results">
            No s'han trobat resultats
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: String,
  label: String,
  placeholder: { type: String, default: 'Cercar...' },
  results: { type: Array, default: () => [] }, // Si no es passa, actua com input simple
  showNoResults: { type: Boolean, default: true }, // False si volem amagarel missatge de "No s'han trobat resultats"
  theme: {
    type: String,
    default: 'primary',
    validator: v => ['primary', 'secondary', 'accent'].includes(v)
  }
})

defineEmits(['update:modelValue'])

// Gestió de colors segons el tema
const themeClasses = computed(() => {
  const map = {
    primary:   'focus:ring-2 focus:ring-primary-500',
    secondary: 'focus:ring-2 focus:ring-secondary-500',
    accent:    'focus:ring-2 focus:ring-accent-500',
  }
  return map[props.theme]
})

const hoverThemeClasses = computed(() => {
  const map = {
    primary:   'hover:bg-primary-50',
    secondary: 'hover:bg-secondary-50',
    accent:    'hover:bg-accent-50',
  }
  return map[props.theme]
})
</script>