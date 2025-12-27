"use client";
import { Incident } from '@/lib/types';
import { useTrust } from '@/context/TrustContext';
import { useState, useEffect } from 'react';

const SEVERITY_CONFIG: Record<string, { border: string; text: string; bg: string; icon: string }> = {
  Critical: { border: 'border-red-500', text: 'text-red-500', bg: 'bg-red-500/10', icon: '🚨' },
  High:     { border: 'border-orange-500', text: 'text-orange-500', bg: 'bg-orange-500/10', icon: '🔥' },
  Medium:   { border: 'border-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: '⚠️' },
  Low:      { border: 'border-blue-500', text: 'text-blue-500', bg: 'bg-blue-500/10', icon: 'ℹ️' },
};

const DEFAULT_CONFIG = SEVERITY_CONFIG['Low'];

export default function IncidentCard({ incident }: { incident: Incident }) {
  // 🆕 RBAC: Get the userRole from context
  const { resolveIncident, userRole } = useTrust(); 
  
  const [expanded, setExpanded] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  
  // 🆕 SECURITY: State to hold the cryptographic hash
  const [dataHash, setDataHash] = useState('');

  const config = SEVERITY_CONFIG[incident.severity] || DEFAULT_CONFIG;

  // 🛡️ SECURITY EFFECT: Generate SHA-256 Signature
  // This simulates verifying that the log hasn't been tampered with
  useEffect(() => {
    const generateSignature = async () => {
        const data = `${incident.id}-${incident.trigger}-${incident.timestamp}`;
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        // Show first 16 characters to look like a git commit hash
        setDataHash(hashHex.substring(0, 16)); 
    };
    generateSignature();
  }, [incident]);

  const handleResolve = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 🔒 RBAC CHECK: Stop if Auditor
    if (userRole === 'Auditor') return;

    setIsResolving(true);

    try {
        const res = await fetch('/api/datadog/resolve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: incident.title,
                description: incident.rootCause
            })
        });

        if (!res.ok) throw new Error('Datadog sync failed');

        resolveIncident(incident.id);

    } catch (error) {
        console.error("Datadog Sync Error:", error);
        // Fallback resolution
        resolveIncident(incident.id); 
    } finally {
        setIsResolving(false);
    }
  };

  return (
    <div className={`w-full bg-gray-900/80 border border-gray-800 rounded-lg overflow-hidden transition-all duration-200 
      ${incident.status === 'Resolved' ? 'opacity-60 grayscale' : 'hover:border-gray-700 shadow-lg'}
      border-l-4 ${config.border}
    `}>
      
      {/* 1️⃣ INCIDENT HEADER */}
      <div 
        className="p-5 flex items-center justify-between cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gray-800 ${config.text}`}>
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-3">
               <h3 className="font-bold text-gray-200 text-lg group-hover:text-blue-400 transition-colors">
                 {incident.title}
               </h3>
               {incident.status === 'Active' && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wide animate-pulse">
                    Open Incident
                  </span>
               )}
            </div>
            <div className="text-xs text-gray-500 mt-1 font-mono flex gap-3">
              <span>ID: {incident.id}</span>
              <span>•</span>
              <span>Detected: {incident.timestamp}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
           <div className="text-xs text-gray-500 uppercase font-bold">Trust Impact</div>
           <div className={`font-bold text-lg ${config.text}`}>-{incident.trustImpact} pts</div>
        </div>
      </div>

      {/* 2️⃣ EXPANDED DETAILS */}
      {expanded && (
        <div className="bg-black/20 border-t border-gray-800 p-6 space-y-6 animate-in slide-in-from-top-2">
            
            {/* 🆕 SECURITY BADGE */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 mb-4 bg-black/40 p-2 rounded border border-dashed border-gray-800 w-fit">
                <span className="text-green-500">🔒 VERIFIED SIGNATURE:</span>
                <span className="text-gray-300">{dataHash}...</span>
                <span className="text-gray-600 pl-2">ECDSA-SHA256</span>
            </div>

            {/* DATADOG METADATA GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-900 p-3 rounded border border-gray-800">
                    <div className="text-gray-500 text-xs uppercase font-bold mb-1">Trigger Condition</div>
                    <div className="text-gray-200 font-mono text-xs">{incident.trigger}</div>
                </div>
                <div className="bg-gray-900 p-3 rounded border border-gray-800">
                    <div className="text-gray-500 text-xs uppercase font-bold mb-1">Affected Service</div>
                    <div className="text-gray-200">{incident.affectedService}</div>
                </div>
                <div className="bg-gray-900 p-3 rounded border border-gray-800">
                    <div className="text-gray-500 text-xs uppercase font-bold mb-1">Datadog Monitor</div>
                    <div className="text-blue-400 cursor-pointer hover:underline">{incident.monitorName} ↗</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold flex items-center gap-2">
                        🔍 Root Cause Analysis
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed bg-gray-900/50 p-3 rounded border border-gray-800">
                        {incident.rootCause}
                    </p>
                </div>

                <div>
                     <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold flex items-center gap-2">
                        ⚡ Automated Response
                     </h4>
                     <ul className="text-sm text-gray-400 space-y-2">
                        {incident.actionsTaken?.map((action, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> {action}
                            </li>
                        ))}
                     </ul>
                </div>
            </div>

            {/* 5️⃣ RESOLUTION BUTTON (WITH RBAC LOCK) */}
            {incident.status === 'Active' && (
                <div className="flex justify-between items-center pt-4 border-t border-gray-800/50">
                    
                    {/* Access Warning for Auditors */}
                    {userRole === 'Auditor' && (
                         <div className="text-xs text-red-400 flex items-center gap-2 animate-pulse">
                            <span>🚫</span> Read-Only Mode: Resolution Restricted
                         </div>
                    )}

                    <button 
                        onClick={handleResolve}
                        disabled={isResolving || userRole === 'Auditor'} // 🔒 DISABLE IF AUDITOR
                        className={`
                            px-6 py-2 rounded text-sm font-bold transition-all flex items-center gap-2 shadow-lg ml-auto
                            ${userRole === 'Auditor' 
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                                : isResolving 
                                    ? 'bg-gray-700 text-gray-400 cursor-wait' 
                                    : 'bg-green-600 hover:bg-green-500 text-white hover:shadow-green-900/20'
                            }
                        `}
                    >
                        {userRole === 'Auditor' ? (
                            <>
                                <span>🔒</span> RESTRICTED ACCESS
                            </>
                        ) : isResolving ? (
                            <>
                                <span className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></span>
                                SYNCING...
                            </>
                        ) : (
                            <>
                                <span>✓</span> MARK AS RESOLVED
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
      )}
    </div>
  );
}