<script setup>
import Admin from "@/components/Admin.vue";
import { onMounted, ref } from "vue";
import utils from "@/logic/utils.js";
import router from "@/router/index.js";
import { Icon } from "@iconify/vue";
import sportLogic from "@/logic/sportLogic";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Button from "@/components/ui/button/Button.vue";

if (!utils().ensureIsLoggedIn()) {
    router.push('/login');
}

const collection = ref([]);

onMounted(async () => {
    const response = await sportLogic().getSports();
    if (response && response?.data) {
        collection.value = response.data?.list;
    }
});

function deleteItem() {
    console.log('delete item');
}
</script>

<template>
    <Admin title="Sports" name-btn-add="Add Sport" path-to-add="/admin/sports/add">
        <p class="text-lg text-muted-foreground m-auto" v-if="collection.length === 0">
          No sports yet
        </p>
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
                        <Button @click="deleteItem" variant="ghost"><Icon icon="radix-icons:pencil-2" class="w-4 h-4 mr-2" /></Button>
                        <Button @click="deleteItem" variant="ghost"><Icon icon="octicon:trash-24" class="w-4 h-4 mr-2" /></Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </Admin>
</template>