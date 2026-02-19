import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from './components/views/HomeView.vue'
import PrestecView from './components/views/PrestecView.vue'
import RetornView from './components/views/RetornView.vue'
import LudotecaView from './components/views/LudotecaView.vue'

// Definició de rutes
const routes = [
  { path: '/', component: HomeView },
  { path: '/prestec', component: PrestecView },
  { path: '/retorn', component: RetornView },
  { path: '/ludoteca', name: 'consulta', component: LudotecaView },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router