<script setup>

import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import router from "@/router/index.js";

import matchLogic from "@/logic/matchLogic.js";
import betLogic from "@/logic/betLogic.js";
import utils from '@/logic/utils';

import {useToast} from '@/components/ui/toast/use-toast';
import {useUserStore} from "@/store/user.js";

import Header from "@/components/Header.vue";
import {Icon} from "@iconify/vue";
import {Input} from "@/components/ui/input/index.js";
import {Button} from "@/components/ui/button/index.js";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const {toast} = useToast();

const route = useRoute();

const matches = ref([]);
const bets = ref([]);

const firstTeamScore = ref(0);
const secondTeamScore = ref(0);

onMounted(async () => {
  if (!route.params.id) await router.push('/events');
  await getMatches();
});

const getMatches = async () => {
  matches.value = await matchLogic().getMatches(parseInt(route.params.id));
  bets.value = await betLogic().getBets('eventId=' + parseInt(route.params.id));
  matches.value = [...matches.value].map((elem) => {
    const padNumber = (num) => num < 10 ? `0${num}` : num;

    const date = new Date(elem.date);
    elem.fullDate = date;
    elem.date = `${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}/${date.getFullYear()}`;
    elem.startTime = `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
    return elem;
  });

  matches.value = [...matches.value].map((elem) => {
    const bet = bets.value.find((bet) => bet.match?.id === elem.id);
    if (bet) {
      elem.betFirstTeam = bet.scoreFirstTeam;
      elem.betSecondTeam = bet.scoreSecondTeam;
    }
    return elem;
  });
}

const createBet = async (matchId) => {
  utils().showLoader();
  const objectData = {
    firstTeamScore: parseInt(firstTeamScore._rawValue),
    secondTeamScore: parseInt(secondTeamScore._rawValue),
    userEmail: useUserStore().getUserEmail,
    matchId: parseInt(matchId),
    eventId: parseInt(route.params.id)
  };

  const isUpdating = bets.value.some((bet) => bet.match?.id === matchId);
  const response = await betLogic().createOrUpdateBet(objectData, isUpdating);
  utils().hideLoader();

  if (response && !response?.error) {
    toast({
      title: `You made a prediction`
    });
    await getMatches();
  } else {
    toast({
      title: 'Error',
      description: response?.message || 'An error occurred',
      variant: 'destructive',
    });
  }
};
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
                <img v-if="!match.firstTeam?.logo" src="https://via.placeholder.com/150" alt="team1 logo"
                     class="w-10 h-10"/>
                <img v-else :src="['data:image/png;base64',match.firstTeam.logo]" alt="team1 logo"
                     class="w-10 h-10"/>
              </div>
              <div class="flex items-center">
                <div class="flex items-center gap-4">
                  <p class="text-2xl text-uppercase font-semibold">{{ match?.firstTeam?.name ?? 'Team 1' }}</p>
                  <p class="text-m text-uppercase font-semibold text-primary">{{ match?.betFirstTeam ?? '0' }}</p>
                  <p class="text-xl text-uppercase font-semibold">{{ match?.firstTeamScore ?? '0' }}</p>
                </div>
                <Icon icon="solar:cup-outline" class="h-8 w-8 px-2"/>
                <div class="flex items-center gap-4">
                  <p class="text-xl text-uppercase font-semibold">{{ match?.secondTeamScore ?? '0' }}</p>
                  <p class="text-m text-uppercase font-semibold text-primary">{{ match?.betSecondTeam ?? '0' }}</p>
                  <p class="text-2xl text-uppercase font-semibold">{{ match?.secondTeam?.name ?? 'Team 2' }}</p>
                </div>
              </div>
              <div class="border rounded-lg flex justify-evenly">
                <img v-if="!match.secondTeam?.logo" src="https://via.placeholder.com/150" alt="team2 logo"
                     class="w-10 h-10"/>
                <img v-else :src="['data:image/png;base64',match.secondTeam.logo]" alt="team2 logo"
                     class="w-10 h-10"/>
              </div>
            </div>
            <div class="flex gap-2 justify-center items-center">
              <Dialog>
                <DialogTrigger as-child>
                  <Button variant="outline" size="sm" class="" :disabled="utils().hasDateExpired(match.fullDate)">
                    <Icon icon="clarity:note-line" class="h-5 w-5"/>
                    Predict
                  </Button>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Predict the result</DialogTitle>
                  </DialogHeader>
                  <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                      <Label for="name" class="text-right">
                        {{ match?.firstTeam?.name }}
                      </Label>
                      <Input v-model="firstTeamScore" class="col-span-3"/>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                      <Label for="username" class="text-right">
                        {{ match?.secondTeam?.name }}
                      </Label>
                      <Input v-model="secondTeamScore" class="col-span-3"/>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" @click="createBet(match.id)">
                      Predict now!
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>