<script setup>
import { watch, onMounted, ref } from 'vue';
import { useUserStore } from '@/store/user'
import { useTenantStore } from '@/store/tenant'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast';
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
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import utils from '@/logic/utils'
import userLogic from '@/logic/userLogic'

const emit = defineEmits(['update:showModal']);

const trigger = ref(null);
const email = ref('');
const objectData = ref({});

const { toast } = useToast();


const props = defineProps({
  showModal: Boolean
});

watch(
  () => props.showModal,
  () => {
    trigger.value.click();
  }
)

onMounted(async () => {
  email.value = await useUserStore().getUserEmail;
  objectData.value.name = await useUserStore().getUserName;
});

async function handleSubmit() {
  let tenant = useTenantStore().getCurrentTenant ?? null;

  utils().showLoader();
  const userId = await useUserStore().getUserId;
  const userData = await userLogic().basicSignUpOrUpdate(objectData.value, tenant, userId);

  if (!userData || userData.error) {
    toast({
      title: 'Update Failed',
      description: userData?.message ?? 'Something went wrong',
      variant: 'destructive'
    });
    utils().hideLoader();
    return;
  }

  useUserStore().setUserName(objectData.value.name);

  toast({
    title: 'Personal Info updated'
  });
  utils().hideLoader();

  emit('update:showModal', false);
}
</script>

<template>
  <div>
    <AlertDialog>
      <AlertDialogTrigger as-child class="hidden">
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
            <Input id="email" v-model="email" class="col-span-3" disabled />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="username" class="text-right">Username</Label>
            <Input id="username" v-model="objectData.name" class="col-span-3" />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel @click="() => { emit('update:showModal', false) }">Close</AlertDialogCancel>
          <AlertDialogAction @click="handleSubmit">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
