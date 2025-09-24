// database/databaseConnect.js

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

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
window.db = db; // global access

console.log("Firestore initialized:", db);

// -----------------------
// Enhanced Global Firestore Functions with Error Handling
// -----------------------

// Connection status monitoring
let isOnline = navigator.onLine;
let connectionRetries = 0;
const MAX_RETRIES = 3;

window.addEventListener('online', () => {
  isOnline = true;
  connectionRetries = 0;
  console.log('🟢 Database connection restored');
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.log('🔴 Database connection lost - operating in offline mode');
});

// Enhanced error handling with retry logic
const withRetry = async (operation, retries = MAX_RETRIES) => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && (error.code === 'unavailable' || error.code === 'deadline-exceeded')) {
      console.warn(`⚠️ Retrying operation... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (MAX_RETRIES - retries + 1)));

// Get document by ID
window.getDoc = async (collectionName, docId) => {
  try {
    const docRef = db.collection(collectionName).doc(docId);
    const docSnap = await docRef.get();
    if (docSnap.exists) return docSnap.data();
    return null;
  } catch (err) {
    console.error(`❌ Error getting document ${docId} from ${collectionName}:`, err);
    return null;
  }
};

// Update document
window.updateDoc = async (collectionName, docId, data) => {
  try {
    await db.collection(collectionName).doc(docId).update({
      ...data,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return { success: true };
  } catch (err) {
    console.error(`❌ Error updating document ${docId} in ${collectionName}:`, err);
    return { success: false, error: err };
  }
};

// Delete document
window.deleteDoc = async (collectionName, docId) => {
  try {
    await db.collection(collectionName).doc(docId).delete();
    return { success: true };
  } catch (err) {
    console.error(`❌ Error deleting document ${docId} from ${collectionName}:`, err);
    return { success: false, error: err };
  }
};

// Get all documents in a collection
window.getCollection = async (collectionName, orderByField = null, desc = false) => {
  try {
    let query = db.collection(collectionName);
    if (orderByField) query = query.orderBy(orderByField, desc ? "desc" : "asc");
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error(`❌ Error getting collection ${collectionName}:`, err);
    return [];
  }
};
