<template>
  <div class="w-full max-w-lg mx-auto bg-white min-h-screen md:min-h-0 md:rounded-2xl md:shadow-xl p-6 flex flex-col relative">

    <LoadingSpinner
      v-if="store.carregant"
    />

    <div class="flex items-center mb-6">
      <BackButton />
      <h2 class="ml-auto text-xl font-bold text-gray-800">Fer un préstec</h2>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-1">Nom i cognoms</label>
      <input
        v-model="nomSoci"
        type="text"
        placeholder="Qui s'emporta els jocs?"
        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
      >
    </div>

    <!-- Quadre de cerca -->
    <SearchInput
      v-model="textCerca"
      label="Afegeix jocs al préstec"
      placeholder="Busca per nom o codi..."
      theme="primary"
      :results="resultatsFiltrats"
    >
      <template #item="{ item }">
        <JocItem
          :joc="item"
          :mostrar-estat="!item.esPotPrestar"
          @click="item.esPotPrestar ? afegirJoc(item) : null"
          :class="!item.esPotPrestar ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
          :flat="true"
        >
          <template #action v-if="item.esPotPrestar">
            <span class="text-blue-600 text-sm font-medium whitespace-nowrap">+ Afegir</span>
          </template>
        </JocItem>
      </template>

      <template #no-results>
        No s'ha trobat cap joc
      </template>
    </SearchInput>

    <!-- Llista jocs seleccionats -->
    <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
      Jocs seleccionats ({{ jocsSeleccionats.length }})
    </h3>
    <div class="flex-1 overflow-y-auto mb-6">

      <div v-if="jocsSeleccionats.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p class="text-gray-400">Encara no has afegit cap joc</p>
      </div>

      <div v-else class="space-y-3">
        <JocItem
          v-for="(joc, index) in jocsSeleccionats"
          :key="index"
          :joc="joc"
        >
          <template #action>
            <button
              @click.stop="eliminarJoc(index)"
              class="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Treure de la llista"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </template>
        </JocItem>
      </div>
    </div>

    <div class="mt-auto">
      <ActionModalButton
        button-label="Confirmar préstec"
        :disabled="!esValid"
        :action="guardarPrestec"

        confirm-title="Confirmar préstec?"
        :confirm-message="`Estàs a punt d'agafar ${jocsSeleccionats.length} ${jocsSeleccionats.length === 1 ? 'joc' : 'jocs'}`"
        success-message="Préstec guardat correctament"
        error-message="No s'ha pogut guardar el préstec"
        @success="onActionModelReturn"
      />
    </div>

  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {getJocs, postPrestec} from '../../services/api.js'
import {netejarText} from '../../js/utils.js'
import JocItem from '../lists/JocItem.vue'
import BackButton from "../ui/BackButton.vue";
import LoadingSpinner from '../ui/LoadingSpinner.vue'
import ActionModalButton from "../ui/ActionModalButton.vue";
import SearchInput from '../ui/SearchInput.vue'
import { useJocsStore } from '../../stores/jocsStore.js'

const router = useRouter()
const store = useJocsStore()

// -- ESTAT --
const jocsSeleccionats = ref([])
const nomSoci = ref('')
const textCerca = ref('')

onMounted(async () => {
  await store.inicialitzarDades();
})

// -- LÒGICA DEL CERCADOR --
const resultatsFiltrats = computed(() => {
  if (!textCerca.value) return []

  const textCercaNet = netejarText(textCerca.value)

  return store.ludoteca.filter(joc => {
    // Evitem mostrar jocs que ja tenim a la cistella
    const jaSeleccionat = jocsSeleccionats.value.some(s => s.id === joc.id)
    if (jaSeleccionat) return false

    return netejarText(joc.nom).includes(textCercaNet) ||
        netejarText(joc.codi).includes(textCercaNet)
  })
})

// -- ACCIONS --
const afegirJoc = (joc) => {
  jocsSeleccionats.value.push(joc)
  textCerca.value = ''
}

const eliminarJoc = (index) => {
  jocsSeleccionats.value.splice(index, 1)
}

const guardarPrestec = async () => {
  const llistaIds = jocsSeleccionats.value.map(joc => joc.id)
  return await postPrestec(nomSoci.value, llistaIds)
}

const onActionModelReturn = () => {
  // Netejar i redirigir
  nomSoci.value = ''
  jocsSeleccionats.value = []
  router.push('/')
}

// -- VALIDACIÓ --
const esValid = computed(() => {
  return nomSoci.value.length > 0 && jocsSeleccionats.value.length > 0
})
</script>