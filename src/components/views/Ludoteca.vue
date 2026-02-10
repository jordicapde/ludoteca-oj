<template>
  <div class="w-full max-w-lg mx-auto bg-white min-h-screen md:min-h-0 md:rounded-2xl md:shadow-xl p-6 flex flex-col relative">

    <LoadingSpinner
      v-if="carregant"
    />

    <div class="flex items-center mb-6">
      <BackButton />
      <h2 class="ml-auto text-xl font-bold text-gray-800">Catàleg complet</h2>
    </div>

    <div class="mb-6 relative">
      <input
        v-model="textCerca"
        type="text"
        placeholder="Busca un joc..."
        class="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
      >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <div class="flex-1 overflow-y-auto -mx-2 px-2">
      <div v-if="!carregant && jocsFiltrats.length === 0" class="text-center py-12">
        <p class="text-gray-400">No s'han trobat jocs amb aquest nom.</p>
      </div>

      <div v-else class="space-y-2">
        <JocItem
          v-for="joc in jocsFiltrats"
          :key="joc.id"
          :joc="joc"
          class="border border-gray-100 rounded-xl"
        >
          <template #action>
            <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase tracking-wide">
              Disponible
            </span>
          </template>
        </JocItem>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
      Mostrant {{ jocsFiltrats.length }} jocs de {{ jocs.length }}
    </div>

  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {getJocs} from '../../services/api.js'
import {netejarText} from '../../js/utils.js'
import JocItem from '../lists/JocItem.vue'
import BackButton from "../ui/BackButton.vue";
import LoadingSpinner from '../ui/LoadingSpinner.vue'


// Estat
const jocs = ref([])
const textCerca = ref('')
const carregant = ref(true)

// Càrrega inicial
onMounted(async () => {
  try {
    jocs.value = await getJocs()
  } catch (error) {
    console.error(error)
  } finally {
    carregant.value = false
  }
})

const jocsFiltrats = computed(() => {
  if (!textCerca.value) return jocs.value

  const cerca = netejarText(textCerca.value)
  return jocs.value.filter(joc => {
    return netejarText(joc.nom).includes(cerca) ||
           String(joc.id).toLowerCase().includes(cerca)
  })
})
</script>