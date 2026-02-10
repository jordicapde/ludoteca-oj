import { createRouter, createWebHashHistory } from 'vue-router'

import Home from './components/views/Home.vue'
import Prestec from './components/views/Prestec.vue'
import Retorn from './components/views/Retorn.vue'
import Ludoteca from './components/views/Ludoteca.vue'

// Definició de rutes
const routes = [
  { path: '/', component: Home },
  { path: '/prestec', component: Prestec },
  { path: '/retorn', component: Retorn },
  { path: '/ludoteca', name: 'consulta', component: Ludoteca },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router