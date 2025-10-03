

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIW1dZERJyjv-DlVRCkqOIvsjgppNXMfk",
  authDomain: "customcodeeditor-c34c7.firebaseapp.com",
  projectId: "customcodeeditor-c34c7",
  storageBucket: "customcodeeditor-c34c7.firebasestorage.app",
  messagingSenderId: "437441540919",
  appId: "1:437441540919:web:0702b86f8a1c734019a0b2",
  measurementId: "G-X8G0P24413"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, db };
