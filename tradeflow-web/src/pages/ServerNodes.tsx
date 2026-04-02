import { Server, Cpu, Database, Activity, HardDrive, RefreshCcw, Network, Plus, X, Copy, CheckCircle2, Zap } from "lucide-react"
import { Button } from "../components/ui/button"
import { useEffect, useState } from "react"
import api from "../lib/api"
import { usePlatform } from "../hooks/usePlatform"
import { cn } from "../lib/utils"

export function ServerNodes() {
  const [nodes, setNodes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPairingModal, setShowPairingModal] = useState(false)
  const [pairingCode, setPairingCode] = useState<string | null>(null)
  const [pairingExpiry, setPairingExpiry] = useState<string | null>(null)
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [copied, setCopied] = useState(false)

  const { isDesktop } = usePlatform()
  
  // Desktop-specific local monitoring state
  const [localStats, setLocalStats] = useState<any>(null)
  const [localBot, setLocalBot] = useState<any>(null)

  const fetchNodes = async () => {
    try {
      const res = await api.get("/api/nodes")
      setNodes(res.data)
    } catch (err) {
      console.error("Failed to fetch nodes", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateCode = async () => {
    setIsGeneratingCode(true)
    try {
      const res = await api.post("/api/nodes/enroll/code")
      setPairingCode(res.data.code)
      setPairingExpiry(new Date(res.data.expiresAt).toLocaleTimeString())
      setShowPairingModal(true)
    } catch (err) {
      alert("Fehler beim Generieren des Codes.")
    } finally {
      setIsGeneratingCode(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    fetchNodes()
    const interval = setInterval(fetchNodes, 10000) // Poll every 10s
    
    // Desktop-exclusive real-time local loop
    let desktopInterval: any;
    if (isDesktop) {
      import(/* @vite-ignore */ "@tauri-apps/api/core").then((core) => {
        const { invoke } = core;
        desktopInterval = setInterval(async () => {
          try {
            const stats = await invoke("get_system_stats");
            const bot = await invoke("check_bot_status", { processName: "tradeflow-bot" });
            setLocalStats(stats);
            setLocalBot(bot);
          } catch (e) {
            console.error("Native invoke failed:", e);
          }
        }, 3000); // Faster local telemetry (3s)
      }).catch(err => {
        console.warn("Tauri Core API not available:", err);
      });
    }

    return () => {
      clearInterval(interval);
      if (desktopInterval) clearInterval(desktopInterval);
    }
  }, [isDesktop])

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/40 p-10 rounded-[40px] border border-slate-800 backdrop-blur-3xl shadow-3xl gap-6">
        <div className="flex gap-8 items-center">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center border border-indigo-500/30 shadow-indigo-500/10 shadow-2xl">
            <Server className="w-10 h-10 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">Cloud Nodes & Hardware</h1>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs mt-1 transition-all">Monitoring your infrastructure</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
           <Button 
             onClick={handleGenerateCode}
             disabled={isGeneratingCode}
             className="bg-primary hover:bg-primary/90 text-white font-black px-6 py-6 rounded-2xl shadow-xl shadow-primary/20 flex gap-2"
           >
             <Plus className="w-5 h-5" />
             {isGeneratingCode ? "GENERIERRE..." : "GERÄT VERBINDEN"}
           </Button>

           <div className="flex gap-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center min-w-[100px]">
                 <div className="text-sm font-black text-white leading-none">0.24ms</div>
                 <div className="text-[10px] text-slate-500 font-black mt-2">API Latenz</div>
              </div>
              <div className={cn(
                "p-4 rounded-2xl border text-center min-w-[100px]",
                nodes.some(n => n.online) ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"
              )}>
                 <div className={cn("text-sm font-black leading-none", nodes.some(n => n.online) ? "text-emerald-500" : "text-rose-500")}>
                   {nodes.some(n => n.online) ? "ONLINE" : "OFFLINE"}
                 </div>
                 <div className="text-[10px] text-slate-500 font-black mt-2 uppercase transition-all">Status</div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* NATIVE LOCAL NODE (Desktop Exclusive) */}
        {isDesktop && localStats && (
          <div className="bg-slate-900 border-2 border-primary/30 rounded-3xl overflow-hidden shadow-2xl relative group hover:border-primary/50 transition-all flex flex-col">
             <div className="absolute top-0 right-0 p-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
             </div>
             <div className="p-6 border-b border-slate-800 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"><Zap className="w-4 h-4 text-primary" /></div>
                   <h3 className="text-sm font-black text-white uppercase tracking-widest">DIESES GERÄT (LOCAL)</h3>
                </div>
                <div className="flex gap-2">
                  <span className="text-[8px] font-black px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-widest">NATIVE</span>
                  <span className="text-[8px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 uppercase tracking-widest">ONLINE</span>
                </div>
             </div>
             
             <div className="p-8 flex-1 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <div className="flex justify-between items-baseline mb-3">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Cpu className="w-3.5 h-3.5" /> NATIVE CPU</span>
                         <span className="text-xs font-black text-white">{localStats.cpu_usage.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-primary transition-all duration-300" style={{ width: `${localStats.cpu_usage}%` }} />
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between items-baseline mb-3">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Database className="w-3.5 h-3.5" /> NATIVE RAM</span>
                         <span className="text-xs font-black text-white">{localStats.ram_usage.toFixed(1)}GB / {localStats.ram_total.toFixed(0)}GB</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(localStats.ram_usage / localStats.ram_total * 100)}%` }} />
                      </div>
                   </div>
                </div>

                {/* Local Bot Process */}
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <Activity className="w-3 h-3 text-primary" /> Lokale Bot Runtime
                    </h4>
                    {localBot?.is_running ? (
                       <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Active (PID: {localBot.pid})</span>
                    ) : (
                       <span className="text-[8px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Not Found</span>
                    )}
                  </div>
                  {!localBot?.is_running && (
                    <div className="text-center py-2">
                      <Button size="sm" className="h-8 text-[9px] bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">BOT LOKAL STARTEN</Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                      <HardDrive className="w-4 h-4 text-slate-500 mb-2" />
                      <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Betriebssystem</div>
                      <div className="text-[10px] font-black text-white mt-1 uppercase truncate">{localStats.os_name}</div>
                   </div>
                   <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                      <Network className="w-4 h-4 text-slate-500 mb-2" />
                      <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Local Link</div>
                      <div className="text-[10px] font-black text-white mt-1 uppercase truncate">IPC / Native Bridge</div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Real Nodes List */}
        {nodes.map((node) => (
          <div key={node.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl group hover:border-indigo-500/40 transition-all flex flex-col">
             <div className="p-6 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center"><Cpu className="w-4 h-4 text-indigo-500" /></div>
                   <h3 className="text-sm font-black text-white uppercase tracking-widest">{node.hostname || node.nodeName}</h3>
                </div>
                <div className="flex gap-2">
                  <span className="text-[8px] font-black px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-500 uppercase tracking-widest">{node.nodeType}</span>
                  <span className={cn(
                    "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                    node.online ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"
                  )}>
                    {node.online ? "ACTIVE" : "STALE"}
                  </span>
                </div>
             </div>
             
             <div className="p-8 flex-1 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <div className="flex justify-between items-baseline mb-3">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Cpu className="w-3.5 h-3.5" /> CPU LOAD</span>
                         <span className="text-xs font-black text-white">{node.metrics?.[0]?.cpuUsage || 0}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 transition-all" style={{ width: `${node.metrics?.[0]?.cpuUsage || 0}%` }} />
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between items-baseline mb-3">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Database className="w-3.5 h-3.5" /> RAM USAGE</span>
                         <span className="text-xs font-black text-white">{node.metrics?.[0]?.ramUsage || 0}GB / {node.totalRamGb || 4}GB</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 transition-all" style={{ width: `${((node.metrics?.[0]?.ramUsage || 0) / (node.totalRamGb || 4) * 100).toFixed(0)}%` }} />
                      </div>
                   </div>
                </div>

                {/* Bot Process Status */}
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <Zap className="w-3 h-3 text-primary" /> Trading Bot Status
                    </h4>
                    {node.processes?.length > 0 ? (
                       <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse border border-emerald-500/20">Running</span>
                    ) : (
                       <span className="text-[8px] font-black text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded-full uppercase tracking-widest">Stopped</span>
                    )}
                  </div>
                  
                  {node.processes?.length > 0 ? (
                    node.processes.map((proc: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">#{proc.pid}</div>
                           <div className="text-[10px] font-bold text-white truncate max-w-[120px]">{proc.processName}</div>
                        </div>
                        <div className="flex gap-4">
                           <div className="text-right">
                              <div className="text-[8px] text-slate-600 font-black uppercase">CPU</div>
                              <div className="text-[10px] text-slate-300 font-bold">{proc.cpuUsage}%</div>
                           </div>
                           <div className="text-right">
                              <div className="text-[8px] text-slate-600 font-black uppercase">RAM</div>
                              <div className="text-[10px] text-slate-300 font-bold">{proc.ramUsage}%</div>
                           </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2 text-[10px] text-slate-600 italic font-medium">Kein aktiver Trading Prozess erkannt</div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                   {[
                     { label: "IP ADRESSE", value: node.ipAddress || "Detecting...", icon: Network },
                     { label: "OS VERSION", value: node.os || "Linux", icon: HardDrive },
                     { label: "UPTIME", value: node.runtimeVersion || "Active", icon: Activity },
                   ].map((stat, i) => (
                     <div key={i} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 group-hover:bg-slate-900 transition-colors">
                        <stat.icon className="w-4 h-4 text-slate-500 mb-2" />
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{stat.label}</div>
                        <div className="text-[10px] font-black text-white mt-1 uppercase truncate">{stat.value}</div>
                     </div>
                   ))}
                </div>

                <div className="flex gap-3 pt-2">
                   <Button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-black text-[10px] uppercase tracking-widest py-6 rounded-2xl border border-slate-700 shadow-xl">
                      <RefreshCcw className="w-3.5 h-3.5 mr-2" /> REBOOT NODE
                   </Button>
                   <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest py-6 rounded-2xl shadow-lg shadow-indigo-500/20">
                      OPEN CONSOLE
                   </Button>
                </div>
             </div>
          </div>
        ))}

        {/* Empty State */}
        {nodes.length === 0 && !isLoading && (
          <div className="bg-slate-900 border border-dashed border-slate-800 p-20 rounded-[40px] flex flex-col items-center justify-center text-center space-y-6 col-span-2">
             <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700">
                <Server className="w-12 h-12 text-slate-600" />
             </div>
             <div className="max-w-md">
                <h3 className="text-2xl font-black text-white">Keine aktiven Nodes gefunden</h3>
                <p className="text-slate-500 text-sm italic mt-2">Verbinde deinen ersten Server oder Trading-Rechner mit dem TradeFlow Agenten, um Live-Monitoring zu erhalten.</p>
             </div>
             <Button onClick={handleGenerateCode} className="bg-primary hover:bg-primary/90 text-white font-black px-10 py-6 rounded-2xl">
               JETZT STARTEN
             </Button>
          </div>
        )}
      </div>

      {/* Pairing Modal */}
      {showPairingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden relative">
             <button 
               onClick={() => setShowPairingModal(false)}
               className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
             >
                <X className="w-6 h-6" />
             </button>

             <div className="p-10 space-y-8">
                <div className="text-center space-y-2">
                   <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                      <Zap className="w-8 h-8 text-primary" />
                   </div>
                   <h2 className="text-2xl font-black text-white">Gerät verbinden</h2>
                   <p className="text-slate-500 text-sm font-medium">Nutze diesen Code, um deinen lokalen Agenten zu koppeln.</p>
                </div>

                <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 text-center space-y-6">
                   <div className="text-xs font-black text-slate-600 uppercase tracking-[0.3em] mb-2">DEIN PAIRING CODE</div>
                   <div className="flex items-center justify-center gap-4">
                      <div className="text-6xl font-black text-white tracking-widest font-mono">
                        {pairingCode}
                      </div>
                      <button 
                        onClick={() => copyToClipboard(pairingCode || "")}
                        className={cn(
                          "p-4 rounded-2xl transition-all",
                          copied ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        )}
                      >
                        {copied ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                      </button>
                   </div>
                   <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Gültig bis {pairingExpiry}</p>
                </div>

                <div className="space-y-4">
                   <h4 className="text-xs font-black text-white uppercase tracking-widest">Installation:</h4>
                   <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[10px] text-slate-400 space-y-1">
                      <div>$ cd tradeflow-agent</div>
                      <div className="text-primary">$ node agent.js enroll --code {pairingCode}</div>
                      <div>$ node agent.js start</div>
                   </div>
                </div>

                <Button 
                  onClick={() => setShowPairingModal(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-7 rounded-2xl"
                >
                  FERTIG
                </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
