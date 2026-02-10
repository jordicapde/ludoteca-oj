<template>
  <div class="w-full max-w-lg mx-auto bg-white min-h-screen md:min-h-0 md:rounded-2xl md:shadow-xl p-6 flex flex-col relative">

    <LoadingSpinner
      v-if="carregant"
    />

    <div class="flex items-center mb-6">
      <BackButton />
      <h2 class="ml-auto text-xl font-bold text-gray-800">Retornar jocs</h2>
    </div>

    <div class="relative mb-6 z-20">
      <label class="block text-sm font-medium text-gray-700 mb-1">Buscar soci</label>
      <div class="relative">
        <input
          v-model="textCerca"
          @input="alEscriure"
          type="text"
          placeholder="Escriu el nom per buscar..."
          class="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm"
          autocomplete="off"
        >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <div
          v-if="textCerca && resultatsCerca.length > 0 && mostrarSuggeriments"
          class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-30"
        >
          <button
            v-for="soci in resultatsCerca"
            :key="soci.nom"
            @click="seleccionarSoci(soci.nom)"
            class="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-50 last:border-0 flex justify-between items-center group transition-colors"
          >
            <span class="font-medium text-gray-700 group-hover:text-green-700">{{ soci.nom }}</span>
            <span class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{{ soci.total }} jocs</span>
          </button>
        </div>

        <div v-if="textCerca && resultatsCerca.length === 0 && mostrarSuggeriments" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500 z-30">
          No s'ha trobat cap préstec amb aquest nom
        </div>
      </div>
    </div>

    <div v-if="sociSeleccionat" class="flex-1 flex flex-col animate-fade-in-up">

      <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <div>
          <h3 class="text-lg font-bold text-gray-800">Jocs de <span class="text-green-600">{{ sociSeleccionat }}</span></h3>
          <p class="text-xs text-gray-500">Selecciona els jocs que retornes</p>
        </div>
        <button
          @click="toggleSeleccionarTot"
          class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          {{ totsSeleccionats ? 'Deseleccionar tot' : 'Seleccionar tot' }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto space-y-3 -mx-2 px-2 pb-4">
        <JocItem
          v-for="prestec in prestecsDelSoci"
          :key="prestec.idPrestec"
          :joc="{ id: prestec.idJoc, nom: prestec.nomJoc }"
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

      <div class="mt-auto pt-4 border-t border-gray-100">
        <button
          @click="confirmarRetorn"
          :disabled="seleccioIds.length === 0"
          class="w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          :class="seleccioIds.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300'"
        >
          Confirmar retorn ({{ seleccioIds.length }})
        </button>
      </div>

    </div>

    <div v-else-if="!textCerca" class="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-50">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p>Busca un soci per veure els seus préstecs</p>
    </div>

  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import BackButton from '../ui/BackButton.vue'
import LoadingSpinner from '../ui/LoadingSpinner.vue'
import JocItem from '../lists/JocItem.vue'
import {actualitarPrestec, getPrestecsActius} from '../../services/api.js'
import {netejarText} from '../../js/utils.js'

const router = useRouter()

// Dades
const carregant = ref(false)
const prestecsActius = ref([])
const sociSeleccionat = ref(null)
const textCerca = ref('')
const seleccioIds = ref([])
const mostrarSuggeriments = ref(false) // Controla si es veu el dropdown

onMounted(async () => {
  carregant.value = true
  try {
    prestecsActius.value = await getPrestecsActius()
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
  if (!textCerca.value) return []
  const cerca = netejarText(textCerca.value)
  return socisUnics.value.filter(s => netejarText(s.nom).includes(cerca))
})

const seleccionarSoci = (nom) => {
  sociSeleccionat.value = nom
  textCerca.value = '' // Netegem el text per deixar-ho maco
  mostrarSuggeriments.value = false // Amaguem el dropdown
  seleccioIds.value = [] // Reset de selecció anterior
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
  return prestecsDelSoci.value.length > 0 && prestecsDelSoci.value.every(p => seleccioIds.value.includes(p.idPrestec))
})

const toggleSeleccionarTot = () => {
  if (totsSeleccionats.value) seleccioIds.value = []
  else seleccioIds.value = prestecsDelSoci.value.map(p => p.idPrestec)
}

const confirmarRetorn = async () => {
  if (!confirm(`Confirmar el retorn de ${seleccioIds.value.length} jocs?`)) return

  carregant.value = true
  try {
    await actualitarPrestec(seleccioIds.value)
    alert('Retorn realitzat correctament!')
    router.push('/')
  } catch (e) {
    alert('Error: ' + e.message)
  } finally {
    carregant.value = false
  }
}
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