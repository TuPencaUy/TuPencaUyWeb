<script setup>
import {useUserStore} from "@/store/user.js";
import router from "@/router/index.js";
import {Icon} from "@iconify/vue";
import {useEventStore} from "@/store/event.js";

const url = router.currentRoute.value.path;

function handleLogOut() {
  useUserStore().logOut();
  router.push("/login");
}
</script>

<template>
  <header>
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <router-link to="/" class="flex items-center">
          <img src="/public/logo.png" class="w-20 h-20" alt="TuPencaUY logo"/>
        </router-link>
        <div class="flex items-center lg:order-2">
          <button
              class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              @click="handleLogOut">Log out
          </button>
        </div>
        <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
          <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <router-link to="/events"
                           class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                           aria-current="page">
                <Icon icon="solar:cup-star-linear"
                      :class="['w-10 h-10 mr-2', url === '/events' ? 'text-primary' : '']"/>
              </router-link>
            </li>
            <li v-if="useEventStore().getCurrentEvent">
              <router-link :to="`events/${useEventStore().getCurrentEvent.id}`"
                           class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                           aria-current="page">
                <Icon icon="game-icons:soccer-field"
                      :class="['w-10 h-10 mr-2', url === `/events/${useEventStore().getCurrentEvent.id}` ? 'text-primary' : '']"/>
              </router-link>
            </li>
            <li v-if="useEventStore().getCurrentEvent">
              <router-link :to="`events/${useEventStore().getCurrentEvent.id}/ranking`"
                           class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                           aria-current="page">
                <Icon icon="ph:ranking"
                      :class="['w-10 h-10 mr-2', url === `/events/${useEventStore().getCurrentEvent.id}/ranking` ? 'text-primary' : '']"/>
              </router-link>
            </li>
            <li v-if="useEventStore().getCurrentEvent">
              <router-link to="/chat"
                           class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                           aria-current="page">
                <Icon icon="fluent:people-chat-20-regular" :class="['w-10 h-10 mr-2', url === '/chat' ? 'text-primary' : '']"/>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>