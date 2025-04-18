import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase config - Use your existing config from initDb.js
const firebaseConfig = {
  apiKey: "AIzaSyCWWr-A6HP34eRkoHiOKEuOZ-Qbmpkyamo",
  authDomain: "campusproshuttlelite.firebaseapp.com",
  projectId: "campusproshuttlelite",
  storageBucket: "campusproshuttlelite.firebasestorage.app",
  messagingSenderId: "153847249312",
  appId: "1:153847249312:web:eb685180201fa702844cc5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };