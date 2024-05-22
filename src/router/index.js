import { createMemoryHistory, createRouter } from 'vue-router'

import App from '../App.vue'
import HomeView from '../pages/Home.vue'
import SignInView from '../pages/Signin.vue'
import LoginView from '../pages/Login.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/signin', name: 'Signin', component: SignInView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/:catchAll(.*)', name: 'Not Found', component: LoginView }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
