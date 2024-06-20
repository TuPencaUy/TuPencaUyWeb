import {collection, getDocs} from "firebase/firestore";
import {db} from "@/logic/init-firebase.js";
import {useTenantStore} from "@/store/tenant.js";

export default function firebaseLogic() {

    async function checkIfChatExists(senderId, receiverId) {
        const currentTenant = useTenantStore().getCurrentTenant;
        const currentEvent = 1;
        const querySnapshot = await getDocs(collection(db, "chat"));
        let results = [];
        querySnapshot.forEach((doc) => {
            results.push({
                id: doc.id,
                ...doc.data(),

            });
        });

        return results.find((chat) => {
            return (chat.event === currentEvent && chat.site === currentTenant) && ((chat.sender === senderId && chat.receiver.id === receiverId) || (chat.sender === receiverId && chat.receiver.id === senderId));
        });
    }

    return {
        checkIfChatExists,
    };
}
