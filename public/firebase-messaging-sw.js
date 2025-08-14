importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Використання єдиної, правильної конфігурації з файлу .env
firebase.initializeApp({
  apiKey: "AIzaSyAnIolE-wxhUdtOuKcDwwIEj66fNdOIsSU",
  authDomain: "promelektroservice.firebaseapp.com",
  projectId: "promelektroservice",
  storageBucket: "promelektroservice.appspot.com",
  messagingSenderId: "159290070933",
  appId: "1:159290070933:web:ad36370727f99459a0889c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/icon-192.png" // Використовуємо більш універсальний значок
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});