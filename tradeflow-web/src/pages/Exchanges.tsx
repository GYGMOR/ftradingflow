import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"
import { Wallet, Link2, Unlink, RefreshCw, Server } from "lucide-react"

const initialExchanges = [
  { id: "binance", name: "Binance", connected: true, balance: "€8,420.00", icon: "B" },
  { id: "kraken", name: "Kraken", connected: true, balance: "€2,100.00", icon: "K" },
  { id: "bybit", name: "Bybit", connected: false, balance: "€0.00", icon: "Y" },
  { id: "coinbase", name: "Coinbase", connected: false, balance: "€0.00", icon: "C" },
]

export function Exchanges() {
  const [exchanges, setExchanges] = useState(initialExchanges)
  const [paperTrading, setPaperTrading] = useState(false)

  const toggleConnection = (id: string) => {
    setExchanges(exchanges.map(ex => {
      if (ex.id === id) return { ...ex, connected: !ex.connected }
      return ex
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Börsen & API</h2>
          <p className="text-muted-foreground mt-1">Verwalten Sie Ihre Börsen-Anbindungen und Bot-Schnittstellen.</p>
        </div>
      </div>

      {/* Paper Trading Banner */}
      <Card className="border-primary/50 bg-primary/5 shadow-none overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center mb-1">
              Paper Trading Modus
              <Badge variant="outline" className="ml-3 bg-background">Kein echtes Geld</Badge>
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Wenn aktiv, werden alle Trades simuliert und nicht an die echten Börsen gesendet. Nutzen Sie diesen Modus, um Ihre Strategien risikofrei zu testen.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-background p-3 rounded-xl border">
            <span className="text-sm font-medium">{paperTrading ? 'Aktiviert' : 'Deaktiviert'}</span>
            <Switch checked={paperTrading} onCheckedChange={setPaperTrading} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exchanges.map((exchange) => (
          <Card key={exchange.id} className={exchange.connected ? "border-primary/30" : "border-border"}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
                  {exchange.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{exchange.name}</CardTitle>
                </div>
              </div>
              <Badge variant={exchange.connected ? "success" : "secondary"}>
                {exchange.connected ? "VERBUNDEN" : "GETRENNT"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground flex items-center"><Wallet className="w-4 h-4 mr-2"/> Guthaben</span>
                <span className={`font-bold ${exchange.connected ? 'text-foreground' : 'text-muted-foreground'}`}>{exchange.balance}</span>
              </div>
              
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="relative">
                  <Input 
                    type="password" 
                    defaultValue={exchange.connected ? "1234567890abcdef1234567890abcdef" : ""} 
                    placeholder="API Key eingeben" 
                    disabled={exchange.connected}
                    className="font-mono"
                  />
                  {exchange.connected && <span className="absolute inset-x-3 top-2.5 bg-background font-mono text-sm">•••••••••••••••••••••••••</span>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>API Secret</Label>
                <div className="relative">
                  <Input 
                    type="password" 
                    defaultValue={exchange.connected ? "1234567890abcdef1234567890abcdef" : ""} 
                    placeholder="API Secret eingeben" 
                    disabled={exchange.connected}
                    className="font-mono"
                  />
                  {exchange.connected && <span className="absolute inset-x-3 top-2.5 bg-background font-mono text-sm">•••••••••••••••••••••••••</span>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" size="sm" disabled={!exchange.connected}>
                <RefreshCw className="w-4 h-4 mr-2" /> Testen
              </Button>
              <Button 
                variant={exchange.connected ? "destructive" : "default"} 
                size="sm"
                className={exchange.connected ? "" : "bg-primary hover:bg-primary/90 text-white"}
                onClick={() => toggleConnection(exchange.id)}
              >
                {exchange.connected ? <><Unlink className="w-4 h-4 mr-2"/> Trennen</> : <><Link2 className="w-4 h-4 mr-2"/> Verbinden</>}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Server className="w-5 h-5 mr-2" /> Bot API Anbindung</CardTitle>
          <CardDescription>Verbinden Sie die Web-Applikation mit Ihrem Python/Node.js Trading Bot.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Bot Endpoint URL</Label>
            <Input defaultValue="http://localhost:8000/api/v1/webhook" />
          </div>
          <div className="space-y-2">
            <Label>Webhook Auth Token</Label>
            <Input type="password" defaultValue="secret_token_123" />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between items-center">
          <div className="flex items-center text-sm">
            <span className="mr-2">Status:</span>
            <span className="flex items-center text-primary font-medium"><div className="w-2 h-2 rounded-full bg-primary mr-2"></div> VERBUNDEN</span>
          </div>
          <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Verbindung testen</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
