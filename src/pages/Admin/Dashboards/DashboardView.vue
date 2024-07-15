<script setup>
import Admin from "@/components/Admin.vue";
import Donut from "@/components/Analytics/Donut.vue";
import Leaderboard from "@/components/Analytics/Leaderboard.vue";
import BetsEventsData from "@/components/Analytics/BetsEventsData.vue";
import chartsLogic from "@/logic/chartsLogic";
import { onMounted, ref } from "vue";
import { useTenantStore } from '@/store/tenant';

const betsPerEvent = ref([]);
const usersPerEvent = ref([]);
const usersPerSite = ref([]);

onMounted(async () => {
  if (!useTenantStore().isCentralSite) {
    betsPerEvent.value = await chartsLogic().betsPerEvent();
    usersPerEvent.value = await chartsLogic().usersPerEvent();
  } else {
    usersPerSite.value = await chartsLogic().usersPerSitePlatfrom();
    usersPerEvent.value = await chartsLogic().usersPerEventPlatfrom();
  }
});
</script>

<template>
  <Admin title="Dashboard">
    <div class="flex flex-col p-10 w-full gap-4" v-if="!useTenantStore().isCentralSite">
      <div class="flex justify-center p-2 w-full gap-4">
        <div class="flex rounded-lg border border-separate shadow-sm p-4 h-fit">
          <Donut title="Bets per Event" :data="betsPerEvent"></Donut>
        </div>
        <div class="flex rounded-lg border border-separate shadow-sm p-4 h-fit">
          <Donut title="Users per Event" :data="usersPerEvent"></Donut>
        </div>
      </div>
      <div>
        <BetsEventsData></BetsEventsData>
        <Leaderboard></Leaderboard>
      </div>
    </div>
    <div class="flex flex-col p-10 w-full gap-4" v-else>
      <div class="flex justify-center p-2 w-full gap-4">
        <div class="flex rounded-lg border border-separate shadow-sm p-4 h-fit">
          <Donut title="Users per Site" :data="usersPerSite"></Donut>
        </div>
        <div class="flex rounded-lg border border-separate shadow-sm p-4 h-fit">
          <Donut title="Users per Event" :data="usersPerEvent"></Donut>
        </div>
      </div>
    </div>
  </Admin>
</template>