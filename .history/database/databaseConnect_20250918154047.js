// database/databaseConnect.js

// Initialize Firebase using the global `firebase` object from the compat CDN
const firebaseConfig = {
  apiKey: "AIzaSyC1MXd3FcLv_Ta00hzv7CU6skJPw4H1w7M",
  authDomain: "northmancorpdatabase.firebaseapp.com",
  projectId: "northmancorpdatabase",
  storageBucket: "northmancorpdatabase.firebasestorage.app",
  messagingSenderId: "843208612876",
  appId: "1:843208612876:web:d4249a28702e62010ae229",
  measurementId: "G-3P6XCFX2SK"
};
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
window.db = db; // Make Firestore accessible globally

console.log("Firestore initialized:", db);
