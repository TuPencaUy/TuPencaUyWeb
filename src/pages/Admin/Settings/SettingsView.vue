<script setup lang="ts">
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {Input} from '@/components/ui/input'

import {useTenantStore} from '@/store/tenant'
import Settings from "@/components/Settings/Settings.vue";

const currentTenant = useTenantStore().getCurrentTenant ?? 'No tenant selected';
</script>

<template>
  <Settings>
    <Card>
      <CardHeader>
        <CardTitle>Site Name</CardTitle>
        <CardDescription>
          Used to identify your site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Input disabled placeholder="Site Name" v-model="currentTenant"/>
        </form>
      </CardContent>
      <CardFooter class="border-t px-6 py-4">
        <Button disabled>Save</Button>
      </CardFooter>
    </Card>
  </Settings>
</template>