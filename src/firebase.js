import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAnIolE-wxhUdtOuKcDwwIEj66fNdOIsSU", // Ваш API-ключ
  authDomain: "promelektroservice.firebaseapp.com",
  projectId: "promelektroservice",
  storageBucket: "promelektroservice.firebasestorage.app",
  messagingSenderId: "159290070933",
  appId: "1:159290070933:web:ad36370727f99459a0889c",
  measurementId: "G-SCE9TK4FMJ"
};

// Инициализация приложения Firebase
const app = initializeApp(firebaseConfig);

// Получаем доступ к Firestore
const db = getFirestore(app);

// Инициализация FCM (Firebase Cloud Messaging)
const messaging = getMessaging(app);

// Получение токена для уведомлений
getToken(messaging, {
  vapidKey: "BE6mx-nmfkaM-RJmDBA2rJVNYkQRX9Qayj4-zgSz4AM-IJFssiPlAA0XUAaGmlznUUDIpvkksUzzJbgS0glRKj8"
})
  .then((currentToken) => {
    if (currentToken) {
      console.log("FCM токен:", currentToken); // Печатает токен в консоль
    } else {
      console.warn("FCM: токен не отримано. Можливо, не дозволено сповіщення.");
    }
  })
  .catch((err) => {
    console.error("FCM: помилка отримання токена:", err);
  });

// Получение уведомлений
onMessage(messaging, (payload) => {
  alert(`🔔 Повідомлення: ${payload.notification?.title}`);
});

export { db, messaging };
