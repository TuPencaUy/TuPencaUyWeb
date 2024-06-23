<script setup>
import {
  ChevronLeft,
} from 'lucide-vue-next';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/components/ui/toast/use-toast';
import router from '@/router';
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
import siteLogic from "@/logic/siteLogic.js";
import themes from "@/logic/themes.js";

const {toast} = useToast();

const objectData = ref({
  name: '',
  domain: 'domainname',
  accesstype: '1',
  color: '1',
});

const SITE_PERMISSION_VALUES = [
  {
    id: '0',
    name: 'Closed (users cannot register)'
  },
  {
    id: '1',
    name: 'Open (open to everyone)'
  },
  {
    id: '2',
    name: 'By Invitation (users need an invitation via link to register)'
  },
  {
    id: '3',
    name: 'By Request (users need to request access)'
  }
];

const formSchema = toTypedSchema(z.object({
  domain: z.string(),
}));

let availableThemes = ref([]);

onMounted(async () => {
  utils().showLoader();
  availableThemes.value = await themes().getThemes();
  utils().hideLoader();
});

const {handleSubmit} = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async () => {
  objectData.value.name = String(objectData.value.domain).trim().replaceAll(' ', '');

  utils().showLoader();
  const response = await siteLogic().createSite(objectData?._rawValue);
  utils().hideLoader();

  if (response && !response?.error) {
    toast({
      title: 'Site created',
      description: 'Site has been created successfully',
    });
    setTimeout(() => {
      router.push('/admin/sites');
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
              <router-link to="/admin/sites">
                <Button variant="outline" size="icon" class="h-7 w-7">
                  <ChevronLeft class="h-4 w-4"/>
                </Button>
              </router-link>
              <h1 class="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {{ objectData.name }}
              </h1>
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
                    <CardTitle>Create Site</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="grid gap-6">
                      <FormField v-slot="{ componentField }" name="domain">
                        <FormItem>
                          <FormLabel>Domain</FormLabel>
                          <FormControl>
                            <Input type="text" v-bind="componentField" v-model="objectData.domain"/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      </FormField>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div class="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Site properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="grid gap-6">
                      <div class="grid gap-3">
                        <Label for="status">Access Type</Label>
                        <Select v-model="objectData.accesstype">
                          <SelectTrigger id="status" aria-label="Select access type">
                            <SelectValue placeholder="Select access type"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-for="accesstype in SITE_PERMISSION_VALUES" class="bg-white" :key="accesstype"
                                        :value="accesstype.id">
                              {{ accesstype.name }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent>
                    <div class="grid gap-6">
                      <div class="grid gap-3">
                        <Label for="status">Theme</Label>
                        <Select v-model="objectData.color">
                          <SelectTrigger id="status" aria-label="Select site theme">
                            <SelectValue placeholder="Select site theme"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-for="theme in availableThemes" class="bg-white" :value="theme.key" :key="theme">
                              {{ theme.name }}
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