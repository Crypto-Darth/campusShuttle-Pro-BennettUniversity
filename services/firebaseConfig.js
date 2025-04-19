import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9YeBbJ8tDXu0DNR3Gj4XCZuOGI-3FJn8",
  authDomain: "bennett-bus-tracker.firebaseapp.com",
  projectId: "bennett-bus-tracker",
  storageBucket: "bennett-bus-tracker.appspot.com",
  messagingSenderId: "851070054877",
  appId: "1:851070054877:web:b75aaeae59fd28e59b687c",
  measurementId: "G-P931LC60H8"
};

// Initialize Firebase safely
let firebase;
try {
  if (!getApps().length) {
    firebase = initializeApp(firebaseConfig);
  } else {
    firebase = getApp();
  }
} catch (err) {
  console.error("Firebase initialization error", err.stack);
}

// Initialize Firestore database
const db = getFirestore(firebase);

// Initialize Firebase Auth
const auth = getAuth(firebase);

export { firebase, db, auth };