
import React from 'react';
import { AnalyticsData } from '../types';
import StatsCards from './StatsCards';
import TrendChart from './TrendChart';
import ErrorTypeChart from './ErrorTypeChart';
import TopErrorsWidget from './TopErrorsWidget';
import ErrorsTable from './ErrorsTable';

interface DashboardProps {
  data: AnalyticsData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const topErrorType = data.errorsByType.length > 0 
    ? data.errorsByType.reduce((prev, current) => (prev.count > current.count) ? prev : current).type 
    : 'None';

  const stats = {
    totalErrors: data.totalErrors,
    todayErrors: data.errorRate.today,
    topErrorType: topErrorType,
    errorRateChange: data.errorRate.today - data.errorRate.yesterday
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Overview Cards */}
      <StatsCards stats={stats} />

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrendChart data={data.errorsByDay} />
        <ErrorTypeChart data={data.errorsByType} />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <TopErrorsWidget tasks={data.topFailingTasks} />
        </div>
        <div className="xl:col-span-2">
          <ErrorsTable errors={data.recentErrors} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
