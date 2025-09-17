import { initializeApp } from "https://www.gstatic.com/firebasejs/9.27.0/firebase-app.js";
  import { getFirestore, collection } from "https://www.gstatic.com/firebasejs/9.27.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyC1MXd3FcLv_Ta00hzv7CU6skJPw4H1w7M",
    authDomain: "northmancorpdatabase.firebaseapp.com",
    projectId: "northmancorpdatabase",
    storageBucket: "northmancorpdatabase.firebasestorage.app",
    messagingSenderId: "843208612876",
    appId: "1:843208612876:web:d4249a28702e62010ae229",
    measurementId: "G-3P6XCFX2SK"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  window.db = db; // make globally accessible