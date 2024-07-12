<script setup>
import { DonutChart } from '@/components/ui/chart-donut'

const props = defineProps({
  data: Array,
  title: String
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <h3 class="text-lg font-semibold md:text-xl">{{props.title ?? "Titulo"}}</h3>
    <DonutChart
      index="name"
      :category="'total'"
      :data="props.data"
    />
  </div>
</template>