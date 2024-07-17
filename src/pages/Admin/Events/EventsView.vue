<script setup>
import Admin from "@/components/Admin.vue";
import {onMounted, ref} from "vue";
import utils from "@/logic/utils.js";
import eventsLogic from "@/logic/eventsLogic.js";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify/vue";

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
import paypalLogic from "@/logic/paypalLogic.js";
import payoutLogic from "@/logic/payoutLogic.js";

const {toast} = useToast();

const TEAM_VALUES = {
  1: 'National',
  2: 'Local',
};

const collection = ref([]);

onMounted(async () => {
  utils().showLoader();
  const events = await eventsLogic().getEvents();
  if (events && events.length > 0) {
    collection.value = events;
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

async function handleEndEvent(event) {
  utils().showLoader();
  const eventInfo = await eventsLogic().endEvent(event?.id);
  if (!eventInfo || eventInfo?.error) {
    utils().hideLoader();
    toast({
      title: 'Finish event',
      description: 'An error occurred while ending the event.',
      variant: 'destructive',
    });
    return;
  }
  event.finished = true;
  if (event?.price === 0) {
    utils().hideLoader();
    toast({
      title: 'Finish event',
      description: 'Event has been finished successfully.',
    });
    return;
  }
  const payoutInfo = await paypalLogic().createPayout(
      [
        {
          receiver: eventInfo?.data?.winner?.paypalEmail,
          amount: eventInfo?.data?.prizeAmount,
        },
        {
          receiver: eventInfo?.data?.sitePaypalEmail,
          amount: eventInfo?.data?.siteRevenueAmount,
        },
      ],
      event?.name,
  );
  if (!payoutInfo || !payoutInfo?.batch_header) {
    utils().hideLoader();
    toast({
      title: 'Finish event',
      description: 'An error occurred while ending the event.',
      variant: 'destructive',
    });
    return;
  }
  //TODO: pass list of objects to several requests to db
  const winnerPayoutResponse = await payoutLogic().createPayout({
    "siteId": useTenantStore().getTenantId,
    "paypalEmail": eventInfo?.data?.winner?.paypalEmail,
    "amount": eventInfo?.data?.prizeAmount,
    "transactionID": payoutInfo?.batch_header?.payout_batch_id,
    "eventId": event?.referenceEvent,
  });
  const sitePayoutResponse = await payoutLogic().createPayout({
    "siteId": useTenantStore().getTenantId,
    "paypalEmail": eventInfo?.data?.sitePaypalEmail,
    "amount": eventInfo?.data?.siteRevenueAmount,
    "transactionID": payoutInfo?.batch_header?.payout_batch_id,
    "eventId": event?.referenceEvent,
  });
  if (!winnerPayoutResponse || !sitePayoutResponse) {
    utils().hideLoader();
    toast({
      title: 'Finish event',
      description: 'An error occurred while ending the event.',
      variant: 'destructive',
    });
    return;
  }
  utils().hideLoader();
  toast({
    title: 'Finish event',
    description: 'Event has been finished successfully.',
  });
}
</script>

<template>
  <Admin title="Events" name-btn-add="Add event"
         :path-to-add="useTenantStore().isCentralSite ? '/admin/events/add' : '/admin/events/instantiate'">
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
          <TableHead v-if="useTenantStore().isCentralSite">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Sport</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead v-if="!useTenantStore().isCentralSite">Price</TableHead>
          <TableHead>Commission</TableHead>
          <TableHead v-if="!useTenantStore().isCentralSite">Prize Percentage</TableHead>
          <TableHead>Team Type</TableHead>
          <TableHead class="text-right">
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="event in collection" :key="event.id">
          <TableCell v-if="useTenantStore().isCentralSite">{{ event.id }}</TableCell>
          <TableCell>{{ event.name }}</TableCell>
          <TableCell>{{ event.sport.name }}</TableCell>
          <TableCell>{{ new Date(event.startDate).toLocaleDateString() }}</TableCell>
          <TableCell>{{ new Date(event.endDate).toLocaleDateString() }}</TableCell>
          <TableCell v-if="!useTenantStore().isCentralSite">{{
              `${event.price !== 0 ? '$' + event.price : 'Free'}`
            }}
          </TableCell>
          <TableCell>{{ `${(parseInt(event.comission * 100)) ?? 0}%` }}</TableCell>
          <TableCell v-if="!useTenantStore().isCentralSite">
            {{ `${event.prizePercentage !== 0 ? (parseInt(event.prizePercentage * 100) + '%') : 'None'}` }}
          </TableCell>
          <TableCell>{{ TEAM_VALUES[event.teamType ?? 1] }}</TableCell>
          <TableCell v-if="useTenantStore().isCentralSite">
            <router-link class="inline-block" :to="`/admin/events/${event.id}`">
              <Icon icon="radix-icons:pencil-2" class="w-4 h-4 mr-2"/>
            </router-link>
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
                  <AlertDialogAction @click="deleteItem(event.id)">Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableCell>
          <TableCell v-if="!useTenantStore().isCentralSite && !event?.finished">
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button>
                  End Event
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to finish this event?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently finish the event.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction @click="handleEndEvent(event)">Finish event</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableCell>
          <TableCell v-if="!useTenantStore().isCentralSite && event?.finished">
            <span class="text-sm">Finished</span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Admin>
</template>