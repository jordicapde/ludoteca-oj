<template>
  <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
    <h1 class="text-3xl font-bold text-primary-600 mb-2">Ludoteca d'Osona Juga</h1>
    <p class="text-gray-500 mb-8">Gestió de préstecs de l'associació</p>

    <div class="flex flex-col gap-4">
      <button
        @click="$router.push('/prestec')"
        class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3"
      >
        <span class="text-2xl">📦</span>
        <span class="text-lg">Fer un préstec</span>
      </button>

      <button
        @click="$router.push('/retorn')"
        class="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold py-5 px-6 rounded-xl border border-primary-100 shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3"
      >
        <span class="text-2xl">🔄</span>
        <span class="text-lg">Retornar un préstec</span>
      </button>

      <button
        @click="$router.push('/ludoteca')"
        class="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-5 px-6 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3"
      >
        <span class="text-2xl">👀</span>
        <span class="text-lg">Consultar ludoteca</span>
      </button>
    </div>

    <div class="mt-10 pt-6 border-t border-gray-100 flex flex-col items-center justify-center">

      <img
        src="../../assets/logo.png"
        alt="Logo Associació"
        class="h-16 w-auto mb-3 mx-auto object-contain"
      />

      <p class="text-xs text-gray-400 font-medium tracking-wide text-opacity-80 mt-2">
        Aquesta és una eina exclusiva per a socis i sòcies d'Osona Juga
      </p>
      <p class="text-s text-gray-400 font-medium tracking-wide text-opacity-80 mt-1">
        Versió {{ appVersion }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useJocsStore } from '../../stores/JocsStore.js'
import packageInfo from '../../../package.json'

const store = useJocsStore()
const appVersion = ref(packageInfo.version)

onMounted(() => {
  store.inicialitzarDades(true);
})
</script>