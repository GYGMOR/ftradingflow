import { useEffect, useState } from "react"
import { Bell, Search, Play, Square, TrendingUp, Sparkles, AlertTriangle, Info } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useStore, type NotificationType } from "../../stores/useStore"
import { format, formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import { cn } from "../../lib/utils"

const iconMap: Record<NotificationType, React.ReactNode> = {
  "TRADE": <TrendingUp className="w-4 h-4 text-success" />,
  "WARNING": <AlertTriangle className="w-4 h-4 text-destructive" />,
  "INFO": <Info className="w-4 h-4 text-primary" />,
  "SYSTEM": <AlertTriangle className="w-4 h-4 text-warning" />,
  "AI": <Sparkles className="w-4 h-4 text-ai" />
}

const borderMap: Record<NotificationType, string> = {
  "TRADE": "border-l-success",
  "WARNING": "border-l-destructive",
  "INFO": "border-l-primary",
  "SYSTEM": "border-l-warning",
  "AI": "border-l-ai"
}

export function Topbar() {
  const { botActive, toggleBot, notifications, markAllRead } = useStore()
  const [time, setTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length
  const isMarketOpen = true // Demo fixed state

  return (
    <header className="h-[60px] border-b border-border bg-[#0F1320] flex items-center justify-between px-6 shrink-0 relative z-40 shadow-sm">
      <div className="flex flex-1 items-center space-x-6">
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <Input 
            placeholder="Märkte durchsuchen (z.B. BTC)..." 
            className="pl-9 h-9 bg-card border-border text-xs focus-visible:ring-primary placeholder:text-muted-foreground"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="hidden lg:flex items-center space-x-4 border-r border-border pr-6">
          <div className="flex items-center">
            <span className={cn("w-2 h-2 rounded-full mr-2", isMarketOpen ? "bg-success" : "bg-destructive")}></span>
            <span className="text-xs font-semibold text-muted-foreground mr-4">
              MARKT {isMarketOpen ? "OFFEN" : "GESCHLOSSEN"}
            </span>
          </div>
          <span className="text-sm font-mono tracking-wider font-medium text-foreground">
            {format(time, "dd. MMM yyyy, HH:mm:ss", { locale: de })}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleBot}
            className={cn(
              "h-9 font-bold text-xs tracking-wider transition-all duration-300 border",
              botActive 
                ? "border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" 
                : "border-success/30 text-success hover:bg-success/10 hover:text-success shadow-[0_0_15px_-3px_rgba(0,200,150,0.3)] animate-pulse"
            )}
          >
            {botActive ? <Square className="w-3.5 h-3.5 mr-2 fill-current" /> : <Play className="w-3.5 h-3.5 mr-2 fill-current" />}
            {botActive ? "Bot Stoppen" : "Bot Starten"}
          </Button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative h-9 w-9 border-border bg-card hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-[#0F1320]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
            
            {showNotifications && (
              <div className="absolute right-0 top-12 w-[360px] bg-card border border-border shadow-2xl rounded-xl overflow-hidden animate-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card text-foreground">
                  <h3 className="font-bold text-sm">Benachrichtigungen</h3>
                  {unreadCount > 0 && <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">{unreadCount} neu</span>}
                </div>
                
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground text-sm">Keine Benachrichtigungen</div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.map((n) => (
                        <div key={n.id} className={cn("p-4 border-b border-border hover:bg-card-hover transition-colors flex items-start border-l-4", borderMap[n.type], !n.read && "bg-primary/5")}>
                          <div className="mt-1 mr-3 shrink-0">{iconMap[n.type]}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-card-foreground">{n.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.message}</p>
                            <p className="text-[10px] text-muted-foreground/70 mt-1.5 font-medium">
                              {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true, locale: de })}
                            </p>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="px-4 py-2 border-t border-border bg-card flex justify-between">
                  <button onClick={markAllRead} className="text-xs text-muted-foreground hover:text-primary transition-colors py-1 font-medium">
                    Alle als gelesen markieren
                  </button>
                  <button onClick={() => setShowNotifications(false)} className="text-xs text-primary transition-colors py-1 font-medium">
                    Schließen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
