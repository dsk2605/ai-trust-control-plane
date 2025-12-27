"use client";
import { useTrust } from '@/context/TrustContext';

export default function TrustHero() {
  const { trustScore, trustState } = useTrust();

  // Dynamic Colors based on State
  const getColor = () => {
    if (trustState === 'Healthy') return 'text-green-400 border-green-500/20';
    if (trustState === 'Degraded') return 'text-yellow-400 border-yellow-500/20';
    return 'text-red-500 border-red-500/20';
  };

  return (
    <div className={`relative p-10 rounded-2xl bg-gray-900/50 border ${getColor().split(' ')[1]} text-center transition-all duration-500`}>
      <div className="absolute top-4 right-4 text-xs font-mono text-gray-500">LIVE MONITORING</div>
      
      <div className={`text-9xl font-black tracking-tighter ${getColor().split(' ')[0]} transition-all duration-700`}>
        {Math.round(trustScore)}
      </div>
      
      <div className="text-xl font-medium tracking-widest uppercase text-gray-400 mt-2">
        System Status: <span className={getColor().split(' ')[0]}>{trustState}</span>
      </div>

      <p className="text-gray-500 text-sm mt-6 max-w-md mx-auto">
        {trustState === 'Healthy' ? 'All systems operating within normal governance parameters.' : 
         trustState === 'Degraded' ? 'Performance degradation detected. Investigation recommended.' : 
         'CRITICAL FAILURE. Immediate engineering intervention required.'}
      </p>
    </div>
  );
}