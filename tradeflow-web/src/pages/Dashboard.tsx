import { useState } from "react"
import { ResponsiveGridLayout, useContainerWidth } from "react-grid-layout"
import { 
  ArrowUpRight, 
  Activity, 
  Cpu,
  LayoutGrid,
  Lock,
  Unlock,
  Save,
  RotateCcw,
  ShieldAlert,
  History,
  Zap
} from "lucide-react"

import { useStore } from "../stores/useStore"
import { DashboardWidget } from "../components/layout/DashboardWidget"
import { Button } from "../components/ui/button"
import { DashboardDrawer } from "../components/dashboard/DashboardDrawer"
import { cn } from "../lib/utils"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts"

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

// Mock Data
const btcData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  price: 43000 + (Math.sin(i / 3) * 1500) + (Math.random() * 500)
}))

const heatmapData = [
  { name: 'BTC', profit: 1200 },
  { name: 'ETH', profit: 800 },
  { name: 'SOL', profit: 450 },
  { name: 'ADA', profit: -120 },
  { name: 'DOT', profit: 80 },
]

// Grid Engine 2.0: Strict Widget Manifest
const WIDGET_MANIFEST: Record<string, { minW: number, minH: number, defaultW: number, defaultH: number }> = {
  // KPIs
  capital: { minW: 2, minH: 2, defaultW: 3, defaultH: 2 },
  daily_pnl: { minW: 2, minH: 2, defaultW: 3, defaultH: 2 },
  winrate: { minW: 2, minH: 2, defaultW: 3, defaultH: 2 },
  bot_status: { minW: 2, minH: 2, defaultW: 3, defaultH: 2 },
  risk_score: { minW: 2, minH: 2, defaultW: 3, defaultH: 2 },
  
  // Charts & Visuals
  main_chart: { minW: 4, minH: 3, defaultW: 9, defaultH: 4 },
  sentiment: { minW: 2, minH: 3, defaultW: 3, defaultH: 4 },
  ai_radar: { minW: 3, minH: 3, defaultW: 6, defaultH: 4 },
  heatmap: { minW: 3, minH: 3, defaultW: 6, defaultH: 4 },
  order_flow: { minW: 4, minH: 4, defaultW: 12, defaultH: 5 },
  
  // Lists & Feeds
  ai_decision_feed: { minW: 3, minH: 3, defaultW: 4, defaultH: 4 },
  watchlist_mini: { minW: 2, minH: 3, defaultW: 4, defaultH: 4 },
  last_signals: { minW: 3, minH: 2, defaultW: 4, defaultH: 3 },
  open_orders: { minW: 3, minH: 2, defaultW: 4, defaultH: 2 },
  
  // System & Health
  node_health: { minW: 4, minH: 2, defaultW: 12, defaultH: 2 },
  journal_snapshot: { minW: 4, minH: 2, defaultW: 12, defaultH: 2 },
}

export function Dashboard() {
  const { capital, winRate, botActive, isDark, isLayoutLocked, toggleLayoutLock, activeWidgets, activeScene, dashboardLayouts, saveLayout, addNotification, isFeatureUnlocked } = useStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeDrawerTab, setActiveDrawerTab] = useState<"layouts" | "modules">("modules")

  // Recharts Dynamic Colors
  const tooltipBg = isDark ? '#0f172a' : '#ffffff'
  const tooltipBorder = isDark ? '#1e293b' : '#e2e8f0'
  const tooltipText = isDark ? '#f8fafc' : '#0f172a'
  const gridColor = isDark ? '#1e293b' : '#e2e8f0'
  
  // Dashboard Layout Sync Engine
  const generateFinalLayout = () => {
    const storedLayouts = dashboardLayouts[activeScene] || { lg: [] }
    const activeIds = activeWidgets || []
    
    // 1. Start with any stored layout from DB/Store
    let currentLg = [...(storedLayouts.lg || [])]
    
    // 2. Filter out items that are no longer active
    currentLg = currentLg.filter(item => activeIds.includes(item.i))
    
    // 3. For any active widget NOT in currentLg, add it with manifest defaults
    activeIds.forEach(id => {
      const exists = currentLg.find(item => item.i === id)
      if (!exists) {
        const config = WIDGET_MANIFEST[id] || { minW: 2, minH: 2, defaultW: 3, defaultH: 2 }
        
        // Find a first available vertical spot to avoid overlapping
        const maxY = currentLg.reduce((acc, curr) => Math.max(acc, curr.y + curr.h), 0)
        
        currentLg.push({
          i: id,
          x: 0,
          y: maxY, // Put at the bottom by default to prevent overlap bugs
          w: config.defaultW,
          h: config.defaultH,
          minW: config.minW,
          minH: config.minH
        })
      } else {
        // Enforce Manifest constraints even on stored layouts
        const config = WIDGET_MANIFEST[id]
        if (config) {
          exists.minW = config.minW
          exists.minH = config.minH
          // Ensure it's not smaller than min
          if (exists.w && exists.w < config.minW) exists.w = config.minW
          if (exists.h && exists.h < config.minH) exists.h = config.minH
        }
      }
    })
    
    return { lg: currentLg }
  }

  const finalLayouts = generateFinalLayout()

  const onLayoutChange = (_: any, allLayouts: any) => {
    if (!isLayoutLocked) {
      saveLayout(activeScene, allLayouts)
    }
  }

  const handleSaveWorkspace = () => {
    addNotification({
      type: "SYSTEM",
      title: "Workspace gespeichert",
      message: `Dein Layout für '${activeScene}' wurde erfolgreich gesichert.`
    })
  }

  const openDrawer = (tab: "layouts" | "modules") => {
    setActiveDrawerTab(tab)
    setIsDrawerOpen(true)
  }

  const { containerRef, width, mounted } = useContainerWidth()

  const activeWidgetIds = activeWidgets || []


  return (
    <div className={cn("space-y-6 pb-24 min-h-screen transition-colors duration-500", isDark ? "bg-[#020617]" : "bg-slate-50")} ref={containerRef}>
      {/* Workspace Header - Theme Aware Sticky */}
      <div className={cn(
        "p-3 flex flex-wrap items-center justify-between gap-4 sticky top-[-24px] z-50 shadow-2xl -mx-6 px-6 border-b transition-all duration-300",
        isDark 
          ? "bg-[#0B0E17]/80 backdrop-blur-xl border-slate-800" 
          : "bg-white/90 backdrop-blur-xl border-slate-200"
      )}>
        <div className="flex items-center gap-4 px-2">
          <div className={cn("flex items-center gap-2 border-r pr-4", isDark ? "border-slate-800" : "border-slate-200")}>
             <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <LayoutGrid className="w-5 h-5" />
             </div>
             <div>
                <h2 className={cn("text-sm font-black leading-none", isDark ? "text-white" : "text-slate-900")}>Trader Classic</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tighter transition-all">WORKSPACE: ACTIVE</p>
             </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => openDrawer("layouts")}
              className="text-[10px] font-black h-8 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              LAYOUTS
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => openDrawer("modules")}
              className="text-[10px] font-black h-8 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              MODULES
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2">
          {/* Layout Lock Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLayoutLock}
            className={cn(
              "h-9 px-4 rounded-xl gap-2 font-black text-[10px] transition-all border",
              isLayoutLocked 
                ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20" 
                : isDark 
                  ? "bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white"
                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
            )}
          >
            {isLayoutLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            {isLayoutLocked ? "LOCKED" : "EDITABLE"}
          </Button>

          <div className={cn("w-px h-6 mx-1", isDark ? "bg-slate-800" : "bg-slate-200")} />

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {}}
            className={cn(
              "h-9 px-4 rounded-xl gap-2 font-black text-[10px] transition-all",
              isDark ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET
          </Button>

          <Button 
            onClick={handleSaveWorkspace}
            className="h-9 px-6 bg-primary hover:bg-primary/90 text-white font-black text-[10px] rounded-xl gap-2 shadow-lg shadow-primary/20"
          >
            <Save className="w-3.5 h-3.5" />
            SAVE WORKSPACE
          </Button>
        </div>
      </div>

      <div className="px-2">
        <h2 className={cn("text-3xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>Terminal Dashboard</h2>
        <p className="text-slate-500 text-sm font-medium">Willkommen zurück, <span className={isDark ? "text-white" : "text-slate-800"}>Admin User</span>. <span className="text-emerald-500 font-bold uppercase text-[10px] ml-2 tracking-widest border border-emerald-500/30 px-2 py-0.5 rounded-full">Layout auto-restored</span></p>
      </div>

      {mounted && (
        <ResponsiveGridLayout
          className="layout"
          layouts={finalLayouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          dragConfig={{ handle: ".group", enabled: !isLayoutLocked }}
          resizeConfig={{ enabled: !isLayoutLocked }}
          onLayoutChange={onLayoutChange}
          margin={[20, 20]}
          width={width}
          rowHeight={100}
        >
        {/* Metric: Capital */}
        {activeWidgetIds.includes("capital") && (
          <div key="capital">
            <DashboardWidget title="GESAMTKAPITAL">
              <div className="space-y-1">
                <div className="text-2xl font-black text-white">€{capital.toLocaleString()}</div>
                <div className="flex items-center text-xs text-emerald-500 font-bold">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +2.4% <span className="text-slate-500 ml-1.5 font-normal tracking-wide italic">diesen Monat</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/30" />
            </DashboardWidget>
          </div>
        )}

        {/* Metric: Daily Profit */}
        {activeWidgetIds.includes("daily_pnl") && (
          <div key="daily_pnl">
            <DashboardWidget title="TAGESGEWINN">
              <div className="space-y-1">
                <div className="text-2xl font-black text-emerald-500">+€184.50</div>
                <div className="flex items-center text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                  HEUTE AKTIV
                </div>
              </div>
            </DashboardWidget>
          </div>
        )}

        {/* Metric: Win Rate */}
        {activeWidgetIds.includes("winrate") && (
          <div key="winrate">
            <DashboardWidget title="WIN RATE">
               <div className="space-y-1">
                <div className="text-2xl font-black text-white">{winRate}%</div>
                <div className="flex items-center text-xs text-primary font-bold">
                  <Activity className="w-3 h-3 mr-1" /> TRENDING UP
                </div>
              </div>
            </DashboardWidget>
          </div>
        )}

        {/* FREE: Bot Quick Toggle */}
        {activeWidgetIds.includes("bot_toggle") && (
          <div key="bot_toggle">
            <DashboardWidget title="BOT QUICK TOGGLE">
               <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500",
                    botActive ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-slate-800"
                  )}>
                    <Zap className={cn("w-8 h-8", botActive ? "text-white animate-pulse" : "text-slate-500")} />
                  </div>
                  <Button variant="outline" size="sm" className="font-black text-[9px] px-6 h-7 border-slate-800">
                    {botActive ? "PAUSE ACTIONS" : "START BOT"}
                  </Button>
               </div>
            </DashboardWidget>
          </div>
        )}

        {/* FREE: Quick Bot Status */}
        {activeWidgetIds.includes("bot_status_live") && (
          <div key="bot_status_live">
            <DashboardWidget title="QUICK BOT STATUS">
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500">RUNTIME</span>
                    <span className="text-[10px] font-black text-emerald-500">NORMAL</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500">HEARTBEAT</span>
                    <span className="text-[10px] font-black text-white">2.4ms</span>
                  </div>
               </div>
            </DashboardWidget>
          </div>
        )}

        {/* FREE: Tagziel Fortschritt */}
        {activeWidgetIds.includes("daily_target") && (
          <div key="daily_target">
            <DashboardWidget title="TAGESZIEL FORTSCHRITT">
               <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-black">
                    <span className="text-white">€184.50</span>
                    <span className="text-slate-500">ZIEL: €250</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[73%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  </div>
                  <p className="text-[9px] text-slate-500 font-bold italic text-center">Noch €65.50 für heute</p>
               </div>
            </DashboardWidget>
          </div>
        )}

        {/* FREE: Watchlist Mini */}
        {activeWidgetIds.includes("watchlist_mini") && (
          <div key="watchlist_mini">
            <DashboardWidget title="WATCHLIST MINI">
               <div className="space-y-2">
                  {[
                    { s: "BTC", p: "43.2k", c: "+1.2%" },
                    { s: "ETH", p: "2.5k", c: "-0.5%" },
                    { s: "SOL", p: "98.2", c: "+4.8%" }
                  ].map(x => (
                    <div key={x.s} className="flex justify-between text-[10px] font-bold">
                       <span className="text-white">{x.s}</span>
                       <span className="text-slate-400">{x.p}</span>
                       <span className={x.c.startsWith('+') ? "text-emerald-500" : "text-rose-500"}>{x.c}</span>
                    </div>
                  ))}
               </div>
            </DashboardWidget>
          </div>
        )}

        {/* FREE: Letzte Signale */}
        {activeWidgetIds.includes("last_signals") && (
          <div key="last_signals">
            <DashboardWidget title="LETZTE SIGNALE">
               <div className="space-y-2 overflow-hidden h-full">
                  {[
                    { t: "BUY", m: "BTC/USDT", v: "82%" },
                    { t: "SELL", m: "ETH/USDT", v: "14%" }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                       <div className={cn("text-[8px] font-black px-1.5 py-0.5 rounded", s.t === "BUY" ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500")}>{s.t}</div>
                       <div className="text-[10px] font-black text-white">{s.m}</div>
                       <div className="ml-auto text-xs font-black text-primary">{s.v}</div>
                    </div>
                  ))}
               </div>
            </DashboardWidget>
          </div>
        )}

        {/* FREE: Offene Orders Mini */}
        {activeWidgetIds.includes("open_orders") && (
          <div key="open_orders">
             <DashboardWidget title="OFFENE ORDERS MINI">
                <div className="flex flex-col items-center justify-center h-full opacity-40">
                   <LayoutGrid className="w-6 h-6 mb-2 text-slate-600" />
                   <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Keine aktiven Orders</span>
                </div>
             </DashboardWidget>
          </div>
        )}

        {/* PREMIUM: AI Decision Feed */}
        {activeWidgetIds.includes("ai_decision_feed") && (
          <div key="ai_decision_feed">
             <DashboardWidget title="AI DECISION FEED" premiumTier="PRO" isLocked={!isFeatureUnlocked("ai_signals")}>
                <div className="space-y-3">
                   <div className="p-2 border-l-2 border-indigo-500 bg-indigo-500/5 rounded-r-lg">
                      <p className="text-[10px] font-black text-indigo-400">Momentum Surge</p>
                      <p className="text-[9px] text-slate-400 italic">"Detected volume spike on ETH, monitoring confirm..."</p>
                   </div>
                </div>
             </DashboardWidget>
          </div>
        )}

        {/* PREMIUM: Risiko Score */}
        {activeWidgetIds.includes("risk_score") && (
          <div key="risk_score">
             <DashboardWidget title="RISIKO SCORE" premiumTier="PRO" isLocked={!isFeatureUnlocked("risk_shield")}>
                <div className="flex flex-col items-center justify-center gap-2">
                   <div className="text-4xl font-black text-emerald-500">12<span className="text-sm text-slate-500">/100</span></div>
                   <div className="px-4 py-1 bg-emerald-500/20 text-emerald-500 text-[10px] font-black rounded-full border border-emerald-500/30 uppercase tracking-widest">VERY SAFE</div>
                </div>
             </DashboardWidget>
          </div>
        )}

        {/* PREMIUM: Drawdown Guard */}
        {activeWidgetIds.includes("drawdown_guard") && (
          <div key="drawdown_guard">
             <DashboardWidget title="DRAWDOWN GUARD" premiumTier="PRO">
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-500">MAXALLOWED DD</span>
                      <span className="text-sm font-black text-white">5.0%</span>
                   </div>
                   <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 w-[12%]" />
                   </div>
                   <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="text-slate-600 uppercase">Current: 0.6%</span>
                      <span className="text-emerald-500 uppercase">ACTIVE</span>
                   </div>
                </div>
             </DashboardWidget>
          </div>
        )}

        {/* PREMIUM: Strategy Compare Mini */}
        {activeWidgetIds.includes("strat_compare") && (
          <div key="strat_compare">
             <DashboardWidget title="STRATEGY COMPARE" premiumTier="PRO">
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-[10px] font-black">
                      <span className="text-white">SCALPER PRO</span>
                      <span className="text-emerald-500">+12%</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black">
                      <span className="text-white">TREND MASTER</span>
                      <span className="text-emerald-500">+8.4%</span>
                   </div>
                </div>
             </DashboardWidget>
          </div>
        )}

        {/* PREMIUM: Heatmap Mini */}
        {activeWidgetIds.includes("heatmap_mini") && (
          <div key="heatmap_mini">
             <DashboardWidget title="HEATMAP MINI" premiumTier="ELITE">
                <div className="grid grid-cols-4 gap-1 h-full">
                   {['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOT', 'AVAX', 'MATIC'].map(c => (
                     <div key={c} className={cn(
                       "aspect-square rounded flex items-center justify-center text-[8px] font-black",
                       Math.random() > 0.4 ? "bg-emerald-500/40 text-emerald-100" : "bg-rose-500/40 text-rose-100"
                     )}>
                        {c}
                     </div>
                   ))}
                </div>
             </DashboardWidget>
          </div>
        )}

        {/* PREMIUM: Session Performance */}
        {activeWidgetIds.includes("session_perf") && (
          <div key="session_perf">
             <DashboardWidget title="SESSION PERFORMANCE" premiumTier="PRO">
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-[9px] font-black text-slate-500">
                      <span>ASIA</span>
                      <span className="text-rose-400">-0.2%</span>
                   </div>
                   <div className="flex justify-between items-center text-[9px] font-black text-slate-500">
                      <span>LONDON</span>
                      <span className="text-emerald-400">+1.5%</span>
                   </div>
                   <div className="flex justify-between items-center text-[9px] font-black text-slate-500">
                      <span>NY</span>
                      <span className="text-emerald-400">+2.4%</span>
                   </div>
                </div>
             </DashboardWidget>
          </div>
        )}

        {/* PREMIUM: Coin Strength Meter */}
        {activeWidgetIds.includes("coin_strength") && (
          <div key="coin_strength">
             <DashboardWidget title="COIN STRENGTH METER" premiumTier="PRO">
                <div className="flex flex-col gap-2">
                   {['STRONG BUY', 'BULLISH', 'NEUTRAL'].map((x, i) => (
                     <div key={x} className="flex items-center gap-2">
                        <div className={cn("h-1 flex-1 rounded-full", i === 0 ? "bg-emerald-500" : i === 1 ? "bg-emerald-500/40" : "bg-slate-700")} />
                        <span className="text-[8px] font-black text-slate-500 w-16">{x}</span>
                     </div>
                   ))}
                </div>
             </DashboardWidget>
          </div>
        )}

        {/* PREMIUM: Smart Alerts Panel */}
        {activeWidgetIds.includes("smart_alerts") && (
          <div key="smart_alerts">
             <DashboardWidget title="SMART ALERTS PANEL" premiumTier="PRO">
                <div className="space-y-2">
                   <div className="p-2 bg-slate-900 border-l-2 border-amber-500 rounded flex gap-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <p className="text-[9px] font-black text-white italic">"Volatility spike on BTC detected."</p>
                   </div>
                </div>
             </DashboardWidget>
          </div>
        )}

        {/* PREMIUM: Runtime / Node Health */}
        {activeWidgetIds.includes("node_health") && (
          <div key="node_health">
             <DashboardWidget title="RUNTIME / NODE HEALTH" premiumTier="ELITE">
                <div className="grid grid-cols-2 gap-2 h-full">
                   <div className="bg-slate-950 p-2 rounded flex flex-col justify-center">
                      <span className="text-[8px] text-slate-500 font-black">CPU LOAD</span>
                      <span className="text-xs font-black text-white">12.4%</span>
                   </div>
                   <div className="bg-slate-950 p-2 rounded flex flex-col justify-center">
                      <span className="text-[8px] text-slate-500 font-black">MEMORY</span>
                      <span className="text-xs font-black text-white">1.2GB</span>
                   </div>
                </div>
             </DashboardWidget>
          </div>
        )}

        {/* PREMIUM: Journal Snapshot Pro */}
        {activeWidgetIds.includes("journal_snapshot") && (
          <div key="journal_snapshot">
             <DashboardWidget title="JOURNAL SNAPSHOT PRO" premiumTier="PRO">
                <div className="space-y-2">
                   <div className="h-12 bg-slate-900 rounded border border-slate-800 flex items-center justify-center">
                      <History className="w-4 h-4 text-slate-700" />
                   </div>
                   <div className="text-[9px] text-center font-bold text-slate-500 italic">"3 Trades marked for review today."</div>
                </div>
             </DashboardWidget>
          </div>
        )}

        {/* Legacy/Existing Metric: Bot Status */}
        {activeWidgetIds.includes("bot_status") && (
          <div key="bot_status">
            <DashboardWidget title="BOT STATUS">
               <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${botActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500'} animate-pulse`} />
                  <div className="text-xl font-black text-white">{botActive ? "AKTIV" : "INAKTIV"}</div>
               </div>
               <div className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">
                 4 STRATEGIEN AUSGEFÜHRT
               </div>
            </DashboardWidget>
          </div>
        )}

        {/* Main Chart */}
        {activeWidgetIds.includes("main_chart") && (
          <div key="main_chart">
            <DashboardWidget title="PREISVERLAUF ANALYTICS">
              <div className="h-full w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={btcData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.5} />
                    <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', color: tooltipText }}
                      itemStyle={{ color: '#3B82F6', fontWeight: 'black' }}
                    />
                    <Area type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DashboardWidget>
          </div>
        )}

        {/* Premium: Sentiment Radar */}
        {activeWidgetIds.includes("sentiment") && (
          <div key="sentiment">
            <DashboardWidget title="MARKT-STIMMUNG" premiumTier="PRO">
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                 <div className="relative w-28 h-28 flex items-center justify-center border-8 border-slate-900 rounded-full">
                    <div className="text-2xl font-black text-emerald-500">72</div>
                    <div className="absolute inset-0 border-8 border-emerald-500 rounded-full border-t-transparent animate-spin duration-[3s]" />
                 </div>
                 <div className="text-center">
                   <div className="text-xs font-black text-white uppercase tracking-widest">GREED DETECTED</div>
                   <div className="text-[10px] text-slate-500 mt-1">Stimmung ist optimistisch</div>
                 </div>
              </div>
            </DashboardWidget>
          </div>
        )}

        {/* Premium: AI Radar */}
        {activeWidgetIds.includes("ai_radar") && (
          <div key="ai_radar">
            <DashboardWidget title="KI SIGNAL RADAR" premiumTier="ELITE">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="space-y-4">
                   <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-ai font-black mb-1">KI VORHERSAGE</div>
                      <div className="text-lg font-black text-white">UPTREND 82%</div>
                   </div>
                   <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold mb-1">KONFIIDENZ</div>
                      <div className="text-lg font-black text-primary">STARK</div>
                   </div>
                </div>
                <div className="flex items-center justify-center">
                   <Cpu className="w-16 h-16 text-ai animate-pulse" />
                </div>
              </div>
            </DashboardWidget>
          </div>
        )}

        {/* Premium: Heatmap */}
        {activeWidgetIds.includes("heatmap") && (
          <div key="heatmap">
            <DashboardWidget title="EXPOSURE HEATMAP" premiumTier="ELITE">
              <div className="h-full w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={heatmapData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} fontStyle="italic" axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="profit" radius={[0, 4, 4, 0]}>
                        {heatmapData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.profit > 0 ? '#10B981' : '#F43F5E'} />
                        ))}
                      </Bar>
                   </BarChart>
                 </ResponsiveContainer>
              </div>
            </DashboardWidget>
          </div>
        )}

        {/* Premium: Order Flow (Stub) */}
        {activeWidgetIds.includes("order_flow") && (
          <div key="order_flow">
            <DashboardWidget title="ORDER FLOW ANALYSIS" premiumTier="ELITE">
              <div className="flex items-center justify-center h-full text-slate-500 font-bold uppercase text-[10px] tracking-widest italic">
                Realtime Tape stream is starting...
              </div>
            </DashboardWidget>
          </div>
        )}

        {/* Premium: Risk Control (Stub) */}
        {activeWidgetIds.includes("risk_dashboard") && (
          <div key="risk_dashboard">
            <DashboardWidget title="SMART RISK CONTROL" premiumTier="PRO">
              <div className="flex items-center justify-center h-full text-slate-500 font-bold uppercase text-[10px] tracking-widest italic text-center px-6">
                Active risk protection is monitoring your nodes.
              </div>
            </DashboardWidget>
          </div>
        )}
        </ResponsiveGridLayout>
      )}

      {/* Dashboard Customization Drawer */}
      <DashboardDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeDrawerTab}
        setActiveTab={setActiveDrawerTab}
      />
    </div>
  )
}
