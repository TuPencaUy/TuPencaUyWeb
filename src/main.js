import './assets/main.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import { createApp } from 'vue'
import App from './App.vue'
import { createAuth0 } from '@auth0/auth0-vue'
import auth0_config from '../auth0_config.json'

createApp(App)
.use(
    createAuth0({
        domain: auth0_config.domain_id,
        clientId: auth0_config.domain_id,
        authorizationParams: {
            redirect_uri: window.location.origin
        },
    })
)
.mount('#app')
