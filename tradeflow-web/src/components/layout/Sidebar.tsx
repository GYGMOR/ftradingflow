import { NavLink } from "react-router-dom"
import { 
  LayoutDashboard, 
  ActivitySquare, 
  BarChart2, 
  PieChart, 
  Wallet, 
  Settings, 
  Moon,
  Sun,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ShieldAlert,
  BrainCircuit,
  Lock,
  Cpu,
  History,
  MonitorDown
} from "lucide-react"
import { cn } from "../../lib/utils"
import { useStore } from "../../stores/useStore"
import { Switch } from "../ui/switch"
import { useState } from "react"
import { PremiumTeaserModal } from "../ui/PremiumTeaserModal"
import { usePlatform } from "../../hooks/usePlatform"

const navItems = {
  standard: [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/trading", label: "Live Trading", icon: ActivitySquare },
    { path: "/strategies", label: "Strategien", icon: BarChart2 },
    { path: "/analytics", label: "Analytics", icon: PieChart },
    { path: "/store", label: "Trading Store", icon: ShoppingBag, isStore: true },
  ],
  professional: [
    { path: "/control-center", label: "Control Center", icon: ShieldAlert, premium: true },
    { path: "/risk-center", label: "Risk Center", icon: Lock, premium: true },
    { path: "/ai-insights", label: "AI Insights", icon: BrainCircuit, premium: true },
    { path: "/server-nodes", label: "Server & Nodes", icon: Cpu, premium: true },
    { path: "/journal", label: "Trade Journal", icon: History, premium: true },
  ],
  system: [
    { path: "/exchanges", label: "Börsen & API", icon: Wallet },
    { path: "/settings", label: "Einstellungen", icon: Settings },
  ],
  admin: [
    { path: "/admin-dashboard", label: "Admin Panel", icon: ShieldAlert, isAdmin: true },
  ]
}

const SIDEBAR_ENTITLEMENTS: Record<string, string> = {
  "/control-center": "upgrade_elite_control",
  "/risk-center": "pack_risk_control",
  "/ai-insights": "pack_ai_insight",
  "/server-nodes": "pack_bot_monitoring",
  "/journal": "pack_journal_pro",
}

export function Sidebar() {
  const { isDark, toggleTheme, botActive, isSidebarCollapsed, toggleSidebar, user, logout } = useStore()
  const { isWeb } = usePlatform()
  const [teaserData, setTeaserData] = useState<{ open: boolean; name: string; tier: "PRO" | "ELITE" }>({
    open: false,
    name: "",
    tier: "PRO"
  })

  const openTeaser = (name: string, path: string) => {
    const tier = (path === "/control-center" || path === "/ai-insights" || path === "/server-nodes") ? "ELITE" : "PRO"
    setTeaserData({ open: true, name, tier })
  }

  return (
    <div 
      className={cn(
        "border-r border-border bg-sidebar text-foreground h-full flex flex-col justify-between shrink-0 transition-all duration-300 relative z-50",
        isSidebarCollapsed ? "w-[80px]" : "w-[240px]"
      )}
      style={{ marginTop: 'var(--titlebar-height)', height: 'calc(100% - var(--titlebar-height))' }}
    >
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/90 transition-transform z-10"
      >
        {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar">
        <div className={cn("h-[60px] flex items-center border-b border-slate-800 overflow-hidden shrink-0", isSidebarCollapsed ? "justify-center px-0" : "px-6")}>
          <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-400 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/30 shrink-0", !isSidebarCollapsed && "mr-3")}>
            TF
          </div>
          {!isSidebarCollapsed && (
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              TradeFlow
            </span>
          )}
        </div>
        
        <nav className="p-3 space-y-6 mt-2">
          {/* STANDARD SECTION */}
          <div>
            {!isSidebarCollapsed && <h4 className="px-5 mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Main</h4>}
            <div className="space-y-1">
              {navItems.standard.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center text-sm font-semibold transition-all duration-200 group overflow-hidden border-l-4 relative",
                    isSidebarCollapsed ? "justify-center px-0 py-3" : "px-3 py-3 mx-2 rounded-r-lg",
                    isActive 
                      ? "bg-indigo-500/20 text-indigo-500 border-indigo-500" 
                      : cn("border-transparent hover:bg-slate-800/10", isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")
                  )}
                >
                  <item.icon className={cn("shrink-0 transition-transform duration-200 group-hover:scale-110", isSidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3")} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  {item.isStore && !isSidebarCollapsed && (
                    <span className="ml-auto bg-primary text-[10px] px-1.5 py-0.5 rounded-full text-white font-black animate-pulse">SALE</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* PROFESSIONAL SECTION */}
          <div>
            {!isSidebarCollapsed && <h4 className="px-5 mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
              Professional <Lock className="w-2.5 h-2.5 ml-2 text-indigo-500" />
            </h4>}
            <div className="space-y-1">
              {navItems.professional.map((item) => {
                const isLocked = SIDEBAR_ENTITLEMENTS[item.path] && 
                                !useStore.getState().isFeatureUnlocked(item.path.replace('/', '')) && 
                                !useStore.getState().isFeatureUnlocked(SIDEBAR_ENTITLEMENTS[item.path]);
                
                return (
                  <div key={item.path} className="relative group">
                    <NavLink
                      to={isLocked ? "#" : item.path}
                      onClick={(e) => {
                        if (isLocked) {
                          e.preventDefault();
                          openTeaser(item.label, item.path);
                        }
                      }}
                      className={({ isActive }) => cn(
                        "flex items-center text-sm font-semibold transition-all duration-300 group overflow-hidden border-l-4",
                        isSidebarCollapsed ? "justify-center px-0 py-3" : "px-3 py-3 mx-2 rounded-r-lg",
                        isActive && !isLocked
                          ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                          : cn("border-transparent", isDark ? "text-slate-500 hover:bg-slate-800/30 hover:text-slate-300" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"),
                        isLocked && "hover:bg-amber-500/5 opacity-60"
                      )}
                    >
                      <div className="relative">
                        <item.icon className={cn(
                          "shrink-0 transition-all duration-300", 
                          isSidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3",
                          isLocked && "blur-[1px]"
                        )} />
                        {isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center -left-1">
                            <Lock className="w-2.5 h-2.5 text-amber-500 shadow-sm" />
                          </div>
                        )}
                      </div>
                      {!isSidebarCollapsed && (
                        <>
                          <span className={cn("truncate transition-all", isLocked && "text-slate-600 font-medium")}>{item.label}</span>
                          {isLocked && (
                            <span className="ml-auto text-[8px] font-black bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 tracking-tighter">
                              { (item.path === "/control-center" || item.path === "/ai-insights" || item.path === "/server-nodes") ? "ELITE" : "PRO" }
                            </span>
                          )}
                          {!isLocked && <ChevronRight className="ml-auto w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </>
                      )}
                    </NavLink>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SYSTEM SECTION */}
          <div>
            {!isSidebarCollapsed && <h4 className="px-5 mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">System</h4>}
            <div className="space-y-1">
              {navItems.system.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center text-sm font-semibold transition-all duration-200 group overflow-hidden border-l-4",
                    isSidebarCollapsed ? "justify-center px-0 py-3" : "px-3 py-3 mx-2 rounded-r-lg",
                    isActive 
                      ? cn("text-white border-slate-500", isDark ? "bg-slate-700" : "bg-slate-300 text-slate-900")
                      : cn("border-transparent hover:bg-slate-800/10", isDark ? "text-slate-500 hover:text-white" : "text-slate-500 hover:text-slate-900")
                  )}
                >
                  <item.icon className={cn("shrink-0", isSidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3")} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
          {/* ADMIN SECTION */}
          {user?.role === "ADMIN" && (
            <div>
              {!isSidebarCollapsed && <h4 className="px-5 mb-2 text-[10px] font-black text-rose-500 uppercase tracking-widest">Administration</h4>}
              <div className="space-y-1">
                {navItems.admin.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center text-sm font-semibold transition-all duration-200 group overflow-hidden border-l-4",
                      isSidebarCollapsed ? "justify-center px-0 py-3" : "px-3 py-3 mx-2 rounded-r-lg",
                      isActive 
                        ? "bg-rose-500/20 text-rose-500 border-rose-500" 
                        : cn("border-transparent hover:bg-rose-500/5", isDark ? "text-slate-400 hover:text-rose-400" : "text-slate-600 hover:text-rose-600")
                    )}
                  >
                    <item.icon className={cn("shrink-0", isSidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3")} />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>

      <div className="p-3 space-y-4 border-t border-slate-800 shrink-0 bg-sidebar">
        {/* DESKTOP APP CTA (Web Only) */}
        {isWeb && (
          <div className="mb-2">
            {!isSidebarCollapsed ? (
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <MonitorDown className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Desktop Required</span>
                </div>
                <a 
                  href="http://localhost:5000/downloads/TradeFlow_Installer.exe" 
                  download
                  className="w-full py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-[9px] font-black rounded-lg transition-colors uppercase tracking-wider block text-center"
                >
                  DOWNLOAD APP
                </a>
              </div>
            ) : (
              <div className="flex justify-center">
                <a 
                  href="http://localhost:5000/downloads/TradeFlow_Installer.exe" 
                  download
                  title="Desktop App herunterladen"
                  className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all"
                >
                  <MonitorDown className="w-5 h-5" />
                </a>
              </div>
            )}
          </div>
        )}

        <div className={cn("flex items-center justify-between", isSidebarCollapsed ? "justify-center flex-col space-y-2 h-[40px]" : "px-2")}>
          {!isSidebarCollapsed && <span className="text-xs font-semibold text-slate-500 tracking-wider">BOT STATUS</span>}
          <div className={cn("text-xs font-black flex items-center", botActive ? "text-emerald-500" : "text-rose-500")} title={isSidebarCollapsed ? (botActive ? "Bot Aktiv" : "Bot Pausiert") : undefined}>
            {!isSidebarCollapsed && (botActive ? "AKTIV" : "PAUSIERT")}
            <span className={cn("relative flex h-2.5 w-2.5", !isSidebarCollapsed && "ml-2")}>
              {botActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>}
              <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", botActive ? "bg-emerald-500" : "bg-rose-500")}></span>
            </span>
          </div>
        </div>

        <div className={cn("flex items-center justify-between", isSidebarCollapsed ? "justify-center flex-col space-y-2 h-[40px]" : "px-2")}>
          {!isSidebarCollapsed && (
            <span className="text-xs font-semibold text-slate-500 flex items-center tracking-wider">
              {isDark ? <Moon className="w-3.5 h-3.5 mr-2" /> : <Sun className="w-3.5 h-3.5 mr-2" />}
              {isDark ? "DARK" : "LIGHT"}
            </span>
          )}
          {isSidebarCollapsed && (isDark ? <Moon className="w-5 h-5 text-slate-500 mb-1" /> : <Sun className="w-5 h-5 text-slate-500 mb-1" />)}
          <Switch checked={isDark} onCheckedChange={toggleTheme} className={isSidebarCollapsed ? "scale-75" : ""} />
        </div>

        {/* User Profile (Desktop Only) */}
        {!isWeb && (
          <div className={cn("flex items-center pt-2 border-t border-slate-800/50 mt-2", isSidebarCollapsed ? "justify-center" : "")}>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold shrink-0 shadow-sm overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                (user?.fullName || "AU").substring(0, 2).toUpperCase()
              )}
            </div>
            {!isSidebarCollapsed && (
              <>
                <div className="ml-3 flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{user?.fullName || "Admin User"}</p>
                  <p className="text-[11px] font-medium text-slate-500 truncate">{user?.email || "admin@tradeflow.io"}</p>
                </div>
                <button 
                  onClick={logout}
                  className="text-slate-500 hover:text-rose-500 p-1.5 rounded-md hover:bg-rose-500/10 transition-colors shrink-0"
                  title="Abmelden"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <PremiumTeaserModal 
        isOpen={teaserData.open} 
        onClose={() => setTeaserData(prev => ({ ...prev, open: false }))}
        featureName={teaserData.name}
        tier={teaserData.tier}
      />
    </div>
  )
}
