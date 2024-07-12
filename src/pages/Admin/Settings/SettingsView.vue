<script setup lang="ts">
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {Input} from '@/components/ui/input'

import {useTenantStore} from '@/store/tenant'
import Settings from "@/components/Settings/Settings.vue";
import {Label} from "@/components/ui/label";
import siteLogic from "@/logic/siteLogic";
import {ref} from "vue";

const currentTenant = useTenantStore().getCurrentTenant ?? '';
let paypalEmail = ref(useTenantStore().getPayPalEmail ?? '');
import {useToast} from "@/components/ui/toast/index.js";

const {toast} = useToast();

async function savePayPalEmail(e) {
  e.preventDefault();
  if (!paypalEmail.value) return;

  const siteData = {
    "id": useTenantStore().getTenantId,
    "name": useTenantStore().getCurrentTenant,
    "domain": useTenantStore().getCurrentTenant,
    "accesstype": useTenantStore().getTenantAccess,
    "color": useTenantStore().getTenantColor,
    "paypalEmail": paypalEmail.value
  };
  const response = await siteLogic().updateSite(siteData);
  if (!response || response?.error) {
    toast({
      title: 'Error',
      description: 'Failed to update PayPal email. Please try again.',
      variant: 'destructive'
    });
    return;
  }
  useTenantStore().setPayPalEmail(paypalEmail.value);
}
</script>

<template>
  <Settings>
    <Card class="grid gap-4 bg-transparent">
      <div class="grid gap-2">
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
      </div>
      <div class="grid gap-2">
        <Card>
          <CardHeader>
            <CardTitle class="flex gap-4">
              <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal"
                   class="object-scale-down w-16 h-16"/>
            </CardTitle>
          </CardHeader>
          <form @submit="savePayPalEmail">
            <CardContent>
              <Label>Email</Label>
              <Input type-value="email" placeholder="email@domain.com" v-model="paypalEmail"/>
              <label class="text-xs text-gray-600">
                This is the email address associated with your PayPal account.
              </label>
            </CardContent>
            <CardFooter class="border-t px-6 py-4">
              <Button :disabled="!paypalEmail || paypalEmail === useTenantStore().getPayPalEmail">Save</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Card>
  </Settings>
</template>