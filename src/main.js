import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import { createApp } from 'vue'
import App from './App.vue'
import { createAuth0 } from '@auth0/auth0-vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import router from './router/index'

const pinia = createPinia()
pinia.use(createPersistedState())

createApp(App)
  .use(
    createAuth0({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    })
  )
  .use(pinia)
  .use(router)
  .mount('#app')
