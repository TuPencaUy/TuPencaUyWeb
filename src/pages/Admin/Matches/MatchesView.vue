<script setup>
import Admin from "@/components/Admin.vue";
import {onMounted, ref} from "vue";
import utils from "@/logic/utils.js";
import matchLogic from "@/logic/matchLogic.js";
import eventsLogic from '@/logic/eventsLogic';
import teamLogic from "@/logic/teamLogic";
import {Button} from "@/components/ui/button/index.js";
import {Icon} from "@iconify/vue";
import { useRoute } from 'vue-router'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {useToast} from '@/components/ui/toast/use-toast';

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
} from '@/components/ui/alert-dialog';
import {useTenantStore} from "@/store/tenant.js";

const objectData = ref({
  firstTeam: 0,
  secondTeam: 0
});


const {toast} = useToast();
const route = useRoute();
const collection = ref([]);
let event = ref({});
let teams = ref([]);

onMounted(async () => {
  utils().showLoader();
  let eventId = route.params.event ?? '';
  const matches = await matchLogic().getMatches(eventId);
  event.value = await eventsLogic().getEvent(eventId);
  if (matches && matches.length > 0) {
    collection.value = matches;
  }

  const teamsDB = await teamLogic().getTeams();

  if (teamsDB && teamsDB.length > 0) {
    teams.value = teamsDB;
  }

  setTimeout(() => {
    utils().hideLoader();
  }, 1000);
});

async function deleteItem(id) {
  utils().showLoader();
  const response = await matchLogic().deleteMatch(id);
  utils().hideLoader();
  if (response && !response?.error) {
    toast({
      title: 'match deleted',
      description: 'match has been deleted successfully',
    });
    const response = await matchLogic().getMatches();
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
  <Admin title="Matches" name-btn-add="Add match"
         :path-to-add="useTenantStore().isCentralSite ? '/admin/matches/add' : '/admin/matches/instantiate'">
    <div class="w-full m-auto" v-if="collection.length < 1">
      <div class="text-center">
        <h3 class="text-2xl font-bold tracking-tight">
          You have no matches
        </h3>
        <p class="text-sm text-muted-foreground">
          You can start by adding a new one
        </p>
      </div>
    </div>
    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead v-if="useTenantStore().isCentralSite">ID</TableHead>
          <TableHead>First team</TableHead>
          <TableHead>Second team</TableHead>
          <TableHead>First team score</TableHead>
          <TableHead>Second team score</TableHead>
          <TableHead>Date</TableHead>
          <TableHead class="text-right">
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in collection" :key="item.id">
          <TableCell v-if="useTenantStore().isCentralSite">{{ item.id }}</TableCell>
          <TableCell>{{ item.firstTeam.name }}</TableCell>
          <TableCell>{{ item.secondTeam.name }}</TableCell>
          <TableCell>{{ item.firstTeamScore }}</TableCell>
          <TableCell>{{ item.secondTeamScore }}</TableCell>
          <TableCell>{{ new Date(item.date).toLocaleDateString() }}</TableCell>
          <TableCell>
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="ghost">
                  <Icon icon="octicon:trash-24" class="w-4 h-4 mr-2"/>
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

        <TableRow>
          <TableCell v-if="useTenantStore().isCentralSite"></TableCell>
          <TableCell>
            <Select v-model="objectData.firstTeam">
                <SelectTrigger id="status" aria-label="Sports">
                <SelectValue placeholder="Select sport"/>
                </SelectTrigger>
                <SelectContent>
                <SelectItem v-for="team in teams" class="bg-white" :key="team.id" :value="team.id">
                    {{ team.name }}
                </SelectItem>
                </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Select v-model="objectData.secondTeam">
                <SelectTrigger id="status" aria-label="Sports">
                <SelectValue placeholder="Select sport"/>
                </SelectTrigger>
                <SelectContent>
                <SelectItem v-for="team in teams" class="bg-white" :key="team.id" :value="team.id">
                    {{ team.name }}
                </SelectItem>
                </SelectContent>
            </Select>
          </TableCell>
          <TableCell>0</TableCell>
          <TableCell>0</TableCell>
          <TableCell>{{ new Date().toLocaleDateString() }}</TableCell>
          <TableCell>
            <router-link class="inline-block" :to="`/admin/events/`">
              <Icon icon="radix-icons:pencil-2" class="w-4 h-4 mr-2"/>
            </router-link>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Admin>
</template>