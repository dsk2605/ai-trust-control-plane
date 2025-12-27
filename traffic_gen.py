import requests
import time
import random
import sys

# Configuration
URL = "http://localhost:3000/api/ai/generate"
USERS = ["User 1", "User 2", "User 3"]
PROMPTS = [
    "Explain quantum computing in one sentence.",
    "What is the capital of France?",
    "Write a haiku about coding.",
    "Why is the sky blue?",
    "Define 'Observability' in software.",
    "What is a 429 error?",
    "Tell me a joke.",
    "How does a neural network work?"
]

def send_request():
    user = random.choice(USERS)
    prompt = random.choice(PROMPTS)
    
    payload = {
        "prompt": prompt,
        "modelVersion": "gemini-2.0-flash" 
    }

    print(f"[{user}] Sending request...")

    try:
        response = requests.post(URL, json=payload)
        
        # SUCCESS (200)
        if response.status_code == 200:
            print(f"✅ [{user}] Success: {response.status_code}")
            # Wait 10 seconds to respect Free Tier
            time.sleep(10) 
            
        # RATE LIMIT (429)
        elif response.status_code == 429:
            print(f"⚠️ [{user}] Rate Limited (429). Cooling down for 30 seconds...")
            time.sleep(30) # Smart cool-down
            
        # OTHER ERRORS
        else:
            print(f"❌ [{user}] Failed: {response.status_code} - {response.text[:100]}")
            time.sleep(5)

    except Exception as e:
        print(f"❌ Connection Error: {e}")
        time.sleep(5)

# Main Loop
if __name__ == "__main__":
    print("🚦 Smart Traffic Generator Started...")
    print("   (Automatically handles Rate Limits)")
    
    while True:
        send_request()