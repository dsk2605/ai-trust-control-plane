"use client";
import { useTrust } from '@/context/TrustContext';
import IncidentCard from '@/components/incidents/IncidentCard';

export default function TrustPage() {
  const { trustScore, trustState, incidents, policies } = useTrust();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold text-white">Trust Analysis Engine</h1>
        <p className="text-gray-400 text-sm mt-2">
            Real-time breakdown of scoring logic, penalties, and active risk factors.
        </p>
      </div>

      {/* SCORING BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: Live Score Card */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-4">Live Trust Calculation</h2>
            <div className="flex items-center justify-between mb-8">
                <div className="text-6xl font-black text-white">{Math.round(trustScore)}</div>
                <div className={`px-4 py-1 rounded text-sm font-bold uppercase ${
                    trustState === 'Healthy' ? 'bg-green-500/10 text-green-400' :
                    trustState === 'Degraded' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-red-500/10 text-red-400'
                }`}>
                    {trustState}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Base Score</span>
                    <span className="text-gray-200">100</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Active Incident Penalties</span>
                    <span className="text-red-400 font-mono">
                        -{100 - Math.round(trustScore)}
                    </span>
                </div>
                <div className="border-t border-gray-800 pt-3 flex justify-between text-sm font-bold">
                    <span className="text-white">Net Trust Score</span>
                    <span className={trustState === 'Healthy' ? 'text-green-400' : 'text-white'}>
                        {Math.round(trustScore)}
                    </span>
                </div>
            </div>
        </div>

        {/* RIGHT: Policy State */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-4">Active Guardrails</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black rounded border border-gray-800">
                    <div>
                        <div className="text-sm font-bold text-gray-200">Kill Switch Policy</div>
                        <div className="text-xs text-gray-500">Block traffic when Trust &lt; 60</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${policies.blockLowTrust ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-700'}`}></div>
                </div>

                <div className="flex items-center justify-between p-3 bg-black rounded border border-gray-800">
                    <div>
                        <div className="text-sm font-bold text-gray-200">Identity Verification</div>
                        <div className="text-xs text-gray-500">Require MFA for Admin Actions</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${policies.requireMFA ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-700'}`}></div>
                </div>

                <div className="flex items-center justify-between p-3 bg-black rounded border border-gray-800">
                    <div>
                        <div className="text-sm font-bold text-gray-200">Datadog Sync</div>
                        <div className="text-xs text-gray-500">Real-time log replication</div>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                </div>
            </div>
        </div>
      </div>

      {/* RECENT INCIDENTS LIST */}
      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">Recent Trust Events</h2>
        {incidents.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl text-gray-500">
                No active incidents affecting trust score.
            </div>
        ) : (
            <div className="space-y-4">
                {incidents.map((incident) => (
                    <IncidentCard key={incident.id} incident={incident} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}