'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, AlertTriangle, Activity, Settings, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have this, otherwise remove cn() and use template strings

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/incidents', label: 'Incidents', icon: AlertTriangle },
    { href: '/analysis', label: 'Trust Analysis', icon: Activity },
  ];

  return (
    <aside className="w-64 border-r border-neutral-800 flex flex-col bg-neutral-950 fixed h-full z-50">
      
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck size={24} />
          <span className="font-bold text-lg tracking-tight text-white">TrustControl</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent"
              )}
            >
              <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-neutral-500 group-hover:text-white'} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-neutral-800">
        <button className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors w-full px-2 py-2">
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
}