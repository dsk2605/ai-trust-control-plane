'use client';

import { ArrowUpRight, ArrowDownRight, Zap, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Ensure you have this utility or remove if using standard tailwind classes

interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color: 'emerald' | 'rose' | 'amber' | 'blue';
}

function MetricCard({ label, value, trend, trendDirection, icon: Icon, color }: MetricCardProps) {
  const isPositive = trendDirection === 'up'; // Context dependent (e.g. latency up is bad)
  
  // Color mapping for dynamic styling
  const colorStyles = {
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  };

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:bg-neutral-900 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg", colorStyles[color])}>
          <Icon size={20} />
        </div>
        {trend && (
            <div className={cn("flex items-center text-xs font-medium px-2 py-1 rounded-full bg-neutral-800", 
                trendDirection === 'up' ? "text-rose-400" : "text-emerald-400" // Assuming 'up' is bad for these metrics
            )}>
                {trendDirection === 'up' ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
                {trend}
            </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-neutral-500 text-sm font-medium uppercase tracking-wider">{label}</h3>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}

export function MetricGrid() {
  // In a real app, these props would come from your data source
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <MetricCard 
        label="Avg Latency (P99)" 
        value="842ms" 
        trend="+12%" 
        trendDirection="up" 
        icon={Clock} 
        color="amber"
      />
      <MetricCard 
        label="Error Rate" 
        value="0.4%" 
        trend="-0.1%" 
        trendDirection="down" 
        icon={AlertCircle} 
        color="emerald"
      />
      <MetricCard 
        label="Token Spend (1h)" 
        value="$42.50" 
        trend="+5%" 
        trendDirection="up" 
        icon={DollarSign} 
        color="blue"
      />
      <MetricCard 
        label="RPS (Requests)" 
        value="1,240" 
        trend="Stable" 
        trendDirection="neutral" 
        icon={Zap} 
        color="emerald"
      />
    </div>
  );
}