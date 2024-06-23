<script setup>
import FindFriends from "@/components/Chat/FindFriends.vue";
import ChatContainer from "@/components/Chat/ChatContainer.vue";
import {useTenantStore} from "@/store/tenant.js";
import router from "@/router/index.js";

if(!useTenantStore().getCurrentTenant){
  router.push('/events');
}
</script>

<template>
  <FindFriends />
  <ChatContainer />
</template>