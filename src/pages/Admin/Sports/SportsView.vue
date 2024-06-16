<script setup>
import Admin from "@/components/Admin.vue";
import {onMounted, ref} from "vue";
import utils from "@/logic/utils.js";
import {Icon} from "@iconify/vue";
import sportLogic from "@/logic/sportLogic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import Button from "@/components/ui/button/Button.vue";
import {useToast} from '@/components/ui/toast/use-toast';

const {toast} = useToast();
const collection = ref([]);

onMounted(async () => {
  utils().showLoader();
  const sports = await sportLogic().getSports();
  if (sports && sports.length > 0) {
    collection.value = sports;
  }
  setTimeout(() => {
    utils().hideLoader();
  }, 1000);
});

async function deleteItem(id) {
  utils().showLoader();
  const response = await sportLogic().deleteSport(id);
  utils().hideLoader();
  if (response && !response?.error) {
    toast({
      title: 'Event deleted',
      description: 'Event has been deleted successfully',
    });
    const response = await sportLogic().getSports();
    if (response && response?.data) {
      collection.value = response.data.list;
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
  <Admin title="Sports" name-btn-add="Add Sport" path-to-add="/admin/sports/add">
    <div class="w-full m-auto" v-if="collection.length < 1">
      <div class="text-center">
        <h3 class="text-2xl font-bold tracking-tight">
          You have no sports
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
          <TableHead>Name</TableHead>
          <TableHead>Accepts Tie?</TableHead>
          <TableHead>Exact Points</TableHead>
          <TableHead>Partial Points</TableHead>
          <TableHead class="text-right">
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in collection" :key="item.id">
          <TableCell>{{ item.id }}</TableCell>
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>{{ item.tie ? 'Yes' : 'No' }}</TableCell>
          <TableCell>{{ item.exactPoints }}</TableCell>
          <TableCell>{{ item.partialPoints }}</TableCell>
          <TableCell>
            <router-link class="inline-block" :to="`/admin/sports/${item.id}`">
              <Icon icon="radix-icons:pencil-2" class="w-4 h-4 mr-2"/>
            </router-link>
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
                    This action cannot be undone. This will permanently delete the sport.
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