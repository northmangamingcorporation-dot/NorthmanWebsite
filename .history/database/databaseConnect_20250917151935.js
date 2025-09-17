// 

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC1MXd3FcLv_Ta00hzv7CU6skJPw4H1w7M",
  authDomain: "northmancorpdatabase.firebaseapp.com",
  projectId: "northmancorpdatabase",
  storageBucket: "northmancorpdatabase.firebasestorage.app",
  messagingSenderId: "843208612876",
  appId: "1:843208612876:web:d4249a28702e62010ae229",
  measurementId: "G-3P6XCFX2SK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

