<script setup>
import Admin from "@/components/Admin.vue";
import { onMounted, ref } from "vue";
import utils from "@/logic/utils.js";
import router from "@/router/index.js";
import eventsLogic from "@/logic/eventsLogic.js";
import { Button } from "@/components/ui/button/index.js";
import { Icon } from "@iconify/vue";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

if (!utils().ensureIsLoggedIn()) {
  router.push('/login');
}

const COMMISSION_VALUES = {
  1: 'Yes',
  0: 'No',
};

const TEAM_VALUES = {
  1: 'National',
  2: 'Local',
};

const collection = ref([]);

onMounted(async () => {
  utils().showLoader();
  const response = await eventsLogic().getEvents();
  if (response && response?.data) {
    collection.value = response.data.list;
  }
  setTimeout(() => {
    utils().hideLoader();
  }, 1000);
});

function deleteItem() {
  console.log('delete item');
}
</script>

<template>
  <Admin title="Events" name-btn-add="Add event" path-to-add="/admin/events/add">
    <div class="w-full m-auto" v-if="collection.length < 1">
      <div class="text-center">
        <h3 class="text-2xl font-bold tracking-tight">
          You have no events
        </h3>
        <p class="text-sm text-muted-foreground">
          You can start by adding a new one
        </p>
      </div>
    </div>
    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Comission</TableHead>
          <TableHead>Team Type</TableHead>
          <TableHead class="text-right">
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in collection" :key="item.id">
          <TableCell>{{ item.id }}</TableCell>
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>{{ new Date(item.startDate).toLocaleDateString() }}</TableCell>
          <TableCell>{{ new Date(item.endDate).toLocaleDateString() }}</TableCell>
          <TableCell>{{ COMMISSION_VALUES[item.comission ?? 0] }}</TableCell>
          <TableCell>{{ TEAM_VALUES[item.teamType ?? 0] }}</TableCell>
          <TableCell>
            <Button @click="deleteItem" variant="ghost">
              <Icon icon="radix-icons:pencil-2" class="w-4 h-4 mr-2" />
            </Button>
            <Button @click="deleteItem" variant="ghost">
              <Icon icon="octicon:trash-24" class="w-4 h-4 mr-2" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Admin>
</template>