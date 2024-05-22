<script setup>
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  useUserStore().logOut()
  router.push('/')
}
</script>

<template>
  <header class=".navbar p-3 mb-3 border-bottom bg-dark" data-bs-theme="dark">
    <div class="container">
      <div
        class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"
      >
        <router-link
          to="/"
          class="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none"
        >
          Tu Penca UY
        </router-link>

        <ul class="nav col-12 col-lg-2 me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a href="#" class="nav-link px-2 link-body-emphasis">Products</a></li>
        </ul>

        <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input type="search" class="form-control" placeholder="Search..." aria-label="Search" />
        </form>

        <router-link
          v-if="!useUserStore()?.isAuthenticated"
          class="nav-link link-body-emphasis"
          to="/login"
          >Login</router-link
        >

        <router-link
          v-if="!useUserStore()?.isAuthenticated"
          class="nav-link link-body-emphasis"
          to="/signin"
          >Sign In</router-link
        >

        <div v-if="useUserStore()?.isAuthenticated" class="dropdown text-end">
          <a
            href="#"
            class="d-block link-body-emphasis text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://github.com/mdo.png"
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
