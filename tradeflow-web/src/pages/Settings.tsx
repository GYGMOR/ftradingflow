import { useState } from "react"
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Wallet, 
  CreditCard, 
  Cpu, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Zap,
  BrainCircuit
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { cn } from "../lib/utils"

const SETTINGS_TABS = [
  { id: "profile", name: "Profil & Konto", icon: User },
  { id: "exchanges", name: "Exchanges & API", icon: Wallet },
  { id: "trading", name: "Trading & Risiko", icon: Zap },
  { id: "notifications", name: "Benachrichtigungen", icon: Bell },
  { id: "security", name: "Sicherheit & 2FA", icon: ShieldCheck },
  { id: "infrastructure", name: "Knoten & VPS", icon: Cpu },
  { id: "billing", name: "Abo & Pläne", icon: CreditCard },
]

export function Settings() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-24">
      {/* Settings Navigation */}
      <aside className="w-full lg:w-72 shrink-0">
        <div className="bg-slate-950 border border-slate-900 rounded-[32px] p-4 sticky top-6">
           <h2 className="text-xl font-black text-white px-4 pt-4 mb-6">Settings</h2>
           <div className="space-y-1">
              {SETTINGS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-xs transition-all text-left",
                    activeTab === tab.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-slate-500 hover:bg-slate-900 hover:text-slate-300"
                  )}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  {tab.name}
                  {activeTab === tab.id && <ChevronRight className="ml-auto w-3.5 h-3.5" />}
                </button>
              ))}
           </div>

           <div className="mt-8 pt-6 border-t border-slate-900 px-4">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SYSTEM STATUS</span>
              </div>
              <p className="text-[10px] font-bold text-emerald-500 uppercase">All Nodes Operational</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-8 animate-in fade-in duration-500">
        
        {activeTab === "profile" && (
           <div className="space-y-6">
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                 <h3 className="text-2xl font-black text-white mb-8">Benutzerprofil</h3>
                 <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-800">
                    <div className="relative group">
                       <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-950 flex items-center justify-center text-3xl font-black shadow-2xl overflow-hidden">
                          AD
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] uppercase font-black cursor-pointer transition-opacity">Edit</div>
                       </div>
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-xl font-black text-white">Admin User</h4>
                       <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Standard Plan • Mitglied seit 2024</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black text-slate-500 uppercase px-1">Anzeigename</Label>
                       <Input defaultValue="Admin User" className="bg-slate-950 border-slate-800 h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black text-slate-500 uppercase px-1">E-Mail Adresse</Label>
                       <Input defaultValue="admin@tradeflow.io" className="bg-slate-950 border-slate-800 h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black text-slate-500 uppercase px-1">Sprache</Label>
                       <select className="flex h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white font-bold">
                          <option>Deutsch</option>
                          <option>English</option>
                       </select>
                    </div>
                 </div>
                 <Button className="mt-10 bg-primary hover:bg-primary/90 text-white font-black px-10 h-12 rounded-xl">Änderungen speichern</Button>
              </div>

              <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px]">
                 <h3 className="text-xl font-black text-white mb-6">Setup Health Score</h3>
                 <div className="flex items-center gap-10">
                    <div className="relative w-24 h-24 flex items-center justify-center bg-emerald-500/10 rounded-full border border-emerald-500/20">
                       <span className="text-2xl font-black text-emerald-500">92</span>
                    </div>
                    <div>
                       <p className="text-lg font-black text-white">Dein Setup ist fast perfekt!</p>
                       <p className="text-sm text-slate-500 font-bold uppercase tracking-tight mt-1">Aktiviere 2FA für einen 100% Score.</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === "exchanges" && (
           <div className="space-y-6">
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px]">
                 <div className="flex justify-between items-center mb-10">
                    <div>
                       <h3 className="text-2xl font-black text-white">Börsen-Anbindungen</h3>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Verwalte deine API Keys</p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 rounded-xl shadow-lg">BÖRSE HINZUFÜGEN</Button>
                 </div>

                 <div className="grid grid-cols-1 gap-4">
                    {[
                      { name: "Binance EU", status: "CONNECTED", type: "Spot/Futures", latency: "12ms" },
                      { name: "Kraken Global", status: "PENDING", type: "Spot", latency: "--" },
                    ].map((exchange, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-slate-950 border border-slate-800 rounded-[28px] hover:border-primary/30 transition-all group">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 font-black text-xs">BN</div>
                            <div>
                               <h4 className="text-sm font-black text-white">{exchange.name}</h4>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">{exchange.type} • LATENZ: {exchange.latency}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black border",
                              exchange.status === "CONNECTED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            )}>
                               {exchange.status}
                            </div>
                            <Button variant="ghost" className="h-10 w-10 p-0 text-slate-700 hover:text-white hover:bg-slate-900 rounded-xl">
                               <SettingsIcon className="w-4 h-4" />
                            </Button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-[32px] flex items-center gap-6">
                 <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20 text-rose-500">
                    <AlertTriangle className="w-6 h-6" />
                 </div>
                 <div className="flex-1">
                    <h4 className="text-sm font-black text-white">API SICHERHEITSWARNUNG</h4>
                    <p className="text-xs text-slate-400 font-bold tracking-tight mt-1 uppercase">Achte darauf, dass deine API Keys keine Auszahlungs-Berechtigungen (Withdrawals) besitzen.</p>
                 </div>
                 <Button variant="link" className="text-rose-500 font-black text-xs">DOCS LESEN</Button>
              </div>
           </div>
        )}

        {activeTab === "trading" && (
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px]">
                    <h3 className="text-lg font-black text-white mb-8 border-b border-slate-800 pb-4">Standard SL/TP</h3>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1 px-1">
                             <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">STOP LOSS (%)</Label>
                             <span className="text-xs font-black text-rose-500">2.5%</span>
                          </div>
                          <input type="range" className="w-full accent-rose-500" defaultValue={2.5} />
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1 px-1">
                             <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TAKE PROFIT (%)</Label>
                             <span className="text-xs font-black text-emerald-500">5.0%</span>
                          </div>
                          <input type="range" className="w-full accent-emerald-500" defaultValue={5.0} />
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px]">
                    <h3 className="text-lg font-black text-white mb-8 border-b border-slate-800 pb-4">Smart Protections</h3>
                    <div className="space-y-6">
                       <div className="flex items-center justify-between group">
                          <div>
                             <p className="text-sm font-black text-white">Trailing Stop Loss</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">Zieht den SL automatisch nach</p>
                          </div>
                          <Switch defaultChecked />
                       </div>
                       <div className="flex items-center justify-between group">
                          <div>
                             <p className="text-sm font-black text-white">Break-Even Auto-Move</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">Sichert Trades ab 2% Profit</p>
                          </div>
                          <Switch />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-indigo-500/5 border border-indigo-500/20 rounded-[40px] relative overflow-hidden">
                 <BrainCircuit className="absolute -bottom-10 -right-10 w-40 h-40 text-indigo-500/10 rotate-12" />
                 <div className="relative z-10">
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">KI Bestätigungs-Layer</h3>
                    <p className="text-sm text-slate-400 font-bold italic max-w-lg mb-8 uppercase tracking-widest">Bot führt Signale nur nach KI-Verifikation aus.</p>
                    <div className="flex items-center justify-between p-6 bg-slate-950/50 border border-indigo-500/30 rounded-2xl backdrop-blur-xl">
                       <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">STATUS: AKTIVIERT (Elite Feature)</span>
                       <Switch defaultChecked />
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === "notifications" && (
           <div className="space-y-6">
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-[40px]">
                 <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tighter">Alert Channels</h3>
                 <div className="space-y-8">
                    {[
                      { title: "Browser Push", desc: "Direkte Desktop-Benachrichtigungen", active: true },
                      { title: "E-Mail Alerts", desc: "Tägliche Summaries & Kritische Fehler", active: true },
                      { title: "Telegram Bot", desc: "Live-Signale direkt aufs Handy", active: false },
                      { title: "Discord Webhook", desc: "Eigene Handels-Logs in Discord", active: false },
                    ].map((n, i) => (
                      <div key={i} className="flex items-center justify-between group">
                         <div className="space-y-1">
                            <p className="text-sm font-black text-white">{n.title}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{n.desc}</p>
                         </div>
                         <Switch defaultChecked={n.active} />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {activeTab === "security" && (
           <div className="space-y-6">
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-[40px]">
                 <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tighter">Account Security</h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-slate-950 border border-slate-800 rounded-2xl">
                       <div className="flex items-center gap-4">
                          <ShieldCheck className="w-6 h-6 text-emerald-500" />
                          <div>
                             <p className="text-sm font-black text-white">Zwei-Faktor Authentifizierung (2FA)</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">App-basiert (Google / Authy)</p>
                          </div>
                       </div>
                       <Button variant="outline" className="text-[10px] font-black border-slate-700 h-9 rounded-lg">AKTIVIEREN</Button>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-500 uppercase px-1">Aktuelles Passwort</Label>
                          <Input type="password" placeholder="••••••••" className="bg-slate-950 border-slate-800" />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-500 uppercase px-1">Neues Passwort</Label>
                          <Input type="password" placeholder="Min. 12 Zeichen" className="bg-slate-950 border-slate-800" />
                       </div>
                       <Button className="bg-slate-800 hover:bg-slate-700 text-white font-black text-xs h-10 px-8 rounded-lg">Passwort ändern</Button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === "infrastructure" && (
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px]">
                    <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center">
                       <Cpu className="w-4 h-4 mr-2 text-primary" /> Active Runtime
                    </h3>
                    <div className="space-y-4">
                       <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>NODE ID:</span>
                          <span className="text-white">TF-DE-041B</span>
                       </div>
                       <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>LOCATION:</span>
                          <span className="text-white">FRANKFURT, DE</span>
                       </div>
                       <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>RELAY LATENCY:</span>
                          <span className="text-emerald-500">8.2ms</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px]">
                    <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center">
                       <Zap className="w-4 h-4 mr-2 text-primary" /> VPS Status
                    </h3>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
                       <div className="h-full bg-primary w-[40%]" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase">Load: 4.2% / Resources: Healthy</p>
                 </div>
              </div>
           </div>
        )}

        {activeTab === "billing" && (
           <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-10 bg-slate-900 border border-slate-800 rounded-[40px] flex flex-col items-center text-center">
                 <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8 border border-primary/20">
                   <Zap className="w-10 h-10" />
                 </div>
                 <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Plan: STANDARD</h2>
                 <p className="text-slate-500 font-black uppercase text-xs tracking-widest mt-2 mb-10">DEIN ABONNEMENT LÄUFT AM 30. APRIL 2026 AB</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
                    <Button variant="outline" className="h-16 rounded-2xl border-slate-800 font-black text-xs uppercase tracking-widest hover:bg-slate-800">Subscription verwalten</Button>
                    <Button className="h-16 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20">AUF ELITE UPGRADEN</Button>
                 </div>
              </div>
              
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-[40px]">
                 <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest">Kauf-Historie (Letzte Addons)</h3>
                 <div className="space-y-2">
                    {[
                      { item: "Dashboard Essentials Pack", date: "Vor 10 Min", price: "€9.00" },
                      { item: "Mean Reversion Strat", date: "24. März", price: "€29.00" },
                    ].map((h, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                         <div className="space-y-1">
                            <p className="text-xs font-black text-white">{h.item}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{h.date}</p>
                         </div>
                         <span className="text-xs font-black text-primary">{h.price}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6 animate-in slide-in-from-bottom-10 duration-500">
         <div className="bg-primary/95 backdrop-blur-xl border border-white/20 p-4 rounded-[32px] shadow-[0_20px_50px_rgba(59,130,246,0.3)] flex items-center justify-between">
            <div className="flex items-center gap-4 ml-4">
               <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <SettingsIcon className="w-5 h-5 animate-spin-slow" />
               </div>
               <div>
                  <p className="text-white font-black text-sm">Ungespeicherte Änderungen</p>
                  <p className="text-white/60 text-[10px] font-bold uppercase">Deine Plattform-Konfiguration wurde modifiziert</p>
               </div>
            </div>
            <div className="flex gap-2">
               <Button variant="ghost" className="text-white hover:bg-white/10 font-black text-xs px-6 rounded-2xl h-12">Verwerfen</Button>
               <Button className="bg-white text-primary hover:bg-slate-100 font-black text-xs px-10 rounded-2xl h-12 shadow-xl shadow-black/10">ÄNDERUNGEN SPEICHERN</Button>
            </div>
         </div>
      </div>
    </div>
  )
}
