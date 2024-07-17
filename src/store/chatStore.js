import {defineStore} from 'pinia';
import {db} from "@/logic/init-firebase.js";
import {useUserStore} from "@/store/user.js";
import {
    setDoc,
    getDoc,
    doc,
    getDocs,
    collection,
    updateDoc,
    arrayUnion,
    onSnapshot,
    query,
    where
} from 'firebase/firestore';
import {uuid} from 'vue-uuid';
import firebaseLogic from "@/logic/firebaseLogic.js";
import {useTenantStore} from "@/store/tenant.js";
import {useEventStore} from "@/store/event.js";

export const useChatStore = defineStore({
    id: 'chat',
    state: () => {
        return {
            currentChat: null,
            currentChatMessages: [],
            currentUser: null,
        };
    },
    actions: {
        setCurrentUser(user) {
            this.currentUser = user;
        },
        resetCurrentChat() {
            this.currentChat = null;
            this.currentChatMessages = [];
            this.currentUser = null;
        },
        async openChat(receiver) {
            if (!useUserStore()._user?.id || !receiver) return;

            const data = {
                sender: Number(useUserStore()._user?.id),
                receiver: receiver,
                senderHasRead: false,
                receiverHasRead: false,
                messages: [],
                site: useTenantStore().getCurrentTenant,
                event: useEventStore().getCurrentEvent?.id,
            };

            const chatExists = await firebaseLogic().checkIfChatExists(Number(data.sender), Number(data.receiver.id));
            if (chatExists) {
                this.currentChat = chatExists;
                this.currentChat.selectedUser = receiver;
                return;
            }

            /* Create new Chat */
            try {
                const uniquid = uuid.v4();
                await setDoc(doc(db, "chat", uniquid), data);
                this.currentChat = {id: uniquid, ...data};
                this.currentChat.selectedUser = receiver;
            } catch (e) {
                console.log(e);
            }
        },

        async sendMessage(message) {
            if (!this.currentChat) return;

            const createdAt = Date.now();
            const date = new Date(createdAt);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const formatedDate = `${hours}:${minutes}`;

            const data = {
                sender: Number(useUserStore()._user?.id),
                message: message,
                createdAt: createdAt,
                formatedDate: formatedDate,
            };

            try {
                await updateDoc(doc(db, `chat/${this.currentChat.id}`), {
                    senderHasRead: false,
                    receiverHasRead: false,
                    messages: arrayUnion(data),
                });
            } catch (e) {
                console.log(e);
            }
        },

        deleteChat() {
            this.currentChat = null;
            this.currentChatMessages = [];
            this.currentUser = null;
        }
    },

    getters: {},
    persist: true
});
