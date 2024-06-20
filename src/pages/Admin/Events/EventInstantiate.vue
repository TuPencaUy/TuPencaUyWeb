<script setup>
import Admin from "@/components/Admin.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card/index.js";
import {Button} from "@/components/ui/button/index.js";
import {ChevronLeft} from "lucide-vue-next";
import {useToast} from '@/components/ui/toast/use-toast';
import {onMounted, ref} from "vue";
import eventsLogic from "@/logic/eventsLogic.js";
import utils from "@/logic/utils.js";

const {toast} = useToast();
const events = ref([]);
const selectedEvent = ref(null);
onMounted(async () => {
  utils().showLoader();
  const allInstantiableEvents = await eventsLogic().getEvents(true);
  const alreadyInstantiatedEvents = await eventsLogic().getEvents();

  events.value = allInstantiableEvents.filter(event => {
    return !alreadyInstantiatedEvents.find(e => e?.referenceEvent === event?.id);
  });

  utils().hideLoader();
});

async function handleInstantiate() {
  if (!selectedEvent.value) return;

  const response = await eventsLogic().instantiateEvent(selectedEvent.value);
  if (!response || response?.error) {
    toast({
      title: 'Error',
      description: 'An error occurred while adding the event',
      variant: 'destructive'
    });
    return;
  }

  selectedEvent.value = null;
  toast({
    title: 'Success',
    description: 'Event added successfully',
  });
}
</script>

<template>
  <Admin>
    <Card class="w-full max-w-sm m-auto">
      <CardHeader>
        <router-link to="/admin/events">
          <Button variant="outline" size="icon" class="h-7 w-7">
            <ChevronLeft class="h-4 w-4"/>
          </Button>
        </router-link>
        <CardTitle class="text-2xl text-center">
          Add new event
        </CardTitle>
        <CardDescription class="text-center">
          Please select the event you want to add
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Select v-model="selectedEvent">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select event"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem class="bg-white" v-for="event in events" :key="event.id" :value="String(event.id)">
                  {{ event.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full" :disabled="!selectedEvent" @click="handleInstantiate">
          Add event
        </Button>
      </CardFooter>
    </Card>
  </Admin>
</template>