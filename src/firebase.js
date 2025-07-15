import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAnIolE-wxhUdtOuKcDwwIEj66fNdOIsSU",
  authDomain: "promelektroservice.firebaseapp.com",
  projectId: "promelektroservice",
  storageBucket: "promelektroservice.appspot.com",
  messagingSenderId: "159290070933",
  appId: "1:159290070933:web:ad36370727f99459a0889c",
  measurementId: "G-SCE9TK4FMJ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const messaging = getMessaging(app);

getToken(messaging, {
  vapidKey: "BE6mx-nmfkaM-RJmDBA2rJVNYkQRX9Qayj4-zgSz4AM-IJFssiPlAA0XUAaGmlznUUDIpvkksUzzJbgS0glRKj8"
})
  .then((currentToken) => {
    if (currentToken) {
      console.log("FCM токен:", currentToken);
    } else {
      console.warn("FCM: токен не отримано. Можливо, не дозволено сповіщення.");
    }
  })
  .catch((err) => {
    console.error("FCM: помилка отримання токена:", err);
  });

onMessage(messaging, (payload) => {
  alert(`🔔 Повідомлення: ${payload.notification?.title}`);
});

export { db, messaging };
