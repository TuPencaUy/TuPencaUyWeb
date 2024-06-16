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
import {useToast} from '@/components/ui/toast/use-toast';
import router from '@/router';
import {useRoute} from 'vue-router';
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
import utils from '@/logic/utils';

const route = useRoute();
const {toast} = useToast();

let teamId = '';
let sports = ref([]);

const objectData = ref({
  name: 'Team name',
  logo: '',
  teamType: '1',
  sport: '1',
});

const formSchema = toTypedSchema(z.object({
  name: z.string().min(4).max(30),
}));

const {handleSubmit} = useForm({
  validationSchema: formSchema,
});

onMounted(async () => {
  teamId = route.params.id ?? '';
  if (teamId) {
    utils().showLoader();
    const response = await teamLogic().getTeam(teamId);
    if (response && response?.data) {
      objectData.value.name = response.data.name;
      objectData.value.logo = response.data.logo;
      objectData.value.teamType = String(response.data.teamType);
      objectData.value.sport = response.data.sport;
      objectData.value.sport.id = String(response.data.sport?.id);

      setTimeout(() => {
        utils().hideLoader();
      }, 1000);
    }
  }

  //get sports
  const sportsResponse = await sportLogic().getSports();
  sports.value = sportsResponse.data.list.map(elem => {
    return {id: String(elem.id), name: elem.name};
  });
});

const onSubmit = handleSubmit(async () => {
  utils().showLoader();

  const response = await teamLogic().createOrUpdateTeam(objectData?._rawValue, teamId);
  utils().hideLoader();

  if (response && !response?.error) {
    toast({
      title: `Team ${teamId !== '' ? "updated" : "created"}`,
      description: `Team has been ${teamId !== '' ? "updated" : "created"} successfully`,
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

const onLogoChanged = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    objectData.value.logo = e.target.result;
  };
  reader.readAsDataURL(file);
};
</script>

<template>
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
                    <Label for="logo">Logo</Label>
                    <Input name="logo" v-if="!teamId || teamId && !objectData.logo" type="file" @change="onLogoChanged"/>
                    <img v-if="objectData.logo && !objectData.logo?.includes('data:image')" :src="['data:image/png;base64', objectData.logo]" alt="logo1" class="w-80 h-80">
                    <img v-else-if="objectData.logo" :src="objectData.logo" alt="logo2" class="w-80 h-80">
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
                        <Select v-if="teamId" v-model="objectData.sport.id">
                          <SelectTrigger id="status" aria-label="Sports">
                            <SelectValue placeholder="Select sport"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-for="sport in sports" class="bg-white" :value="sport.id">
                              {{ sport.name }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Select v-else-if="!teamId" v-model="objectData.sport">
                          <SelectTrigger id="status" aria-label="Sports">
                            <SelectValue placeholder="Select sport"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-for="sport in sports" class="bg-white" :value="sport.id">
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