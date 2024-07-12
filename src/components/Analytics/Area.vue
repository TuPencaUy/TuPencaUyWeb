<script setup>
import { AreaChart } from '@/components/ui/chart-area';

defineProps({
    data: [
        { name: 'EeE', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
        { name: 'ddd', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 }
    ]
});

</script>

<template>
  <AreaChart :data="data" index="name" :categories="['total', 'predicted']" />
</template>