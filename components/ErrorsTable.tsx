
import React, { useState } from 'react';
import { ErrorLog, ErrorType } from '../types';
import { formatDate, getErrorTypeBadgeColor, truncateText } from '../utils/formatters';

interface ErrorsProps {
  errors: ErrorLog[];
}

const ErrorsTable: React.FC<ErrorsProps> = ({ errors }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <i className="fa-solid fa-clock-rotate-left mr-2 text-blue-600"></i>
          Recent Errors
        </h3>
        <div className="flex gap-2">
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>All Types</option>
            {Object.values(ErrorType).map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-6 font-medium">Timestamp</th>
              <th className="py-3 px-6 font-medium">Type</th>
              <th className="py-3 px-6 font-medium">Details</th>
              <th className="py-3 px-6 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {errors.map((err) => (
              <React.Fragment key={err.id}>
                <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedId(expandedId === err.id ? null : err.id)}>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {formatDate(err.receivedDate)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getErrorTypeBadgeColor(err.errorType)}`}>
                      {err.errorType}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <div className="font-medium text-gray-800">{err.taskName || err.logFile || 'System Alert'}</div>
                    <div className="text-gray-400 text-xs">{truncateText(err.subject, 60)}</div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className={`fa-solid fa-chevron-${expandedId === err.id ? 'up' : 'down'} text-gray-300`}></i>
                  </td>
                </tr>
                {expandedId === err.id && (
                  <tr className="bg-blue-50/30">
                    <td colSpan={4} className="py-4 px-6">
                      <div className="text-sm space-y-3">
                        <div>
                          <span className="font-bold text-gray-700 block mb-1">Subject:</span>
                          <p className="text-gray-600 bg-white p-2 border border-blue-100 rounded">{err.subject}</p>
                        </div>
                        {err.taskId && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="font-bold text-gray-700 block mb-1">Task ID:</span>
                              <code className="text-xs bg-gray-100 p-1.5 rounded block">{err.taskId}</code>
                            </div>
                            {err.entity && (
                              <div>
                                <span className="font-bold text-gray-700 block mb-1">Entity:</span>
                                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{err.entity}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {(err.statusCode || err.path) && (
                          <div className="flex gap-4">
                            {err.statusCode && <div><span className="font-bold text-gray-700">Status:</span> <span className="text-red-600 font-mono">{err.statusCode}</span></div>}
                            {err.path && <div><span className="font-bold text-gray-700">Path:</span> <span className="text-gray-600 italic">{err.path}</span></div>}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-gray-700 block mb-1">Body Preview:</span>
                          <pre className="text-xs bg-white p-3 border border-blue-100 rounded max-h-40 overflow-y-auto font-mono text-gray-600 whitespace-pre-wrap">
                            {err.body}
                          </pre>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ErrorsTable;
