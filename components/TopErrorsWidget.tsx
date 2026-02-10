
import React from 'react';
import { formatRelativeTime } from '../utils/formatters';

interface TasksProps {
  tasks: Array<{ taskName: string; count: number; lastOccurred: string }>;
}

const TopErrorsWidget: React.FC<TasksProps> = ({ tasks }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <i className="fa-solid fa-list-ol mr-2 text-blue-600"></i>
        Top Failing Tasks
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-2 font-medium">Rank</th>
              <th className="py-3 px-2 font-medium">Task Name</th>
              <th className="py-3 px-2 font-medium text-center">Failures</th>
              <th className="py-3 px-2 font-medium">Last Occurred</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tasks.length > 0 ? tasks.map((task, idx) => (
              <tr key={idx} className={`hover:bg-gray-50 transition-colors group ${idx < 3 ? 'bg-orange-50/30' : ''}`}>
                <td className="py-3 px-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? 'bg-red-500 text-white' : 
                    idx === 1 ? 'bg-orange-500 text-white' : 
                    idx === 2 ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {idx + 1}
                  </span>
                </td>
                <td className="py-3 px-2 text-sm text-gray-700 font-medium max-w-[200px] truncate" title={task.taskName}>
                  {task.taskName}
                </td>
                <td className="py-3 px-2 text-sm text-center">
                  <span className="font-bold text-red-600">{task.count}</span>
                </td>
                <td className="py-3 px-2 text-xs text-gray-500">
                  {formatRelativeTime(new Date(task.lastOccurred))}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">No task data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopErrorsWidget;
