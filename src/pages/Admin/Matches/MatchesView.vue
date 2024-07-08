<script setup>
import Admin from "@/components/Admin.vue";
import {onMounted, ref} from "vue";
import utils from "@/logic/utils.js";
import matchLogic from "@/logic/matchLogic.js";
import eventsLogic from '@/logic/eventsLogic';
import teamLogic from "@/logic/teamLogic";
import {Button} from "@/components/ui/button/index.js";
import {Icon} from "@iconify/vue";
import {Input} from '@/components/ui/input';
import {useRoute} from 'vue-router';

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
  SelectContent, SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  secondTeam: 0,
  firstTeamScore: 0,
  secondTeamScore: 0,
  date: '',
  eventId: 0,
  sport: 0,
  finished: false,
});

const {toast} = useToast();
const route = useRoute();
const collection = ref([]);
let event = ref({});
let teams = ref([]);
let timeHour = ref(0);
let timeMinutes = ref(0);

onMounted(async () => {
  utils().showLoader();
  let eventId = route.params.event ?? '';
  let matches = await matchLogic().getMatches(eventId);
  event.value = await eventsLogic().getEvent(eventId);

  if (matches && matches.length > 0) {
    matches = [...matches].map((elem) => {
      const padNumber = (num) => num < 10 ? `0${num}` : num;

      const date = new Date(elem.date);
      const dateFormatted = `${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}/${date.getFullYear()}`;
      const time = `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
      elem.date = `${dateFormatted} ${time}`;

      return elem;
    });

    collection.value = matches;

  }

  const teamsDB = await teamLogic().getTeams();

  if (teamsDB && teamsDB.length > 0) {
    teams.value = teamsDB;
  }

  objectData.value.eventId = eventId;
  objectData.value.sport = event.value.data.sport.id;

  setTimeout(() => {
    utils().hideLoader();
  }, 1000);
});

async function deleteItem(id) {
  utils().showLoader();
  const response = await matchLogic().deleteMatch(id);
  if (response && !response?.error) {
    toast({
      title: 'match deleted',
      description: 'match has been deleted successfully',
    });
    collection.value = await matchLogic().getMatches(event.value.data.id);
  } else {
    toast({
      title: 'Error',
      description: response?.message || 'An error occurred',
      variant: 'destructive',
    });
  }
  utils().hideLoader();
}

const onSubmit = async (match = null) => {
  let matchId = match?.id ?? '';

  if (matchId !== '') {
    objectData.value.date = match.date;
    objectData.value.firstTeam = match.firstTeam.id;
    objectData.value.secondTeam = match.secondTeam.id;
    objectData.value.firstTeamScore = Number(match.firstTeamScore);
    objectData.value.secondTeamScore = Number(match.secondTeamScore);
    objectData.value.sport = match.sport.id;
    objectData.value.finished = match.finished === "1";
  }

  utils().showLoader();

  const objectToSend = objectData._rawValue;

  if (matchId === '') {
    if (!objectToSend.date || timeHour.value < 0 || timeHour.value > 23 || timeMinutes.value < 0 || timeMinutes.value > 59) {
      toast({
        title: 'Error',
        description: 'Invalid time format',
        variant: 'destructive',
      });
      utils().hideLoader();
      return;
    }

    const splittedDate = objectToSend.date?.split('-');
    const year = Number(splittedDate[0]);
    const month = Number(splittedDate[1]) - 1;
    const day = Number(splittedDate[2]);
    const datetime = new Date(year, month, day);
    datetime.setHours(timeHour.value);
    datetime.setMinutes(timeMinutes.value);
    objectToSend.date = datetime;
  }

  const response = await matchLogic().createOrUpdateMatch(objectToSend, matchId);

  if (response && !response?.error) {
    toast({
      title: `Match ${matchId !== '' ? "updated" : "created"}`,
      description: `Match has been ${matchId !== '' ? "updated" : "created"} successfully`,
    });
    collection.value = await matchLogic().getMatches(event.value.data.id);
  } else {
    toast({
      title: 'Error',
      description: response?.message || 'An error occurred',
      variant: 'destructive',
    });
  }
  utils().hideLoader();
};
</script>

<template>
  <Admin title="Matches"
         :path-to-add="useTenantStore().isCentralSite ? '/admin/matches/add' : '/admin/matches/instantiate'">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-if="useTenantStore().isCentralSite">ID</TableHead>
          <TableHead>First team</TableHead>
          <TableHead>Second team</TableHead>
          <TableHead>First team score</TableHead>
          <TableHead>Second team score</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Finished</TableHead>
          <TableHead class="text-right">
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in collection" :key="item.id">
          <TableCell v-if="useTenantStore().isCentralSite">{{ item.id }}</TableCell>
          <TableCell>{{ item.firstTeam.name }}</TableCell>
          <TableCell>{{ item.secondTeam.name }}</TableCell>
          <TableCell>
            <Input type="text" v-model="item.firstTeamScore"/>
          </TableCell>
          <TableCell>
            <Input type="text" v-model="item.secondTeamScore"/>
          </TableCell>
          <TableCell>{{ item.date }}</TableCell>
          <TableCell>
            <Select v-model="item.finished" default-value="0">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select status"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem class="bg-white" value="1">Finished</SelectItem>
                  <SelectItem class="bg-white" value="0">In progress</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Button variant="ghost" @click="onSubmit(item)" :disabled="utils().hasDateExpired(item.date)">
              <Icon icon="material-symbols:update" class="w-4 h-4 mr-2"/>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="ghost" :disabled="utils().hasDateExpired(item.date)">
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
            <div class="grid gap-6 mt-3">
              <div class="grid gap-3">
                <Select v-model="objectData.firstTeam">
                  <SelectTrigger id="firstTeam" aria-label="First Team">
                    <SelectValue placeholder="Select team"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="team in teams" class="bg-white" :key="team.id" :value="team.id">
                      {{ team.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div class="grid gap-6 mt-3">
              <div class="grid gap-3">
                <Select v-model="objectData.secondTeam">
                  <SelectTrigger id="secondTeam" aria-label="Second Team">
                    <SelectValue placeholder="Select team"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="team in teams" class="bg-white" :key="team.id" :value="team.id">
                      {{ team.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TableCell>
          <TableCell>0</TableCell>
          <TableCell>0</TableCell>
          <TableCell>
            <div class="flex w-fit gap-[10px]">
              <Input type="date" class="w-[200px]" v-model="objectData.date"/>
              <div class="flex gap-[5px]">
                <div class="relative">
                  <p class="absolute bottom-10 text-xs">Hs</p>
                  <Input type="text" class="w-[60px]" v-model="timeHour"/>
                </div>
                <div class="flex flex-col justify-center">
                  <p>:</p>
                </div>
                <div class="relative">
                  <p class="absolute bottom-10 text-xs">Min</p>
                  <Input type="text" class="w-[60px]" v-model="timeMinutes"/>
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Button variant="ghost" @click="onSubmit">
              <Icon icon="gala:add" class="w-4 h-4 mr-2"/>
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Admin>
</template>