import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Инициализация (только один раз)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore — база данных
const db = getFirestore(app);

// Analytics — только в браузере (иначе упадет на сервере)
let analytics = null;
if (typeof window !== "undefined") {
  isAnalyticsSupported().then((ok) => {
    if (ok) {
      analytics = getAnalytics(app);
    }
  });
}

// Messaging — проверяем поддержку (например, не везде есть Service Workers)
let messaging = null;
if (typeof window !== "undefined") {
  isMessagingSupported().then((ok) => {
    if (ok) {
      messaging = getMessaging(app);
    }
  });
}

export { db, analytics, messaging };
