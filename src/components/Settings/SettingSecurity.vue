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

let currentPermission = ref('');

onMounted(() => {
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
  //TODO: to be implemented
};

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
        <Button @click="handlePermissionChange">Save</Button>
      </CardFooter>
    </Card>
  </Settings>
</template>