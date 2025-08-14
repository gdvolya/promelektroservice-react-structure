// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Використання змінних середовища замість хардкодингу
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const messaging = getMessaging(app);

getToken(messaging, {
  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
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