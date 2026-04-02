import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { LayoutGrid, Settings as SettingsIcon, Maximize2 } from "lucide-react"
import { TradingChart, type OHLCVData } from "../components/charts/TradingChart"
import { useStore } from "../stores/useStore"

// Generate realistic mock OHLCV wrapper
const generateData = (seedPrice: number, count: number): OHLCVData[] => {
  const data: OHLCVData[] = []
  let currentPrice = seedPrice
  const now = new Date().getTime()
  
  for(let i = count; i > 0; i--) {
    const time = (now - i * 60 * 60 * 1000) / 1000 // Convert to Unix timestamp seconds for lightweight-charts
    const volatility = currentPrice * 0.005
    const open = currentPrice
    const close = currentPrice + (Math.random() * volatility * 2 - volatility)
    const high = Math.max(open, close) + Math.random() * volatility
    const low = Math.min(open, close) - Math.random() * volatility
    
    data.push({ time: time as number, open, high, low, close })
    currentPrice = close
  }
  return data
}

export function Trading() {
  const { chartLayout, setChartLayout } = useStore()
  const [activeTab, setActiveTab] = useState<"LIMIT" | "MARKET" | "STOP">("MARKET")
  const [chartType, setChartType] = useState<"candlestick" | "line" | "area">("candlestick")
  
  // Memoize identical random data so it doesn't bounce around on re-renders
  const btcData = useMemo(() => generateData(43000, 100), [])
  const ethData = useMemo(() => generateData(2200, 100), [])
  const solData = useMemo(() => generateData(100, 100), [])
  const adaData = useMemo(() => generateData(0.5, 100), [])

  const charts = [
    { id: "1", symbol: "BTC/USDT", data: btcData },
    { id: "2", symbol: "ETH/USDT", data: ethData },
    { id: "3", symbol: "SOL/USDT", data: solData },
    { id: "4", symbol: "ADA/USDT", data: adaData },
  ]

  const visibleCharts = chartLayout === "single" ? charts.slice(0, 1) : chartLayout === "split" ? charts.slice(0, 2) : charts

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[800px]">
      {/* Chart Section */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between border border-border bg-card p-2 rounded-lg shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold ml-2 mr-4 hidden md:block">Layout:</span>
            <Button variant={chartLayout === "single" ? "default" : "ghost"} size="sm" onClick={() => setChartLayout("single")} className="h-8">1x1</Button>
            <Button variant={chartLayout === "split" ? "default" : "ghost"} size="sm" onClick={() => setChartLayout("split")} className="h-8">1x2</Button>
            <Button variant={chartLayout === "quad" ? "default" : "ghost"} size="sm" onClick={() => setChartLayout("quad")} className="h-8"><LayoutGrid className="w-4 h-4 mr-2" /> 2x2</Button>
          </div>
          
          <div className="flex items-center space-x-2 border-l border-border pl-4">
            <Button variant={chartType === "candlestick" ? "default" : "ghost"} size="sm" onClick={() => setChartType("candlestick")}>Kerzen</Button>
            <Button variant={chartType === "line" ? "default" : "ghost"} size="sm" onClick={() => setChartType("line")}>Linie</Button>
            <Button variant={chartType === "area" ? "default" : "ghost"} size="sm" onClick={() => setChartType("area")}>Area</Button>
            
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 text-muted-foreground hover:text-primary"><Maximize2 className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><SettingsIcon className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Dynamic Canvas Grid */}
        <div className={`flex-1 grid gap-4 grid-cols-1 ${chartLayout === "quad" ? "md:grid-cols-2" : ""} ${chartLayout === "split" ? "md:grid-cols-2" : ""}`}>
          {visibleCharts.map((c) => (
            <Card key={c.id} className="border-border bg-card overflow-hidden h-full flex flex-col hover:border-primary/50 transition-colors shadow-lg">
              <div className="flex-1 w-full min-h-[300px] h-full relative">
                 <TradingChart data={c.data} type={chartType} symbol={c.symbol} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Order Book & Trading Panel */}
      <div className="w-full lg:w-80 flex flex-col space-y-6 shrink-0">
        <Card className="bg-card border-border shadow-xl">
          <CardHeader className="pb-2 border-b border-border/50">
            <CardTitle className="text-sm font-bold flex justify-between">
              Order aufgeben
              <span className="text-muted-foreground font-mono text-xs">Bal: 0.84 BTC</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-1 p-1 bg-background rounded-lg border border-border">
              <button 
                className={`py-1.5 text-xs font-bold rounded-md ${activeTab === 'LIMIT' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('LIMIT')}
              >
                LIMIT
              </button>
              <button 
                className={`py-1.5 text-xs font-bold rounded-md ${activeTab === 'MARKET' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('MARKET')}
              >
                MARKET
              </button>
              <button 
                className={`py-1.5 text-xs font-bold rounded-md ${activeTab === 'STOP' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('STOP')}
              >
                STOP
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">Preis</span>
                <Input type="number" defaultValue="43250.00" className="pl-14 text-right bg-background border-border text-foreground font-mono font-bold" />
                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">USDT</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">Menge</span>
                <Input type="number" defaultValue="0.15" className="pl-14 text-right bg-background border-border text-foreground font-mono font-bold" />
                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">BTC</span>
              </div>
              
              {/* Slider Mock */}
              <div className="py-2">
                <div className="h-1.5 w-full bg-muted rounded-full">
                  <div className="h-full w-1/4 bg-primary rounded-full"></div>
                </div>
                <div className="flex justify-between mt-1 px-1">
                  <span className="text-[10px] text-muted-foreground">0%</span>
                  <span className="text-[10px] text-primary font-bold">25%</span>
                  <span className="text-[10px] text-muted-foreground">50%</span>
                  <span className="text-[10px] text-muted-foreground">75%</span>
                  <span className="text-[10px] text-muted-foreground">100%</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between font-mono text-sm border-t border-border mt-4">
                <span className="text-muted-foreground text-xs">Total</span>
                <span className="font-bold text-foreground">6,487.50 USDT</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button className="bg-success hover:bg-success/90 text-white font-bold h-12 border border-success">
                KAUFEN LONG
              </Button>
              <Button className="bg-destructive hover:bg-destructive/90 text-white font-bold h-12 border border-destructive">
                VERKAUF SHORT
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 bg-card border-border shadow-xl">
          <CardHeader className="py-3 border-b border-border">
            <CardTitle className="text-sm font-bold flex justify-between">
              Orderbook
              <Badge variant="outline" className="text-[10px]">BTC/USDT</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 font-mono text-xs">
            <div className="flex justify-between px-4 py-2 text-muted-foreground text-[10px] font-semibold bg-muted/30">
              <span>Preis (USDT)</span>
              <span>Menge (BTC)</span>
            </div>
            <div className="p-2 space-y-0.5 relative">
              {/* Asks */}
              <div className="flex justify-between px-2 py-1 text-destructive hover:bg-destructive/10 cursor-pointer relative z-10"><span className="font-bold">43,258.10</span><span className="text-muted-foreground">1.250</span></div>
              <div className="flex justify-between px-2 py-1 text-destructive hover:bg-destructive/10 cursor-pointer"><span className="font-bold">43,256.40</span><span className="text-muted-foreground">0.820</span></div>
              <div className="flex justify-between px-2 py-1 text-destructive hover:bg-destructive/10 cursor-pointer"><span className="font-bold">43,255.00</span><span className="text-muted-foreground">3.400</span></div>
              <div className="flex justify-between px-2 py-1 text-destructive hover:bg-destructive/10 cursor-pointer"><span className="font-bold">43,252.80</span><span className="text-muted-foreground">0.150</span></div>
              
              <div className="my-2 py-2 flex items-center justify-center font-bold text-lg text-success border-y border-border bg-success/5">
                43,250.00 <span className="text-xs ml-2 text-muted-foreground">$43,250.00</span>
              </div>
              
              {/* Bids */}
              <div className="flex justify-between px-2 py-1 text-success hover:bg-success/10 cursor-pointer relative z-10"><span className="font-bold">43,248.50</span><span className="text-muted-foreground">2.100</span></div>
              <div className="flex justify-between px-2 py-1 text-success hover:bg-success/10 cursor-pointer"><span className="font-bold">43,246.20</span><span className="text-muted-foreground">0.500</span></div>
              <div className="flex justify-between px-2 py-1 text-success hover:bg-success/10 cursor-pointer"><span className="font-bold">43,245.00</span><span className="text-muted-foreground">1.800</span></div>
              <div className="flex justify-between px-2 py-1 text-success hover:bg-success/10 cursor-pointer"><span className="font-bold">43,240.10</span><span className="text-muted-foreground">5.000</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
