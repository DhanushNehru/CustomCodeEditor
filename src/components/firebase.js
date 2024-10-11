

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1hSaR5PzPXYs90AhuFshIE85ZGBsWT3I",
  authDomain: "codelive-503da.firebaseapp.com",
  projectId: "codelive-503da",
  storageBucket: "codelive-503da.appspot.com",
  messagingSenderId: "52006541158",
  appId: "1:52006541158:web:5cdc1584e3bcd5d1c19aa7",
  measurementId: "G-HB4DLV7RBZ"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, db };
