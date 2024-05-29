<script setup>
import Admin from "@/components/Admin.vue";
import {onMounted, ref} from "vue";
import utils from "@/logic/utils.js";
import router from "@/router/index.js";
import eventsLogic from "@/logic/eventsLogic.js";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card/index.js";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge/index.js";
import {Button} from "@/components/ui/button/index.js";
import {Icon} from "@iconify/vue";

if (!utils().ensureIsLoggedIn()) {
  router.push('/login');
}

const events = ref([]);

onMounted(async () => {
  utils().showLoader();
  const response = await eventsLogic().getEvents();
  if (response && response?.data) {
    events.value = response.data.list;
  }
  setTimeout(() => {
    utils().hideLoader();
  }, 1000);
});

</script>

<template>
  <Admin title="Events" name-btn-add="Add event" path-to-add="/admin/events/add">
    <div class="w-full m-auto" v-if="events.length < 1">
      <div class="text-center">
        <h3 class="text-2xl font-bold tracking-tight">
          You have no events
        </h3>
        <p class="text-sm text-muted-foreground">
          You can start by adding a new one
        </p>
      </div>
    </div>

    <div v-if="events.length > 0" class="w-full gap-4 grid grid-template-columns=[repeat(200px, minmax(1fr))]">
        <Card v-for="event in events">
          <CardHeader>
            <Badge class="w-fit bg-gray-500">{{ Number(event.teamType) === 1 ? 'National' : 'Local' }}</Badge>
            <CardTitle>{{event.name}}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex gap-2">
              <div class="w-fit flex flex-col gap-3">
                <Label>Start Date</Label>
                <Button variant="outline">
                  <Icon icon="akar-icons:calendar" class="w-4 h-4 mr-2" />
                  {{ new Date(event.startDate).toLocaleDateString() }}
                </Button>
              </div>
              <div class="w-fit flex flex-col gap-3">
                <Label>End Date</Label>
                <Button variant="outline">
                  <Icon icon="akar-icons:calendar" class="w-4 h-4 mr-2" />
                  {{ new Date(event.endDate).toLocaleDateString() }}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex justify-between px-6 pb-6">
            <Button variant="destructive">Delete</Button>
          </CardFooter>
        </Card>
      </div>
  </Admin>
</template>