<template>
  <div class="w-full max-w-lg mx-auto bg-white min-h-[100dvh] md:min-h-0 md:rounded-2xl md:shadow-xl px-6 pb-6 pt-6 md:p-8 flex flex-col relative">

    <LoadingSpinner
      v-if="store.carregant"
    />

    <div class="flex items-center mb-6">
      <BackButton />
      <h2 class="ml-auto text-xl font-bold text-gray-800">Consultar la ludoteca</h2>
    </div>

    <!-- Quadre de cerca -->
    <SearchInput
      v-model="textCerca"
      placeholder="Busca per nom o codi..."
      theme="primary"
      :show-no-results="false"
    />

    <!-- Filtres avançats -->
    <FiltresAvancatsComponent
      v-model:filtresEstat="filtresEstat"
      v-model:ordenacio="ordenacio"
    />

    <!-- Llista de jocs -->
    <div class="flex-1 overflow-y-auto -mx-2 px-2">
      <div v-if="!store.carregant && jocsFiltrats.length === 0" class="text-center py-12">
        <p class="text-gray-400">No s'han trobat jocs amb aquest nom.</p>
      </div>

      <div v-else class="space-y-2">
        <JocComponent
          v-for="joc in jocsFiltrats"
          :key="joc.id"
          :joc="joc"
          :mostrar-estat="true"
          :hover="false"
        >
          <template #details v-if="joc.estaEnPrestec">
            <JocDetallPrestecComponent :prestec="joc.detall" />
          </template>
        </JocComponent>
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
import JocComponent from '../lists/JocComponent.vue'
import JocDetallPrestecComponent from '../lists/JocDetallPrestecComponent.vue'
import BackButton from "../ui/BackButton.vue";
import LoadingSpinner from '../ui/LoadingSpinner.vue'
import SearchInput from '../ui/SearchInput.vue'
import FiltresAvancatsComponent from '../ui/FiltresAvancatsComponent.vue'
import { useJocsStore } from '../../stores/JocsStore.js'

const store = useJocsStore()

// Estat
const textCerca = ref('')
const filtresEstat = ref({
  disponible: true,
  prestec: true
})
const ordenacio = ref('nom')

// Càrrega inicial
onMounted(async () => {
  await store.inicialitzarDades();
})

const jocsFiltrats = computed(() => {
  let resultat = store.ludoteca

  // 1. Filtre de text (Cerca)
  if (textCerca.value) {
    const textCercaNet = netejarText(textCerca.value)
    resultat = resultat.filter(joc => {
      return netejarText(joc.nom).includes(textCercaNet) ||
             netejarText(joc.codi).includes(textCercaNet)
    })
  }

  // 2. Filtre d'estats
  resultat = resultat.filter(joc => {
    if (filtresEstat.value.disponible && joc.estaDisponible) return true

    if (filtresEstat.value.prestec && joc.estaEnPrestec) return true

    return false
  })

  // 3. Ordenació
  return [...resultat].sort((a, b) => {
    if (ordenacio.value === 'nom') {
      // Ordenació alfabètica per nom
      return String(a.nom).localeCompare(String(b.nom), 'ca')
    } else {
      // Ordenació per codi (numeric: true fa que el codi A2 vagi abans que A10)
      return String(a.codi).localeCompare(String(b.codi), 'ca', { numeric: true })
    }
  })
})
</script>