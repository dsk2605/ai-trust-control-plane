'use client';

import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useTrust } from '@/context/TrustContext'; // <--- Connected to global state

export function IncidentFeed() {
  const { incidents } = useTrust(); // <--- Fetching live data

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col h-full max-h-[600px]">
      
      {/* Header */}
      <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-500" />
          Live Incidents
        </h3>
        <span className="text-xs font-mono text-neutral-500 bg-neutral-800 px-2 py-1 rounded">
            {incidents.length} EVENTS
        </span>
      </div>

      {/* Live List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {incidents.map((incident) => (
          <div 
            key={incident.id} 
            className="flex items-start gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-950/50 hover:bg-neutral-900 transition-all group"
          >
            {/* Status Icon */}
            <div className={`mt-1 p-1.5 rounded-full ${
                incident.severity === 'critical' ? 'bg-rose-500/10 text-rose-500' : 
                incident.severity === 'high' ? 'bg-amber-500/10 text-amber-500' : 
                'bg-blue-500/10 text-blue-500'
            }`}>
                {incident.status === 'active' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium text-neutral-200 group-hover:text-white truncate pr-4">
                        {incident.title}
                    </h4>
                    <span className="text-xs font-mono text-neutral-500 whitespace-nowrap flex items-center gap-1">
                        <Clock size={12} />
                        {incident.timestamp}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                        incident.severity === 'critical' ? 'border-rose-500/30 text-rose-400 bg-rose-500/5' :
                        incident.severity === 'high' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' :
                        'border-blue-500/30 text-blue-400 bg-blue-500/5'
                    }`}>
                        {incident.severity}
                    </span>
                </div>
            </div>
          </div>
        ))}

        {/* Empty State (Optional polish) */}
        {incidents.length === 0 && (
            <div className="text-center py-12 text-neutral-500 text-sm">
                No active incidents detected.
            </div>
        )}
      </div>
    </div>
  );
}