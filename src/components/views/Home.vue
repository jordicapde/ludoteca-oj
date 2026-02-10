<template>
  <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
    <h1 class="text-3xl font-bold text-blue-600 mb-2">Ludoteca d'Osona Juga</h1>
    <p class="text-gray-500 mb-8">Gestió de préstecs de l'associació</p>

    <div class="flex flex-col gap-4">
      <button
        @click="$router.push('/prestec')"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2"
      >
        <span>📦</span> Fer un préstec
      </button>

      <button
        @click="$router.push('/retorn')"
        class="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2"
      >
        <span>🔄</span> Retornar un préstec
      </button>

      <button
        @click="$router.push('/ludoteca')"
        class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2"
      >
        <span>📚</span> Consultar ludoteca
      </button>
    </div>
  </div>
</template>

<script setup>

</script>