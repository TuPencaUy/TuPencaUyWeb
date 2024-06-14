<script setup>
import Admin from "@/components/Admin.vue";
import { onMounted, ref } from "vue";
import utils from "@/logic/utils.js";
import router from "@/router/index.js";
import { Icon } from "@iconify/vue";
import teamLogic from "@/logic/teamLogic";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

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

import Button from "@/components/ui/button/Button.vue";

if (!utils().ensureIsLoggedIn()) {
    router.push('/login');
}

const collection = ref([]);

onMounted(async () => {
    utils().showLoader();
    const response = await teamLogic().getTeams();
    if (response && response?.data) {
        collection.value = response.data?.list;
    }
    setTimeout(() => {
        utils().hideLoader();
    }, 1000);
});

function deleteItem() {
    console.log('delete item');
}
</script>

<template>
    <Admin title="Teams" name-btn-add="Add Team" path-to-add="/admin/teams/add">
        <div class="w-full m-auto" v-if="collection.length < 1">
            <div class="text-center">
                <h3 class="text-2xl font-bold tracking-tight">
                    You have no teams
                </h3>
                <p class="text-sm text-muted-foreground">
                    You can start by adding a new one
                </p>
            </div>
        </div>
        <Table v-else>
            <TableHeader>
                <TableRow>

                    <TableHead>Logo</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Team Type</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead class="text-right">
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="item in collection" :key="item.id">
                    <TableCell>{{ item.logo }}</TableCell>
                    <TableCell>{{ item.id }}</TableCell>
                    <TableCell>{{ item.name }}</TableCell>
                    <TableCell>{{ item.teamType }}</TableCell>
                    <TableCell>{{ item.sport.name }}</TableCell>
                    <TableCell>
                        <router-link class="inline-block" :to="`/admin/teams/${item.id}`">
                            <Icon icon="radix-icons:pencil-2" class="w-4 h-4 mr-2" />
                        </router-link>
                        <AlertDialog>
                        <AlertDialogTrigger as-child>
                            <Button variant="ghost">
                            <Icon icon="octicon:trash-24" class="w-4 h-4 mr-2" />
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