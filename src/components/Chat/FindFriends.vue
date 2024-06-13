<script setup>
import {onMounted, ref, toRefs} from 'vue';
import utils from "@/logic/utils.js";
import {getDocs} from 'firebase/firestore';
import {useChatStore} from "@/store/chatStore.js";
import {Icon} from "@iconify/vue";

const usersToShow = ref([]);
const users = ref([]);

onMounted(async () => {
  utils().showLoader();
  users.value = await useChatStore().getUsers();
  usersToShow.value = users.value;
  utils().hideLoader();
});

const handleSearchFriends = async (values) => {
  const userToFind = values.target.value;
  usersToShow.value = users.value?.filter(user => user?.name?.toLowerCase()?.includes(userToFind.toLowerCase()));
};

const createNewChat = async (receiver) => {
  utils().showLoader();
  const receiverRef = toRefs(receiver);
  const receiverData = {
    id: receiverRef.id.value,
    name: receiverRef.name.value,
    email: receiverRef.email.value,
  };
  await useChatStore().openChat(receiverData);
  utils().hideLoader();

  const objDiv = document.getElementById('messagesContainer');
  objDiv.scrollTop = objDiv.scrollHeight;
};
</script>

<template>
  <div class="find-friends">
    <div class="find-friends__header text-center text-lg">
      <h3>Chats</h3>
    </div>
    <div class="find-friends__search">
      <input type="text" placeholder="Search..." @input="handleSearchFriends"/>
    </div>
    <div class="find-friends__list">
      <div id="containerChat" v-for="user in usersToShow" :key="user" @click="createNewChat(user)"
           class="find-friends__item cursor-pointer hover:bg-gray-100">
        <div class="find-friends__item-avatar">
          <Icon icon="bxs:message" color="#757575" width="40" height="40"/>
        </div>
        <div class="find-friends__item-info">
          <h4 class="text-lg font-semibold">{{ user.name }}</h4>
          <p class="text-sm text-gray-500">Active 3m ago</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.find-friends {
  width: 300px;
  height: 100vh;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
  position: fixed;
  z-index: 10;
}

.find-friends__header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.find-friends__search {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.find-friends__search input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
}

.find-friends__list {
  padding: 1rem;
  overflow-y: auto;
}

.find-friends__item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.find-friends__item-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.find-friends__item-info {
  margin-left: 1rem;
}

.find-friends__item-actions button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.find-friends__item-actions button:hover {
  background-color: #0056b3;
}
</style>