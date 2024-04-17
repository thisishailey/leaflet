import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

let firebaseApp: FirebaseApp;
try {
    firebaseApp = getApp('firebaseApp');
} catch (e) {
    firebaseApp = initializeApp(firebaseConfig, 'firebaseApp');
}

export const app = firebaseApp;
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
