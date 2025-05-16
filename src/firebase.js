import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyADB_57F2kKA7HcxLnLpcqzr3ooi2sszMc",
  authDomain: "promelectroservice-cb179.firebaseapp.com",
  projectId: "promelectroservice-cb179",
  storageBucket: "promelectroservice-cb179.firebasestorage.app",
  messagingSenderId: "938821085661",
  appId: "1:938821085661:web:1eeb590842370bd23f2e34"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { db, messaging };
