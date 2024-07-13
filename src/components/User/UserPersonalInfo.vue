<script setup>
import { useUserStore } from '@/store/user'
import { useTenantStore } from '@/store/tenant'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { onMounted, ref } from 'vue';
import utils from '@/logic/utils'
import userLogic from '@/logic/userLogic'

const emit = defineEmits(['update:showDialog']);

const trigger = ref(null);
const email = ref('');
const objectData = ref({});

const { toast } = useToast();

onMounted(async () => {
  debugger
  if (trigger.value) {
    trigger.value.click();
  }

  email.value = await useUserStore().getUserEmail
  objectData.value.name = await useUserStore().getUserName
});

async function handleSubmit() {
  let tenant = useTenantStore().getCurrentTenant ?? null;

  utils().showLoader();
  const userId = await useUserStore().getUserId;
  const userData = await userLogic().basicSignUpOrUpdate(objectData._rawValue, tenant, userId);

  if (!userData || userData.error) {
    toast({
      title: 'Update Failed',
      description: userData?.message ?? 'Something went wrong',
      variant: 'destructive'
    });
    utils().hideLoader();
    return;
  }

  toast({
    title: 'Personal Info updated'
  });1
  utils().hideLoader();

  emit('update:showDialog', false); // Notify parent to hide the dialog
}
</script>

<template>
  <div>
    <Dialog>
      <DialogTrigger as-child class="hidden">
        <p ref="trigger">Personal Info</p>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="email" class="text-right">Email</Label>
            <Input id="email" :value="email" class="col-span-3" disabled />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="username" class="text-right">Username</Label>
            <Input id="username" v-model="objectData.name" class="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" @click="handleSubmit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
