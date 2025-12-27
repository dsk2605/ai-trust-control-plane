require('dotenv').config({ path: '.env.local' });

const DD_API_KEY = process.env.DD_API_KEY;
const DD_SITE = process.env.DD_SITE || "us5.datadoghq.com";

async function sendFakeSuccess() {
  const url = `https://http-intake.logs.${DD_SITE}/api/v2/logs`;
  
  // Create a fake "Success" log entry
  const logEntry = {
    ddsource: "nodejs",
    ddtags: "env:development",
    hostname: "localhost",
    message: "AI Telemetry [SIMULATED SUCCESS]",
    service: "ai-trust-control-plane",
    status: "info", // <--- This makes it GREEN
    timestamp: new Date().toISOString(),
    // Fake metrics for the dashboard
    latency_ms: Math.floor(Math.random() * 500) + 200, // 200-700ms
    cost_usd: 0.00015,
    tokens_total: 150,
    model: "gemini-2.0-flash-exp"
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': DD_API_KEY
      },
      body: JSON.stringify(logEntry)
    });

    if (response.ok) {
      console.log("✅ Sent Green Log to Datadog!");
    } else {
      console.log("❌ Failed to send:", response.status, await response.text());
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}

// Run it 10 times quickly
console.log("🎨 Painting Dashboard with GREEN logs...");
let count = 0;
const interval = setInterval(() => {
    sendFakeSuccess();
    count++;
    if (count >= 10) {
        clearInterval(interval);
        console.log("✨ Done! Check your Dashboard.");
    }
}, 1000); // Send one every second