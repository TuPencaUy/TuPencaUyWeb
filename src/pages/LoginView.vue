<script setup>
import Login from '@/components/Login.vue';
import {useUserStore} from "@/store/user.js";
import router from "@/router/index.js";

if (useUserStore().isAuthenticated) router.push('/events');
</script>

<template>
  <Login/>
</template>
