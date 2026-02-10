
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy, limit, where } = require('firebase/firestore');

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

exports.handler = async () => {
  try {
    const errorCol = collection(db, "errors");
    const snapshot = await getDocs(errorCol);
    const errors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const stats = {
      totalErrors: errors.length,
      errorsByType: {},
      errorsByDay: {},
      topFailingTasks: {},
      errorRate: { today: 0, yesterday: 0, lastWeek: 0, thisWeek: 0 }
    };

    errors.forEach(err => {
      const date = err.receivedDate.toDate();
      const dateStr = date.toISOString().split('T')[0];

      // Group by Type
      stats.errorsByType[err.errorType] = (stats.errorsByType[err.errorType] || 0) + 1;

      // Group by Day
      stats.errorsByDay[dateStr] = (stats.errorsByDay[dateStr] || 0) + 1;

      // Error Rates
      if (dateStr === todayStr) stats.errorRate.today++;
      if (dateStr === yesterdayStr) stats.errorRate.yesterday++;

      // Top Failing Tasks
      if (err.errorType === "Celery Task Failure" && err.taskName) {
        if (!stats.topFailingTasks[err.taskName]) {
          stats.topFailingTasks[err.taskName] = { count: 0, lastOccurred: date.toISOString() };
        }
        stats.topFailingTasks[err.taskName].count++;
        if (new Date(date) > new Date(stats.topFailingTasks[err.taskName].lastOccurred)) {
          stats.topFailingTasks[err.taskName].lastOccurred = date.toISOString();
        }
      }
    });

    // Format for frontend
    const formattedErrorsByType = Object.keys(stats.errorsByType).map(type => ({ type, count: stats.errorsByType[type] }));
    const formattedErrorsByDay = Object.keys(stats.errorsByDay).sort().map(date => ({ date, count: stats.errorsByDay[date] }));
    const formattedTopTasks = Object.keys(stats.topFailingTasks)
      .map(name => ({ taskName: name, ...stats.topFailingTasks[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalErrors: stats.totalErrors,
        errorsByType: formattedErrorsByType,
        errorsByDay: formattedErrorsByDay,
        topFailingTasks: formattedTopTasks,
        recentErrors: errors.sort((a, b) => b.receivedDate.toMillis() - a.receivedDate.toMillis()).slice(0, 20),
        errorRate: stats.errorRate
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
