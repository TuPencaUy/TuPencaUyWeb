<script setup>
import NavBar from './components/NavBar.vue'
import { useUserStore } from './store/user'
import { useRouter } from 'vue-router'

const router = useRouter()

if (!useUserStore().isAuthenticated) {
  router.push('/login')
}
</script>

<template>
  <nav>
    <NavBar />
  </nav>
  <main>
    <RouterView />
  </main>
</template>
