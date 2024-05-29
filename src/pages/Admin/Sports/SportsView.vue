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
    utils().showLoader();
    const response = await sportLogic().getSports();
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
                        <Button @click="deleteItem" variant="ghost">
                            <Icon icon="radix-icons:pencil-2" class="w-4 h-4 mr-2" />
                        </Button>
                        <Button @click="deleteItem" variant="ghost">
                            <Icon icon="octicon:trash-24" class="w-4 h-4 mr-2" />
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </Admin>
</template>