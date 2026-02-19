<template>
  <div class="w-full max-w-lg mx-auto bg-white min-h-screen md:min-h-0 md:rounded-2xl md:shadow-xl p-6 flex flex-col relative">

    <LoadingSpinner
      v-if="store.carregant"
    />

    <div class="flex items-center mb-6">
      <BackButton />
      <h2 class="ml-auto text-xl font-bold text-gray-800">Consultar la ludoteca</h2>
    </div>

    <SearchInput
      v-model="textCerca"
      placeholder="Busca per nom o codi..."
      theme="primary"
      :show-no-results="false"
    />

    <div class="flex-1 overflow-y-auto -mx-2 px-2">
      <div v-if="!store.carregant && jocsFiltrats.length === 0" class="text-center py-12">
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
      Mostrant {{ jocsFiltrats.length }} {{jocsFiltrats.length === 1 ? 'joc' : 'jocs'}} de {{ store.ludoteca.length }}
    </div>

  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {netejarText} from '../../js/utils.js'
import JocItem from '../lists/JocItem.vue'
import BackButton from "../ui/BackButton.vue";
import LoadingSpinner from '../ui/LoadingSpinner.vue'
import SearchInput from '../ui/SearchInput.vue'
import { useJocsStore } from '../../stores/jocsStore.js'

const store = useJocsStore()

// Estat
const textCerca = ref('')

// Càrrega inicial
onMounted(async () => {
  await store.inicialitzarDades();
})

const jocsFiltrats = computed(() => {
  if (!textCerca.value) return store.ludoteca

  const textCercaNet = netejarText(textCerca.value)
  return store.ludoteca.filter(joc => {
    return netejarText(joc.nom).includes(textCercaNet) ||
           netejarText(joc.codi).includes(textCercaNet)
  })
})
</script>