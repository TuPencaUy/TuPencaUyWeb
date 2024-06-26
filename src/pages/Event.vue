<script setup>

import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import router from "@/router/index.js";

import matchLogic from "@/logic/matchLogic.js";


import Header from "@/components/Header.vue";
import {Icon} from "@iconify/vue";
import {Input} from "@/components/ui/input/index.js";
import {Button} from "@/components/ui/button/index.js";

const route = useRoute();

const matches = ref([]);

onMounted(async () => {
  if (!route.params.id) await router.push('/events');
  
  matches.value = await matchLogic().getMatches(parseInt(route.params.id));

  matches.value = [...matches.value].map((elem) => {
    const padNumber = (num) => num < 10 ? `0${num}` : num;

    const date = new Date(elem.date);
    elem.date = `${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}/${date.getFullYear()}`;
    elem.startTime = `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
    return elem;
  });
});
</script>

<template>
  <Header/>
  <main>
    <div class="container mx-auto mt-8">
      <div class="w-full h-40 flex flex-col justify-center align-items-center bg-white shadow border-primary">
        <h1 class="text-4xl font-bold text-center">Matches</h1>
      </div>
      <div class="mt-8">
        <div class="m-8 flex flex-col justify-center items-center" v-for="match in matches" :key="match">
          <p class="flex justify-center gap-4 items-center">
            <Icon icon="solar:calendar-line-duotone" class="h-10 w-10"/>
            <span class="text-lg font-semibold">{{ match.date ?? 'Today' }}</span>
          </p>
          <div class="flex gap-4">
            <div class="flex gap-2 justify-center items-center">
              <Icon icon="ph:clock" class="h-5 w-5"/>
              <span class="font-semibold text-lg">{{ match.startTime ?? '21:00' }}</span>
            </div>
            <div class="rounded-[50px] p-4 flex justify-evenly max-w-[800px] w-[800px] shadow">
              <div>
                <img :src="match?.firstTeam?.logo ?? 'https://via.placeholder.com/150'" alt="team1 logo" class="w-10 h-10"/>
              </div>
              <div class="flex items-center">
                <div class="flex items-center gap-4">
                  <p class="text-2xl text-uppercase font-semibold">{{ match?.firstTeam?.name ?? 'Team 1' }}</p>
                  <Input type="number" class="w-10" placeholder="bet team 1"/>
                </div>
                <Icon icon="solar:cup-outline" class="h-8 w-8 px-2"/>
                <div class="flex items-center gap-4">
                  <Input type="number" class="w-10" placeholder="bet team 2"/>
                  <p class="text-2xl text-uppercase font-semibold">{{ match?.secondTeam?.name ?? 'Team 2' }}</p>
                </div>
              </div>
              <div class="border rounded-lg flex justify-evenly">
                <img :src="match?.secondTeam?.logo ?? 'https://via.placeholder.com/150'" alt="team2 logo" class="w-10 h-10"/>
              </div>
            </div>
            <div class="flex gap-2 justify-center items-center">

              <Button variant="outline" size="sm" class="">
                <Icon icon="clarity:note-line" class="h-5 w-5"/>
                Predict
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>