<script setup>
import userLogic from '@/logic/userLogic';
import {useTenantStore} from '@/store/tenant';
import {useUserStore} from '@/store/user';
import utils from '@/logic/utils.js';
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
import router from '@/router';
import {Separator} from "@/components/ui/separator/index.js";
import {Card, CardFooter, CardHeader} from "@/components/ui/card/index.js";

const formSchema = toTypedSchema(z.object({
  name: z.string().min(4).max(50),
  email: z.string().email(),
  password: z.string()
}));

const form = useForm({
  validationSchema: formSchema
});

const {toast} = useToast();

const onSubmit = form.handleSubmit(async (values) => {
  let tenant = useTenantStore().getCurrentTenant ?? null;

  utils().showLoader();

  const userData = await userLogic().basicSignUp(values, tenant);

  if (!userData || userData.error) {
    toast({
      title: 'Register Failed',
      description: userData?.message ?? 'Something went wrong',
      variant: 'destructive'
    });
    utils().hideLoader();
    return;
  }
  const loginData = await useUserStore().login({email: values.email, password: values.password});


  utils().hideLoader();

  if (!loginData || loginData?.error) {
    toast({
      title: 'Login failed!',
      description: 'Redirecting to the home page...',
      variant: 'destructive'
    });
  } else {
    toast({
      title: 'Thank you for sign up!',
      description: 'Redirecting...',
    });
  }

  setTimeout(() => {
    useTenantStore().getCurrentTenant === null ? router.push('/create-site') : router.push('/');
  }, 2000);
});
</script>

<template>
  <main class="container flex justify-center align-items-center">
    <Card class="w-full p-10 border-none">
      <CardHeader class="flex-row justify-center">
        <img src="../../public/logo.png" class="max-w-[24%] m-auto" alt="">
      </CardHeader>
      <form @submit="onSubmit" class="flex flex-col gap-5">

        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Name" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Email" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Password" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
        <Button type="submit" class="w-[120px] m-auto">
          Register
        </Button>
      </form>
      <Separator class="m-5"/>
      <CardFooter class="flex justify-center">
        <p class="text-sm">Already have an account?
          <router-link to="/login" class="font-semibold">Log In</router-link>
        </p>
      </CardFooter>
    </Card>
  </main>
</template>