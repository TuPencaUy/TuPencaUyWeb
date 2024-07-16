<script setup>
import { onMounted, ref } from "vue";
import app from '@/eventBus.js';

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

defineProps({
    title: String,
    data: Array
});

const trigger = ref(null);

onMounted(async () => {
    app.config.globalProperties.emitter.on('showFinanceTableModal', () => {
        if (trigger.value) trigger.value.click();
    });
});

</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button variant="outline" class="hidden">
                <p ref="trigger">Edit Profile</p>
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[600px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
            <DialogHeader class="p-6 pb-0">
                <DialogTitle>{{ title }}</DialogTitle>
            </DialogHeader>
            <div class="grid gap-4 py-4 overflow-y-auto px-6">
                <div class="flex flex-col justify-between h-[300dvh]">
                    <Table v-if="data.length > 0">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Total Raised</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="item in data" :key="item.id">
                                <TableCell>{{ item.name }}</TableCell>
                                <TableCell>${{ item.totalRaised }}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>