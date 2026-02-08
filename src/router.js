import { createRouter, createWebHashHistory } from 'vue-router'

import Home from './components/Home.vue'
import Prestec from './components/Prestec.vue'

// Definició de rutes
const routes = [
  { path: '/', component: Home },
  { path: '/prestec', component: Prestec },
  // { path: '/retorn', component: Retorn }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router