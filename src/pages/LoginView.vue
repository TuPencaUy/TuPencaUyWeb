<script setup>
import {useUserStore} from '@/store/user';
import router from '@/router';
import Login from '@/components/Login.vue';

router.push('/chat');

if (useUserStore().isAuthenticated) {
  router.push('/');
}
</script>

<template>
  <Login/>
</template>
