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
      return withRetry(operation, retries - 1);
    }
    throw error;
  }
};

// Enhanced Add / set document with validation and backup
window.setDoc = async (collectionName, docId, data) => {
  try {
    // Input validation
    if (!collectionName || !docId || !data) {
      throw new Error('Missing required parameters: collectionName, docId, or data');
    }

    // Data validation
    const validatedData = {
      ...data,
      dateSubmitted: firebase.firestore.FieldValue.serverTimestamp(),
      lastModified: firebase.firestore.FieldValue.serverTimestamp(),
      version: data.version || 1,
      status: data.status || 'active'
    };

    const operation = () => db.collection(collectionName).doc(docId).set(validatedData);
    await withRetry(operation);

    // Log successful operation
    console.log(`✅ Document ${docId} successfully added to ${collectionName}`);
    
    // Store backup in localStorage for offline capability
    if (typeof Storage !== 'undefined') {
      const backupKey = `backup_${collectionName}_${docId}`;
      localStorage.setItem(backupKey, JSON.stringify({
        ...validatedData,
        dateSubmitted: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }));
    }

    return { success: true, docId };
  } catch (err) {
    console.error(`❌ Error adding document to ${collectionName}:`, {
      error: err.message,
      code: err.code,
      docId,
      timestamp: new Date().toISOString(),
      isOnline
    });

    // Store failed operation for retry when online
    if (!isOnline && typeof Storage !== 'undefined') {
      const failedOps = JSON.parse(localStorage.getItem('failedOperations') || '[]');
      failedOps.push({
        type: 'setDoc',
        collectionName,
        docId,
        data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('failedOperations', JSON.stringify(failedOps));
    }

    return { success: false, error: err.message, code: err.code };
  }
};

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

// Enhanced Get all documents in a collection with caching
window.getCollection = async (collectionName, orderByField = null, desc = false) => {
  try {
    const operation = async () => {
      let query = db.collection(collectionName);
      if (orderByField) query = query.orderBy(orderByField, desc ? "desc" : "asc");
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const result = await withRetry(operation);
    
    // Cache successful results
    if (typeof Storage !== 'undefined') {
      const cacheKey = `cache_${collectionName}_${orderByField || 'default'}_${desc}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        data: result,
        timestamp: new Date().toISOString(),
        ttl: 5 * 60 * 1000 // 5 minutes TTL
      }));
    }

    return result;
  } catch (err) {
    console.error(`❌ Error getting collection ${collectionName}:`, err);
    
    // Try to return cached data if available
    if (typeof Storage !== 'undefined') {
      const cacheKey = `cache_${collectionName}_${orderByField || 'default'}_${desc}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp, ttl } = JSON.parse(cached);
        const isExpired = new Date().getTime() - new Date(timestamp).getTime() > ttl;
        if (!isExpired) {
          console.warn(`⚠️ Returning cached data for ${collectionName}`);
          return data;
        }
      }
    }
    
    return [];
  }
};

// -----------------------
// Backup and Recovery System
// -----------------------

// Retry failed operations when connection is restored
window.retryFailedOperations = async () => {
  if (!isOnline || typeof Storage === 'undefined') return;

  const failedOps = JSON.parse(localStorage.getItem('failedOperations') || '[]');
  if (failedOps.length === 0) return;

  console.log(`🔄 Retrying ${failedOps.length} failed operations...`);
  
  const successfulOps = [];
  const stillFailedOps = [];

  for (const op of failedOps) {
    try {
      switch (op.type) {
        case 'setDoc':
          const result = await window.setDoc(op.collectionName, op.docId, op.data);
          if (result.success) {
            successfulOps.push(op);
          } else {
            stillFailedOps.push(op);
          }
          break;
        // Add other operation types as needed
      }
    } catch (error) {
      stillFailedOps.push(op);
    }
  }

  // Update failed operations list
  localStorage.setItem('failedOperations', JSON.stringify(stillFailedOps));
  
  if (successfulOps.length > 0) {
