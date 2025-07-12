// src/firebaseLazy.js
let db = null;
let messaging = null;

export const loadFirebase = async () => {
  const { initializeApp, getApps } = await import("firebase/app");
  const { getFirestore } = await import("firebase/firestore");
  const { getMessaging } = await import("firebase/messaging");

  // Проверяем, если Firebase уже инициализирован
  if (getApps().length === 0) {
    const app = initializeApp({
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY, 
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, 
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, 
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET, 
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, 
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    });

    // Получаем экземпляр Firestore и Messaging
    db = getFirestore(app);
    messaging = getMessaging(app);
  }
};

export { db, messaging };
