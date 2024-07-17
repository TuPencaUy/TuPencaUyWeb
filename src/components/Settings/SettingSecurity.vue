<script setup>
import Settings from "@/components/Settings/Settings.vue";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card/index.js";
import {useTenantStore} from "@/store/tenant.js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select/index.js";
import {Button} from '@/components/ui/button';
import {onMounted, ref} from "vue";
import siteLogic from "@/logic/siteLogic.js";
import utils from "@/logic/utils.js";
import {useToast} from "@/components/ui/toast/index.js";
import accessRequestLogic from "@/logic/accessRequestLogic.js";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table/index.js";
import {Input} from "@/components/ui/input/index.js";
import {Icon} from "@iconify/vue";

const {toast} = useToast();

const invitationLink = ref('');
let currentPermission = ref('');
const accesses = ref([]);

onMounted(async () => {
  accesses.value = await accessRequestLogic().getAccessRequests();
  currentPermission.value = String(useTenantStore().getTenantAccess);
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

async function handlePermissionChange() {
  utils().showLoader();

  const siteData = {
    "id": useTenantStore().getTenantId,
    "name": useTenantStore().getCurrentTenant,
    "domain": useTenantStore().getCurrentTenant,
    "accesstype": currentPermission?._rawValue,
    "color": useTenantStore().getTenantColor
  };

  const response = await siteLogic().updateSite(siteData);
  if (!response || response?.error) {
    toast({
      title: 'Error',
      description: 'Failed to update site permission',
      variant: 'destructive'
    });
    return;
  }

  await useTenantStore().refreshTenantValues();
  const site = await siteLogic().getSite(useTenantStore().getCurrentTenant);
  invitationLink.value = `https://${useTenantStore().getCurrentTenant}.${import.meta.env.VITE_BASE_DOMAIN}/${site?.data?.uniqueID}`;
  utils().hideLoader();
  toast({
    title: 'Success',
    description: 'Site permission updated successfully',
  });
}

async function handleAction(access, email) {
  utils().showLoader();
  const response = await accessRequestLogic().updateAccessRequest({
    status: access,
    email: email,
  });
  if (!response || response?.error) {
    toast({
      title: 'Error',
      description: 'Failed to update access request',
      variant: 'destructive'
    });
    return;
  }
  accesses.value = await accessRequestLogic().getAccessRequests();
  utils().hideLoader();
  toast({
    title: 'Success',
    description: 'Access request updated successfully',
  });

}

async function handleCopyToClipboard() {
  if (await utils().copyToClipboard(invitationLink.value)) {
    toast({
      title: 'Success',
      description: 'Link copied to clipboard',
    });
    return;
  }
  toast({
    title: 'Error',
    description: 'Failed to copy link to clipboard',
    variant: 'destructive'
  });
}


</script>

<template>
  <Settings>
    <Card>
      <CardHeader>
        <CardTitle>Site Permission</CardTitle>
        <CardDescription>
          Permission to access the site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid gap-2">
            <Select v-model="currentPermission">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select event"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem class="bg-white" v-for="permission in SITE_PERMISSION_VALUES" :key="permission.id"
                              :value="permission.id">
                    {{ permission.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter class="border-t px-6 py-4">
        <Button @click="handlePermissionChange"
                :disabled="Number(useTenantStore().getTenantAccess) === Number(currentPermission)">Save
        </Button>
      </CardFooter>
    </Card>
    <Card v-if="useTenantStore().isInvitationAccess">
      <CardHeader>
        <CardTitle>
          Invitation URL
        </CardTitle>
        <CardDescription>
          With this link, users can request access to the site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex gap-2 items-center">
          <Input class="w-full" type="text" disabled v-model="invitationLink"></Input>
          <Icon icon="ph:copy" class="w-8 h-8 cursor-pointer text-gray-600" @click="handleCopyToClipboard()">Copy</Icon>
        </div>
      </CardContent>
    </Card>
    <Card v-if="useTenantStore().isInvitationAccess || useTenantStore().isRequestAccess">
      <CardHeader>
        <CardTitle>
          Access Requests
        </CardTitle>
        <CardDescription>
          Requests for access to the site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="access in accesses" :key="access">
              <TableCell>{{ access.user.name }}</TableCell>
              <TableCell>{{ access.user.email }}</TableCell>
              <TableCell>{{ access.accessStatus }}</TableCell>
              <TableCell class="text-right flex justify-end gap-4">
                <Button class="bg-green-800" @click="handleAction(1, access?.user?.email)">Approve</Button>
                <Button class="bg-red-800" @click="handleAction(-1, access?.user?.email)">Deny</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </Settings>
</template>