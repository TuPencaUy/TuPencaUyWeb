<script setup>

import {Input} from "@/components/ui/input/index.js";

const handleSendMessage = () => {
  console.log("Message sent");
};
</script>

<template>
  <div class="ml-[300px] w-[100% - 300px] h-[100vh]">
    <div class="flex flex-col h-[100vh] bg-white rounded-lg shadow-lg">
      <div class="flex items-center justify-between p-4 border-b">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div class="ml-4">
            <p class="text-lg font-semibold">John Doe</p>
            <p class="text-sm text-gray-500">Active 3m ago</p>
          </div>
        </div>
        <div class="flex items-center">
          <button class="p-2 bg-gray-200 rounded-full">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
          <button class="p-2 bg-gray-200 rounded-full ml-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="flex-1 p-4 overflow-y-auto">
        <div class="flex items-start mb-4">
          <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div class="ml-4 p-4 bg-gray-200 rounded-lg">
            <p class="text-sm">Hello, how are you?</p>
          </div>
        </div>
        <div class="flex items-end justify-end mb-4">
          <div class="mr-4 p-4 bg-gray-200 rounded-lg">
            <p class="text-sm">I'm fine, thank you.</p>
          </div>
        </div>
      </div>

      <div class="w-full p-4">
        <Input placeholder="Type a message" @submit="handleSendMessage"/>
      </div>
    </div>
  </div>
</template>
