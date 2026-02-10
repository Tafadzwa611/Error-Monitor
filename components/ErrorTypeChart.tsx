
import React from 'react';
// Fixed: Use XAxis and YAxis instead of X-axis and Y-axis in imports
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TypeProps {
  data: Array<{ type: string; count: number }>;
}

const COLORS = {
  "Celery Task Failure": "#ef4444",
  "Loan Balances Check": "#f97316",
  "Installments Check": "#eab308",
  "System Error": "#a855f7",
  "Default": "#94a3b8"
};

const ErrorTypeChart: React.FC<TypeProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Errors by Type</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
            {/* Fixed: Use XAxis component */}
            <XAxis type="number" hide />
            {/* Fixed: Use YAxis component */}
            <YAxis 
              dataKey="type" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#4b5563', fontSize: 11}}
              width={150}
            />
            <Tooltip 
              cursor={{fill: '#f9fafb'}}
              contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.type as keyof typeof COLORS] || COLORS.Default} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ErrorTypeChart;
