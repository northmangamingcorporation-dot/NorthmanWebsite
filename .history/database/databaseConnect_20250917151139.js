// Database connection setup

import { getFirestore, collection, addDoc, getDocs, onSnapshot, serverTimestamp } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore(app);

// Optional: export globally if you want to use in other scripts
window.db = db;

