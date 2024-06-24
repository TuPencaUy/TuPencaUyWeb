<script setup>
import {
  ChevronLeft,
} from 'lucide-vue-next';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import eventsLogic from '@/logic/eventsLogic';
import sportLogic from "@/logic/sportLogic";
import {useToast} from '@/components/ui/toast/use-toast';
import router from '@/router';
import {useRoute} from 'vue-router';

const {toast} = useToast();
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import
{
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Admin from "@/components/Admin.vue";
import {onMounted, ref} from "vue";
import {toTypedSchema} from "@vee-validate/zod";
import * as z from "zod";
import {useForm} from 'vee-validate';
import {Badge} from "@/components/ui/badge";
import utils from '@/logic/utils';


const route = useRoute();

let eventId = '';
let sports = ref([]);

const objectData = ref({
  name: 'eventName',
  startDate: '',
  endDate: '',
  comission: 'no',
  teamType: 'local',
  sport_id: ''
});

const formSchema = toTypedSchema(z.object({
  name: z.string().min(4).max(30),
  startDate: z.string(),
  endDate: z.string(),
}));

const {handleSubmit} = useForm({
  validationSchema: formSchema,
});

onMounted(async () => {
  eventId = route.params.id ?? '';
  if (eventId) {
    utils().showLoader();
    const response = await eventsLogic().getEvent(eventId);
    if (response && response?.data) {
      objectData.value = response.data;

      objectData.value.comission = String(objectData.value.comission) === '0' ? 'no' : 'yes';
      objectData.value.teamType = String(objectData.value.teamType) === '1' ? 'national' : 'local';
      objectData.value.startDate = objectData.value.startDate.split('T')[0];
      objectData.value.endDate = objectData.value.endDate.split('T')[0];
    }

    setTimeout(() => {
      utils().hideLoader();
    }, 1000);
  }

  //get sports
  const sportsCollection = await sportLogic().getSports();
  sports.value = sportsCollection.map(elem => {
    return {id: String(elem.id), name: elem.name};
  });
});

const onSubmit = handleSubmit(async () => {
  if (objectData?.value.startDate > objectData?.value.endDate) {
    toast({
      title: 'Error',
      description: 'Please select a valid date range',
      variant: 'destructive',
    });
    return;
  }

  utils().showLoader();
  const response = await eventsLogic().createOrUpdateEvent(objectData?.value, eventId);
  utils().hideLoader();

  if (response && !response?.error) {
    toast({
      title: `Event ${eventId !== '' ? "updated" : "created"}`,
      description: `Event has been ${eventId !== '' ? "updated" : "created"} successfully`,
    });
    setTimeout(() => {
      router.push('/admin/events');
    }, 1000);
  } else {
    toast({
      title: 'Error',
      description: response?.message || 'An error occurred',
      variant: 'destructive',
    });
  }
});
</script>

<template>
  <Admin>
    <div class="flex w-full flex-col bg-muted/40">
      <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div class="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div class="flex items-center gap-4">
              <router-link to="/admin/events">
                <Button variant="outline" size="icon" class="h-7 w-7">
                  <ChevronLeft class="h-4 w-4"/>
                </Button>
              </router-link>
              <h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {{ objectData.name }}
              </h1>
              <Badge variant="success">{{ objectData.teamType }}</Badge>
              <div class="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button @click="onSubmit" size="sm">
                  Save
                </Button>
              </div>
            </div>
            <div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="grid gap-6">
                      <FormField v-slot="{ componentField }" name="name">
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input type="text" v-bind="componentField" v-model="objectData.name"/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      </FormField>
                      <div class="w-full justify-between flex gap-2">
                        <FormField v-slot="{ componentField }" name="startDate">
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" v-bind="componentField" v-model="objectData.startDate"/>
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="endDate">
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" v-bind="componentField" v-model="objectData.endDate"/>
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        </FormField>
                      </div>
                    </div>
                    <div class="grid gap-6 mt-3">
                      <div class="grid gap-3">
                        <Label for="status">Sport</Label>
                        <Select v-model="objectData.sport_id">
                          <SelectTrigger id="status" aria-label="Sports">
                            <SelectValue placeholder="Select sport"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-for="sport in sports" class="bg-white" :key="sport.id" :value="sport.id">
                              {{ sport.name }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <router-link :to="`/admin/event/${objectData.id}/matches`">Show Matches</router-link>
              </div>
              <div class="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Event properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="grid gap-6">
                      <div class="grid gap-3">
                        <Label for="status">Commission</Label>
                        <Select v-model="objectData.comission">
                          <SelectTrigger id="status" aria-label="Select commission">
                            <SelectValue placeholder="Select commission"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem class="bg-white" value="yes">
                              Yes
                            </SelectItem>
                            <SelectItem class="bg-white" value="no">
                              No
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent>
                    <div class="grid gap-6">
                      <div class="grid gap-3">
                        <Label for="status">Team Type</Label>
                        <Select v-model="objectData.teamType">
                          <SelectTrigger id="status" aria-label="Select team type">
                            <SelectValue placeholder="Select team type"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem class="bg-white" value="national">
                              National
                            </SelectItem>
                            <SelectItem class="bg-white" value="local">
                              Local
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div class="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button @click="onSubmit" size="sm">
                Save
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </Admin>
</template>
