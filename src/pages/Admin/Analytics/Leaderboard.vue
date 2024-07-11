<script setup>
import {onMounted, ref} from "vue";
import utils from "@/logic/utils.js";
import analyticsLogic from "@/logic/analyticsLogic.js";
import {Icon} from "@iconify/vue";

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
//   utils().showLoader();
//   const leaderboard = await analyticsLogic().eventLeaderBoard(1);
//   setTimeout(() => {
//     utils().hideLoader();
//   }, 1000);
});
</script>

<template>
  <div>
    <!-- <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Sport</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in collection" :key="item.id">
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>{{ item.sport.name }}</TableCell>
        </TableRow>
      </TableBody>
    </Table> -->
  </div>
</template>