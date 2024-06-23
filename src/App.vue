<script setup>
import {useUserStore} from './store/user';
import {useRouter} from 'vue-router';
import {onMounted} from 'vue';
import siteLogic from './logic/siteLogic';
import Loader from './components/utils/Loader.vue';
import {Toaster} from "@/components/ui/toast/index.js";
import {useTenantStore} from "@/store/tenant.js";

const router = useRouter();

onMounted(async () => {
  siteLogic().init();
});

router.beforeEach((to, from, next) => {
  if (!useUserStore().isAuthenticated) {
    if (to.path === '/login' || to.path === '/signup') next();
    next('/login');
  }

  if (to.path.includes('/admin') && !useUserStore().isAdmin) {
    next('/');
  }

  if (!to.path.includes('/admin') && useUserStore().isAdmin) {
    next('/admin');
  }

  if (!useTenantStore().getCurrentTenant && !useUserStore().isAdmin && !useUserStore()._user?.site) {
    if (to.path === '/create-site') next();
    next('/create-site');
  }

  next();
});

</script>

<template>
  <Toaster/>
  <main>
    <Loader/>
    <RouterView/>
  </main>
</template>
