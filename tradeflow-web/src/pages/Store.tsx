import { useState } from "react"
import { 
  ShoppingBag, 
  Star, 
  Zap, 
  ShieldCheck, 
  LayoutGrid, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  Cpu, 
  BrainCircuit
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useStore } from "../stores/useStore"
import { cn } from "../lib/utils"

const CATEGORIES = [
  { id: "all", name: "Alle Produkte", icon: ShoppingBag },
  { id: "strategies", name: "KI Strategien", icon: Star },
  { id: "layouts", name: "Layout Packs", icon: LayoutGrid },
  { id: "ai", name: "AI Hub", icon: Zap },
  { id: "risk", name: "Risk Tools", icon: ShieldCheck },
  { id: "packs", name: "Feature Packs", icon: Cpu },
]

const PRODUCTS = [
  {
    id: "bundle_ai_elite",
    name: "AI Elite Bundle",
    category: "ai",
    price: 99.00,
    oldPrice: 159.00,
    badge: "PREMIUM",
    color: "from-purple-500 to-pink-500",
    features: ["Alle KI Strategien", "AI Command Layout", "Full Risk Center", "AI Insights Panel"],
    icon: Zap,
    isBundle: true
  },
  {
    id: "strat_momentum_pro",
    name: "Momentum Pro v4",
    category: "strategies",
    price: 29.00,
    oldPrice: null,
    badge: "NEU",
    color: "from-blue-500 to-indigo-500",
    features: ["Trend Detection", "Auto Stop-Loss", "Forex & Crypto"],
    icon: Star,
    isBundle: false
  },
  {
    id: "layout_pro_dark",
    name: "Deep Dark UI Pro",
    category: "layouts",
    price: 19.00,
    oldPrice: 39.00,
    badge: "BESTSELLER",
    color: "from-slate-700 to-slate-900",
    features: ["Custom Grid Layout", "6 New Widgets", "SVG Animations"],
    icon: LayoutGrid,
    isBundle: false
  },
  {
    id: "risk_shield_auto",
    name: "Risk Shield Auto",
    category: "risk",
    price: 45.00,
    oldPrice: null,
    badge: "PRO",
    color: "from-emerald-500 to-emerald-700",
    features: ["Automatic Deleveraging", "Drawdown Protection", "Multi-Exchange Logic"],
    icon: ShieldCheck,
    isBundle: false
  },
  {
    id: "ai_market_gpt",
    name: "Market GPT Logic",
    category: "ai",
    price: 59.00,
    oldPrice: 89.00,
    badge: "HOT",
    color: "from-orange-500 to-red-500",
    features: ["LLM Sentiment Feed", "News Event Analysis", "Discord/Twitter Sync"],
    icon: Cpu,
    isBundle: false
  },
  // 12 NEW PRODUCTS
  {
    id: "pack_essentials",
    name: "Dashboard Essentials",
    category: "packs",
    price: 9.00,
    badge: "BASIC",
    color: "from-slate-500 to-slate-700",
    features: ["Bot Toggle Widget", "Quick Status", "Mini Watchlist"],
    icon: LayoutGrid
  },
  {
    id: "pack_analytics_pro",
    name: "Analytics Pro Pack",
    category: "packs",
    price: 19.00,
    badge: "PRO",
    color: "from-blue-600 to-indigo-600",
    features: ["Equity Curve", "Drawdown Chart", "Strategy Ranking"],
    icon: BrainCircuit
  },
  {
    id: "pack_ai_insight",
    name: "AI Insight Pack",
    category: "ai",
    price: 24.00,
    badge: "AI+",
    color: "from-purple-600 to-purple-900",
    features: ["AI Decision Feed", "Sentiment Radar", "Pattern Detection"],
    icon: Zap
  },
  {
    id: "pack_risk_control",
    name: "Risk Control Pack",
    category: "risk",
    price: 21.00,
    badge: "PRO",
    color: "from-rose-600 to-rose-900",
    features: ["Risk Score Widget", "Drawdown Guard", "Stop-Loss Automation"],
    icon: ShieldCheck
  },
  {
    id: "pack_bot_monitoring",
    name: "Bot Monitoring Pack",
    category: "operator",
    price: 18.00,
    badge: "NODE",
    color: "from-emerald-600 to-emerald-900",
    features: ["Node Health Widget", "Runtime Stats", "Heartbeat Logs"],
    icon: Cpu
  },
  {
    id: "pack_journal_pro",
    name: "Journal Pro Pack",
    category: "packs",
    price: 14.00,
    badge: "ELITE",
    color: "from-indigo-400 to-indigo-600",
    features: ["Journal Snapshot", "AI Reasoning Logs", "Trade Labels"],
    icon: ShoppingBag
  },
  {
    id: "bundle_elite_dash",
    name: "Elite Dashboard Pack",
    category: "layouts",
    price: 29.00,
    badge: "ELITE",
    color: "from-amber-500 to-orange-600",
    features: ["3 Premium Layouts", "All Master Widgets", "Custom Grid SVGs"],
    icon: LayoutGrid,
    isBundle: true
  },
  {
    id: "bundle_operator",
    name: "Operator Bundle",
    category: "packs",
    price: 39.00,
    badge: "BEST VALUE",
    color: "from-cyan-500 to-blue-600",
    features: ["Risk + Monitoring", "Server Control Hub", "24/7 Node Watcher"],
    icon: Cpu,
    isBundle: true
  },
  {
    id: "pack_layout_master",
    name: "Layout Master Pack",
    category: "layouts",
    price: 12.00,
    badge: "PRO",
    color: "from-slate-800 to-black",
    features: ["Scalper Layout", "Dual Monitor Grid", "Touch Layout"],
    icon: LayoutGrid
  },
  {
    id: "pack_market_insight",
    name: "Market Insight Pack",
    category: "ai",
    price: 17.00,
    badge: "HOT",
    color: "from-orange-400 to-red-600",
    features: ["Coin Strength Meter", "Heatmap Mini", "Global Trend"],
    icon: Zap
  },
  {
    id: "pack_alert_intel",
    name: "Alert Intelligence",
    category: "packs",
    price: 11.00,
    badge: "NEW",
    color: "from-indigo-900 to-purple-900",
    features: ["Smart Alerts Panel", "Discord Sync", "Telegram Bot"],
    icon: Zap
  },
  {
    id: "upgrade_elite_control",
    name: "Elite Control Upgrade",
    category: "packs",
    price: 49.00,
    badge: "ULTRA",
    color: "from-yellow-400 to-amber-600",
    features: ["Full Control Center", "Automation Lab", "Market Scanner"],
    icon: ShieldCheck,
    isBundle: true
  }
]

export function Store() {
  const { addToCart, cart } = useStore()
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20">
      {/* Category Sidebar */}
      <aside className="w-full lg:w-64 space-y-8">
        <div>
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">Kategorien</h3>
           <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-xs transition-all",
                    activeCategory === cat.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  )}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                  {cat.id === "all" && <span className="ml-auto opacity-50 px-2 bg-black/20 rounded-md text-[9px]">{PRODUCTS.length}</span>}
                </button>
              ))}
           </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden group border-indigo-500/30">
           <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-indigo-500/20 transition-all" />
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Treuprogramm</p>
           <p className="text-xs font-bold text-slate-300 leading-relaxed mb-4">Erhalte Rabatte basierend auf deinem Handelsvolumen.</p>
           <Button variant="link" className="text-primary p-0 h-auto text-xs font-black group-hover:gap-2 transition-all">PROGRAMM DETAILS <ArrowRight className="w-3 h-3" /></Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Search & Stats Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-[32px] gap-6">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Strategien, Layouts oder Module suchen..." 
                className="pl-11 bg-slate-950 border-slate-800 h-12 rounded-2xl text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-4 shrink-0">
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                      U{i}
                   </div>
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-primary flex items-center justify-center text-[10px] font-black text-white">
                    +12k
                 </div>
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AKTIVE NUTZER IM STORE</div>
           </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-primary/40 transition-all shadow-xl">
              <div className={cn("h-40 relative flex items-center justify-center bg-gradient-to-br transition-all duration-500", product.color)}>
                <product.icon className="w-16 h-16 text-white/20 group-hover:scale-110 group-hover:text-white/40 transition-all duration-500" />
                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-black tracking-widest border border-white/10 uppercase">
                   {product.badge}
                </div>
                {product.isBundle && (
                  <div className="absolute bottom-4 left-4 bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-full font-black tracking-widest shadow-lg shadow-emerald-500/20">
                     BEST VALUE
                  </div>
                )}
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-black text-white leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                   <div className="flex flex-col items-end">
                      <span className="text-2xl font-black text-white">€{product.price}</span>
                      {product.oldPrice && <span className="text-[10px] font-bold text-slate-500 line-through">€{product.oldPrice}</span>}
                   </div>
                </div>

                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">
                   {CATEGORIES.find(c => c.id === product.category)?.name}
                </p>

                <ul className="space-y-4 mb-10 flex-1">
                   {product.features.map(f => (
                     <li key={f} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{f}</span>
                     </li>
                   ))}
                </ul>

                <div className="relative">
                   <Button 
                     onClick={() => addToCart(product.id)}
                     className={cn(
                       "w-full py-7 font-black rounded-2xl shadow-lg transition-all active:scale-95 text-xs tracking-widest uppercase",
                       cart.includes(product.id)
                         ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                         : "bg-white hover:bg-slate-200 text-slate-950 shadow-white/5"
                     )}
                   >
                     {cart.includes(product.id) ? "IM WARENKORB" : product.isBundle ? "BUNDLE FREISCHALTEN" : "JETZT KAUFEN"}
                   </Button>
                   {!cart.includes(product.id) && (
                     <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-white opacity-20 blur-sm rounded-full group-hover:opacity-40 transition-opacity" />
                   )}
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
             <div className="col-span-full py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto opacity-50">
                   <ShoppingBag className="w-10 h-10 text-slate-500" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-white">Keine Produkte gefunden</h3>
                   <p className="text-slate-500 font-bold uppercase text-[10px] mt-2">Versuche es mit einem anderen Suchbegriff oder einer anderen Kategorie</p>
                </div>
                <Button variant="outline" onClick={() => { setActiveCategory("all"); setSearchTerm(""); }} className="border-slate-800 text-slate-400 font-black px-10 rounded-2xl">SUCHE ZURÜCKSETZEN</Button>
             </div>
          )}
        </div>

        {/* Cross Selling Banner */}
        <div className="bg-[#0b0e17] border border-indigo-500/20 rounded-[40px] p-12 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full -mr-[200px] -mt-[200px] blur-[100px] group-hover:bg-indigo-500/10 transition-all duration-1000" />
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-500/30">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">TOP ANGEBOT ZUM WOCHENENDE</span>
                 </div>
                 <h2 className="text-4xl font-black text-white leading-tight">Maximiere deinen Profit mit dem AI Mastery Pack</h2>
                 <p className="text-lg font-bold text-slate-500 leading-relaxed italic">
                   Kombiniere unsere stärksten KI-Modelle mit dem neuen Scalper Dashboard und erhalte das Risk-Center 2.0 gratis dazu.
                 </p>
                 <div className="flex gap-4">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-black px-10 py-6 rounded-2xl shadow-xl shadow-primary/20">MEHR SEHEN</Button>
                    <div className="flex flex-col justify-center">
                       <span className="text-2xl font-black text-white">€129.00</span>
                       <span className="text-[10px] font-bold text-slate-600 line-through">STATT €249.00</span>
                    </div>
                 </div>
              </div>
              <div className="relative hidden lg:block">
                 <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 blur-[100px] -rotate-12 group-hover:opacity-30 transition-all duration-1000" />
                 <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[48px] transform rotate-3 group-hover:rotate-0 transition-all duration-700 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-6 mb-8">
                       <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                          <BrainCircuit className="w-10 h-10 text-white" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors">AI INSIGHTS GENERATOR</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">MODULE ACTIVATED</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="h-4 bg-white/5 rounded-full w-full" />
                       <div className="h-4 bg-white/5 rounded-full w-[80%]" />
                       <div className="h-4 bg-white/5 rounded-full w-[90%]" />
                       <div className="flex items-center gap-3 pt-6">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                             <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trade Confirmations Online</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
