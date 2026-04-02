import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Switch } from "../components/ui/switch"
import { Download, Search, Terminal } from "lucide-react"

type LogType = "INFO" | "WARNING" | "ERROR" | "TRADE"

interface LogEntry {
  id: number
  time: string
  type: LogType
  message: string
}

const initialLogs: LogEntry[] = [
  { id: 1, time: "10:42:33", type: "INFO", message: "Bot gestartet — Strategie: RSI Mean Reversion" },
  { id: 2, time: "10:42:34", type: "INFO", message: "Verbindung zu Binance hergestellt. Ping: 12ms" },
  { id: 3, time: "10:42:35", type: "TRADE", message: "BTC/USDT KAUF 0.001 @ $43,250" },
  { id: 4, time: "10:43:12", type: "INFO", message: "RSI = 28.4 — Kaufsignal erkannt" },
  { id: 5, time: "10:55:44", type: "TRADE", message: "BTC/USDT VERKAUF @ $43,890 +€6.40" },
  { id: 6, time: "11:02:18", type: "WARNING", message: "Verbindung zur Börse kurz unterbrochen (Timeout)" },
  { id: 7, time: "11:02:19", type: "INFO", message: "Verbindung erfolgreich wiederhergestellt" },
  { id: 8, time: "11:15:00", type: "ERROR", message: "Unzureichendes Guthaben für ETH/USDT Order" },
]

export function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs)
  const [filter, setFilter] = useState<LogType | "ALL">("ALL")
  const [search, setSearch] = useState("")
  const [autoScroll, setAutoScroll] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Simulate new logs
  useEffect(() => {
    const interval = setInterval(() => {
      const types: LogType[] = ["INFO", "INFO", "INFO", "TRADE", "WARNING"]
      const newLog: LogEntry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('de-DE', { hour12: false }),
        type: types[Math.floor(Math.random() * types.length)],
        message: "System heartbeat check. Status: OK. Latency: " + Math.floor(Math.random() * 50) + "ms"
      }
      setLogs(prev => [...prev, newLog])
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, autoScroll])

  const filteredLogs = logs.filter(log => {
    if (filter !== "ALL" && log.type !== filter) return false
    if (search && !log.message.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center"><Terminal className="w-6 h-6 mr-2" /> System Logs</h2>
        </div>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export TXT</Button>
      </div>

      <div className="flex items-center justify-between border bg-card p-3 rounded-xl shrink-0">
        <div className="flex items-center space-x-2">
          <Button variant={filter === "ALL" ? "default" : "ghost"} size="sm" onClick={() => setFilter("ALL")}>ALL</Button>
          <Button variant={filter === "INFO" ? "default" : "ghost"} size="sm" className="text-blue-400" onClick={() => setFilter("INFO")}>INFO</Button>
          <Button variant={filter === "TRADE" ? "default" : "ghost"} size="sm" className="text-primary" onClick={() => setFilter("TRADE")}>TRADE</Button>
          <Button variant={filter === "WARNING" ? "default" : "ghost"} size="sm" className="text-yellow-500" onClick={() => setFilter("WARNING")}>WARNING</Button>
          <Button variant={filter === "ERROR" ? "default" : "ghost"} size="sm" className="text-destructive" onClick={() => setFilter("ERROR")}>ERROR</Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input 
              placeholder="Logs durchsuchen..." 
              className="w-64 pl-9 h-9" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground border-l pl-4">
            <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
            <span>Auto-Scroll</span>
          </div>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden bg-[#0a0a0a] border-border text-xs md:text-sm font-mono flex flex-col">
        <CardContent className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {filteredLogs.map((log) => {
              let colorClass = "text-foreground"
              if (log.type === "INFO") colorClass = "text-blue-400"
              if (log.type === "WARNING") colorClass = "text-yellow-500"
              if (log.type === "ERROR") colorClass = "text-destructive"
              if (log.type === "TRADE") colorClass = "text-[#10B981]"

              return (
                <div key={log.id} className="flex items-start hover:bg-white/5 py-0.5 px-2 rounded-sm transition-colors">
                  <span className="text-muted-foreground mr-4 shrink-0">[{log.time}]</span>
                  <span className={`w-20 shrink-0 font-bold ${colorClass}`}>{log.type}</span>
                  <span className="text-gray-300 break-all">{log.message}</span>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
