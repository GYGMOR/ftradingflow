import { BrainCircuit, Zap, TrendingUp, AlertCircle, History, Sparkles, MessageSquare } from "lucide-react"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"

export function AIAnalytics() {
  return (
    <div className="space-y-8 pb-20">
      <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 border border-indigo-500/20 p-10 rounded-[32px] relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 max-w-xl text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">ELITE FEATURE: ACTIVE</span>
               </div>
               <h1 className="text-5xl font-black text-white leading-tight">AI Insights & Analytics</h1>
               <p className="text-slate-400 font-medium text-lg leading-relaxed">
                  Verstehe die Logik hinter jedem Trade. Unser neuronales Netz analysiert Marktdaten, Sentiment und Orderflows in Echtzeit.
               </p>
            </div>
            <div className="w-40 h-40 bg-indigo-500/10 rounded-full flex items-center justify-center ring-4 ring-indigo-500/20 animate-pulse border-2 border-indigo-500/30">
               <BrainCircuit className="w-20 h-20 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Decision Feed */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
           <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <History className="w-5 h-5 text-indigo-500" />
                 <h3 className="text-sm font-black text-white">Live Decision Feed</h3>
              </div>
              <span className="text-[10px] items-center flex px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded font-black text-emerald-500 transition-all uppercase tracking-tighter shadow-lg shadow-emerald-500/5">
                REALTIME UPDATING
              </span>
           </div>
           
           <div className="p-6 space-y-6">
              {[
                { time: "vor 2 Min", event: "BUY_SIGNAL_DETECTED", asset: "BTC/USDT", reason: "EMA 50/200 Crossover bestätigt durch RSI Divergenz (Bullisch).", confidence: 84 },
                { time: "vor 12 Min", event: "POSITION_REDUCED", asset: "ETH/USDT", reason: "Hohe Volatilität im Orderbuch erkannt. Risiko-Score von 65 auf 42 gesenkt.", confidence: 91 },
                { time: "vor 45 Min", event: "TRADE_SKIPPED", asset: "BNB/USDT", reason: "Sentiment-Score unter Schwellenwert (Neutral). Trade wegen Risiko abgelehnt.", confidence: 72 },
                { time: "vor 1 Std", event: "EXIT_TRIGGERED", asset: "SOL/USDT", reason: "Trailing Stop bei 104.50 erreicht. Gesamtprofit: +4.2%.", confidence: 95 },
              ].map((log, i) => (
                <div key={i} className="flex gap-6 group hover:bg-slate-800/30 p-4 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-700/50">
                   <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 shadow-lg group-hover:bg-indigo-500/20 transition-colors">
                         <Zap className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="w-px h-full bg-slate-800 my-2" />
                   </div>
                   <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{log.time}</span>
                            <span className={cn("text-[10px] font-black px-2 py-0.5 rounded uppercase", 
                              log.event === 'BUY_SIGNAL_DETECTED' ? 'bg-emerald-500/20 text-emerald-500' : 
                              log.event === 'TRADE_SKIPPED' ? 'bg-amber-500/20 text-amber-500' :
                              'bg-indigo-500/20 text-indigo-500')}>
                              {log.event}
                            </span>
                            <span className="text-sm font-black text-white">{log.asset}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase">CONFIDENCE</span>
                            <span className="text-xs font-black text-indigo-400">{log.confidence}%</span>
                         </div>
                      </div>
                      <p className="text-sm font-semibold text-slate-400 leading-relaxed italic pr-10">"{log.reason}"</p>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="p-6 bg-slate-950 text-center border-t border-slate-800 group cursor-pointer">
              <Button variant="link" className="text-indigo-500 font-bold group-hover:scale-105 transition-transform text-xs uppercase uppercase tracking-widest">Ganzes Log-Archiv öffnen</Button>
           </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center justify-between">
                Market Phase <AlertCircle className="w-4 h-4 text-slate-500" />
              </h3>
              <div className="space-y-6">
                <div>
                   <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xs font-bold text-slate-400">TRENDRICHTUNG</span>
                      <span className="text-xs font-black text-emerald-500 uppercase">STEIGEND</span>
                   </div>
                   <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all w-[75%]" />
                   </div>
                </div>
                <div>
                   <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xs font-bold text-slate-400">VOLATILITÄT</span>
                      <span className="text-xs font-black text-amber-500 uppercase">MITTEL</span>
                   </div>
                   <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 transition-all w-[42%]" />
                   </div>
                </div>
                <div>
                   <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xs font-bold text-slate-400">SENTIMENT</span>
                      <span className="text-xs font-black text-indigo-500 uppercase">OPTIMISTISCH</span>
                   </div>
                   <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all w-[68%]" />
                   </div>
                </div>
              </div>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all cursor-pointer">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                 <TrendingUp className="w-20 h-20 text-indigo-500" />
              </div>
              <h3 className="text-sm font-black text-white mb-2 uppercase tracking-widest leading-none">Explainable AI</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase transition-all mb-6">KI-Begründungen pro Trade</p>
              
              <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl group-hover:bg-slate-800 transition-colors">
                 <MessageSquare className="w-5 h-5 text-indigo-500" />
                 <div>
                    <div className="text-[10px] font-black text-white uppercase">NEUE ANALYSE</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">"Warum BTC gestern pausiert wurde"</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
