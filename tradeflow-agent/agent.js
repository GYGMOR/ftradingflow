const { program } = require('commander');
const axios = require('axios');
const si = require('systeminformation');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const CONFIG_PATH = path.join(__dirname, 'config.json');
const API_BASE = process.env.API_BASE || 'http://localhost:5000/api/nodes';

let state = {
  nodeId: null,
  accessToken: null,
  refreshToken: null
};

// --- Storage Logic ---
function saveState() {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(state, null, 2));
}

function loadState() {
  if (fs.existsSync(CONFIG_PATH)) {
    state = JSON.parse(fs.readFileSync(CONFIG_PATH));
    return true;
  }
  return false;
}

// --- API Helpers ---
async function apiCall(method, endpoint, data = {}, retry = true) {
  try {
    const res = await axios({
      method: method,
      url: `${API_BASE}${endpoint}`,
      data: data,
      headers: {
        Authorization: state.accessToken ? `Bearer ${state.accessToken}` : ''
      }
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 403 && retry && state.refreshToken) {
      console.log("🔄 Access token expired. Refreshing...");
      const refreshed = await refreshToken();
      if (refreshed) {
        return apiCall(method, endpoint, data, false);
      }
    }
    throw err;
  }
}

async function refreshToken() {
  try {
    const res = await axios.post(`${API_BASE}/token/refresh`, {
      refreshToken: state.refreshToken
    });
    state.accessToken = res.data.accessToken;
    state.refreshToken = res.data.refreshToken;
    saveState();
    console.log("✅ Tokens rotated successfully.");
    return true;
  } catch (err) {
    console.error("❌ Refresh failed. Re-enrollment required.");
    return false;
  }
}

// --- Monitoring Logic ---
async function collectMetrics() {
  const [load, mem, fsSize, os] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.fsSize(),
    si.osInfo()
  ]);

  const disk = fsSize[0] || {};
  
  // Mock: Find a process named 'node' or 'python' as placeholder for trading bot
  const processes = await si.processes();
  const botProcess = processes.list.find(p => 
    p.name.includes('tradeflow-bot') || p.command.includes('tradeflow-bot')
  );

  return {
    cpuUsage: load.currentLoad.toFixed(2),
    ramUsage: (mem.active / (1024 * 1024 * 1024)).toFixed(2), // GB
    diskUsage: disk.use ? disk.use.toFixed(2) : 0,
    status: botProcess ? "RUNNING" : "IDLE",
    processes: botProcess ? [{
      name: botProcess.name,
      pid: botProcess.pid,
      cpu: botProcess.cpu,
      ram: botProcess.mem,
      status: botProcess.state,
      uptime: botProcess.started
    }] : []
  };
}

// --- Commands ---
program
  .name('tradeflow-agent')
  .description('Professional Monitoring Agent for TradeFlow')
  .version('1.0.0');

program
  .command('enroll')
  .description('Pair the agent with your account')
  .requiredOption('-c, --code <code>', '6-digit pairing code from dashboard')
  .action(async (options) => {
    try {
      console.log("🚀 Starting enrollment...");
      const siInfo = await si.osInfo();
      const hostname = siInfo.hostname;

      const res = await axios.post(`${API_BASE}/enroll/verify`, {
        code: options.code,
        hostname: hostname,
        os: `${siInfo.distro} ${siInfo.release}`,
        nodeType: 'PC/SERVER'
      });

      state.nodeId = res.data.nodeId;
      state.accessToken = res.data.accessToken;
      state.refreshToken = res.data.refreshToken;
      saveState();

      console.log("✅ Enrollment successful! Node ID:", state.nodeId);
      console.log("Run 'node agent.js start' to begin monitoring.");
    } catch (err) {
      console.error("❌ Enrollment failed:", err.response ? err.response.data.error : err.message);
    }
  });

program
  .command('start')
  .description('Start the monitoring loop')
  .action(async () => {
    if (!loadState()) {
      console.error("❌ Agent not enrolled. Please run 'enroll' first.");
      return;
    }

    console.log(`📡 Monitoring started for Node: ${state.nodeId}`);
    
    // Heartbeat Loop (Every 30s)
    setInterval(async () => {
      try {
        const metrics = await collectMetrics();
        await apiCall('POST', '/heartbeat', metrics);
        console.log(`[${new Date().toLocaleTimeString()}] Heartbeat sent. Status: ${metrics.status}`);
      } catch (err) {
        console.error("⚠️ Heartbeat failed:", err.message);
      }
    }, 30000);
  });

program.parse(process.argv);
