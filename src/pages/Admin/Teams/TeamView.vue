<script setup>
import {
  ChevronLeft,
} from 'lucide-vue-next';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import teamLogic from '@/logic/teamLogic';
import sportLogic from '@/logic/sportLogic';
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
import router from '@/router'
import { useRoute } from 'vue-router'

const { toast } = useToast()
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
} from '@/components/ui/form'
import Admin from "@/components/Admin.vue";
import {onMounted, ref} from "vue";
import {toTypedSchema} from "@vee-validate/zod";
import * as z from "zod";
import {useForm} from 'vee-validate'
import utils from '@/logic/utils';


const route = useRoute();

let objectId = '';
let sports = ref([]);

const objectData = ref({
  name: 'Team name',
  logo: 'no',
  teamType: 0,
  sport: 0,
});

const formSchema = toTypedSchema(z.object({
  name: z.string().min(4).max(30),
}));

const {handleSubmit} = useForm({
  validationSchema: formSchema,
});

onMounted(async () => {
  objectId = route.params.id ?? '';
  if(objectId) {
    utils().showLoader();
    const response = await teamLogic().getTeams(objectId);
    if (response && response?.data) {
      objectData.value = response.data;

      setTimeout(() => {
        utils().hideLoader();
      }, 1000);
    }
  }

  //get sports
  sports = await sportLogic().getSports();
  sports.value = sports.data.list.map(elem =>  { return {id: elem.id, name: elem.name}});
});

const onSubmit = handleSubmit(async () => {
  utils().showLoader();
  
  const response = await teamLogic().createOrUpdateTeam(objectData?._rawValue, objectId);
  utils().hideLoader();

  if (response && !response?.error) {
    toast({
      title: `Team ${objectId !== '' ? "updated" : "created"}`,
      description: `Team has been ${objectId !== '' ? "updated" : "created"} successfully`,
    });
    setTimeout(() => {
      router.push('/admin/teams');
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
  <Toaster />
  <Admin>
    <div class="flex w-full flex-col bg-muted/40">
      <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <div class="flex flex-col">
            <div class="flex items-center gap-4">
              <router-link to="/admin/teams">
                <Button variant="outline" size="icon" class="h-7 w-7">
                  <ChevronLeft class="h-4 w-4"/>
                </Button>
              </router-link>
              <h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {{ objectData.name }}
              </h1>
              <div class="hidden items-center gap-2 md:ml-auto md:flex">
                <router-link variant="outline" class="inline-block" to="/admin/teams">
                    Discard
                </router-link>
                <Button @click="onSubmit" size="sm">
                  Save
                </Button>
              </div>
            </div>
            <div class="flex w-full mt-2">
              <div class="w-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Team</CardTitle>
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
                      <div class="grid gap-6">
                      <div class="grid gap-3">
                        <Label for="status">Team Type</Label>
                        <Select v-model="objectData.teamType">
                          <SelectTrigger id="status" aria-label="Select team type">
                            <SelectValue placeholder="Select team type"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem class="bg-white" value="1">
                              National
                            </SelectItem>
                            <SelectItem class="bg-white" value="2">
                              Local
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                      <div class="grid gap-6">
                        <div class="grid gap-3">
                          <Label for="status">Sports</Label>
                          <Select v-model="objectData.sport">
                            <SelectTrigger id="status" aria-label="Sports">
                              <SelectValue placeholder="Sport"/>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem v-for="sport in sports.value" class="bg-white" :value="sport.id">
                                {{ sport.name }}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div class="flex items-center justify-center gap-2 md:hidden">
              <router-link variant="outline" class="inline-block" to="/admin/teams">
                  Discard
              </router-link>
              <Button @click="onSubmit" size="sm">
                Save
              </Button>
            </div>
          </div>
      </div>
    </div>
  </Admin>
</template>