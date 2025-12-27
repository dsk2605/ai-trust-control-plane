"use client";
import { useTrust } from '@/context/TrustContext';
import IncidentCard from '@/components/incidents/IncidentCard';

export default function IncidentsPage() {
  const { incidents } = useTrust();

  // 4️⃣ INCIDENT SEGMENTATION
  const activeIncidents = incidents.filter(i => i.status === 'Active');
  const resolvedIncidents = incidents.filter(i => i.status === 'Resolved');

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Incident Management</h1>
        <p className="text-gray-400 text-sm">Review triggers, understand root causes, and resolve trust violations.</p>
      </div>

      {/* ACTIVE INCIDENTS SECTION */}
      <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Active Incidents
            </h2>
            <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800">
                {activeIncidents.length} Issues
            </span>
        </div>
        
        <div className="space-y-4">
            {activeIncidents.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-gray-800 rounded-xl bg-gray-900/30">
                    <p className="text-gray-500 text-sm">No active incidents. System is healthy. 🛡️</p>
                </div>
            ) : (
                activeIncidents.map(incident => <IncidentCard key={incident.id} incident={incident} />)
            )}
        </div>
      </section>

      {/* RESOLVED INCIDENTS SECTION */}
      {resolvedIncidents.length > 0 && (
          <section className="opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Resolved History</h2>
                <span className="text-xs text-gray-600">{resolvedIncidents.length} Resolved</span>
            </div>
            <div className="space-y-4">
                {resolvedIncidents.map(incident => <IncidentCard key={incident.id} incident={incident} />)}
            </div>
          </section>
      )}
    </div>
  );
}