import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyBlNUDLV1AbX4eHqbFn-Jaj26YwdpJERyg",
    authDomain: "tupencauy-65abe.firebaseapp.com",
    projectId: "tupencauy-65abe",
    storageBucket: "tupencauy-65abe.appspot.com",
    messagingSenderId: "7215841621",
    appId: "1:7215841621:web:f5ef572904b2289eb0efdc",
    measurementId: "G-87FSWQ7GF7"
});

// used for the firestore refs
const db = getFirestore(firebaseApp);

export {db};