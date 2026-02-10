
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBUHvdbk4lzbzuZGMgJutYTCjAHU3OcyG4",
  authDomain: "error-monitor-c155c.firebaseapp.com",
  projectId: "error-monitor-c155c",
  storageBucket: "error-monitor-c155c.firebasestorage.app",
  messagingSenderId: "413446394970",
  appId: "1:413446394970:web:94fadd0d22411749cbf463"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
