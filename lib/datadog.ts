const DD_API_KEY = process.env.DD_API_KEY;
const DD_SITE = process.env.DD_SITE || 'datadoghq.com';

export async function sendToDatadog(data: any, level: 'info' | 'error' = 'info') {
  if (!DD_API_KEY) {
    console.warn('⚠️ Datadog API Key missing. Log not sent.');
    return;
  }

  const url = `https://http-intake.logs.${DD_SITE}/api/v2/logs`;

  // DEBUG: Print where we are sending
  console.log(`📡 Sending log to: ${url}`);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': DD_API_KEY,
      },
      body: JSON.stringify({
        ddsource: 'nextjs-ai-backend',
        ddtags: 'env:dev,service:ai-trust-control-plane',
        message: data.message || 'AI Telemetry',
        service: 'ai-trust-control-plane',
        status: level,
        ...data
      }),
    });

    // DEBUG: Print the result
    if (res.ok) {
        console.log(`✅ Datadog Response: ${res.status} (Success)`);
    } else {
        const text = await res.text();
        console.error(`❌ Datadog Failed: ${res.status} - ${text}`);
    }

  } catch (err) {
    console.error('❌ Network Error sending to Datadog:', err);
  }
}