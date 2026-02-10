
import React from 'react';
import { formatNumber } from '../utils/formatters';

interface StatsProps {
  stats: {
    totalErrors: number;
    todayErrors: number;
    topErrorType: string;
    errorRateChange: number;
  };
}

const StatsCards: React.FC<StatsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Errors',
      value: formatNumber(stats.totalErrors),
      subtitle: 'Last 30 days',
      icon: '⚠️',
      color: 'border-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Errors Today',
      value: formatNumber(stats.todayErrors),
      subtitle: 'Since midnight',
      icon: '🔥',
      color: 'border-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Most Common',
      value: stats.topErrorType,
      subtitle: 'Error category',
      icon: '📊',
      color: 'border-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Trend (24h)',
      value: `${stats.errorRateChange > 0 ? '+' : ''}${stats.errorRateChange}`,
      subtitle: 'Vs yesterday',
      icon: '📈',
      color: 'border-orange-500',
      trend: stats.errorRateChange
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${card.color}`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-2xl">{card.icon}</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</span>
          </div>
          <div className="flex items-baseline">
            <h3 className={`text-2xl font-bold ${card.textColor || 'text-gray-900'}`}>{card.value}</h3>
            {card.trend !== undefined && (
              <span className={`ml-2 text-sm font-medium ${card.trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {card.trend > 0 ? '↑' : '↓'}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
