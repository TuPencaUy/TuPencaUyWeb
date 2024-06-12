import {useCollection} from 'vuefire';
import {collection} from 'firebase/firestore';
import {db} from "@/logic/Chat/init-firebase.js";

export default function firebaseLogic() {

    /* Esto se pone momentaneamente hasta que tengamos endpoint de usuarios por eventos */
    function getUsers() {
        return collection(db, 'Users');
    }

    return {
        getUsers,
    };
}
