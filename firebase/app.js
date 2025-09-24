import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDX-BNoPRZX1SjuaC4pjBYyWutrbf2BfcY",
  authDomain: "qahub-68285.firebaseapp.com",
  projectId: "qahub-68285",
  storageBucket: "qahub-68285.firebasestorage.app",
  messagingSenderId: "280309067987",
  appId: "1:280309067987:web:9392eebef2f87645926426",
  measurementId: "G-WF7377JEBC",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
