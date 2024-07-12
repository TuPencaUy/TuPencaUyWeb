<script setup>
import {Bell, CircleUser, Home, Menu, Package2, Users} from 'lucide-vue-next';
import {Button} from '@/components/ui/button';
import UserPersonalInfo from '@/components/User/UserPersonalInfo.vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import router from '@/router';
import {useTenantStore} from '@/store/tenant';
import utils from '@/logic/utils';
import {Icon} from "@iconify/vue";
import {useUserStore} from '@/store/user';
import { ref } from 'vue';

const showUserPersonalInfo = ref(false);

if (!utils().ensureIsLoggedIn()) {
  router.push('/login');
}
if (!useUserStore().isAdmin) {
  router.push('/events');
}

const url = router.currentRoute.value.path;
const splittedRouter = url.split('/');

const currentTenant = useTenantStore().getCurrentTenant;

const activeClass = (path) => {
  const routeActive = splittedRouter.find((route) => {
    return route === path;
  });

  return routeActive ? 'bg-muted text-primary' : 'text-muted-foreground';
};

const props = defineProps(['title', 'nameBtnAdd', 'pathToAdd']);

defineExpose({
  activeClass,
});

const handleLogOut = () => {
  useUserStore().logOut();

  if (!utils().ensureIsLoggedIn()) {
    router.push('/login');
  }
};

</script>

<template>
  <div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
    <div class="hidden border-r bg-muted/40 md:block">
      <div class="flex h-full max-h-screen flex-col gap-2">
        <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <router-link to="/admin" class="flex items-center gap-2 text-lg font-semibold">
            <Package2 class="h-6 w-6"/>
            <span class="truncate max-w-[160px]">{{ currentTenant ? `${currentTenant}` : 'TuPencaUY' }}</span>
          </router-link>
          <Button variant="outline" size="icon" class="ml-auto h-8 w-8">
            <Bell class="h-4 w-4"/>
            <span class="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div class="flex-1">
          <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
            <router-link to="/admin"
                         :class="`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${url === '/admin' ? 'bg-muted text-primary' : 'text-muted-foreground'}  hover:text-foreground`">
              <Home class="h-5 w-5"/>
              Dashboard
            </router-link>

            <router-link to="/admin/events"
                         :class="`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeClass('events')}  hover:text-foreground`">
              <Icon icon="octicon:trophy-24" class="h-5 w-5"/>
              Events
            </router-link>

            <router-link v-if="useTenantStore().isCentralSite" to="/admin/sports"
                         :class="`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeClass('sports')}  hover:text-foreground`">
              <Icon icon="fluent-mdl2:more-sports" class="h-5 w-5"/>
              Sports
            </router-link>

            <router-link v-if="useTenantStore().isCentralSite" to="/admin/teams"
                         :class="`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeClass('teams')}  hover:text-foreground`">
              <Users class="h-5 w-5"/>
              Teams
            </router-link>

            <router-link v-if="useTenantStore().isCentralSite" to="/admin/sites"
                         :class="`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeClass('sites')}  hover:text-foreground`">
              <Icon icon="fluent-mdl2:my-network" class="h-5 w-5"/>
              Sites
            </router-link>

            <router-link v-if="useTenantStore().getCurrentTenant" to="/admin/settings/general"
                         :class="`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeClass('settings')}  hover:text-foreground`">
              <Icon icon="bx:bx-cog" class="h-5 w-5"/>
              Settings
            </router-link>
          </nav>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger as-child>
            <Button
                variant="outline"
                size="icon"
                class="shrink-0 md:hidden"
            >
              <Menu class="h-5 w-5"/>
              <span class="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="flex flex-col">
            <nav class="grid gap-2 text-lg font-medium">
              <router-link to="/admin" class="flex items-center gap-2 text-lg font-semibold">
                <Package2 class="h-6 w-6"/>
                <span class="truncate max-w-[160px]">TuPencaUY {{ currentTenant ? `(${currentTenant})` : '' }}</span>
              </router-link>
              <router-link to="/admin"
                           :class="`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeClass('admin')}  hover:text-foreground`">
                <Home class="h-5 w-5"/>
                Dashboard
              </router-link>

              <router-link to="/admin/events"
                           :class="`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeClass('events')}  hover:text-foreground`">
                <Icon icon="octicon:trophy-24" class="h-5 w-5"/>
                Events
              </router-link>

              <router-link to="/admin/sports"
                           :class="`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeClass('sports')}  hover:text-foreground`">
                <Icon icon="fluent-mdl2:more-sports" class="h-5 w-5"/>
                Sports
              </router-link>

              <router-link to="/admin/teams"
                           :class="`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeClass('teams')}  hover:text-foreground`">
                <Users class="h-5 w-5"/>
                Teams
              </router-link>

              <router-link to="/admin/settings"
                           :class="`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeClass('settings')}  hover:text-foreground`">
                <Icon icon="bx:bx-cog" class="h-5 w-5"/>
                Settings
              </router-link>
            </nav>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <CircleUser class="h-5 w-5"/>
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem class="cursor-pointer" @click="() => {showUserPersonalInfo = true;}">
              Personal Info
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer" @click="handleLogOut">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div class="flex justify-between">
          <h1 v-if="props.title" class="text-lg font-semibold md:text-2xl">
            {{ props.title }}
          </h1>
          <router-link v-if="pathToAdd && nameBtnAdd" :to="pathToAdd">
            <Button>
              {{ nameBtnAdd }}
            </Button>
          </router-link>

        </div>
        <div class="flex flex-1 rounded-lg border border-dashed shadow-sm">
          <slot/>
        </div>
      </main>
    </div>
  </div>

  <UserPersonalInfo v-if="showUserPersonalInfo"/>
</template>

<style scoped>

</style>