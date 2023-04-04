// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAKI_cH04w2gUQOHX9q3qn3BcLV8DtmtFQ",
  authDomain: "blood-bank-app-381911.firebaseapp.com",
  projectId: "blood-bank-app-381911",
  storageBucket: "blood-bank-app-381911.appspot.com",
  messagingSenderId: "831432592245",
  appId: "1:831432592245:web:3f9a51cf6cc02d5b41613c",
  measurementId: "G-QMQQKYQ8WS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth();
const db = getFirestore(app);

export { app, auth, storage, db };