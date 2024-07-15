<script setup>
import {onMounted, ref} from 'vue';
import {useUserStore} from '@/store/user';
import {useTenantStore} from '@/store/tenant';
import {useToast} from '@/components/ui/toast/use-toast';
import app from '@/eventBus.js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import utils from '@/logic/utils';
import userLogic from '@/logic/userLogic';
import siteLogic from "@/logic/siteLogic.js";

const trigger = ref(null);
const email = ref('');
const name = ref('');
let payPalEmail = ref(useUserStore().isAdmin ? useTenantStore().getPayPalEmail : useUserStore().getUserPaypalEmail);

const {toast} = useToast();

onMounted(async () => {
  email.value = await useUserStore().getUserEmail;
  name.value = await useUserStore().getUserName;
  payPalEmail.value = useUserStore().isAdmin ? useTenantStore().getPayPalEmail : useUserStore().getUserPaypalEmail;

  app.config.globalProperties.emitter.on('showModalInfoUser', () => {
    payPalEmail.value = useUserStore().isAdmin ? useTenantStore().getPayPalEmail : useUserStore().getUserPaypalEmail;
    if (trigger.value) trigger.value.click();
  });
});

function showError() {
  utils().hideLoader();
  toast({
    title: 'An error occurred while updating the user info',
    status: 'destructive'
  });
}

async function handleSubmit() {
  let tenant = useTenantStore().getCurrentTenant ?? null;
  utils().showLoader();
  const userId = await useUserStore().getUserId;
  if (!useUserStore().isAdmin) {
    const userData = await userLogic().basicSignUpOrUpdate({
      name: name.value,
      email: email.value,
      payPalEmail: payPalEmail.value
    }, tenant, userId);
    if (userData?.error) {
      showError();
      return;
    }
    useUserStore().setUserName(name);
    useUserStore().setUserPaypalEmail(payPalEmail);
  } else {
    const site = await siteLogic().getSite(useTenantStore().getCurrentTenant);
    if (!site?.data || site?.error) {
      showError();
      return;
    }
    const response = await siteLogic().updateSite({
      ...site?.data,
      paypalEmail: payPalEmail.value
    });
    if (response?.error) {
      showError();
      return;
    }
    useTenantStore().setPayPalEmail(payPalEmail.value);
  }

  toast({
    title: 'Personal Info updated'
  });
  utils().hideLoader();
}
</script>

<template>
  <div>
    <AlertDialog>
      <AlertDialogTrigger class="hidden">
        <p ref="trigger">Personal Info</p>
      </AlertDialogTrigger>
      <AlertDialogContent class="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit profile</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to your profile here. Click save when you're done.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="email" class="text-right">Email</Label>
            <Input id="email" v-model="email" class="col-span-3" disabled/>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="username" class="text-right">Username</Label>
            <Input id="username" v-model="name" class="col-span-3"/>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="paypalEmail" class="text-right">Paypal Email</Label>
            <Input id="paypalEmail" v-model="payPalEmail" class="col-span-3"/>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction @click="handleSubmit">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
