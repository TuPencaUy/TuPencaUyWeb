import { createMemoryHistory, createRouter } from 'vue-router'

import App from '../App.vue'
import HomeView from '../pages/Home.vue'
import SignUpView from '../pages/Signup.vue'
import LoginView from '../pages/LoginView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/signup', name: 'Signin', component: SignUpView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/:catchAll(.*)', name: 'Not Found', component: LoginView }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
