import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
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