<template>
  <button
    @click="anarEnrere"
    class="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2 group"
  >
    <div class="p-1 rounded-full group-hover:bg-blue-50 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
    </div>
    <span class="font-medium">Tornar</span>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  ruta: {
    type: String,
    default: '/' // Per defecte torna a la Home
  }
})

const router = useRouter()

const anarEnrere = () => {
  if (props.ruta) {
    router.push(props.ruta)
  } else {
    router.back()
  }
}
</script>