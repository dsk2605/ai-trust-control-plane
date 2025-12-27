"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTrust } from '@/context/TrustContext';

export default function OverviewPage() {
  const { 
      trustScore, trustState, incidents, addIncident, resetSystem, 
      userRole, setUserRole, 
      policies, togglePolicy, selectedModel, setModel, trustForecast 
  } = useTrust();
  
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  // 🧠 INSTANT MEMORY
  const currentScoreRef = useRef(trustScore);

  useEffect(() => {
    currentScoreRef.current = trustScore;
  }, [trustScore]);

  // 🔐 REAL SECURITY CHECK
  const handleRoleSwitch = (targetRole: 'SRE' | 'Auditor') => {
    if (targetRole === 'SRE') {
        const pin = window.prompt("🔐 SECURITY CHECK\n\nEnter SRE Admin PIN to elevate privileges:");
        if (pin === "1234") {
            setUserRole('SRE');
            alert("✅ Identity Verified: Privileges Elevated to ADMIN.");
        } else {
            alert("🚫 ACCESS DENIED: Invalid Credentials.");
        }
    } else {
        setUserRole('Auditor');
    }
  };

  // 🧪 REAL-TIME LOGIC ENGINE
  const handleTestInference = async () => {
    
    // 🛡️ GUARDRAIL LOGIC
    if (policies.blockLowTrust && trustScore < 60) {
        alert(`⛔ TRAFFIC BLOCKED BY POLICY ENGINE\n\nReason: Trust Score (${Math.round(trustScore)}) is below Critical Threshold (60).\nAction: Request dropped to prevent cascading failure.`);
        return; 
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt || "Simulation Test" })
      });
      const data = await res.json();
      
      // 🔴 CASE 1: RATE LIMIT
      if (res.status === 429) {
        // 📉 TUNED FOR DEMO: Set to 30
        const penalty = 30; 
        
        let newScore = Math.max(0, currentScoreRef.current - penalty);
        currentScoreRef.current = newScore; 

        addIncident({
            id: `INC-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            title: 'Rate Limit Exceeded',
            severity: 'Critical',
            status: 'Active',
            timestamp: new Date().toLocaleTimeString(),
            trustImpact: penalty,
            trigger: `API Quota > 100% for ${selectedModel}`,
            affectedService: selectedModel,
            monitorName: '[Critical] API Rate Limit',
            rootCause: `Hard quota reached on ${selectedModel} API key.`,
            actionsTaken: ['Autoscaler maxed out', 'On-call engineer Paged']
        });

        await fetch('/api/datadog/sync', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                score: newScore,
                status: newScore < 60 ? 'Critical' : 'Degraded',
                incidentDetails: {
                    trigger: `API Quota > 100% for ${selectedModel}`,
                    rootCause: `Hard quota reached on ${selectedModel} API key.`,
                    service: selectedModel
                }
            }) 
        });

      } 
      // 🟡 CASE 2: LATENCY
      else if (data.latency && data.latency > 8000) { 
        // 📉 TUNED FOR DEMO: Set to 20
        const penalty = 20;

        let newScore = Math.max(0, currentScoreRef.current - penalty);
        currentScoreRef.current = newScore; 

        addIncident({
            id: `INC-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            title: 'Latency SLO Violation',
            severity: 'Medium',
            status: 'Active',
            timestamp: new Date().toLocaleTimeString(),
            trustImpact: penalty,
            trigger: `p95 Latency > 8s (Actual: ${data.latency}ms)`,
            affectedService: selectedModel,
            monitorName: '[Warn] LLM Response Time',
            rootCause: 'Model cold start or high complexity prompt.',
            actionsTaken: ['Logged to Datadog Traces', 'Flagged for review']
        });

        await fetch('/api/datadog/sync', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                score: newScore, 
                status: newScore < 60 ? 'Critical' : 'Degraded',
                 incidentDetails: {
                    trigger: `p95 Latency > 8s (Actual: ${data.latency}ms)`,
                    rootCause: 'Model cold start or high complexity prompt.',
                    service: selectedModel
                }
            }) 
        });
      }
    } catch (e) { console.error("Error", e); } 
    finally { setLoading(false); }
  };

  const activeIncidents = incidents.filter(i => i.status === 'Active');
  
  // 🎨 HELPER: Get Dynamic Color based on state
  const getStatusColor = () => {
    if (trustState === 'Healthy') return 'text-green-500';
    if (trustState === 'Degraded') return 'text-yellow-500';
    return 'text-red-500';
  };

  // 🎨 HELPER: Get Severity Label & Color based on Trust State (Visual Consistency)
  const getSeverityDisplay = () => {
    if (trustState === 'Critical') return { text: 'CRITICAL', color: 'text-red-500' };
    if (trustState === 'Degraded') return { text: 'HIGH', color: 'text-yellow-500' };
    return { text: 'NONE', color: 'text-green-500' };
  };

  const severityDisplay = getSeverityDisplay();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-white">AI Trust Control Plane</h1>
            <p className="text-gray-400 text-xs mt-1 font-mono flex items-center gap-2">
                <span>Env: <span className="text-green-400">Prod (US-East)</span></span>
                <span className="text-gray-700">|</span>
                <span>Audit: <span className="text-green-400">Active (SHA-256)</span></span>
            </p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-900 p-2 rounded-lg border border-gray-800">
            <div className="text-right hidden sm:block">
                <div className="text-xs text-gray-500 font-bold uppercase">Active Identity</div>
                <div className="text-sm text-gray-200 font-mono">
                    {userRole === 'SRE' ? 'engineer@google.com' : 'auditor@external.com'}
                </div>
            </div>
            <div className="flex gap-1 bg-black rounded p-1">
                <button onClick={() => handleRoleSwitch('SRE')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${userRole === 'SRE' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>SRE</button>
                <button onClick={() => handleRoleSwitch('Auditor')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${userRole === 'Auditor' ? 'bg-purple-600 text-white' : 'text-gray-500'}`}>Auditor</button>
            </div>
        </div>
      </div>

      {/* OPERATIONS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 flex flex-col justify-center">
             <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">AI Trust Forecast (1h)</div>
             <div className={`text-lg font-bold flex items-center gap-2 ${trustForecast === 'Stable' ? 'text-green-400' : 'text-yellow-500'}`}>
                {trustForecast === 'Stable' ? '↗ Stable' : '↘ Degrading'}
             </div>
         </div>

         <div className={`p-4 rounded-lg border transition-all flex justify-between items-center ${policies.blockLowTrust ? 'bg-red-900/10 border-red-500/30' : 'bg-gray-900/50 border-gray-800'}`}>
             <div>
                <div className={`text-[10px] uppercase font-bold ${policies.blockLowTrust ? 'text-red-400' : 'text-gray-500'}`}>Policy: Kill Switch</div>
                <div className="text-[10px] text-gray-400">Block traffic if Trust &lt; 60</div>
             </div>
             <div onClick={() => togglePolicy('blockLowTrust')} className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${policies.blockLowTrust ? 'bg-red-600' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${policies.blockLowTrust ? 'left-6' : 'left-1'}`}></div>
             </div>
         </div>

         <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 col-span-2">
             <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Target Inference Model</div>
             <div className="flex gap-2">
                {['Gemini Pro 1.5', 'GPT-4 Turbo', 'Claude 3 Opus'].map(m => (
                    <button 
                        key={m}
                        onClick={() => setModel(m)}
                        className={`flex-1 py-1.5 rounded text-xs font-bold border transition-all ${selectedModel === m ? 'bg-blue-600 text-white border-blue-500' : 'bg-black text-gray-500 border-gray-700 hover:border-gray-500'}`}
                    >
                        {m}
                    </button>
                ))}
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TRUST SCORE */}
        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-black">{Math.round(trustScore)}</div>
             <div className="relative z-10">
                <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Current Trust Score</h2>
                <div className="flex items-baseline gap-4">
                    {/* 🎨 Uses getStatusColor() to correctly show Yellow */}
                    <span className={`text-8xl font-black tracking-tighter ${getStatusColor()}`}>
                        {Math.round(trustScore)}
                    </span>
                    <span className="text-2xl text-gray-600 font-medium">/ 100</span>
                </div>
                <div className="mt-6 flex items-center gap-3">
                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${trustState === 'Healthy' ? 'bg-green-500/10 text-green-400' : trustState === 'Degraded' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-400'}`}>
                        {trustState}
                    </span>
                </div>
            </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="space-y-3">
             <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                <div className="text-gray-400 text-xs uppercase font-bold mb-1">Highest Severity</div>
                {/* 🎨 FIXED: Now syncs perfectly with Trust State (Green/Yellow/Red) */}
                <div className={`text-lg font-bold ${severityDisplay.color}`}>
                    {severityDisplay.text}
                </div>
            </div>
            
            <Link href="/audit" className="group block w-full text-center py-4 bg-black border border-gray-800 hover:border-blue-500 text-gray-400 hover:text-blue-400 rounded-xl text-xs font-bold uppercase transition-all">
                <span className="block mb-1 text-xl">📜</span>
                View Immutable Audit Logs
            </Link>

            <button onClick={resetSystem} className="w-full py-2 text-xs text-gray-600 hover:text-white border border-transparent hover:border-gray-800 rounded">
                Reset System ↺
            </button>
        </div>
      </div>
      
      {/* SIMULATION CONTROL */}
      <div className="p-6 bg-black/30 border border-dashed border-gray-800 rounded-xl relative overflow-hidden">
            {policies.blockLowTrust && trustState === 'Critical' && (
                <div className="absolute inset-0 bg-red-950/90 z-20 flex items-center justify-center flex-col text-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="text-4xl mb-2">🛡️</div>
                    <h3 className="text-white font-bold text-lg tracking-wider">GUARDRAIL ACTIVE</h3>
                    <p className="text-red-200 text-sm mt-1">Policy Enforcement: Traffic Blocked due to Critical Trust.</p>
                </div>
            )}
            
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 text-xs uppercase font-bold">Inference Pipeline</h3>
                <span className="text-[10px] text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-500/30 font-mono">
                    Target: {selectedModel}
                </span>
            </div>
            <div className="flex gap-4">
                <input 
                    className="bg-black border border-gray-700 rounded px-4 py-2 text-sm w-full text-white focus:outline-none focus:border-blue-500"
                    placeholder={`Enter prompt for ${selectedModel}...`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button 
                    onClick={handleTestInference}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded font-bold text-sm whitespace-nowrap transition-all"
                >
                    {loading ? 'Processing...' : 'RUN INFERENCE'}
                </button>
            </div>
      </div>
    </div>
  );
}