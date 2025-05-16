importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyADB_57F2kKA7HcxLnLpcqzr3ooi2sszMc",
  authDomain: "promelectroservice-cb179.firebaseapp.com",
  projectId: "promelectroservice-cb179",
  storageBucket: "promelectroservice-cb179.firebasestorage.app",
  messagingSenderId: "938821085661",
  appId: "1:938821085661:web:1eeb590842370bd23f2e34"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
