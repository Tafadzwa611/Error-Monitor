
import React, { useState, useEffect, useCallback } from 'react';
import { AnalyticsData } from './types';
import { fetchAnalytics, triggerSync } from './utils/api';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import RefreshButton from './components/RefreshButton';

const App: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);

  const loadData = useCallback(async (showFullLoader: boolean = false) => {
    if (showFullLoader) setLoading(true);
    try {
      const analytics = await fetchAnalytics();
      setData(analytics);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error(err);
    } finally {
      if (showFullLoader) setLoading(false);
    }
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const result = await triggerSync();
      // After sync, reload analytics
      await loadData(false);
      // Optional: show a success toast here
    } catch (err) {
      alert("Manual sync failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadData(true);
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadData(false);
    }, 300000);

    return () => clearInterval(interval);
  }, [loadData]);

  if (loading && !data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <i className="fa-solid fa-shield-virus text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">ErrorMonitor</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Analytics Dashboard v1.0</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <RefreshButton 
              onRefresh={handleManualSync} 
              lastUpdated={lastUpdated} 
              syncing={syncing} 
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {error ? (
          <div className="max-w-7xl mx-auto p-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <i className="fa-solid fa-circle-exclamation text-red-500 text-4xl mb-4"></i>
              <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button 
                onClick={() => loadData(true)} 
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Retry Loading
              </button>
            </div>
          </div>
        ) : data ? (
          <Dashboard data={data} />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-400 font-medium tracking-wide uppercase">
          &copy; 2024 ErrorMonitor Engine &bull; monitoring marambatanaka@gmail.com
        </div>
      </footer>
    </div>
  );
};

export default App;
