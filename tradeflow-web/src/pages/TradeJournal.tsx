import { useState } from "react"
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Download, 
  ChevronRight, 
  LayoutList,
  Target,
  Clock,
  History,
  BrainCircuit,
  MessageSquare
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { cn } from "../lib/utils"

const MOCK_TRADES = [
  { id: "t1", symbol: "BTC/USDT", side: "LONG", entryPrice: 42150.20, exitPrice: 43210.50, amount: 0.15, pnl: 159.04, pnlPercent: 2.5, duration: "4h 20m", strategy: "AI Scalper v2", status: "CLOSED", timestamp: "2024-04-01 14:20", reason: "EMA 50/200 Cross + Bullish Divergence" },
  { id: "t2", symbol: "ETH/USDT", side: "SHORT", entryPrice: 2450.80, exitPrice: 2465.10, amount: 2.5, pnl: -35.75, pnlPercent: -0.58, duration: "1h 12m", strategy: "Mean Reversion", status: "CLOSED", timestamp: "2024-04-01 11:05", reason: "Overbought RSI (85) + Resistance Level" },
  { id: "t3", symbol: "SOL/USDT", side: "LONG", entryPrice: 104.20, exitPrice: 108.50, amount: 50, pnl: 215.00, pnlPercent: 4.12, duration: "12h 45m", strategy: "AI Scalper v2", status: "CLOSED", timestamp: "2024-03-31 22:30", reason: "Volume Spike + Trendline Breakout" },
  { id: "t4", symbol: "BTC/USDT", side: "LONG", entryPrice: 41800.00, exitPrice: 41650.00, amount: 0.2, pnl: -30.00, pnlPercent: -0.36, duration: "25m", strategy: "Momentum", status: "CLOSED", timestamp: "2024-03-31 16:15", reason: "False Breakout + Stop Loss triggered" },
  { id: "t5", symbol: "AVAX/USDT", side: "SHORT", entryPrice: 38.40, exitPrice: 35.20, amount: 100, pnl: 320.00, pnlPercent: 8.33, duration: "1d 2h", strategy: "Swing Master", status: "CLOSED", timestamp: "2024-03-30 09:45", reason: "Major Resistance + Global Market Pullback" },
]

export function TradeJournal() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTrade, setSelectedTrade] = useState<any>(null)

  return (
    <div className="space-y-8 pb-20">
      {/* Header & KPIs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white leading-tight">Trade Journal</h1>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs mt-1 transition-all">Verwalte und analysiere deine Trading-Historie</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-800 bg-slate-900/50 text-white font-black px-6 rounded-xl">
            <Download className="w-4 h-4 mr-2" /> EXPORT CSV
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-black px-8 rounded-xl shadow-lg shadow-primary/20">
            NEUER EINTRAG
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "TOTAL PNL", value: "+€1,452.20", sub: "+12.4% gesamt", icon: History, color: "text-emerald-500" },
          { label: "WIN RATE", value: "68.4%", sub: "Letzte 50 Trades", icon: Target, color: "text-primary" },
          { label: "AVG. PROFIT", value: "€82.40", sub: "Pro Trade", icon: ArrowUpRight, color: "text-white" },
          { label: "TOTAL TRADES", value: "142", sub: "Aktiv seit Jan 2024", icon: LayoutList, color: "text-slate-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-800 rounded-xl">
                 <stat.icon className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className={cn("text-2xl font-black", stat.color)}>{stat.value}</div>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-900 border border-slate-800 rounded-3xl sticky top-0 z-10 shadow-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Nach Symbol oder Strategie suchen..." 
            className="pl-11 bg-slate-950 border-slate-800 h-12 rounded-2xl text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-800 bg-slate-950 h-12 px-6 rounded-2xl gap-2 font-black text-[10px] text-slate-400 hover:text-white transition-all">
            <Calendar className="w-4 h-4" /> ZEITRAUM
          </Button>
          <Button variant="outline" className="border-slate-800 bg-slate-950 h-12 px-6 rounded-2xl gap-2 font-black text-[10px] text-slate-400 hover:text-white transition-all">
            <Filter className="w-4 h-4" /> FILTER (2)
          </Button>
        </div>
      </div>

      {/* Trade Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Datum / Zeit</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Symbol</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Seite</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Strategie</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Menge</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">PnL (€)</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">PnL (%)</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRADES.map((trade) => (
                <tr 
                  key={trade.id} 
                  onClick={() => setSelectedTrade(trade)}
                  className="group hover:bg-slate-800/30 border-b border-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="p-5">
                    <div className="text-xs font-bold text-white leading-none mb-1">{trade.timestamp}</div>
                    <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                       <Clock className="w-3 h-3" /> {trade.duration}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="text-sm font-black text-white">{trade.symbol}</div>
                  </td>
                  <td className="p-5">
                    <span className={cn(
                      "text-[10px] px-2 py-1 rounded font-black",
                      trade.side === "LONG" ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"
                    )}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="text-xs font-semibold text-slate-300">{trade.strategy}</div>
                  </td>
                  <td className="p-5 text-right font-bold text-white text-sm">{trade.amount}</td>
                  <td className={cn("p-5 text-right font-black text-sm", trade.pnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
                    {trade.pnl >= 0 ? "+" : ""}€{trade.pnl.toFixed(2)}
                  </td>
                  <td className="p-5 text-right">
                    <div className={cn(
                      "inline-flex items-center gap-1 font-black text-xs",
                      trade.pnlPercent >= 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {trade.pnlPercent >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(trade.pnlPercent)}%
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-primary transition-colors ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Stub */}
        <div className="p-6 bg-slate-950/30 flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-widest">
           <span>Zeige 5 von 142 Trades</span>
           <div className="flex gap-2">
              <Button variant="ghost" disabled className="h-8 px-4 text-[10px]">Back</Button>
              <Button variant="ghost" className="h-8 px-4 text-[10px] text-white">Next</Button>
           </div>
        </div>
      </div>

      {/* Trade Detail Swipe Drawer */}
      {selectedTrade && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[80] transition-opacity" onClick={() => setSelectedTrade(null)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#0B0E17] border-l border-slate-800 z-[90] shadow-2xl animate-in slide-in-from-right duration-300 p-10 flex flex-col">
            <div className="flex justify-between items-start mb-10">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction ID: {selectedTrade.id}</span>
                  </div>
                  <h2 className="text-4xl font-black text-white">{selectedTrade.symbol} Trade</h2>
                  <div className="flex items-center gap-3 mt-4">
                     <span className={cn(
                        "text-xs px-3 py-1 rounded-full font-black",
                        selectedTrade.side === "LONG" ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" : "bg-rose-500/20 text-rose-500 border border-rose-500/30"
                      )}>
                        {selectedTrade.side}
                      </span>
                      <span className="text-slate-500 text-xs font-bold">{selectedTrade.timestamp}</span>
                  </div>
               </div>
               <button onClick={() => setSelectedTrade(null)} className="p-3 bg-slate-900 rounded-2xl text-slate-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
               <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-black tracking-widest mb-2">ENTRY</p>
                  <p className="text-xl font-black text-white">€{selectedTrade.entryPrice.toLocaleString()}</p>
               </div>
               <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800 text-right">
                  <p className="text-[10px] text-slate-500 font-black tracking-widest mb-2 uppercase">EXIT</p>
                  <p className="text-xl font-black text-white font-mono">€{selectedTrade.exitPrice.toLocaleString()}</p>
               </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
               <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
                  <div className="flex items-center gap-3 mb-4">
                     <BrainCircuit className="w-5 h-5 text-primary" />
                     <h3 className="text-sm font-black text-white uppercase tracking-widest">AI Reasoning</h3>
                  </div>
                  <p className="text-sm font-semibold text-slate-400 italic leading-relaxed">
                     "{selectedTrade.reason}"
                  </p>
               </div>

               <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Trade Notizen</h4>
                  <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex items-start gap-4">
                     <MessageSquare className="w-5 h-5 text-slate-500 mt-0.5" />
                     <p className="text-sm font-bold text-slate-300">"Wichtiger Support auf dem 4h Chart wurde gehalten. Erhöhtes Volumen bestätigt den Trend."</p>
                  </div>
               </div>

               <div className="p-10 bg-slate-900 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center opacity-70">
                  <LayoutList className="w-10 h-10 text-slate-700 mb-4" />
                  <h4 className="text-xs font-black text-slate-500 uppercase">Screenshot Analysis coming soon</h4>
                  <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold">Verfügbar ab Pro Plan</p>
               </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800 flex justify-between items-center">
               <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Trade Profit</p>
                  <p className={cn("text-3xl font-black", selectedTrade.pnl > 0 ? "text-emerald-500" : "text-rose-500")}>
                    {selectedTrade.pnl > 0 ? "+" : ""}€{selectedTrade.pnl.toFixed(2)}
                  </p>
               </div>
               <Button className="bg-primary hover:bg-primary/90 text-white font-black px-10 py-6 rounded-2xl shadow-xl shadow-primary/10">
                  EXPORT DETAILS
               </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function X(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
