import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyBlNUDLV1AbX4eHqbFn-Jaj26YwdpJERyg",
    authDomain: "tupencauy-65abe.firebaseapp.com",
    projectId: "tupencauy-65abe",
    storageBucket: "tupencauy-65abe.appspot.com",
    messagingSenderId: "7215841621",
    appId: "1:7215841621:web:f5ef572904b2289eb0efdc",
    measurementId: "G-87FSWQ7GF7"
});

const messaging = getMessaging();

console.log('messaging: ', messaging)

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
});

getToken(messaging, { vapidKey: 'BDsk0AXxeCnK9rxJ-DRJqScCBclcg361B1ZrqNRHg3k0mhX_edM5GkAKajJazd7EiYZljhbOxxAQ0NKECD3nmpk' }).then((currentToken) => {
  if (currentToken) {
    
    console.log('token: ', currentToken);
  } else {
    console.log('No registration token available. Request permission to generate one.');
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
});

// used for the firestore refs
const db = getFirestore(firebaseApp);

export {db};