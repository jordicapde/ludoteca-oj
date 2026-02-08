<template>
  <div class="w-full max-w-lg mx-auto bg-white min-h-screen md:min-h-0 md:rounded-2xl md:shadow-xl p-6 flex flex-col relative">

    <div class="flex items-center mb-6">
      <button
        @click="$router.push('/')"
        class="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Tornar
      </button>
      <h2 class="ml-auto text-xl font-bold text-gray-800">Nou Préstec</h2>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-1">Nom i cognoms</label>
      <input
        v-model="nomSoci"
        type="text"
        placeholder="Qui s'emporta els jocs?"
        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      >
    </div>

    <div class="mb-6 relative">
      <label class="block text-sm font-medium text-gray-700 mb-1">Afegeix jocs al préstec</label>
      <div class="relative">
        <input
          v-model="textCerca"
          type="text"
          placeholder="Cerca per nom o codi..."
          class="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div
        v-if="textCerca.length > 0 && resultatsFiltrats.length > 0"
        class="absolute z-10 left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 max-h-60 overflow-y-auto"
      >
        <ul>
          <li
            v-for="joc in resultatsFiltrats"
            :key="joc.id"
            @click="afegirJoc(joc)"
            class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 flex justify-between items-center"
          >
            <div>
              <p class="font-semibold text-gray-800">{{ joc.nom }}</p>
              <p class="text-xs text-gray-500">Codi: {{ joc.id }}</p>
            </div>
            <span class="text-blue-600 text-sm font-medium">+ Afegir</span>
          </li>
        </ul>
      </div>

      <div v-if="textCerca.length > 0 && resultatsFiltrats.length === 0" class="absolute z-10 left-0 right-0 mt-1 bg-white p-4 rounded-lg shadow-xl border border-gray-100 text-center text-gray-500">
        No s'ha trobat cap joc
      </div>
    </div>

    <div class="flex-1 overflow-y-auto mb-6">
      <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
        Jocs seleccionats ({{ jocsSeleccionats.length }})
      </h3>

      <div v-if="jocsSeleccionats.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p class="text-gray-400">Encara no has afegit cap joc</p>
      </div>

      <ul v-else class="space-y-3">
        <li
          v-for="(joc, index) in jocsSeleccionats"
          :key="index"
          class="bg-blue-50 p-4 rounded-lg flex justify-between items-center group"
        >
          <div class="flex items-center gap-3">
            <div class="bg-blue-100 text-blue-600 font-bold px-2 py-1 rounded text-xs">
              {{ joc.id }}
            </div>
            <span class="font-medium text-gray-800">{{ joc.nom }}</span>
          </div>

          <button
            @click="eliminarJoc(index)"
            class="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Treure de la llista"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      </ul>
    </div>

    <div class="mt-auto">
      <button
        @click="confirmarPrestec"
        :disabled="!esValid"
        class="w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        :class="esValid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300'"
      >
        Confirmar préstec
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getJocs, postPrestec } from '../services/api'

const router = useRouter()

// -- ESTAT --
const jocsDisponibles = ref([])
const jocsSeleccionats = ref([])
const nomSoci = ref('')
const textCerca = ref('')
const carregant = ref(false)
const textCarrega = ref('')

onMounted(async () => {
  carregant.value = true
  textCarrega.value = 'Carregant catàleg...'
  try {
    jocsDisponibles.value = await getJocs()
  } catch (error) {
    alert("No s'ha pogut connectar amb la ludoteca")
  } finally {
    carregant.value = false
  }
})

const netejarText = (text) => {
  return text
    .normalize("NFD")                     // Separa l'accent de la lletra
    .replace(/[\u0300-\u036f]/g, "")      // Esborra els accents
    .replace(/[.,:;!?¡¿'"-]/g, "")        // Esborra signes de puntuació
    .toLowerCase()
    .trim()
}

// -- LÒGICA DEL CERCADOR --
const resultatsFiltrats = computed(() => {
  if (!textCerca.value) return []

  const textUsuari = netejarText(textCerca.value)

  return jocsDisponibles.value.filter(joc => {
    // 1. Evitem mostrar jocs que ja tenim a la cistella
    const jaSeleccionat = jocsSeleccionats.value.some(s => s.id === joc.id)
    if (jaSeleccionat) return false

    // 2. Netegem el nom del joc de la base de dades
    const nomJocNet = netejarText(joc.nom)

    // 3. Comprovem si coincideix
    return nomJocNet.includes(textUsuari) || String(joc.id).includes(textUsuari)
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

const confirmarPrestec = async () => {
  carregant.value = true
  textCarrega.value = 'Guardant préstec...'

  try {
    const llistaIds = jocsSeleccionats.value.map(joc => joc.id)
    await postPrestec(nomSoci.value, llistaIds)

    alert("Préstec guardat correctament!")
    nomSoci.value = ''
    jocsSeleccionats.value = []
    router.push('/')
  } catch (error) {
    alert("Hi ha hagut un error al guardar")
  } finally {
    carregant.value = false
  }
}

// -- VALIDACIÓ --
const esValid = computed(() => {
  return nomSoci.value.length > 0 && jocsSeleccionats.value.length > 0
})
</script>