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
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  new Notification(notificationTitle, notificationOptions);
});

Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    console.log('Notification permission granted.');

    // Get the token
    getToken(messaging, { vapidKey: 'BDsk0AXxeCnK9rxJ-DRJqScCBclcg361B1ZrqNRHg3k0mhX_edM5GkAKajJazd7EiYZljhbOxxAQ0NKECD3nmpk' }).then((currentToken) => {
      if (currentToken) {
        console.log('Token: ', currentToken);
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
  } else {
    console.log('Unable to get permission to notify.');
  }
});

// used for the firestore refs
const db = getFirestore(firebaseApp);

export {db};