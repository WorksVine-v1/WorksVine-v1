import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyArLtj0Ze8wPuZYptMMMRCKyJ79ZWJQ3IY",
    authDomain: "worksvine-v1.firebaseapp.com",
    projectId: "worksvine-v1",
    storageBucket: "worksvine-v1.firebasestorage.app",
    messagingSenderId: "722542601144",
    appId: "1:722542601144:web:de7098cadfbd5830bb254d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();