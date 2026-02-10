
import { AnalyticsData, FetchErrorsParams, ErrorType } from '../types';

const API_BASE = '/.netlify/functions';

// Set to false to use real Netlify Functions
const isLocalDemo = false; 

export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  if (isLocalDemo) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const now = new Date();
    return {
      totalErrors: 209,
      errorsByType: [{ type: ErrorType.CELERY, count: 124 }],
      errorsByDay: [],
      topFailingTasks: [],
      recentErrors: [],
      errorRate: { today: 14, yesterday: 18, lastWeek: 112, thisWeek: 56 }
    };
  }

  const response = await fetch(`${API_BASE}/get-analytics`);
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
};

export const fetchErrors = async (params: FetchErrorsParams) => {
  const query = new URLSearchParams(params as any).toString();
  const response = await fetch(`${API_BASE}/get-errors?${query}`);
  if (!response.ok) throw new Error('Failed to fetch errors');
  return response.json();
};

export const triggerSync = async () => {
  const response = await fetch(`${API_BASE}/manual-sync`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to trigger sync');
  return response.json();
};
