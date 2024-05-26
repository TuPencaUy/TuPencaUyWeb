<script setup>
import { useUserStore } from '@/store/user'
import Login from '@/components/Login.vue'

if (useUserStore().isAuthenticated)
{
  router.push('/');
}
</script>

<template>
  <Login />
</template>
