import { Lock, ShieldCheck, AlertTriangle, Zap, Target, TrendingUp, BarChart3, Info } from "lucide-react"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"

export function RiskCenter() {
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white">Risk Command Center</h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-xs tracking-widest flex items-center">
             Manage your bot's safety limits <ShieldCheck className="w-3.5 h-3.5 ml-2 text-emerald-500" />
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-800 text-white font-black px-6 py-6 rounded-2xl bg-slate-900/40">
            <Info className="w-4 h-4 mr-2" /> RISK GUIDE
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-black px-8 py-6 rounded-2xl shadow-lg shadow-primary/20">
            SAVE RISK PROFILE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "DAILY LOSS LIMIT", value: "€500", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "MAX DRAWDOWN", value: "8.5%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "MAX OPEN TRADES", value: "12", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "AUTO-KILL SWITCH", value: "ACTIVE", icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-950 border border-slate-900 p-6 rounded-3xl relative overflow-hidden group hover:border-slate-800 transition-all">
             <div className={cn("p-2 rounded-xl w-fit mb-4", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
             </div>
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
             <div className="text-2xl font-black text-white mt-1 uppercase">{stat.value}</div>
             <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BarChart3 className="w-12 h-12 text-white" />
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
           <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-500/10 rounded-2xl">
                 <ShieldCheck className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Safety Profiles</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter transition-all">Select a preset risk strategy</p>
              </div>
           </div>

           <div className="space-y-4">
              {[
                { name: "Safe (Conservative)", desc: "Focus on capital preservation. Tight SL, low leverage.", active: true },
                { name: "Balanced (Recommended)", desc: "Optimized for growth with controlled risk parameters.", active: false },
                { name: "Aggressive", desc: "High leverage, wide stops. For expert portfolios.", active: false },
              ].map((profile, i) => (
                <div key={i} className={cn("p-5 rounded-2xl border transition-all cursor-pointer", 
                  profile.active ? "bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/20 shadow-xl" : "bg-slate-950 border-slate-800 hover:border-slate-700")}>
                   <div className="flex justify-between items-center">
                      <div>
                        <h4 className={cn("font-black text-sm uppercase", profile.active ? "text-white" : "text-slate-400")}>{profile.name}</h4>
                        <p className="text-xs text-slate-500 group-hover:text-slate-400">{profile.desc}</p>
                      </div>
                      {profile.active && <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"><ShieldCheck className="w-3.5 h-3.5 text-white" /></div>}
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8">
               <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-2 ring-primary/20 animate-pulse transition-all">
                  <Lock className="w-8 h-8 text-primary shadow-2xl" />
               </div>
               <h3 className="text-2xl font-black text-white">PRO Risk Automation</h3>
               <p className="text-slate-400 mt-2 max-w-sm">
                  Aktiviere automatische Risikoanpassungen basierend auf der Marktvolatilität und dem Sentiment.
               </p>
               <Button className="mt-8 bg-white hover:bg-slate-200 text-slate-950 font-black px-10 py-6 rounded-2xl shadow-xl transition-all shadow-white/5 active:scale-95">
                 JETZT FREISCHALTEN
               </Button>
               <p className="text-[10px] text-slate-500 font-bold uppercase mt-4 tracking-widest">Verfügbar ab Pro Plan</p>
            </div>
            
            <BarChart3 className="w-32 h-32 text-slate-800 opacity-20 mb-6" />
            <div className="space-y-4 w-full opacity-10 pointer-events-none">
               {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-800 rounded-xl" />)}
            </div>
        </div>
      </div>
    </div>
  )
}
