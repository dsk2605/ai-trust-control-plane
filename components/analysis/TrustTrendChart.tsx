"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '10:00', score: 100 },
  { time: '10:05', score: 100 },
  { time: '10:10', score: 98 },
  { time: '10:15', score: 100 },
  { time: '10:20', score: 85 },
  { time: '10:25', score: 70 },
  { time: '10:30', score: 65 },
  { time: '10:35', score: 85 },
  { time: '10:40', score: 100 },
];

export default function TrustTrendChart() {
  return (
    <div className="w-full h-[300px] bg-gray-900/50 border border-gray-800 rounded-xl p-4">
      <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Trust Score Trend (1H)</h3>
      
      {/* 🛠️ FIX: The div above creates a fixed height context for this container */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', borderColor: '#374151', fontSize: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#3B82F6" 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 4, fill: '#60A5FA' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}