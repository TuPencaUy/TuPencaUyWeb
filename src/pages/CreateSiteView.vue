<script setup>
import { useUserStore } from '@/store/user.js';
import router from '@/router';
import utils from '@/logic/utils'

import { useForm } from 'vee-validate';
import { useToast } from '@/components/ui/toast/use-toast';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Toaster from '@/components/ui/toast/Toaster.vue';
import siteLogic from '@/logic/siteLogic';

// if (!useUserStore().isAuthenticated) {
//   router.push('/login');
// }

const formSchema = toTypedSchema(z.object({
    name: z.string(),
    domain: z.string()
}));

const form = useForm({
    validationSchema: formSchema
});
const { toast } = useToast();

const onSubmit = form.handleSubmit(async (values) => {


    utils().showLoader();

    values.accesstype = values.color = 1;

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
        window.location.replace(`http://${values.domain}.${import.meta.env.VITE_BASE_DOMAIN}`);
    }, 2000);
});
</script>

<template>
    <main class="container fixed w-full h-full flex flex-col justify-center">
        <Toaster />
        <div class="content m-auto">
            <h1 class="text-4xl mb-5">Create your site</h1>
            <form @submit="onSubmit" class="flex flex-col gap-5">
                <FormField v-slot="{ componentField }" name="name">
                    <FormItem>
                        <FormLabel>Site name</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Name" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="domain">
                    <FormItem>
                        <FormLabel>Site domain</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Domain" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <Button type="submit" class="w-[120px] m-auto">
                    Create now!
                </Button>
            </form>
        </div>
    </main>

</template>
