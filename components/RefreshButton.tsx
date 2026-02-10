
import React from 'react';
import { formatRelativeTime } from '../utils/formatters';

interface RefreshProps {
  onRefresh: () => void;
  lastUpdated: Date | null;
  syncing: boolean;
}

const RefreshButton: React.FC<RefreshProps> = ({ onRefresh, lastUpdated, syncing }) => {
  return (
    <div className="flex flex-col items-end">
      <button
        onClick={onRefresh}
        disabled={syncing}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all shadow-sm ${
          syncing 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
        }`}
      >
        <i className={`fa-solid fa-arrows-rotate ${syncing ? 'animate-spin' : ''}`}></i>
        {syncing ? 'Syncing...' : 'Sync Emails'}
      </button>
      {lastUpdated && (
        <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
          Last synced: {formatRelativeTime(lastUpdated)}
        </span>
      )}
    </div>
  );
};

export default RefreshButton;
