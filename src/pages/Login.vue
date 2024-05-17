<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useUserStore } from '@/store/user'

const auth0 = useAuth0();
const email = ref('');
const password = ref('');
const router = useRouter();

if (useUserStore().isAuthenticated) {
  router.push('/');
}

async function handleLogin(event) {
  const id = event.target.dataset.id;

  let userData = {
    email: email.value,
    password: password.value,
    token: null
  }

  if (id === 'google') {
    await auth0.loginWithPopup({
      authorizationParams: {
        connection: 'google-oauth2'
      }
    });

    userData.token = auth0.idTokenClaims?._rawValue?.__raw;
  }

  const loggedIn = await useUserStore().login(userData);
  if (loggedIn) {
    router.push('/');
  }
}
</script>

<template>
  <main class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3 mt-5">
        <div class="card">
          <div class="card-body">
            <form @submit="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="email" required />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                />
              </div>
              <div class="moreActions">
                <button
                  @click="handleLogin"
                  type="button"
                  class="btn btn-dark mb-3 col-md-3"
                  data-id="google"
                >
                  Google Sign-In
                </button>
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
