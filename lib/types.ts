// lib/types.ts

export type TrustState = 'Healthy' | 'Degraded' | 'Critical';

export interface Incident {
  id: string;              // e.g., "INC-1024"
  title: string;           // e.g., "LLM Latency SLO Violation"
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Resolved';
  timestamp: string;       // e.g., "11:32 IST"
  trustImpact: number;     // e.g., 12
  
  // 🆕 DATADOG SPECIFIC FIELDS
  trigger: string;         // e.g., "p95 latency > 2.5s for 5m"
  affectedService: string; // e.g., "Vertex AI Endpoint"
  monitorName: string;     // e.g., "[P1] LLM Latency SLO"
  rootCause: string;       // e.g., "Cold starts during traffic spike"
  actionsTaken: string[];  // e.g., ["On-call notified", "Throttling enabled"]
}