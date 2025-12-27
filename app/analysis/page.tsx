"use client";
import { useTrust } from '@/context/TrustContext';
import TrustTrendChart from '@/components/analysis/TrustTrendChart';

export default function AnalysisPage() {
  const { trustScore, incidents } = useTrust();
  
  // Logic: Map Incidents to Dimensions
  // If an active incident mentions "Latency", degrade Latency dimension.
  const isLatencyIssue = incidents.some(i => i.status === 'Active' && i.title.toLowerCase().includes('latency'));
  const isErrorIssue = incidents.some(i => i.status === 'Active' && (i.title.toLowerCase().includes('rate limit') || i.title.toLowerCase().includes('error')));
  
  const dimensions = [
      {
          name: "Latency Reliability",
          signal: "Datadog p95 Metric",
          status: isLatencyIssue ? "Degraded" : "Healthy",
          desc: isLatencyIssue ? "p95 latency exceeding SLO of 2.5s." : "Response times within 2.5s SLO.",
          weight: "40%"
      },
      {
          name: "Error Resilience",
          signal: "Datadog Error Rate",
          status: isErrorIssue ? "Critical" : "Healthy",
          desc: isErrorIssue ? "High volume of 429/500 errors detected." : "Error rate < 0.1%.",
          weight: "30%"
      },
      {
          name: "Cost Stability",
          signal: "Token Usage Monitor",
          status: "Healthy",
          desc: "Token consumption within hourly budget.",
          weight: "15%"
      },
      {
          name: "Availability",
          signal: "Uptime Monitor",
          status: "Healthy",
          desc: "Endpoint reachable (100% uptime).",
          weight: "15%"
      }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="border-b border-gray-800 pb-6 flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Trust Analysis</h1>
            <p className="text-gray-400 text-sm">Deep dive into Datadog signals and trust score composition.</p>
        </div>
        <div className="text-right">
             <div className="text-xs text-gray-500 uppercase">Computed Score</div>
             <div className="text-3xl font-mono font-bold text-white">{Math.round(trustScore)}/100</div>
        </div>
      </div>

      {/* 2️⃣ TRUST TREND */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            Historical Trend (Datadog Metric)
            <span className="bg-gray-800 text-gray-400 px-1.5 rounded text-[10px]">ai.trust.score</span>
        </h3>
        <TrustTrendChart />
      </div>

      {/* 1️⃣ TRUST DIMENSION BREAKDOWN */}
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Signal Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {dimensions.map((dim, i) => (
             <div key={i} className={`p-5 rounded-lg border ${
                 dim.status === 'Healthy' ? 'bg-gray-900/30 border-gray-800' : 
                 dim.status === 'Degraded' ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-red-500/5 border-red-500/20'
             }`}>
                <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-200">{dim.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        dim.status === 'Healthy' ? 'text-green-400 bg-green-500/10' : 
                        dim.status === 'Degraded' ? 'text-yellow-400 bg-yellow-500/10' : 'text-red-400 bg-red-500/10'
                    }`}>{dim.status}</span>
                </div>
                <div className="text-xs text-gray-500 font-mono mb-2">Signal: {dim.signal}</div>
                <p className="text-sm text-gray-400">{dim.desc}</p>
             </div>
         ))}
      </div>
    </div>
  );
}