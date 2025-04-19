import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCWWr-A6HP34eRkoHiOKEuOZ-Qbmpkyamo",
  authDomain: "campusproshuttlelite.firebaseapp.com",
  projectId: "campusproshuttlelite",
  storageBucket: "campusproshuttlelite.firebasestorage.app",
  messagingSenderId: "153847249312",
  appId: "1:153847249312:web:eb685180201fa702844cc5"
};

// Use global variables to prevent reinitializing Firebase
let firebaseInstance;

// Check if we're in a browser or React Native environment
if (typeof window !== 'undefined') {
  // Browser environment
  const globalWithFirebase = window;
  if (!globalWithFirebase._firebaseInitialized) {
    firebaseInstance = initializeApp(firebaseConfig);
    globalWithFirebase._firebaseInitialized = true;
  } else {
    // Use existing Firebase instance
    firebaseInstance = globalWithFirebase._firebaseApp;
  }
} else {
  // React Native environment
  if (!global._firebaseInitialized) {
    firebaseInstance = initializeApp(firebaseConfig);
    global._firebaseInitialized = true;
    global._firebaseApp = firebaseInstance;
  } else {
    firebaseInstance = global._firebaseApp;
  }
}

// Initialize Firestore and Auth
const db = getFirestore(firebaseInstance);
const auth = getAuth(firebaseInstance);

export { firebaseInstance as app, db, auth };