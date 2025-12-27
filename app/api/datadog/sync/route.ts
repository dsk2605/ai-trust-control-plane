import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { score, status, incidentDetails } = await req.json();
    
    // Get Key from Env or Fallback
    const apiKey = process.env.DD_API_KEY || process.env.DATADOG_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'Missing Datadog API Key' }, { status: 500 });
    }

    // 1. 📊 SEND METRIC/LOG (For the Dashboard Graph)
    // This draws the line chart (100 -> 85 -> 50)
    const logPayload = {
      ddsource: 'nodejs',
      service: 'ai-trust-control-plane',
      message: `Trust Score Updated: ${score}`,
      trust_score: score,
      trustState: status,
      timestamp: new Date().toISOString()
    };

    const logRes = await fetch(`https://http-intake.logs.us5.datadoghq.com/api/v2/logs?dd-api-key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logPayload)
    });

    // 2. 🚨 SEND REAL EVENT (For the Incident Stream)
    // Only send if something is actually wrong (Critical/Degraded)
    if ((status === 'Critical' || status === 'Degraded') && incidentDetails) {
        
        const eventPayload = {
            title: `[${status}] AI Trust Incident: Score dropped to ${score}`,
            text: `%%% \n**Incident Detected**\n\n**Current Score:** ${score}/100\n**Status:** ${status}\n**Trigger:** ${incidentDetails.trigger}\n**Root Cause:** ${incidentDetails.rootCause}\n**Affected Service:** ${incidentDetails.service}\n %%%`,
            alert_type: status === 'Critical' ? 'error' : 'warning',
            source_type_name: 'ai-monitor',
            tags: [
                `env:production`, 
                `service:${incidentDetails.service}`,
                `trust_state:${status}`
            ]
        };

        // Datadog Events API v1
        await fetch(`https://api.us5.datadoghq.com/api/v1/events?api_key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventPayload)
        });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Datadog Sync Error:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}