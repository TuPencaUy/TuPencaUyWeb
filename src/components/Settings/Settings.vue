<script setup>
import Admin from "@/components/Admin.vue";
import router from "@/router/index.js";

const url = router.currentRoute.value.path;
</script>

<template>
  <Admin>
    <div class="flex min-h-screen w-full flex-col">
      <main class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div class="mx-auto grid w-full max-w-6xl gap-2">
          <h1 class="text-3xl font-semibold">
            Settings
          </h1>
        </div>
        <div class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav class="grid gap-4 text-sm text-muted-foreground">
            <router-link to="/admin/settings/general" :class="[url.includes('/admin/settings/general') ? 'font-semibold text-primary' : '']">
              General
            </router-link>

            <router-link to="/admin/settings/security" :class="[url.includes('/admin/settings/security') ? 'font-semibold text-primary' : '']">
              Security
            </router-link>

            <router-link to="/admin/settings/custom" :class="[url.includes('/admin/settings/custom') ? 'font-semibold text-primary' : '']">
              Custom
            </router-link>
          </nav>
          <div class="grid gap-6">
            <slot/>
          </div>
        </div>
      </main>
    </div>
  </Admin>
</template>