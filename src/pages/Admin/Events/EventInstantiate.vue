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
import router from "@/router";
import {Button} from "@/components/ui/button/index.js";
import {ChevronLeft} from "lucide-vue-next";
import {useToast} from '@/components/ui/toast/use-toast';
import {onMounted, ref} from "vue";
import eventsLogic from "@/logic/eventsLogic.js";
import utils from "@/logic/utils.js";
import {Input} from "@/components/ui/input/index.js";
import {Label} from "@/components/ui/label/index.js";
import {useTenantStore} from "@/store/tenant.js";

const {toast} = useToast();
const events = ref([]);
const selectedEvent = ref(null);
const price = ref(0);
const prizePercentage = ref(0);
onMounted(async () => {
  utils().showLoader();
  const allInstantiableEvents = await eventsLogic().getEvents(true);
  const alreadyInstantiatedEvents = await eventsLogic().getEvents();

  events.value = allInstantiableEvents.filter(event => {
    return event.instantiable && !alreadyInstantiatedEvents.find(e => e?.referenceEvent === event?.id);
  });

  utils().hideLoader();
});

async function handleInstantiate() {
  if (!selectedEvent.value) return;

  const instantiateData = {
    eventId: selectedEvent.value,
    price: Number(price.value),
    prizePercentage: Number(Number(prizePercentage.value / 100).toFixed(2)),
  };

  utils().showLoader();
  const response = await eventsLogic().instantiateEvent(instantiateData);
  utils().hideLoader();
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

  setTimeout(() => {
    router.push('/admin/events');
  }, 1000);
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
        <div class="grid gap-2">
          <Label>Price</Label>
          <Input type="number" v-model="price" placeholder="Event price" :disabled="!useTenantStore().getPayPalEmail"/>
          <Label class="text-xs text-gray-600" v-if="!useTenantStore().getPayPalEmail">To set price, please fill your
            PayPal email in
            your
            <router-link to="/admin/settings/general" class="underline text-primary">Settings.</router-link>
          </Label>
        </div>
        <div class="grid gap-2">
          <Label>Price percentage</Label>
          <Input type="number" v-model="prizePercentage" placeholder="Prize percentage"
                 :disabled="!useTenantStore().getPayPalEmail || price <= 0"/>
          <Label class="text-xs text-gray-600" v-if="!useTenantStore().getPayPalEmail">To set prize percentage, please
            fill your PayPal email in your
            <router-link to="/admin/settings/general" class="underline text-primary">Settings.</router-link>
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full" :disabled="!selectedEvent || price < 0 || (prizePercentage < 0 || prizePercentage > 100)"
                @click="handleInstantiate">
          Add event
        </Button>
      </CardFooter>
    </Card>
  </Admin>
</template>