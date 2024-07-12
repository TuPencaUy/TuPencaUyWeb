<script setup>
import { onMounted, ref } from "vue";
import utils from "@/logic/utils.js";
import analyticsLogic from "@/logic/analyticsLogic.js";
import eventsLogic from '@/logic/eventsLogic';
import { Icon } from "@iconify/vue";
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const leaderboard = ref([]);
const siteEvents = ref([]);
const selectedEvent = ref(0);

onMounted(async () => {
  utils().showLoader();
  siteEvents.value = await eventsLogic().getEvents();

  await getLeaderboard();

  setTimeout(() => {
    utils().hideLoader();
  }, 1000);
});

async function getLeaderboard(eventId) {
  if (!eventId) return

  let fetching = await analyticsLogic().eventLeaderBoard(eventId);
  console.log(selectedEvent.value);
  let data = fetching.data;

  if (data.count > 0) {
    leaderboard.value = data.leaderboard.map(elem => { return { name: elem.name, email: elem.email, points: elem.points } });
  } else {
    leaderboard.value = [];
  }
}
</script>

<template>
  <div class="my-10 p-10 border rounded">
    <h3 class="text-lg font-semibold mb-4 md:text-xl">Events Leaderboard</h3>
    <div class="flex gap-2 mt-2">
      <div class="w-[400px]">
        <Select v-model="selectedEvent">
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="event in siteEvents" class="bg-white" :key="event.id" :value="event.id">
              {{ event.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button @click="getLeaderboard(selectedEvent)">Show leaderboard</Button>
    </div>
    <Table v-if="leaderboard.length > 0">
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(item, index) in leaderboard" :key="item.email">
          <TableCell v-if="index === 0">
            <Icon icon="emojione:1st-place-medal" class="w-7 h-7" />
          </TableCell>
          <TableCell v-else-if="index === 1">
            <Icon icon="emojione:2nd-place-medal" class="w-7 h-7" />
          </TableCell>
          <TableCell v-else-if="index === 2">
            <Icon icon="emojione:3rd-place-medal" class="w-7 h-7" />
          </TableCell>
          <TableCell v-else>
          </TableCell>
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>{{ item.email }}</TableCell>
          <TableCell>{{ item.points }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div class="w-full m-auto" v-else>
      <div class="text-center">
        <h3 class="text-xl font-bold tracking-tight">
          No leaderboard yet
        </h3>
        <p class="text-sm text-muted-foreground">
          Select another event
        </p>
      </div>
    </div>
  </div>
</template>