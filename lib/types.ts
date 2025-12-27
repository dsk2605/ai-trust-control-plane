export type TrustState = 'Healthy' | 'Degraded' | 'Critical';

export interface Incident {
  id: string;
  title: string;
  severity: 'Critical' | 'Medium' | 'Low';
  status: 'Active' | 'Resolved';
  timestamp: string;
  trustImpact: number;

  // 🆕 ADDED: Enterprise Details
  trigger: string;
  affectedService: string;
  monitorName: string;
  rootCause: string;
  actionsTaken: string[];
}