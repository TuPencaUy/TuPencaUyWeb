<script setup>
import Admin from "@/components/Admin.vue";
import {onMounted, ref} from "vue";
import utils from "@/logic/utils.js";
import {Button} from "@/components/ui/button/index.js";
import {Icon} from "@iconify/vue";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {useToast} from '@/components/ui/toast/use-toast';

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

import siteLogic from "@/logic/siteLogic.js";
import themes from "@/logic/themes.js";

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

const {toast} = useToast();

const sites = ref([]);

let availableThemes = [];

onMounted(async () => {
  utils().showLoader();
  availableThemes = await themes().getThemes();

  const response = await siteLogic().getSites();
  utils().hideLoader();
  if (response && response?.data) {
    sites.value = response.data;
  }
});

async function deleteItem(id) {
  utils().showLoader();
  const response = await siteLogic().deleteSite(id);
  utils().hideLoader();
  if (response && !response?.error) {
    toast({
      title: 'Site deleted',
      description: 'Site has been deleted successfully',
    });
    const response = await siteLogic().getSites();
    if (response && response?.data) {
      sites.value = response.data;
    }
  } else {
    toast({
      title: 'Error',
      description: response?.message || 'An error occurred',
      variant: 'destructive',
    });
  }
}
</script>

<template>
  <Admin title="Sites" name-btn-add="Add Site" path-to-add="/admin/sites/add">
    <div class="w-full m-auto" v-if="sites.length < 1">
      <div class="text-center">
        <h3 class="text-2xl font-bold tracking-tight">
          There are no sites
        </h3>
        <p class="text-sm text-muted-foreground">
          You can start by adding a new one
        </p>
      </div>
    </div>
    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Access Type</TableHead>
          <TableHead>Theme</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in sites" :key="item.id">
          <TableCell>{{ item.id }}</TableCell>
          <TableCell>{{ item.domain }}</TableCell>
          <TableCell>{{ SITE_PERMISSION_VALUES[item.accessType].name }}</TableCell>
          <TableCell>{{ availableThemes[item.color - 1].name }}</TableCell>
          <TableCell>
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="ghost">
                  <Icon icon="octicon:trash-24" class="w-4 h-4 mr-2"/>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure to delete it?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the site.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction @click="deleteItem(item.id)">Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Admin>
</template>