"use client";
import Link from 'next/link';
import { useTrust } from '@/context/TrustContext';

export default function AuditPage() {
  const { auditLogs } = useTrust();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Immutable Audit Ledger</h1>
          <p className="text-gray-400 text-xs mt-1">
             Compliance: <span className="text-green-400">SOC2 Type II</span> • 
             Integrity: <span className="text-green-400">SHA-256 Signed</span>
          </p>
        </div>
        <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded uppercase">
          ← Return to Control Plane
        </Link>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-black/40 text-xs uppercase font-bold text-gray-500 border-b border-gray-800">
            <tr>
              <th className="p-4">Time</th>
              <th className="p-4">Actor (Identity)</th>
              <th className="p-4">Action</th>
              <th className="p-4">Technical Details</th>
              <th className="p-4">Cryptographic Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {auditLogs.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center italic opacity-30">Waiting for system activity...</td></tr>
            ) : (
                auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-4 font-mono text-gray-500">{log.timestamp}</td>
                        <td className="p-4 text-blue-400 group-hover:text-blue-300 transition-colors">
                            {log.actor}
                        </td>
                        <td className="p-4 font-bold text-gray-200">
                            <span className={`inline-block px-2 py-1 rounded text-[10px] uppercase tracking-wider ${
                                log.action.includes('Resolved') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                log.action.includes('Policy') ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                'bg-gray-800 text-gray-400'
                            }`}>
                                {log.action}
                            </span>
                        </td>
                        <td className="p-4 text-xs font-mono">{log.details}</td>
                        <td className="p-4 font-mono text-[10px] text-green-600 truncate max-w-[150px]" title={log.hash}>
                            🔒 {log.hash}
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}