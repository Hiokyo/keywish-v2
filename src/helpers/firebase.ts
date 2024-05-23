// firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBihPR-XbM4VQWIQ0UrzEqEz-vfYyKZmbY",
  authDomain: "keywish-f4858.firebaseapp.com",
  projectId: "keywish-f4858",
  storageBucket: "keywish-f4858.appspot.com",
  messagingSenderId: "769613301975",
  appId: "1:769613301975:web:381ba0468bd8cbb1698892",
  measurementId: "G-442PQBD9Q8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const FIREBASE_CONFIG = {
  doc_id: "dSQmw8g9ngSSDMMzq8kG",
  collection: "keywish-db",
};
export { db, FIREBASE_CONFIG };
