<template>
  <div
    class="flex items-center justify-between transition-colors p-3 rounded-lg"
    :class="{ 'opacity-60 bg-gray-50': !joc.esPotPrestar }"
  >
    <div class="flex items-center gap-3 overflow-hidden">
      <div
        class="font-bold px-2 py-1 rounded text-xs shrink-0"
        :class="joc.esPotPrestar ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'"
      >
        {{ joc.codi }}
      </div>

      <div class="truncate">
        <p class="font-medium text-gray-800 truncate leading-tight">{{ joc.nom }}</p>
        <slot name="subtitle"></slot>
      </div>
    </div>

    <div class="flex items-center gap-2 ml-2 shrink-0">

      <template v-if="joc.esPotPrestar">
        <slot name="action"></slot>
      </template>

      <template v-else>
        <span class="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded uppercase tracking-wide">
          {{ joc.estat }}
        </span>
      </template>

    </div>
  </div>
</template>

<script setup>
defineProps({
  joc: {
    type: Object,
    required: true
  }
})
</script>