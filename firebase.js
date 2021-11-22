// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAW5vnhjb3IHuJOrq3embNMkQxFsQtVGE",
    authDomain: "rasd-instagram.firebaseapp.com",
    projectId: "rasd-instagram",
    storageBucket: "rasd-instagram.appspot.com",
    messagingSenderId: "658178103570",
    appId: "1:658178103570:web:85455569e19f604974fbcb"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
