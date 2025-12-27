"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Incident, TrustState } from '@/lib/types';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  hash: string;
}

interface SecurityPolicy {
  blockLowTrust: boolean;
  requireMFA: boolean;
}

interface TrustContextType {
  trustScore: number;
  trustState: TrustState;
  incidents: Incident[];
  auditLogs: AuditLog[];
  policies: SecurityPolicy;
  selectedModel: string;
  trustForecast: 'Stable' | 'Degrading' | 'Improving';
  
  addIncident: (incident: Incident) => void;
  resolveIncident: (id: string) => void;
  resetSystem: () => void;
  userRole: 'SRE' | 'Auditor';
  setUserRole: (role: 'SRE' | 'Auditor') => void;
  togglePolicy: (key: keyof SecurityPolicy) => void;
  setModel: (model: string) => void;
}

const TrustContext = createContext<TrustContextType | undefined>(undefined);

export function TrustProvider({ children }: { children: ReactNode }) {
  // 1️⃣ INITIALIZE STATE (Default Empty)
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [userRole, setUserRole] = useState<'SRE' | 'Auditor'>('SRE');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [policies, setPolicies] = useState<SecurityPolicy>({ blockLowTrust: false, requireMFA: true });
  const [selectedModel, setSelectedModel] = useState<string>('Gemini Pro 1.5');
  const [isLoaded, setIsLoaded] = useState(false); // New flag to prevent hydration mismatch

  // 2️⃣ LOAD FROM "DATABASE" (LocalStorage) ON STARTUP
  useEffect(() => {
    const loadData = () => {
      try {
        const savedIncidents = localStorage.getItem('trust_incidents');
        const savedLogs = localStorage.getItem('trust_audit_logs');
        const savedPolicies = localStorage.getItem('trust_policies');
        
        if (savedIncidents) setIncidents(JSON.parse(savedIncidents));
        if (savedLogs) setAuditLogs(JSON.parse(savedLogs));
        if (savedPolicies) setPolicies(JSON.parse(savedPolicies));
      } catch (e) {
        console.error("Failed to load persistence data", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // 3️⃣ SAVE TO "DATABASE" WHENEVER DATA CHANGES
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('trust_incidents', JSON.stringify(incidents));
      localStorage.setItem('trust_audit_logs', JSON.stringify(auditLogs));
      localStorage.setItem('trust_policies', JSON.stringify(policies));
    }
  }, [incidents, auditLogs, policies, isLoaded]);


  // --- CORE LOGIC (Same as before) ---
  const activeIncidents = incidents.filter(i => i.status === 'Active');
  const totalPenalty = activeIncidents.reduce((sum, inc) => sum + inc.trustImpact, 0);
  const trustScore = Math.max(0, 100 - totalPenalty);

  let trustState: TrustState = 'Healthy';
  if (trustScore < 60) trustState = 'Critical';
  else if (trustScore < 85) trustState = 'Degraded';

  const trustForecast = activeIncidents.length > 0 ? 'Degrading' : 'Stable';

  const logAction = async (action: string, details: string) => {
    const timestamp = new Date().toISOString();
    const actor = userRole === 'SRE' ? 'engineer@google.com' : 'auditor@external.com';
    
    const dataString = `${timestamp}|${action}|${actor}|${details}`;
    const msgBuffer = new TextEncoder().encode(dataString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const newLog: AuditLog = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
      timestamp: new Date().toLocaleTimeString(),
      action,
      actor,
      details,
      hash: hashHex.substring(0, 24) + '...'
    };
    
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addIncident = (incident: Incident) => {
    setIncidents(prev => [incident, ...prev]);
    logAction("Incident Detected", `ID: ${incident.id} | Trigger: ${incident.trigger}`);
  };

  const resolveIncident = (id: string) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'Resolved' } : i));
    logAction("Incident Resolved", `ID: ${id} resolved by SRE.`);
  };

  const togglePolicy = (key: keyof SecurityPolicy) => {
    setPolicies(prev => {
        const newState = { ...prev, [key]: !prev[key] };
        logAction("Policy Change", `Updated ${key} to ${newState[key]}`);
        return newState;
    });
  };

  // 4️⃣ RESET FUNCTION (Wipes Database)
  const resetSystem = () => {
    if (confirm("⚠️ ARE YOU SURE?\n\nThis will wipe the entire Audit Ledger and Reset the Trust State to 100%.")) {
        setIncidents([]);
        setAuditLogs([]);
        localStorage.removeItem('trust_incidents');
        localStorage.removeItem('trust_audit_logs');
        localStorage.removeItem('trust_policies');
        logAction("System Reset", "Demo state cleared.");
    }
  };

  return (
    <TrustContext.Provider value={{ 
        trustScore, trustState, incidents, addIncident, resolveIncident, resetSystem,
        userRole, setUserRole,
        auditLogs, policies, togglePolicy, 
        selectedModel, setModel: setSelectedModel, trustForecast
    }}>
      {children}
    </TrustContext.Provider>
  );
}

export const useTrust = () => {
  const context = useContext(TrustContext);
  if (context === undefined) throw new Error('useTrust must be used within a TrustProvider');
  return context;
};