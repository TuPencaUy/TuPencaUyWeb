<script setup>
import {Input} from "@/components/ui/input/index.js";
import {useChatStore} from "@/store/chatStore.js";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/store/user.js";
import utils from "@/logic/utils.js";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu/index.js";
import {Button} from "@/components/ui/button/index.js";
import {CircleUser} from "lucide-vue-next";
import router from "@/router/index.js";

if (!useUserStore().isAuthenticated) {
  router.push('/login');
}

const {currentChat} = storeToRefs(useChatStore());

let messageToSend = '';

const handleSendMessage = async () => {
  if (!messageToSend) return;

  utils().showLoader();
  await useChatStore().sendMessage(messageToSend);
  messageToSend = '';
  utils().hideLoader();

  const objDiv = document.getElementById('messagesContainer');
  objDiv.scrollTop = objDiv.scrollHeight;
};

const handleLogout = async () => {
  utils().showLoader();
  await useUserStore().logOut();
  await router.push('/login');
  utils().hideLoader();
};
</script>

<template>
  <div class="ml-[300px] w-[100% - 300px] h-[100vh]">
    <div class="flex flex-col h-[100vh] bg-white rounded-lg shadow-lg">
      <div v-if="currentChat?.id" class="flex items-center justify-between p-4 border-b">
        <div class="w-full flex justify-between">
          <div class="flex">
            <div class="ml-4">
              <p class="text-lg font-semibold">{{ currentChat.selectedUser?.name }}</p>
              <p class="text-sm text-gray-500">Active 3m ago</p>
            </div>
          </div>
          <div>
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
                <DropdownMenuItem class="cursor-pointer" @click="handleLogout">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div id="messagesContainer" class="flex-1 p-4 overflow-y-auto">
        <div v-for="message in currentChat?.messages" :key="message">
          <div v-if="message.sender !== useUserStore()._user.id" class="flex items-start mb-4">
            <div class="ml-4 p-4 bg-gray-200 rounded-lg">
              <p class="text-sm">{{ message.message }}</p>
              <span class="text-xs ml-2 flex justify-end">{{ message.formatedDate }}</span>
            </div>

          </div>
          <div v-else class="flex items-end justify-end mb-4">
            <div class="mr-4 p-4 bg-blue-300 rounded-lg">
              <p class="text-sm">{{ message.message }}</p>
              <span class="text-xs ml-2 flex justify-end">{{ message.formatedDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentChat?.id" class="w-full p-4">
        <Input placeholder="Type a message" @keyup.enter="handleSendMessage" v-model="messageToSend"/>
      </div>
    </div>
  </div>
</template>
