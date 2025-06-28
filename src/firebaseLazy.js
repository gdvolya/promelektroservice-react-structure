// src/firebaseLazy.js
let db = null;
let messaging = null;

export const loadFirebase = async () => {
  const firebase = await import("firebase/app");
  await import("firebase/firestore");
  await import("firebase/messaging");

  const { initializeApp, getApps } = await import("firebase/app");
  const { getFirestore } = await import("firebase/firestore");
  const { getMessaging } = await import("firebase/messaging");

  if (getApps().length === 0) {
    const app = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });

    db = getFirestore(app);
    messaging = getMessaging(app);
  }
};

export { db, messaging };
