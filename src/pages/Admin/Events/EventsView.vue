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

import { useToast } from '@/components/ui/toast/use-toast'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const { toast } = useToast()

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

async function deleteItem(id) {
  utils().showLoader();
  const response = await eventsLogic().deleteEvent(id);
  utils().hideLoader();
  if (response && !response?.error) {
    toast({
      title: 'Event deleted',
      description: 'Event has been deleted successfully',
    });
    const response = await eventsLogic().getEvents();
    if (response && response?.data) {
      collection.value = response.data.list;
    }
  } else {
    toast({
      title: 'Error',
      description: response?.message || 'An error occurred',
      variant: 'destructive',
    });
  }
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
            <router-link class="inline-block" :to="`/admin/events/${item.id}`">
              <Icon icon="radix-icons:pencil-2" class="w-4 h-4 mr-2" />
            </router-link>
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="ghost">
                  <Icon icon="octicon:trash-24" class="w-4 h-4 mr-2" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure to delete it?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the event.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction @click="deleteItem(item.id)">Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Admin>
</template>