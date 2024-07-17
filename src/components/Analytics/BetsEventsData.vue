<script setup>
import {onMounted, ref} from "vue";
import utils from "@/logic/utils.js";
import analyticsLogic from "@/logic/analyticsLogic.js";
import eventsLogic from '@/logic/eventsLogic';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const collection = ref([]);
onMounted(async () => {
  utils().showLoader();
  const siteEvents = await eventsLogic().getEvents();

  for (let i = 0; i < siteEvents.length; i++) {
    const event = siteEvents[i];
    let eventData = await analyticsLogic().betsEventData(event.id);
    if (eventData && eventData.data) {
      collection.value.push(eventData.data);
    }
  }

  setTimeout(() => {
    utils().hideLoader();
  }, 1000);
});
</script>

<template>
  <div class="my-10 p-10 border rounded">
    <h3 class="text-lg font-semibold mb-4 md:text-xl">Events Data</h3>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Name</TableHead>
          <TableHead>Total Collected Amount</TableHead>
          <TableHead>Success Rate</TableHead>
          <TableHead>Partial Success Rate</TableHead>
          <TableHead>Price amount</TableHead>
          <TableHead>Total Bets</TableHead>
          <TableHead>Unsuccessful Bets</TableHead>
          <TableHead>Successful Bets</TableHead>
          <TableHead>Partially Successful Bets</TableHead>
          <TableHead>Participants</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(item, index) in collection" :key="index">
          <TableCell>{{ item.eventName }}</TableCell>
          <TableCell>${{ item.amountCollected }}</TableCell>
          <TableCell>{{ `${item.hitsPercentage * 100}%` }}</TableCell>
          <TableCell>{{ item.partialHitsPercentage }}</TableCell>
          <TableCell>${{ item.prize }}</TableCell>
          <TableCell>{{ item.totalBets }}</TableCell>
          <TableCell>{{ item.totalErrors }}</TableCell>
          <TableCell>{{ item.totalHits }}</TableCell>
          <TableCell>{{ item.totalPartialHits }}</TableCell>
          <TableCell>{{ item.usersCount }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>