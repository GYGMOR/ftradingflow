import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from "recharts"
import { 
  TrendingUp, 
  Target, 
  ArrowDownRight, 
  Calendar, 
  Activity, 
  Share2,
  ChevronDown
} from "lucide-react"
import { Button } from "../components/ui/button"
import { useStore } from "../stores/useStore"
import { cn } from "../lib/utils"

const EQUITY_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `2024-03-${i + 1}`,
  equity: 10000 + (Math.sin(i / 5) * 2000) + (i * 150)
}))

const PERFORMANCE_METRICS = [
  { label: "Profit Factor", value: "1.84", sub: "+12% vs Prev", icon: TrendingUp, color: "text-primary" },
  { label: "Sharpe Ratio", value: "2.12", sub: "EXCELLENT", icon: Activity, color: "text-indigo-400" },
  { label: "Max Drawdown", value: "-8.4%", sub: "RECOVERED", icon: ArrowDownRight, color: "text-rose-500" },
  { label: "Win Expectancy", value: "€14.20", sub: "PER TRADE", icon: Target, color: "text-emerald-500" },
]

const STRATEGY_STATS = [
  { name: "Alpha Scalper (BTC)", profit: "+€1,240", trades: 142, winRate: "68%", pf: "1.8", status: "ACTIVE" },
  { name: "Momentum King (ETH)", profit: "+€840", trades: 84, winRate: "72%", pf: "2.1", status: "ACTIVE" },
  { name: "Mean Reversion (SOL)", profit: "-€120", trades: 32, winRate: "44%", pf: "0.9", status: "PAUSED" },
  { name: "AI Sentiment Bot", profit: "+€3,120", trades: 512, winRate: "58%", pf: "1.6", status: "ACTIVE" },
]

const DRAWDOWN_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `2024-03-${i + 1}`,
  dd: Math.random() * -5 - (Math.sin(i/3) * 3)
}))

export function Analytics() {
  const { isDark } = useStore()
  const gridColor = isDark ? '#1e293b' : '#e2e8f0'

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-4xl font-black text-white leading-tight transition-all">Portfolio Analytics</h1>
           <p className="text-slate-500 font-bold tracking-widest uppercase text-xs mt-1">Deep Benchmarking & Performance Insights</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="h-12 border-slate-800 bg-slate-900 px-6 rounded-2xl gap-2 font-black text-xs">
              <Calendar className="w-4 h-4" /> LETZTE 30 TAGE <ChevronDown className="w-3.5 h-3.5" />
           </Button>
           <Button className="h-12 bg-primary hover:bg-primary/90 text-white font-black px-6 rounded-2xl gap-2 shadow-xl shadow-primary/20">
              <Share2 className="w-4 h-4" /> REPORT EXPORTIEREN
           </Button>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {PERFORMANCE_METRICS.map((st, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center transition-all group-hover:scale-110">
                  <st.icon className={cn("w-5 h-5", st.color)} />
               </div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{st.label}</span>
             </div>
              <div className="text-3xl font-black text-white">{st.value}</div>
              <div className="text-[10px] font-black text-slate-500 group-hover:text-primary transition-colors mt-1">{st.sub}</div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* Main Equity Curve */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
           <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Equity Curve</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Kapitalentwicklung inklusive offener Positionen</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-primary" />
                 <span className="text-[10px] font-black text-slate-400">TOTAL EQUITY</span>
              </div>
           </div>
        </div>
        <div className="h-[400px] w-full">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EQUITY_DATA}>
                 <defs>
                    <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.3} />
                 <XAxis dataKey="date" hide />
                 <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} hide />
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '12px' }}
                    itemStyle={{ color: '#3B82F6', fontWeight: 'black', fontSize: '14px' }}
                    labelStyle={{ color: '#64748b', fontWeight: 'bold', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' }}
                 />
                 <Area type="monotone" dataKey="equity" stroke="#3B82F6" strokeWidth={5} fill="url(#colorEquity)" />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>      {/* Strategy Ranking Table */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px]">
         <div className="flex justify-between items-center mb-8 px-2">
            <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tighter">Strategy Ranking</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Detailed performance by active algorithm</p>
            </div>
            <Button variant="ghost" className="text-primary font-bold text-xs">MORE DETAILS</Button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-800">
                     <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Strategie</th>
                     <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Profit</th>
                     <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Trades</th>
                     <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Win Rate</th>
                     <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">PF</th>
                     <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50">
                  {STRATEGY_STATS.map((s, i) => (
                    <tr key={i} className="group hover:bg-slate-800/20 transition-colors">
                       <td className="py-4 px-4">
                          <span className="text-sm font-black text-white group-hover:text-primary transition-colors">{s.name}</span>
                       </td>
                       <td className="py-4 px-4">
                          <span className={cn("text-sm font-black", s.profit.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>{s.profit}</span>
                       </td>
                       <td className="py-4 px-4 text-sm font-bold text-slate-400">{s.trades}</td>
                       <td className="py-4 px-4 text-sm font-bold text-slate-300">{s.winRate}</td>
                       <td className="py-4 px-4 text-sm font-bold text-slate-300">{s.pf}</td>
                       <td className="py-4 px-4">
                          <span className={cn(
                            "text-[8px] font-black px-2 py-0.5 rounded-full border",
                            s.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-slate-800 text-slate-500 border-slate-700"
                          )}>{s.status}</span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Distribution & Drawdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px]">
           <div className="flex justify-between items-center mb-10 px-2">
              <div>
                 <h3 className="text-lg font-black text-white uppercase tracking-widest">Drawdown Curve</h3>
                 <p className="text-[10px] text-slate-500 font-bold mt-1">Relative Portfolio Risk Over Time</p>
              </div>
              <ArrowDownRight className="w-5 h-5 text-rose-500" />
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={DRAWDOWN_DATA}>
                    <defs>
                       <linearGradient id="colorDD" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.3} />
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={[-15, 0]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="dd" stroke="#F43F5E" strokeWidth={3} fill="url(#colorDD)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] flex flex-col">
           <div className="flex justify-between items-center mb-10 px-2">
              <h3 className="text-lg font-black text-white uppercase tracking-widest">Risk Distribution</h3>
              <Target className="w-5 h-5 text-slate-700" />
           </div>
           <div className="flex-1 flex flex-col justify-center gap-6">
              {[
                { label: "Safe (Conservative)", percent: 65, color: "bg-emerald-500" },
                { label: "Medium (Growth)", percent: 25, color: "bg-primary" },
                { label: "High (Aggressive)", percent: 10, color: "bg-rose-500" },
              ].map((r, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-[11px] font-black uppercase tracking-widest px-1">
                      <span className="text-slate-500">{r.label}</span>
                      <span className="text-white">{r.percent}%</span>
                   </div>
                   <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-[2px]">
                      <div className={cn("h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)]", r.color)} style={{ width: `${r.percent}%` }} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
