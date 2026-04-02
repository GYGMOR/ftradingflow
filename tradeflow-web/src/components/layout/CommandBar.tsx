import { useState, useEffect, useCallback } from "react"
import { Search, Hash, Zap, ShieldAlert, Cpu, ArrowRight, Command, MessageSquare, LayoutGrid, History } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useStore } from "../../stores/useStore"
import { cn } from "../../lib/utils"

export function CommandBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const { toggleBot, botActive } = useStore()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault()
      setIsOpen(prev => !prev)
    }
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const ACTIONS = [
    { id: "nav-dash", label: "Dashboard öffnen", icon: LayoutGrid, category: "Navigation", action: () => navigate("/dashboard") },
    { id: "nav-journal", label: "Trade Journal", icon: History, category: "Navigation", action: () => navigate("/journal") },
    { id: "bot-toggle", label: botActive ? "Bot stoppen" : "Bot starten", icon: Zap, category: "System", action: () => toggleBot() },
    { id: "bot-panic", label: "PANIC: Alle Positionen schließen", icon: ShieldAlert, category: "Danger", action: () => console.log("PANIC"), danger: true },
    { id: "nav-ai", label: "AI Insights Feed", icon: MessageSquare, category: "Module", action: () => navigate("/ai-insights") },
    { id: "nav-nodes", label: "Server Nodes Status", icon: Cpu, category: "System", action: () => navigate("/server-nodes") },
  ]

  const filteredActions = ACTIONS.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase()) || 
    a.category.toLowerCase().includes(query.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsOpen(false)} />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#0B0E17] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        <div className="flex items-center p-6 border-b border-slate-800 gap-4">
           <Search className="w-5 h-5 text-slate-500" />
           <input 
             autoFocus
             placeholder="Tippe einen Befehl oder suche eine Seite... (z.B. /panic)"
             className="flex-1 bg-transparent border-none text-white font-black text-lg focus:outline-none placeholder:text-slate-700"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
           />
           <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-[10px] font-black text-slate-500 tracking-tighter transition-all">ESC TO CLOSE</span>
           </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
           {filteredActions.length > 0 ? (
             <div className="space-y-6">
                {["Navigation", "System", "Module", "Danger"].map(cat => {
                   const items = filteredActions.filter(a => a.category === cat)
                   if (items.length === 0) return null
                   
                   return (
                     <div key={cat} className="space-y-2">
                        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">{cat}</h3>
                        <div className="grid grid-cols-1 gap-1">
                           {items.map(item => (
                             <button
                               key={item.id}
                               onClick={() => { item.action(); setIsOpen(false); }}
                               className={cn(
                                 "w-full flex items-center justify-between p-4 rounded-2xl group transition-all duration-200",
                                 item.danger 
                                   ? "hover:bg-rose-500/10 hover:border-rose-500/20 border border-transparent" 
                                   : "hover:bg-white/5 hover:border-white/10 border border-transparent"
                               )}
                             >
                               <div className="flex items-center gap-4">
                                  <div className={cn(
                                    "p-2.5 rounded-xl border transition-all",
                                    item.danger 
                                      ? "bg-rose-500/10 border-rose-500/20 text-rose-500" 
                                      : "bg-slate-900 border-slate-800 text-slate-400 group-hover:text-primary group-hover:border-primary/30"
                                  )}>
                                     <item.icon className="w-4 h-4" />
                                  </div>
                                  <span className={cn(
                                    "text-sm font-black transition-colors",
                                    item.danger ? "text-rose-500" : "text-slate-300 group-hover:text-white"
                                  )}>{item.label}</span>
                               </div>
                               <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-slate-500">
                                  <span className="text-[10px] font-black uppercase tracking-widest">Ausführen</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                               </div>
                             </button>
                           ))}
                        </div>
                     </div>
                   )
                })}
             </div>
           ) : (
             <div className="py-20 text-center space-y-4">
                <Hash className="w-12 h-12 text-slate-800 mx-auto" />
                <div>
                   <p className="text-sm font-black text-white">Keine Befehle gefunden</p>
                   <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Versuche es mit 'Dashboard', 'Bot' oder 'Panic'</p>
                </div>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 rounded-lg border border-slate-800">
                 <Command className="w-3 h-3 text-slate-500" />
                 <span className="text-[10px] font-black text-slate-500">K</span>
              </div>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">TO TOGGLE ANYTIME</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic decoration-primary underline underline-offset-4">Premium AI Command-Line</span>
           </div>
        </div>
      </div>
    </div>
  )
}
