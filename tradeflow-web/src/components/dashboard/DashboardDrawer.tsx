import { X, LayoutGrid, Plus, Lock, Check, Layout as LayoutIcon, Star, Zap, Shield, Eye, ActivitySquare, BrainCircuit, Cpu, History } from "lucide-react"
import { Button } from "../ui/button"
import { useStore } from "../../stores/useStore"
import { cn } from "../../lib/utils"

interface DashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "layouts" | "modules";
  setActiveTab: (tab: "layouts" | "modules") => void;
}

const MODULES = [
  // Existing
  { id: "capital", name: "Gesamtkapital", category: "Metrics", icon: LayoutGrid, premium: false },
  { id: "daily_pnl", name: "Tagesgewinn", category: "Metrics", icon: LayoutGrid, premium: false },
  { id: "winrate", name: "Win Rate", category: "Metrics", icon: LayoutGrid, premium: false },
  { id: "bot_status", name: "Bot Status", category: "System", icon: Zap, premium: false },
  { id: "main_chart", name: "Preis-Analytics", category: "Charts", icon: LayoutIcon, premium: false },
  
  // 6 NEW FREE WIDGETS
  { id: "bot_toggle", name: "Bot Quick Toggle", category: "System", icon: Zap, premium: false },
  { id: "bot_status_live", name: "Quick Bot Status", category: "System", icon: ActivitySquare, premium: false },
  { id: "daily_target", name: "Tagesziel Fortschritt", category: "Metrics", icon: Star, premium: false },
  { id: "watchlist_mini", name: "Watchlist Mini", category: "Charts", icon: Eye, premium: false },
  { id: "last_signals", name: "Letzte Signale", category: "AI", icon: BrainCircuit, premium: false },
  { id: "open_orders", name: "Offene Orders Mini", category: "System", icon: Shield, premium: false },

  // 10 NEW PREMIUM WIDGETS
  { id: "ai_decision_feed", name: "AI Decision Feed", category: "AI", icon: BrainCircuit, premium: true, tier: "PRO" },
  { id: "risk_score", name: "Risiko Score", category: "System", icon: Shield, premium: true, tier: "PRO" },
  { id: "drawdown_guard", name: "Drawdown Guard", category: "Metrics", icon: Shield, premium: true, tier: "PRO" },
  { id: "strat_compare", name: "Strategy Compare", category: "Charts", icon: LayoutGrid, premium: true, tier: "PRO" },
  { id: "heatmap_mini", name: "Heatmap Mini", category: "Charts", icon: LayoutGrid, premium: true, tier: "ELITE" },
  { id: "session_perf", name: "Session Performance", category: "Analytics", icon: ActivitySquare, premium: true, tier: "PRO" },
  { id: "coin_strength", name: "Coin Strength Meter", category: "Metrics", icon: Zap, premium: true, tier: "PRO" },
  { id: "smart_alerts", name: "Smart Alerts Panel", category: "System", icon: Shield, premium: true, tier: "PRO" },
  { id: "node_health", name: "Runtime / Node Health", category: "System", icon: Cpu, premium: true, tier: "ELITE" },
  { id: "journal_snapshot", name: "Journal Snapshot Pro", category: "Analytics", icon: History, premium: true, tier: "PRO" },

  // Legacy/Existing Premium
  { id: "sentiment", name: "Markt-Stimmung", category: "Premium", icon: Star, premium: true, tier: "PRO" },
  { id: "ai_radar", name: "KI Signal Radar", category: "Premium", icon: Zap, premium: true, tier: "ELITE" },
  { id: "heatmap", name: "Exposure Heatmap", category: "Premium", icon: Shield, premium: true, tier: "ELITE" },
  { id: "order_flow", name: "Order-Flow", category: "Charts", icon: LayoutIcon, premium: true, tier: "ELITE" },
  { id: "risk_dashboard", name: "Risk Control", category: "System", icon: Shield, premium: true, tier: "PRO" },
]

const LAYOUT_PRESETS = [
  { id: "classic", name: "Trader Classic", description: "Standard-Ansicht für alle Märkte", premium: false },
  { id: "scalper", name: "Fast Scalper", description: "Fokus auf schnellen Order-Flow", premium: true, tier: "PRO" },
  { id: "ai_focused", name: "AI Insight Mastery", description: "Maximaler KI-Input für Strategien", premium: true, tier: "ELITE" },
]

export function DashboardDrawer({ isOpen, onClose, activeTab, setActiveTab }: DashboardDrawerProps) {
  const { activeWidgets, toggleWidget, userRole, applyPreset } = useStore()

  const hasAccess = (premium: boolean, tier?: string) => {
    if (!premium) return true
    const roles = ["TRIAL", "STANDARD", "PREMIUM", "ADMIN"]
    const currentIdx = roles.indexOf(userRole === "PUBLISHER" ? "STANDARD" : userRole)
    const requiredIdx = roles.indexOf(tier === "ELITE" ? "PREMIUM" : tier || "STANDARD")
    return currentIdx >= requiredIdx || userRole === "ADMIN"
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-[400px] bg-[#0B0E17] border-l border-slate-800 z-[70] shadow-2xl transition-transform duration-500 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Workspace Control</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Dashboard anpassen</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-2 sticky top-0 bg-[#0B0E17] z-10">
          <button 
            onClick={() => setActiveTab("layouts")}
            className={cn(
              "px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
              activeTab === "layouts" ? "text-primary" : "text-slate-500 hover:text-slate-300"
            )}
          >
            Layouts
            {activeTab === "layouts" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
          </button>
          <button 
            onClick={() => setActiveTab("modules")}
            className={cn(
              "px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
              activeTab === "modules" ? "text-primary" : "text-slate-500 hover:text-slate-300"
            )}
          >
            Module
            {activeTab === "modules" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {activeTab === "modules" && (
            <div className="space-y-6">
              {["Metrics", "Charts", "System", "Premium"].map(category => (
                <div key={category} className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{category}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {MODULES.filter(m => m.category === category).map(module => {
                      const isActive = activeWidgets.includes(module.id)
                      const access = hasAccess(module.premium, module.tier)
                      
                      return (
                        <div 
                          key={module.id}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                            isActive 
                              ? "bg-primary/10 border-primary/30" 
                              : "bg-slate-900 border-slate-800 hover:border-slate-700"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg transition-colors", isActive ? "bg-primary text-white" : "bg-slate-800 text-slate-400 group-hover:text-white")}>
                              <module.icon className="w-4 h-4" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-white">{module.name}</p>
                               {module.premium && (
                                 <span className="text-[9px] font-black text-amber-500 uppercase tracking-tighter">
                                   {module.tier} FEATURE
                                 </span>
                               )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {access ? (
                              <button 
                                onClick={() => toggleWidget(module.id)}
                                className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                  isActive 
                                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                    : "bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-white"
                                )}
                              >
                                {isActive ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                              </button>
                            ) : (
                              <div className="w-8 h-8 bg-slate-950/50 rounded-lg flex items-center justify-center text-amber-500/50 cursor-help" title="Premium Upgrade notwendig">
                                <Lock className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "layouts" && (
            <div className="space-y-4">
               {LAYOUT_PRESETS.map(preset => {
                 const access = hasAccess(preset.premium, preset.tier)
                 
                 return (
                   <div 
                     key={preset.id}
                     className={cn(
                       "relative p-5 rounded-2xl border transition-all duration-300 group cursor-pointer",
                       access ? "bg-slate-900 border-slate-800 hover:border-primary/50" : "bg-slate-900/50 border-slate-800 opacity-80"
                     )}
                   >
                     {!access && (
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 rounded-full border border-amber-500/30">
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{preset.tier} REQUIRED</span>
                         </div>
                       </div>
                     )}
                     
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-800 rounded-xl">
                           <LayoutIcon className="w-6 h-6 text-primary" />
                        </div>
                        {access && (
                           <Button size="sm" variant="ghost" className="text-[10px] font-black h-8 hover:bg-slate-800">
                             <Eye className="w-3.5 h-3.5 mr-2" /> VORSCHAU
                           </Button>
                        )}
                     </div>

                     <h4 className="text-lg font-black text-white">{preset.name}</h4>
                     <p className="text-xs text-slate-500 mt-1 font-medium">{preset.description}</p>
                     
                     <Button 
                        disabled={!access}
                        onClick={() => applyPreset(preset.id as any)}
                        className={cn(
                          "w-full mt-6 py-6 font-black rounded-xl transition-all",
                          access ? "bg-primary hover:bg-primary/90 text-white" : "bg-slate-800 text-slate-500 border-slate-700"
                        )}
                      >
                        LAYOUT ANWENDEN
                      </Button>
                   </div>
                 )
               })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/10">
          <div className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
             <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Shield className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sicherheitsstatus</p>
                <p className="text-sm font-bold text-white">Cloud Sync aktiv</p>
             </div>
          </div>
        </div>
      </div>
    </>
  )
}
