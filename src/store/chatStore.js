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

        async getUsers() {
            const users = collection(db, 'Users');
            //Filter out the current user
            const q = query(users, where('id', '!=', Number(useUserStore()._user?.id)));
            const querySnapshot = await getDocs(q);
            let results = [];
            querySnapshot.forEach(doc => {
                results.push(doc.data());
            });

            return results;
        },

        async openChat(receiver) {
            if (!useUserStore()._user?.id || !receiver) return;

            const data = {
                sender: Number(useUserStore()._user?.id),
                receiver: receiver,
                senderHasRead: false,
                receiverHasRead: false,
                messages: [],
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

                this.currentChat.messages.push(data);
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
