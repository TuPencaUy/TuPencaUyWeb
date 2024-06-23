<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select/index.js";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card/index.js";
import {Button} from "@/components/ui/button/index.js";
import Settings from "@/components/Settings/Settings.vue";
import themes from "@/logic/themes.js";
import {onMounted, ref} from "vue";
import utils from "@/logic/utils.js";
import {useTenantStore} from "@/store/tenant.js";
import siteLogic from "@/logic/siteLogic.js";
import {useToast} from "@/components/ui/toast/index.js";

const {toast} = useToast();
let selectedTheme = ref('');
let availableThemes = ref([]);

onMounted(async () => {
  utils().showLoader();
  availableThemes.value = await themes().getThemes();
  selectedTheme.value = availableThemes.value[useTenantStore().getTenantColor - 1].key;
  utils().hideLoader();
});

async function handleThemeChange() {
  const siteData = {
    "id": useTenantStore().getTenantId,
    "name": useTenantStore().getCurrentTenant,
    "domain": useTenantStore().getCurrentTenant,
    "accesstype": useTenantStore().getTenantAccess,
    "color": selectedTheme?._rawValue,
  };

  utils().showLoader();
  const response = await siteLogic().updateSite(siteData);
  utils().hideLoader();
  if (!response || response?.error) {
    toast({
      title: "Error",
      description: "Failed to update site theme",
      variant: "destructive",
    });
    return;
  }

  toast({
    title: "Success",
    description: "Site theme updated successfully",
  });

  await useTenantStore().refreshTenantValues();
  await themes().setTheme(Number(selectedTheme.value));
}
</script>

<template>
  <Settings>
    <Card>
      <CardHeader>
        <CardTitle>Site Theme</CardTitle>
        <CardDescription>
          Choose a theme for your site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid gap-2">
            <Select v-model="selectedTheme">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select event"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem class="bg-white" v-for="theme in availableThemes" :key="theme.key"
                              :value="String(theme.key)">
                    {{ theme.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter class="border-t px-6 py-4">
        <Button @click="handleThemeChange"
                :disabled="Number(selectedTheme) === Number(useTenantStore().getTenantColor)">Save
        </Button>
      </CardFooter>
    </Card>
  </Settings>
</template>

<style scoped>

</style>