"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTrust } from '@/context/TrustContext';

export default function Navbar() {
  const pathname = usePathname();
  const { trustState } = useTrust();

  const isActive = (path: string) => 
    pathname === path ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-gray-200";

  // Dynamic Status Color
  const statusColor = 
    trustState === 'Healthy' ? 'bg-green-500' : 
    trustState === 'Degraded' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO AREA */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs">AI</div>
            <div className="font-bold text-lg tracking-tight text-white">
              AI TRUST <span className="text-gray-500 font-normal">CONTROL PLANE</span>
            </div>
          </div>
          
          {/* NAVIGATION TABS */}
          <div className="flex gap-8 text-sm font-medium h-16 items-center">
            <Link href="/" className={`h-full flex items-center ${isActive('/')} transition-all`}>
              Overview
            </Link>
            <Link href="/incidents" className={`h-full flex items-center ${isActive('/incidents')} transition-all`}>
              Incidents
            </Link>
            <Link href="/analysis" className={`h-full flex items-center ${isActive('/analysis')} transition-all`}>
              Trust Analysis
            </Link>
          </div>
        </div>

        {/* SYSTEM STATUS INDICATOR */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-800">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">System Status</div>
            <div className={`text-xs font-bold ${
                trustState === 'Healthy' ? 'text-green-500' : 
                trustState === 'Degraded' ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {trustState.toUpperCase()}
            </div>
          </div>
          <span className={`w-3 h-3 rounded-full ${statusColor} animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></span>
        </div>
      </div>
    </nav>
  );
}