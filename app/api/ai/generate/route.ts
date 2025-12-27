import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sendToDatadog } from '@/lib/datadog';


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  const startTime = Date.now();
  const modelVersion = 'gemini-2.0-flash-exp'; 
  
  // --- TRUST ENGINE INITIALIZATION (Section 5D) ---
  let trustScore = 100;
  let trustImpact = "None";
  let trustState = "Healthy";

  try {
    const body = await req.json();
    const prompt = body.prompt || "Hello Gemini";

    console.log(`🤖 Requesting: ${modelVersion}`);

    // 1. CALL GOOGLE (The AI System)
    const model = genAI.getGenerativeModel({ model: modelVersion });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 2. CALCULATE METRICS
    const endTime = Date.now();
    const latency = endTime - startTime;
    const totalTokens = Math.ceil((prompt.length + text.length) / 4);
    const estimatedCost = (totalTokens / 1000) * 0.0001;

    // --- TRUST ENGINE LOGIC (The Innovation) ---
    // Rule 1: Latency Penalty
    if (latency > 2000) { // If slower than 2 seconds
        trustScore -= 20; 
        trustImpact = "High Latency";
    } else if (latency > 1000) { // If slower than 1 second
        trustScore -= 10;
        trustImpact = "Moderate Latency";
    }

    // Rule 2: Clamp Score
    if (trustScore < 0) trustScore = 0;

    // Rule 3: Determine State
    if (trustScore < 70) trustState = "Degraded";
    if (trustScore < 50) trustState = "Critical";

    console.log(`🛡️ Trust Score: ${trustScore} (${trustState})`);

    // 3. SEND TO DATADOG (Telemetry Layer)
    await sendToDatadog({
      event: 'ai_trust_event', // New event type
      timestamp: new Date().toISOString(),
      model: modelVersion,
      latency_ms: latency,
      cost_usd: estimatedCost,
      
      // The Holy Grail: Trust Metrics
      trust_score: trustScore, 
      trust_state: trustState,
      trust_impact: trustImpact
    }, 'info');

    return NextResponse.json({ text, trustScore, trustState, latency });

  } catch (error: any) {
    console.error(`🔥 AI ERROR: ${error.message}`);
    
    // CRITICAL TRUST FAILURE
    trustScore = 0;
    trustState = "Critical";
    trustImpact = "Service Failure (429/500)";
    const isRateLimit = error.message.includes('429');

    // Send Failure to Datadog
    await sendToDatadog({
      event: 'ai_trust_event',
      timestamp: new Date().toISOString(),
      model: modelVersion,
      latency_ms: Date.now() - startTime,
      trust_score: 0, // Failure kills trust immediately
      trust_state: "Critical",
      trust_impact: trustImpact,
      error_type: isRateLimit ? 'RateLimit' : 'AI_Error',
    }, 'error');

   // Return JSON so the frontend doesn't crash
     return NextResponse.json(
      { error: error.message, trustScore: 0, trustState: "Critical" }, 
      { status: isRateLimit ? 429 : 500 }
     );
  }
}