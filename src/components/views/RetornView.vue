<template>
  <div class="w-full max-w-lg mx-auto bg-white min-h-screen md:min-h-0 md:rounded-2xl md:shadow-xl p-6 flex flex-col relative">

    <LoadingSpinner
      v-if="carregant"
    />

    <div class="flex items-center mb-6">
      <BackButton />
      <h2 class="ml-auto text-xl font-bold text-gray-800">Retornar un préstec</h2>
    </div>

    <!-- Quadre de cerca -->
    <SearchInput
      v-model="nomSoci"
      @update:model-value="alEscriure"
      label="Nom i cognoms"
      placeholder="Amb quin nom vas registrar el préstec?"
      theme="primary"
      :results="mostrarSuggeriments ? resultatsCerca : []"
    >
      <template #item="{ item }">
        <button
          @click="seleccionarSoci(item.nom)"
          class="w-full text-left px-4 py-3 flex justify-between items-center group"
        >
          <span class="font-medium text-gray-700 group-hover:text-primary-700">
            {{ item.nom }}
          </span>
          <span class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
            {{ item.total }} jocs
          </span>
        </button>
      </template>

      <template #no-results>
        No s'ha trobat cap préstec amb aquest nom
      </template>
    </SearchInput>

    <!-- Llista resultats préstec -->
    <div v-if="sociSeleccionat" class="flex-1 flex flex-col animate-fade-in-up overflow-hidden">

      <div class="flex-none">
        <h3 class="text-lg font-bold text-gray-800 mb-4">
          Jocs en préstec: <span class="text-primary-600">{{ sociSeleccionat }}</span>
        </h3>

        <p class="block text-sm font-medium text-gray-700 mb-2">
          Selecciona els jocs que retornes
        </p>

        <div class="flex items-center justify-between border-b border-gray-200 pb-2">

          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Jocs seleccionats ({{ seleccioIds.length }})
          </h3>

          <button
            @click="toggleSeleccionarTot"
            class="text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
          >
            {{ totsSeleccionats ? 'Deseleccionar tot' : 'Seleccionar tot' }}
          </button>

        </div>
      </div>

      <div class="flex-1 overflow-y-auto space-y-3 -mx-2 px-2 pb-4 pt-4 min-h-0">
        <JocItem
          v-for="prestec in prestecsDelSoci"
          :key="prestec.idPrestec"
          :joc="{ id: prestec.idJoc }"
          @click="toggleSeleccio(prestec.idPrestec)"
          class="cursor-pointer border transition-all duration-200"
          :class="estaSeleccionat(prestec.idPrestec) ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-100 hover:bg-gray-50'"
        >
          <template #subtitle>
            <div class="text-xs text-gray-500 mt-1">
              <span :class="prestec.diesDePrestec > 15 ? 'text-red-500 font-bold' : ''">
                Fa {{ prestec.diesDePrestec }} dies
              </span>
            </div>
          </template>

          <template #action>
            <div
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
              :class="estaSeleccionat(prestec.idPrestec) ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'"
            >
              <svg v-if="estaSeleccionat(prestec.idPrestec)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </template>
        </JocItem>
      </div>

      <div class="mt-auto flex-none">
        <ActionModalButton
          button-label="Confirmar retorn"
          :disabled="!esValid"
          :action="confirmarRetorn"

          confirm-title="Confirmar retorn?"
          :confirm-message="`Estàs a punt de retornar ${seleccioIds.length} ${seleccioIds.length === 1 ? 'joc' : 'jocs'}`"
          success-message="Préstec retornat correctament"
          error-message="No s'ha pogut retornar el préstec"
          @success="onActionModelReturn"
        />
      </div>

    </div>

  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import BackButton from '../ui/BackButton.vue'
import LoadingSpinner from '../ui/LoadingSpinner.vue'
import JocItem from '../lists/JocItem.vue'
import SearchInput from '../ui/SearchInput.vue'
import ActionModalButton from '../ui/ActionModalButton.vue'
import {actualitarPrestec, getEstats} from '../../services/api.js'
import {netejarText} from '../../js/utils.js'

const router = useRouter()

// Dades
const carregant = ref(false)
const prestecsActius = ref([])
const sociSeleccionat = ref(null)
const nomSoci = ref('')
const seleccioIds = ref([])
const mostrarSuggeriments = ref(false) // Controla si es veu el dropdown

onMounted(async () => {
  carregant.value = true
  try {
    prestecsActius.value = await getEstats()
  } catch (error) {
    console.error(error)
  } finally {
    carregant.value = false
  }
})

// Quan l'usuari escriu
const alEscriure = () => {
  if (sociSeleccionat.value) {
    // Si teníem algú seleccionat i escrivim, reiniciem la selecció per buscar de nou
    sociSeleccionat.value = null
    seleccioIds.value = []
  }
  mostrarSuggeriments.value = true
}

const socisUnics = computed(() => {
  const mapa = {}
  prestecsActius.value.forEach(p => {
    const nom = p.nomSoci.trim()
    if (!mapa[nom]) mapa[nom] = { nom: nom, total: 0 }
    mapa[nom].total++
  })
  return Object.values(mapa)
})

const resultatsCerca = computed(() => {
  if (!nomSoci.value) return []
  const cerca = netejarText(nomSoci.value)
  return socisUnics.value.filter(s => netejarText(s.nom).includes(cerca))
})

const seleccionarSoci = (nom) => {
  // Reset d'estat i interfície
  sociSeleccionat.value = nom
  nomSoci.value = ''
  mostrarSuggeriments.value = false
  seleccioIds.value = []
}

const prestecsDelSoci = computed(() => {
  if (!sociSeleccionat.value) return []
  return prestecsActius.value.filter(p => p.nomSoci.trim() === sociSeleccionat.value)
})

const estaSeleccionat = (id) => seleccioIds.value.includes(id)

const toggleSeleccio = (id) => {
  if (estaSeleccionat(id)) seleccioIds.value = seleccioIds.value.filter(i => i !== id)
  else seleccioIds.value.push(id)
}

const totsSeleccionats = computed(() => {
  return prestecsDelSoci.value.length > 0 && seleccioIds.value.length === prestecsDelSoci.value.length
})

const toggleSeleccionarTot = () => {
  if (totsSeleccionats.value) seleccioIds.value = []
  else seleccioIds.value = prestecsDelSoci.value.map(p => p.idPrestec)
}

const confirmarRetorn = async () => {
  return await actualitarPrestec(seleccioIds.value)
}

const onActionModelReturn = () => {
  // Netejar i redirigir
  sociSeleccionat.value = null
  seleccioIds.value = []
  router.push('/')
}

// -- VALIDACIÓ --
const esValid = computed(() => {
  return seleccioIds.value.length > 0
})
</script>

<style scoped>
/* Petita animació perquè l'aparició dels jocs sigui suau */
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>