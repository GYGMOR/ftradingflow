import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { 
  Play, 
  Square, 
  Settings as SettingsIcon, 
  BrainCircuit, 
  Lock, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  BarChart4, 
  Clock, 
  Target
} from "lucide-react"
import { useStore } from "../stores/useStore"
import { strategiesList } from "../lib/strategies.data"
import { cn } from "../lib/utils"

export function Strategies() {
  const { purchasedStrategies, purchaseStrategy, activeStrategies, toggleActiveStrategy } = useStore()
  const [filter, setFilter] = useState<"ALL" | "PURCHASED" | "BASIC" | "PRO" | "ELITE">("ALL")

  const filteredStrategies = strategiesList.filter(s => {
    if (filter === "ALL") return true
    if (filter === "PURCHASED") return purchasedStrategies.includes(s.id)
    return s.tier === filter
  })

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "ELITE": return "text-ai border-ai/30 bg-ai/10"
      case "PRO": return "text-primary border-primary/30 bg-primary/10"
      default: return "text-slate-400 border-slate-700 bg-slate-800/50"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "text-rose-500 bg-rose-500/10"
      case "Medium": return "text-amber-500 bg-amber-500/10"
      default: return "text-emerald-500 bg-emerald-500/10"
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">Strategie-Marktplatz</h2>
          <p className="text-slate-400 mt-1">Entdecke und aktiviere hochperformante Trading-Algorithmen.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
          <button 
            onClick={() => setFilter("ALL")}
            className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", filter === "ALL" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white")}
          >
            ALLE
          </button>
          <button 
            onClick={() => setFilter("PURCHASED")}
            className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", filter === "PURCHASED" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white")}
          >
            GEKAUFT
          </button>
          <div className="w-px h-4 bg-slate-700 mx-1 hidden md:block" />
          <button 
            onClick={() => setFilter("BASIC")}
            className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", filter === "BASIC" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white")}
          >
            BASIC
          </button>
          <button 
            onClick={() => setFilter("PRO")}
            className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", filter === "PRO" ? "bg-primary/20 text-primary" : "text-slate-400 hover:text-white")}
          >
            PRO
          </button>
          <button 
            onClick={() => setFilter("ELITE")}
            className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", filter === "ELITE" ? "bg-ai/20 text-ai" : "text-slate-400 hover:text-white")}
          >
            ELITE
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredStrategies.map((s) => {
          const isPurchased = purchasedStrategies.includes(s.id)
          const isActive = activeStrategies.includes(s.id)
          
          return (
            <Card 
              key={s.id} 
              className={cn(
                "relative overflow-hidden transition-all duration-300 border-slate-800 bg-[#141827] group hover:border-slate-600",
                !isPurchased && "opacity-80 grayscale-[0.3] hover:grayscale-0",
                s.tier === "ELITE" && "hover:border-ai/50 shadow-[0_0_20px_-10px_rgba(139,92,246,0.1)]",
                s.tier === "PRO" && "hover:border-primary/50"
              )}
            >
              {/* Premium Glow for Elite */}
              {s.tier === "ELITE" && (
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-ai/10 blur-[60px] rounded-full pointer-events-none" />
              )}

              <CardHeader className="relative z-10 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className={cn("font-bold text-[10px] tracking-widest px-2 py-1 uppercase", getTierColor(s.tier))}>
                    {s.tier}
                  </Badge>
                  {isPurchased ? (
                    <div className="flex items-center text-emerald-500 text-[10px] font-black tracking-tighter bg-emerald-500/10 px-2 py-1 rounded">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> GEKAUFT
                    </div>
                  ) : (
                    <div className="text-white font-black text-sm tracking-tight">{s.priceCHF} CHF</div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-black text-white group-hover:text-primary transition-colors">{s.name}</CardTitle>
                    <div className="flex items-center mt-1 space-x-3">
                      <span className="text-[10px] font-bold text-slate-500 flex items-center">
                        <Zap className="w-3 h-3 mr-1" /> {s.category}
                      </span>
                      <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded", getRiskColor(s.riskLevel))}>
                         {s.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>
                  {s.isAI && <BrainCircuit className="w-6 h-6 text-ai animate-pulse shrink-0" />}
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed min-h-[32px]">
                  {s.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 pb-2">
                  <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800 group-hover:border-slate-700 transition-colors">
                    <div className="text-[10px] text-slate-500 flex items-center mb-1 font-bold"><BarChart4 className="w-3 h-3 mr-1" /> WIN RATE</div>
                    <div className="text-lg font-black text-emerald-500">{s.winRate}%</div>
                    <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${s.winRate}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800 group-hover:border-slate-700 transition-colors">
                    <div className="text-[10px] text-slate-500 flex items-center mb-1 font-bold"><Target className="w-3 h-3 mr-1" /> DRAWDOWN</div>
                    <div className="text-lg font-black text-white">{s.avgDrawdown}</div>
                    <div className="text-[10px] text-slate-500 mt-2">Avg. Trades: <span className="text-white italic">{s.tradesCount}</span></div>
                  </div>
                </div>

                {/* Details List */}
                <div className="space-y-3 py-2 border-y border-slate-800/50">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5" /> Timeframe</span>
                    <span className="text-slate-200 font-bold">{s.timeframe}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Märkte</span>
                    <span className="text-slate-200 font-bold">{s.recommendedMarkets}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  {isPurchased ? (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => toggleActiveStrategy(s.id)}
                        className={cn(
                          "flex-1 font-black transition-all",
                          isActive ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white"
                        )}
                      >
                        {isActive ? <><Square className="w-4 h-4 mr-2 fill-current" /> PAUSIEREN</> : <><Play className="w-4 h-4 mr-2 fill-current" /> AKTIVIEREN</>}
                      </Button>
                      <Button variant="outline" size="icon" className="border-slate-800 text-slate-400 hover:text-white shrink-0">
                        <SettingsIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => purchaseStrategy(s.id)}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-black group/btn overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
                      <Lock className="w-4 h-4 mr-2" /> JETZT FÜR {s.priceCHF} CHF FREISCHALTEN
                    </Button>
                  )}
                </div>
              </CardContent>

              {/* Lock Overlay for Unpurchased */}
              {!isPurchased && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0B0E17]/20 to-transparent" />
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
