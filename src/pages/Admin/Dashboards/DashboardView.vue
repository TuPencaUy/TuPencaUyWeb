<script setup>
import Admin from "@/components/Admin.vue";
import Donut from "../Analytics/Donut.vue";
import chartsLogic from "@/logic/chartsLogic";
import { onMounted, ref } from "vue";

const betsPerEvent = ref([]);

onMounted(async() => {
  betsPerEvent.value = await chartsLogic().betsPerEvent(); 
});
</script>

<template>
  <Admin title="Dashboard">
    <div class="flex justify-center p-2 w-full">
      <div class="flex rounded-lg border border-separate shadow-sm p-4 h-fit">
        <Donut title="Bets per Event" :data="betsPerEvent"></Donut>
      </div>
    </div>
  </Admin>
</template>