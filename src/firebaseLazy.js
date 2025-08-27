// src/firebaseLazy.js

/*
 * Ленивая (lazy) инициализация Firebase
 *
 * Этот подход обеспечивает, что Firebase будет инициализирован
 * только один раз, при первом импорте файла, что повышает
 * производительность и предотвращает ошибки повторной инициализации.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

let db = null;
let messaging = null;

// Конфигурация Firebase из переменных окружения
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Функция для инициализации Firebase, которая будет вызвана только один раз
const initializeFirebaseApp = () => {
  let app;
  // Проверяем, был ли Firebase уже инициализирован
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  // Инициализация Firestore
  db = getFirestore(app);
  
  // Инициализация Messaging с обработкой возможных ошибок
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.warn("⚠️ Push уведомления недоступны:", err.message);
  }
};

initializeFirebaseApp();

export { db, messaging };