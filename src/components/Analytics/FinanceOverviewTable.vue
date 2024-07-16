<script setup>
import { onMounted, ref } from "vue";
import utils from "@/logic/utils.js";
import analyticsLogic from "@/logic/analyticsLogic.js";
import app from '@/eventBus.js';

import FinanceTableModal from "@/components/Analytics/FinanceTableModal.vue";

import { Button } from "@/components/ui/button/index.js";
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
const data = ref([]);
const title = ref('');
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

async function showCompleteTable(type) {
  switch (type) {
    case 'site':
      title.value = 'Site Finances';
      data.value = [...sites.value];
      data.value = data.value.map(elem => {
        return {
          ...elem,
          name: elem.siteName,
          id: elem.siteId
        };
      });
      break;
    case 'event':
      title.value = 'Event Finances';
      data.value = [...events.value];
      data.value = data.value.map(elem => {
        return {
          ...elem,
          name: elem.eventName,
          id: elem.eventId
        };
      });
      break;
  }

  app.config.globalProperties.emitter.emit('showFinanceTableModal');
}
</script>

<template>
  <div class="flex justify-around">
    <div class="my-10 p-10 border rounded w-[49%]">
      <div class="flex gap-2 justify-between mb-4">
        <h3 class="text-lg font-semibold md:text-xl">Event Finances Last Inputs</h3>
        <Button @click="showCompleteTable('event')">Ver Todo</Button>
      </div>
      <Table v-if="events.length > 0">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Total Raised</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in events.slice(0, 5)" :key="item.eventId">
            <TableCell>{{ item.eventName }}</TableCell>
            <TableCell>${{ item.totalRaised }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="my-10 p-10 border rounded w-[49%]">
      <div class="flex gap-2 justify-between mb-4">
        <h3 class="text-lg font-semibold md:text-xl">Site Finances Last Inputs</h3>
        <Button @click="showCompleteTable('site')">Ver Todo</Button>
      </div>
      <Table v-if="sites.length > 0">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Total Raised</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in sites.slice(0, 5)" :key="item.siteId">
            <TableCell>{{ item.siteName }}</TableCell>
            <TableCell>${{ item.totalRaised }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>

  <FinanceTableModal :title="title" :data="data"></FinanceTableModal>
</template>