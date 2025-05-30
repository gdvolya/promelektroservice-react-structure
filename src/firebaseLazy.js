let db = null;
let messaging = null;

export const loadFirebase = () => {
  return import("firebase/app").then(() => {
    import("firebase/firestore").then((firestore) => {
      db = firestore.getFirestore();
    });
    import("firebase/messaging").then((messagingModule) => {
      messaging = messagingModule.getMessaging();
    });
  });
};

export { db, messaging };
