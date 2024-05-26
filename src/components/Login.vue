<script setup>
import { h } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useUserStore } from '@/store/user'
import utils from '@/logic/utils'


import { Button } from '@/components/ui/button'
import
{
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import
{
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast()

const router = useRouter();
const auth0 = useAuth0();
const email = ref('');
const password = ref('');

const formSchema = toTypedSchema(z.object({
    email: z.string().email(),
    password: z.string().min(4).max(30),
}))

const { handleSubmit } = useForm({
    validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) =>
{
    handleLogin();
});

async function handleLogin(event)
{
    const id = event ? event.target.dataset.id : "";

    let userData = {
        email: email.value,
        password: password.value,
        token: null,
        picture: null
    }

    if (id === 'google')
    {
        await auth0.loginWithPopup({
            authorizationParams: {
                connection: 'google-oauth2'
            }
        });

        userData.picture = auth0.user?._value?.picture;
        userData.token = auth0.idTokenClaims?._rawValue?.__raw;
    }

    utils().showLoader();
    const loggedIn = await useUserStore().login(userData);
    utils().hideLoader();
    if (loggedIn)
    {
        toast({
            title: 'You have successfully logged in!',
            description: 'Redirecting to the home page...',
        });

        setTimeout(() =>
        {
            router.push('/');
        }, 2000);
    }
    else
    {
        toast({
            title: 'Login failed!',
            description: 'Please check your credentials and try again.',
            variant: 'destructive'
        });
    }
}
</script>

<template>
    <Toaster />
    <main class="container flex justify-center align-items-center ">
        <Card class="w-full p-10 border-none">
            <CardHeader class="flex-row justify-center">
                <img src="../../public/logo.png" class="max-w-[24%] min-w-[200px]" alt="">
            </CardHeader>
            <form class="space-y-6 my-6" @submit="onSubmit">
                <FormField v-slot="{ componentField }" name="email">
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="user@domain.com" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="password">
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <Button type="submit">
                    Login
                </Button>
                <<<<<<< HEAD=======<Separator />
                <CardFooter class="flex justify-center gap-5">
                    <CardDescription>
                        <button class="login-with-google-btn" data-id="google" @click="handleLogin">
                            Login with Google
                        </button>
                    </CardDescription>
                    <CardDescription>
                        <router-link v-if="!useUserStore()?.isAuthenticated" class="nav-link link-body-emphasis"
                            to="/signup">Do not have an account?</router-link>
                    </CardDescription>
                </CardFooter>
                >>>>>>> b0dd4f4a2f01a07dd29bed6da6c8b5c5ce7f3f2b
            </form>
            <Separator />
            <CardFooter class="flex justify-center">
                <CardDescription>
                    <button class="login-with-google-btn" data-id="google" @click="handleLogin">
                        Login with Google
                    </button>
                </CardDescription>
            </CardFooter>
        </Card>
    </main>
</template>

<style scoped>
.login-with-google-btn {
    transition: background-color .3s, box-shadow .3s;
    margin-top: 1.5rem;
    padding: 12px 16px 12px 42px;
    border: none;
    border-radius: 3px;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25);
    color: #757575;
    font-size: 14px;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
    background-color: white;
    background-repeat: no-repeat;
    background-position: 12px 11px;
}

.login-with-google-btn:hover {
    box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 2px 4px rgba(0, 0, 0, .25);
}

.login-with-google-btn:active {
    background-color: #eeeeee;
}

.login-with-google-btn:focus {
    outline: none;
    box-shadow:
        0 -1px 0 rgba(0, 0, 0, .04),
        0 2px 4px rgba(0, 0, 0, .25),
        0 0 0 3px #c8dafc;
}

.login-with-google-btn:disabled {
    filter: grayscale(100%);
    background-color: #ebebeb;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25);
    cursor: not-allowed;
}
</style>