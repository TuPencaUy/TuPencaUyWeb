<script setup>
import userLogic from '@/logic/userLogic'
import { useTenantStore } from '@/store/tenant'
import { useUserStore } from '@/store/user'

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = toTypedSchema(z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string()
}))

const form = useForm({
    validationSchema: formSchema,
})


async function handleSignUp(e) {

}

const onSubmit = form.handleSubmit(async (values) => {
    let tenant = useTenantStore().getCurrentTenant ?? {};

    const userData = await userLogic().basicSignUp(values, tenant);

    console.log(userData);

    if (loggedIn) {
        router.push('/');
    }
})
</script>

<template>
    <main class="container flex justify-center align-items-center ">
        <Card class="w-full p-10 border-none">
            <CardHeader class="flex-row justify-center">
                <img src="../../public/logo.png" class="max-w-[24%] m-auto" alt="">
            </CardHeader>
            <form @submit="onSubmit" class="flex flex-col gap-5">

                <FormField v-slot="{ componentField }" name="name">
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Name" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="email">
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="Email" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="password">
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Password" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <Button type="submit" class="w-[100px] m-auto">
                    Submit
                </Button>
            </form>
        </Card>
    </main>
</template>