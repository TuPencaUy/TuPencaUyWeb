<script setup>
import Leaderboard from "@/components/Analytics/Leaderboard.vue";
import {useEventStore} from "@/store/event.js";
import Header from "@/components/Header.vue";
</script>

<template>
  <Header/>
  <Leaderboard :event-id="useEventStore().getCurrentEvent?.id"/>
</template>