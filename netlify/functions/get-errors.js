
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy, limit, startAfter } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBUHvdbk4lzbzuZGMgJutYTCjAHU3OcyG4",
  authDomain: "error-monitor-c155c.firebaseapp.com",
  projectId: "error-monitor-c155c",
  storageBucket: "error-monitor-c155c.firebasestorage.app",
  messagingSenderId: "413446394970",
  appId: "1:413446394970:web:94fadd0d22411749cbf463"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

exports.handler = async (event) => {
  try {
    const { page = 1, limit: itemsPerPage = 50 } = event.queryStringParameters || {};
    const errorCol = collection(db, "errors");
    
    // For simplicity, we fetch all and paginate in memory, or use startAfter for real efficiency
    const q = query(errorCol, orderBy("receivedDate", "desc"));
    const snapshot = await getDocs(q);
    const allErrors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedErrors = allErrors.slice(startIndex, startIndex + parseInt(itemsPerPage));

    return {
      statusCode: 200,
      body: JSON.stringify({
        errors: paginatedErrors,
        total: allErrors.length,
        page: parseInt(page),
        totalPages: Math.ceil(allErrors.length / itemsPerPage),
        limit: parseInt(itemsPerPage)
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
