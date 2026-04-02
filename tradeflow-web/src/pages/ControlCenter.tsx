import { ShieldAlert, Zap, Power, Play, AlertTriangle, Activity, Database } from "lucide-react"
import { Button } from "../components/ui/button"
import { useStore } from "../stores/useStore"
import { cn } from "../lib/utils"

export function ControlCenter() {
  const { botActive } = useStore()

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center bg-slate-950 border border-slate-900 p-8 rounded-3xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex gap-6 items-center">
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse shadow-2xl", 
            botActive ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" : "bg-rose-500/20 text-rose-500 border border-rose-500/30")}>
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">Bot Command Center</h1>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs mt-1">STATUS: {botActive ? "SYSTEM OPERATIONAL" : "SYSTEM PAUSED"}</p>
          </div>
        </div>
        <div className="flex gap-3">
           <Button className="bg-rose-500 hover:bg-rose-600 text-white font-black px-6 py-6 rounded-xl shadow-lg shadow-rose-500/20">
             <Zap className="w-4 h-4 mr-2" /> PANIC: CLOSE ALL
           </Button>
           <Button variant="outline" className="border-slate-800 bg-slate-900/50 text-white font-black px-6 py-6 rounded-xl">
             <Power className="w-4 h-4 mr-2" /> HARD SHUTDOWN
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
           <div className="flex justify-between items-start mb-6">
             <div className="p-3 bg-emerald-500/10 rounded-2xl">
               <Play className="w-5 h-5 text-emerald-500" />
             </div>
             <div className="text-[10px] font-black text-slate-500 tracking-widest">AUTO-TRADE</div>
           </div>
           <h3 className="text-lg font-black text-white">Bot Execution</h3>
           <p className="text-xs text-slate-400 mt-1 mb-8">Ermöglicht dem Bot, eigenständig Positionen zu eröffnen.</p>
           <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-xs font-black text-white">{botActive ? "AKTIVIERT" : "DEAKTIVIERT"}</span>
              <div className={cn("w-10 h-6 rounded-full relative transition-colors", botActive ? "bg-emerald-500" : "bg-slate-800")}>
                 <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", botActive ? "right-1" : "left-1")} />
              </div>
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
           <div className="flex justify-between items-start mb-6">
             <div className="p-3 bg-amber-500/10 rounded-2xl">
               <AlertTriangle className="w-5 h-5 text-amber-500" />
             </div>
             <div className="text-[10px] font-black text-slate-500 tracking-widest">SAFETY MODE</div>
           </div>
           <h3 className="text-lg font-black text-white">Risk Protection</h3>
           <p className="text-xs text-slate-400 mt-1 mb-8">Pausiert den Bot bei Volatilitäts-Spikes über 5%.</p>
           <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-xs font-black text-white uppercase tracking-tighter">INTELLIGENT PAUSE</span>
              <Button size="sm" variant="ghost" className="text-primary text-[10px] font-black underline">CONFIG</Button>
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
              <Zap className="w-8 h-8 text-indigo-500 mb-2" />
              <h4 className="text-sm font-black text-white">UPGRADE TO ELITE</h4>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">UNLOCKE DEN LIVE DECISION FEED</p>
           </div>
           <div className="flex justify-between items-start mb-6 opacity-30">
             <div className="p-3 bg-indigo-500/10 rounded-2xl">
               <Activity className="w-5 h-5 text-indigo-500" />
             </div>
             <div className="text-[10px] font-black text-slate-500 tracking-widest">REALTIME</div>
           </div>
           <h3 className="text-lg font-black text-white opacity-30">Decision Stream</h3>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <Database className="w-5 h-5 text-slate-500" />
             <h3 className="text-sm font-black text-white">Bot Execution Logs</h3>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                DURCHGEFÜHRT: 142
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-rose-500">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                FEHLER: 0
              </div>
           </div>
        </div>
        <div className="p-4 space-y-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group">
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-500 w-16 uppercase">14:2{i}:12</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-primary/20 text-primary uppercase">TRADE_OPEN</span>
                    <span className="text-xs font-semibold text-slate-300">Bot opening Long Position for BTC/USDT (Smart Momentum Strategie)</span>
                 </div>
                 <div className="px-3 py-1 bg-slate-950 rounded font-black text-[10px] text-slate-600 group-hover:text-white transition-colors">DETAIL</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
