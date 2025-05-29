import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyADB_57F2kKA7HcxLnLpcqzr3ooi2sszMc",
  authDomain: "promelectroservice-cb179.firebaseapp.com",
  projectId: "promelectroservice-cb179",
  storageBucket: "promelectroservice-cb179.appspot.com",
  messagingSenderId: "938821085661",
  appId: "1:938821085661:web:1eeb590842370bd23f2e34"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

getToken(messaging, {
  vapidKey: "BE6mx-nmfkaM-RJmDBA2rJVNYkQRX9Qayj4-zgSz4AM-IJFssiPlAA0XUAaGmlznUUDIpvkksUzzJbgS0glRKj8"
}).then((currentToken) => {
  if (currentToken) {
    console.log("FCM токен:", currentToken);
  } else {
    console.warn("FCM: токен не отримано. Можливо, не дозволено сповіщення.");
  }
}).catch((err) => {
  console.error("FCM: помилка отримання токена:", err);
});

onMessage(messaging, (payload) => {
  alert(`🔔 Повідомлення: ${payload.notification?.title}`);
});

export { db, messaging };
