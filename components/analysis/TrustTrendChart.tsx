"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTrust } from '@/context/TrustContext';
import { useEffect, useState } from 'react';

export default function TrustTrendChart() {
  const { trustScore } = useTrust();
  const [data, setData] = useState<any[]>([]);

  // 🧪 GENERATE MOCK HISTORY (So the chart isn't empty)
  useEffect(() => {
    const now = new Date();
    const mockHistory = [];
    
    // Generate 24 data points (1 per hour)
    for (let i = 24; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        // Randomize score slightly around 90-100 to look realistic
        let baseScore = 95 + Math.random() * 5 - 2;
        
        // If it's the "Current" point (last one), use real Trust Score
        if (i === 0) baseScore = trustScore;

        mockHistory.push({
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            score: Math.min(100, Math.max(0, Math.floor(baseScore)))
        });
    }
    setData(mockHistory);
  }, [trustScore]);

  return (
    <div className="h-[300px] w-full bg-gray-900/50 border border-gray-800 rounded-lg p-4 relative">
        {/* BACKGROUND GRID EFFECT */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>

        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                    dataKey="time" 
                    stroke="#666" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                />
                <YAxis 
                    domain={[0, 100]} 
                    stroke="#666" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                    itemStyle={{ color: '#3b82f6' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    animationDuration={2000}
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
  );
}