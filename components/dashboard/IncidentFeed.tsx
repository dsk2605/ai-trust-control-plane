"use client";
import { useTrust } from '@/context/TrustContext';
import { Incident } from '@/lib/types';

export default function IncidentFeed() {
  const { incidents } = useTrust();
  const activeIncidents = incidents.filter(i => i.status === 'Active');

  if (activeIncidents.length === 0) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-gray-300 font-bold mb-1">All Systems Normal</h3>
        <p className="text-gray-500 text-sm">No active trust incidents detected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeIncidents.map((incident) => (
        <div key={incident.id} className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex gap-4 items-start group hover:border-gray-700 transition-all">
            
            {/* Status Icon - FIXED TYPES */}
            <div className={`mt-1 p-1.5 rounded-full ${
                incident.severity === 'Critical' ? 'bg-red-500/10 text-red-500' :
                incident.severity === 'Medium'   ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-blue-500/10 text-blue-500'
            }`}>
                <div className={`w-2 h-2 rounded-full bg-current animate-pulse`} />
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-gray-200 group-hover:text-blue-400 transition-colors">
                        {incident.title}
                    </h4>
                    <span className="text-[10px] font-mono text-gray-600">{incident.timestamp}</span>
                </div>
                
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {incident.trigger}
                </p>

                <div className="flex items-center gap-2 mt-3">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                         incident.severity === 'Critical' ? 'bg-red-950/30 text-red-500 border border-red-500/20' :
                         incident.severity === 'Medium'   ? 'bg-yellow-950/30 text-yellow-500 border border-yellow-500/20' :
                         'bg-blue-950/30 text-blue-500 border border-blue-500/20'
                    }`}>
                        {incident.severity}
                    </span>
                    <span className="text-[10px] text-gray-600 border border-gray-800 px-1.5 py-0.5 rounded bg-black">
                        {incident.affectedService}
                    </span>
                </div>
            </div>
        </div>
      ))}
    </div>
  );
}