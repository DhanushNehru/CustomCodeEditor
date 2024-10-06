

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLfOLxHfBnzBk3kivmc90AyXx6bHmGSgE",
  authDomain: "fir-app-c6e55.firebaseapp.com",
  projectId: "fir-app-c6e55",
  storageBucket: "fir-app-c6e55.appspot.com",
  messagingSenderId: "27999162198",
  appId: "1:27999162198:web:2a22022c38d8ce6d8fd0f7",
  measurementId: "G-9952TCZLXP"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, db };
