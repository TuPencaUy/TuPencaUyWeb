import {collection, getDocs} from "firebase/firestore";
import {db} from "@/logic/init-firebase.js";

export default function firebaseLogic() {

    async function checkIfChatExists(senderId, receiverId) {
        const querySnapshot = await getDocs(collection(db, "chat"));
        let results = [];
        querySnapshot.forEach((doc) => {
            results.push({
                id: doc.id,
                ...doc.data(),

            });
        });

        return results.find((chat) => {
            return (chat.sender === senderId && chat.receiver.id === receiverId) || (chat.sender === receiverId && chat.receiver.id === senderId);
        });
    }

    return {
        checkIfChatExists,
    };
}
