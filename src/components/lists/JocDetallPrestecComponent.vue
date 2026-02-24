<template>
  <div class="flex flex-col gap-1.5 text-xs p-2.5 bg-gray-50 rounded-lg border border-gray-100">
    <!-- Nom soci -->
    <div v-if="mostrarNom"
        class="flex items-center gap-1.5 text-gray-700"
    >
      <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      <span class="font-medium truncate">{{ prestec.nomSoci }}</span>
    </div>

    <!-- Dies de préstec -->
    <div v-if="mostrarDies"
      class="flex items-center gap-1.5"
      :class="prestec.diesDePrestec > 15 ? 'text-red-500 font-bold' : 'text-gray-500'"
    >
      <svg class="w-3.5 h-3.5 shrink-0" :class="prestec.diesDePrestec > 15 ? 'text-red-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>
        Fa {{ prestec.diesDePrestec }} {{ prestec.diesDePrestec === 1 ? 'dia' : 'dies' }}
      </span>
    </div>

  </div>
</template>

<script setup>
defineProps({
  prestec: {
    type: Object,
    required: true
  },
  mostrarNom: {
    type: Boolean,
    default: true
  },
  mostrarDies: {
    type: Boolean,
    default: true
  }
})
</script>