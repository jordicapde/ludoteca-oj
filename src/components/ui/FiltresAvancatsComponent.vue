<template>
  <div class="w-full mb-4">

    <button
      @click="mostrarFiltres = !mostrarFiltres"
      class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
    >
      <svg
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': mostrarFiltres }"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
      Filtres avançats
    </button>

    <div
      v-show="mostrarFiltres"
      class="mt-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col gap-4 text-sm"
    >

      <!-- Filtres d'estat -->
      <div>
        <h3 class="font-semibold text-gray-700 mb-2">Mostrar per estat:</h3>
        <div class="flex flex-wrap gap-4">
          <label
            v-for="opcio in opcionsEstat"
            :key="opcio.clau"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="filtresEstat[opcio.clau]"
              @change="actualitzarFiltreEstat(opcio.clau, $event.target.checked)"
              class="w-4 h-4 accent-primary-600 cursor-pointer"
            >
            <span class="text-gray-700">{{ opcio.etiqueta }}</span>
          </label>
        </div>
      </div>

      <hr class="border-gray-100">

      <!-- Ordenació -->
      <div>
        <h3 class="font-semibold text-gray-700 mb-2">Ordenar per:</h3>
        <div class="flex flex-wrap gap-4">
          <label
            v-for="opcio in opcionsOrdenacio"
            :key="opcio.valor"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              :value="opcio.valor"
              :checked="ordenacio === opcio.valor"
              @change="$emit('update:ordenacio', opcio.valor)"
              class="w-4 h-4 accent-primary-600 cursor-pointer"
            >
            <span class="text-gray-700">{{ opcio.etiqueta }}</span>
          </label>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  filtresEstat: {
    type: Object,
    required: true
  },
  ordenacio: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:filtresEstat', 'update:ordenacio'])

// Estat
const mostrarFiltres = ref(false)

const opcionsEstat = [
  { clau: 'disponible', etiqueta: 'Disponibles' },
  { clau: 'prestec', etiqueta: 'En préstec' }
]
const opcionsOrdenacio = [
  { valor: 'nom', etiqueta: 'Nom' },
  { valor: 'codi', etiqueta: 'Codi' }
]

function actualitzarFiltreEstat(clau, valor) {
  emit('update:filtresEstat', {
    ...props.filtresEstat, // Copiem l'estat actual
    [clau]: valor          // Sobreescrivim només el que acaba de canviar
  })
}
</script>