import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Download, Play, RefreshCw } from "lucide-react"
import { useStore } from "../stores/useStore"

const equityData = [
  { date: "Jan", balance: 10000 },
  { date: "Feb", balance: 10400 },
  { date: "Mar", balance: 10200 },
  { date: "Apr", balance: 11500 },
  { date: "May", balance: 12100 },
  { date: "Jun", balance: 11800 },
  { date: "Jul", balance: 13400 },
  { date: "Aug", balance: 14200 },
  { date: "Sep", balance: 14000 },
  { date: "Oct", balance: 15600 },
  { date: "Nov", balance: 16800 },
  { date: "Dec", balance: 18200 },
]

export function Backtest() {
  const [isTesting, setIsTesting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hasResults, setHasResults] = useState(false)
  
  const { isDark } = useStore()
  
  const axisColor = isDark ? '#94a3b8' : '#475569'
  const gridColor = isDark ? '#1e293b' : '#e2e8f0'
  const tooltipBg = isDark ? '#0f172a' : '#ffffff'
  const tooltipBorder = isDark ? '#1e293b' : '#e2e8f0'
  const tooltipText = isDark ? '#f8fafc' : '#0f172a'

  const runBacktest = () => {
    setIsTesting(true)
    setHasResults(false)
    setProgress(0)
    
    let current = 0
    const interval = setInterval(() => {
      current += 10
      setProgress(current)
      if (current >= 100) {
        clearInterval(interval)
        setIsTesting(false)
        setHasResults(true)
      }
    }, 200)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Strategy Backtesting</h2>
          <p className="text-muted-foreground mt-1">Testen Sie Ihre Strategien mit historischen Daten.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backtest Parameter</CardTitle>
          <CardDescription>Definieren Sie die Testumgebung</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Strategie</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>RSI Mean Reversion</option>
                <option>MACD Crossover</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Trading Pair</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>BTC/USDT</option>
                <option>ETH/USDT</option>
                <option>SOL/USDT</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Startkapital (USDT)</Label>
              <Input type="number" defaultValue="10000" />
            </div>
            <div className="space-y-2">
              <Label>Zeitraum</Label>
              <div className="flex space-x-2">
                <Input type="date" defaultValue="2023-01-01" />
                <Input type="date" defaultValue="2023-12-31" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-4">
            <Button onClick={runBacktest} disabled={isTesting} className="w-40 bg-primary hover:bg-primary/90">
              {isTesting ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Verarbeite...</>
              ) : (
                <><Play className="w-4 h-4 mr-2 fill-current" /> Test Starten</>
              )}
            </Button>
            
            {isTesting && (
              <div className="flex-1 max-w-md">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-200" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1 text-right">{progress}%</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {hasResults && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">Gesamtrendite</div>
                <div className="text-2xl font-bold text-primary mt-2">+82.00%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">Netto-Profit</div>
                <div className="text-2xl font-bold text-primary mt-2">+8,200 USDT</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">Max Drawdown</div>
                <div className="text-2xl font-bold text-destructive mt-2">-14.2%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">Gewinn-Trades</div>
                <div className="text-2xl font-bold mt-2">142 (68%)</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">Sharpe Ratio</div>
                <div className="text-2xl font-bold mt-2">1.84</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Equity Kurve</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={equityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                      <XAxis dataKey="date" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                      <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '8px' }} />
                      <Line type="stepAfter" dataKey="balance" stroke="#10B981" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Trade Übersicht</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Total Trades</span>
                    <span className="font-bold">208</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Long Trades</span>
                    <span className="font-bold">114</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Short Trades</span>
                    <span className="font-bold">94</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Avg Gewinn</span>
                    <span className="font-bold text-primary">+124 USDT</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Avg Verlust</span>
                    <span className="font-bold text-destructive">-85 USDT</span>
                  </div>
                </div>
                <Button className="w-full mt-6" variant="outline"><Download className="w-4 h-4 mr-2" /> Report Exportieren</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
