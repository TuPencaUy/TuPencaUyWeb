<script setup>
import { onMounted, ref } from "vue";
import utils from "@/logic/utils.js";
import analyticsLogic from "@/logic/analyticsLogic.js";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const events = ref([]);
const sites = ref([]);
const total = ref(0);

onMounted(async () => {
  utils().showLoader();
  const dataFetched = await analyticsLogic().platformFinances();

  events.value = dataFetched.data.events;
  sites.value = dataFetched.data.sites;

  total.value = dataFetched.totalRaised;

  setTimeout(() => {
    utils().hideLoader();
  }, 1000);
});

</script>

<template>
  <div class="flex justify-around">
    <div class="my-10 p-10 border rounded w-[49%]">
      <h3 class="text-lg font-semibold mb-4 md:text-xl">Event Finances</h3>
      <Table v-if="events.length > 0">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Total Raised</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in events" :key="item.eventId">
            <TableCell>{{ item.eventName }}</TableCell>
            <TableCell>${{ item.totalRaised }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="my-10 p-10 border rounded w-[49%]">
      <h3 class="text-lg font-semibold mb-4 md:text-xl">Site Finances</h3>
      <Table v-if="sites.length > 0">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Total Raised</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in sites" :key="item.siteId">
            <TableCell>{{ item.siteName }}</TableCell>
            <TableCell>${{ item.totalRaised }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>