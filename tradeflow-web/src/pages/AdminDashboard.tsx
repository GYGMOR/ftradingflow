import { useState, useEffect } from "react"
import { 
  Users, 
  Activity, 
  ShieldCheck, 
  Search, 
  UserPlus, 
  UserMinus,
  Clock,
  ExternalLink,
  ShieldAlert
} from "lucide-react"
import api from "../lib/api"
import { cn } from "../lib/utils"

interface PlatformUser {
  id: string
  email: string
  fullName: string | null
  role: string
  createdAt: string
}

interface AuditLog {
  id: string
  action: string
  metadata: any
  createdAt: string
  user: {
    email: string
    fullName: string | null
  }
}

interface Stats {
  totalUsers: number
  totalTrades: number
  activeNodes: number
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "logs">("overview")
  const [users, setUsers] = useState<PlatformUser[]>([])
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, statsRes, logsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/stats"),
        api.get("/admin/audit-logs")
      ])
      setUsers(usersRes.data)
      setStats(statsRes.data)
      setLogs(logsRes.data)
    } catch (err) {
      console.error("Admin data load failed", err)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole })
      loadData() // Refresh
    } catch (err) {
      alert("Fehler beim Ändern der Rolle")
    }
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center">
            <ShieldCheck className="w-8 h-8 mr-3 text-rose-500" />
            Admin Master Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Plattform-Verwaltung & Benutzer-Auditing</p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
          System Status: Online
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Total Trades", value: stats?.totalTrades || 0, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Active Nodes", value: stats?.activeNodes || 0, icon: ShieldAlert, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 transition-transform group-hover:scale-110", stat.bg)}></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-black text-white mt-1 tracking-tighter">{stat.value}</h3>
              </div>
              <div className={cn("p-3 rounded-xl shadow-lg", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 w-full">
        {[
          { id: "overview", label: "Overview", icon: Activity },
          { id: "users", label: "User Management", icon: Users },
          { id: "logs", label: "Audit Logs", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-8 py-4 text-sm font-bold flex items-center transition-all border-b-2 relative",
              activeTab === tab.id 
                ? "border-rose-500 text-rose-500 bg-rose-500/5" 
                : "border-transparent text-slate-500 hover:text-white"
            )}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-500 animate-pulse">Lade Daten...</div>
        ) : activeTab === "users" ? (
          <div className="space-y-4">
             <div className="relative group max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Suchen nach Email oder Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-white placeholder:text-slate-600"
                />
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/30 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-500/30">
                              {(u.fullName || u.email).substring(0, 2).toUpperCase()}
                            </div>
                            <div className="ml-3 overflow-hidden max-w-[200px]">
                              <p className="text-sm font-bold text-white truncate">{u.fullName || "N/A"}</p>
                              <p className="text-xs text-slate-500 truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider",
                            u.role === 'ADMIN' ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : 
                            u.role === 'PREMIUM' ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20" : 
                            "bg-slate-800 text-slate-400 border border-slate-700"
                          )}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-xs font-bold text-emerald-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            Aktiv
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                             <button 
                               onClick={() => handleRoleUpdate(u.id, u.role === 'PREMIUM' ? 'TRIAL' : 'PREMIUM')}
                               className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700/50 hover:border-slate-600"
                               title="Upgrade/Downgrade"
                             >
                               {u.role === 'PREMIUM' ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                             </button>
                             <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-all border border-slate-700/50 hover:border-rose-500/30">
                               <ShieldAlert className="w-4 h-4" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        ) : activeTab === "logs" ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
             {logs.map((log) => (
                <div key={log.id} className="flex items-start p-4 hover:bg-slate-800/30 rounded-xl transition-all border border-transparent hover:border-slate-800 relative group">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                    <Activity className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-rose-400 uppercase tracking-widest">{log.action}</p>
                      <span className="text-[10px] font-medium text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded-full flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Aktion von <span className="font-bold text-white">{log.user?.email || "System"}</span>
                    </p>
                    <div className="mt-3 bg-slate-950/50 p-3 rounded-lg text-[11px] font-mono text-slate-500 border border-slate-800 group-hover:border-slate-700 transition-colors">
                      {JSON.stringify(log.metadata, null, 2)}
                    </div>
                  </div>
                </div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-slate-900/40 to-indigo-900/5 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">System Gesundheit</h3>
              <p className="text-slate-500 mt-2 max-w-xs text-sm leading-relaxed">Alle Knoten arbeiten im optimalen Bereich. Die API Latenz beträgt aktuell 14ms.</p>
              <button className="mt-6 flex items-center text-xs font-black uppercase text-indigo-500 hover:text-indigo-400 transition-colors">
                Server-Status Detail <ExternalLink className="w-3 h-3 ml-2" />
              </button>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Letzte Logins</h3>
                <div className="mt-4 space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div className="flex items-center text-xs text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></div>
                        User #{i}04
                      </div>
                      <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest">{i * 2} MINS AGO</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full mt-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase transition-all tracking-widest text-slate-400 hover:text-white border border-slate-700">
                Alle Aktivitäten anzeigen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
