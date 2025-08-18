// src/firebaseLazy.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

let db = null;
let messaging = null;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Завантаження Firebase тільки один раз
const initializeFirebaseApp = () => {
  if (getApps().length === 0) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    messaging = getMessaging(app);
  } else {
    const app = getApp();
    db = getFirestore(app);
    messaging = getMessaging(app);
  }
};

initializeFirebaseApp();

export { db, messaging };