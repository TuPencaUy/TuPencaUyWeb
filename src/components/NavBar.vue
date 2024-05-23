<script setup>
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const auth0 = useAuth0();

const router = useRouter()

const handleLogout = () => {
  useUserStore().logOut()
  router.push('/')
}
</script>

<template>
  <header class=".navbar mb-3 border-bottom bg-dark" data-bs-theme="dark">
    <div class="container">
      <div
        class="d-flex flex-wrap align-items-center justify-content-between"
      >
        <router-link
          to="/"
          class="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none"
        >
          <img class="logo" src="../../public/logo.png">
        </router-link>

        <router-link
          v-if="!useUserStore()?.isAuthenticated"
          class="nav-link link-body-emphasis"
          to="/login"
          >Login</router-link
        >

        <router-link
          v-if="!useUserStore()?.isAuthenticated"
          class="nav-link link-body-emphasis"
          to="/signup"
          >Sign up</router-link
        >

        <div v-if="useUserStore()?.isAuthenticated" class="dropdown text-end">
          <a
            href="#"
            class="d-block link-body-emphasis text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              :src="auth0?.user?._value?.picture ?? ''"
              alt="mdo"
              width="32"
              height="32"
              class="rounded-circle"
            />
          </a>
          <ul class="dropdown-menu text-small">
            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a @click="handleLogout" class="dropdown-item" href="#">Sign out</a></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
  .logo {
    width: 100px;
  }
</style>
