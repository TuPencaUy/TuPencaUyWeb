importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')

firebase.initializeApp({
  apiKey: 'AIzaSyBlNUDLV1AbX4eHqbFn-Jaj26YwdpJERyg',
  authDomain: 'tupencauy-65abe.firebaseapp.com',
  projectId: 'tupencauy-65abe',
  storageBucket: 'tupencauy-65abe.appspot.com',
  messagingSenderId: '7215841621',
  appId: '1:7215841621:web:f5ef572904b2289eb0efdc',
  measurementId: 'G-87FSWQ7GF7'
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/firebase-logo.png'
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });