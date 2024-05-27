<script setup>
import NavBar from './components/NavBar.vue'
import { useUserStore } from './store/user'
import { useTenantStore } from './store/tenant';
import { useRouter } from 'vue-router'
import { onMounted } from 'vue';
import siteLogic from './logic/siteLogic';
import Loader from './components/utils/Loader.vue';

const router = useRouter()

onMounted(async () => {
  siteLogic().init();

  
  if (!useUserStore().isAuthenticated) {
    router.push('/login');
    return;
  }
  
  const site = await siteLogic().getSite();

  if (!site || !site?.data) {
    router.push('/create-site');
    return;
  }
  
  
  const site = await siteLogic().getSite();

  
  

  if (!site.data) {
    router.push('/create-site');
    return;
  }
  

});


</script>

<template>
  <main>
    <Loader />
    <RouterView />
  </main>
</template>
