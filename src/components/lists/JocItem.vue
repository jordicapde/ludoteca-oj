<template>
  <div
      class="flex items-center p-3 transition-colors gap-4 duration-200"
      :class="[
        // Background segons seleccionat
        seleccionat ? 'bg-green-50' : 'bg-white',

        // Border i cantonades (si no és flat)
        { 'border border-gray-100 rounded-xl': !flat },

        // Hover
        { 'hover:bg-gray-50': hover && !seleccionat },

        // Border si està seleccionat
        { 'border-green-500 ring-1 ring-green-500': seleccionat && !flat }
      ]"
  >

    <!-- Imatge -->
    <div v-if="joc.metadata" class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
      <img :src="joc.metadata.imatge" :alt="joc.nom" class="w-full h-full object-cover" />
    </div>

    <!-- Nom i codi -->
    <div class="flex-1 min-w-0">
      <h3 class="text-sm font-bold text-gray-900 truncate tracking-tight">
        {{ joc.nom }}
      </h3>
      <div v-if="joc.codi" class="mt-1">
        <span class="inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-primary-100 text-primary-700 rounded">
          {{ joc.codi }}
        </span>
      </div>
    </div>

    <!-- Part dreta (estat, detalls o accions) -->
    <div class="flex items-center space-x-3 ml-auto pr-2">
      <div class="flex flex-col items-end gap-1">
        <div v-if="mostrarEstat"
             :class="colorEstat"
             class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap">
          {{ joc.estat }}
        </div>

        <slot name="details"></slot>
      </div>

      <div v-if="$slots.action" class="flex-shrink-0 flex items-center justify-center">
        <slot name="action"></slot>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ESTAT_JOC } from '../../models/Joc.js';

const props = defineProps({
  joc: {
    type: Object,
    required: true
  },
  mostrarEstat: {
    type: Boolean,
    default: false
  },

  // Atributs d'interfície
  flat: {
    type: Boolean,
    default: false
  },
  hover: {
    type: Boolean,
    default: true
  },
  seleccionat: {
    type: Boolean,
    default: false
  }
});

// Lògica de colors segons l'estat del joc
const colorEstat = computed(() => {
  const estats = {
    [ESTAT_JOC.DISPONIBLE]: 'bg-green-50 text-green-700 border-green-200',
    [ESTAT_JOC.PRESTEC]: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return estats[props.joc.estat] || 'bg-gray-50 text-gray-400 border-gray-200';
});
</script>