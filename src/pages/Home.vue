<script setup>
import {useUserStore} from '@/store/user.js';
import router from '@/router';

if (!useUserStore().isAuthenticated) {
  router.push('/login');
}

router.push('/admin');

</script>

<template>
  <h1>Home Page</h1>
</template>
