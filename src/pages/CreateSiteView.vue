<script setup>
import utils from '@/logic/utils';

import {useForm} from 'vee-validate';
import {useToast} from '@/components/ui/toast/use-toast';
import {toTypedSchema} from '@vee-validate/zod';
import * as z from 'zod';

import {Button} from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import siteLogic from '@/logic/siteLogic';
import {Card, CardContent, CardHeader} from "@/components/ui/card/index.js";
import {useUserStore} from "@/store/user.js";

const formSchema = toTypedSchema(z.object({
  domain: z.string(),
}));

const form = useForm({
  validationSchema: formSchema
});
const {toast} = useToast();

const onSubmit = form.handleSubmit(async (values) => {
  utils().showLoader();

  values.accesstype = values.color = 1;
  const domain = values.domain.toLowerCase().trim().replaceAll(' ', '');
  values.domain = domain;
  values.name = domain;

  const siteData = await siteLogic().createSite(values);

  utils().hideLoader();

  if (!siteData || siteData.error) {
    toast({
      title: 'Creation Failed',
      description: siteData?.message ?? 'Something went wrong',
      variant: 'destructive'
    });
    return;
  }

  toast({
    title: 'Your site has been successfully created!',
    description: 'Redirecting to your site...',
  });

  setTimeout(() => {
    useUserStore().logOut();
    window.location.replace(`http://${values.domain}.${import.meta.env.VITE_BASE_DOMAIN}`);
  }, 2000);
});
</script>

<template>
  <div class="container flex justify-center align-items-center h-screen">
    <Card class="w-full p-10 border-none">
      <CardHeader class="flex-row justify-center">
        <img src="../../public/logo.png" class="max-w-[24%] m-auto" alt="">
      </CardHeader>
      <CardContent>
        <h1 class="text-4xl mb-5">Create your site</h1>
        <form @submit="onSubmit" class="flex flex-col gap-5">
          <FormField v-slot="{ componentField }" name="domain">
            <FormItem>
              <FormLabel>Site domain</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Domain" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
          <Button type="submit" class="w-[120px] m-auto">
            Create now!
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>

</template>
