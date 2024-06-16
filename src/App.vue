<script setup>
import { useUserStore } from './store/user'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue';
import siteLogic from './logic/siteLogic';
import Loader from './components/utils/Loader.vue';
import {Toaster} from "@/components/ui/toast/index.js";

const router = useRouter()

onMounted(async () => {
  siteLogic().init();

  if (!useUserStore().isAuthenticated) {
    router.push('/login');
    return;
  }
});

</script>

<template>
  <Toaster/>
  <main>
    <Loader />
    <RouterView />
  </main>
</template>
