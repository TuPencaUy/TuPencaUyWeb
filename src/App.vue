<script setup>
import NavBar from './components/NavBar.vue'
import { useUserStore } from './store/user'
import { useTenantStore } from './store/tenant';
import { useRouter } from 'vue-router'
import { onMounted } from 'vue';

const router = useRouter()

onMounted(() => {
  useTenantStore().setCurrentTenant();

  if (!useUserStore().isAuthenticated) {
    router.push('/login')
  }
});


</script>

<template>
  <nav>
    <NavBar />
  </nav>
  <main>
    <RouterView />
  </main>
</template>
