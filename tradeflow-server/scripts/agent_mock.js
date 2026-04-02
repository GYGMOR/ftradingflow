import axios from 'axios';

// Configuration
const API_URL = 'http://localhost:5000/admin/nodes/heartbeat';
const NODE_ID = 'e1a3b5c4-7d8e-4f9a-b2c1-3d4e5f6a7b8c'; // Fixed ID for mock testing
const JWT_TOKEN = 'your-token-here'; // We'll need a real token to run this

console.log("🚀 TradeFlow Node Agent (MOCK) started.");

async function sendHeartbeat() {
  const cpu = 10 + Math.random() * 20;
  const ram = 1.2 + Math.random() * 0.5;

  const payload = {
    nodeId: NODE_ID,
    cpuUsage: cpu.toFixed(2),
    ramUsage: ram.toFixed(2),
    diskUsage: (45 + Math.random() * 5).toFixed(2),
    status: "RUNNING",
    os: "Ubuntu 22.04 LTS",
    nodeType: "VPS-PRO",
    cpuModel: "Intel Xeon Platinum",
    totalRamGb: 4.0
  };

  try {
    const res = await axios.post(API_URL, payload, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    console.log(`[${new Date().toLocaleTimeString()}] Heartbeat sent! Response:`, res.data.success);
  } catch (err) {
    console.error("❌ Heartbeat failed:", err.response?.data?.error || err.message);
  }
}

// In a real environment, this would be a CLI script. 
// For demo, we just print instructions.
console.log("USAGE:");
console.log("1. Get a JWT token from the TradeFlow login.");
console.log("2. Set the JWT_TOKEN variable in this script.");
console.log("3. Run: node scripts/agent_mock.js");

// setInterval(sendHeartbeat, 5000);
