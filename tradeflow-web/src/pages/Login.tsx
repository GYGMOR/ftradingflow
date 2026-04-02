import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../stores/useStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { LogIn, Mail, Lock, ShieldCheck, Globe } from "lucide-react";
import api from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login fehlgeschlagen. Bitte prüfe deine Daten.");
    } finally {
      setLoading(false);
    }
  };

  const handleSSO = (provider: "google" | "microsoft") => {
    window.location.href = `http://localhost:5000/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-[#0B0E17] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-[450px] z-10">
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 text-white text-3xl font-black">
              TF
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Willkommen zurück</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Sichere dir den Zugang zu deinem Terminal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs py-3 px-4 rounded-xl flex items-center animate-shake">
                <ShieldCheck className="w-4 h-4 mr-2 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Adresse</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <Input 
                  type="email" 
                  placeholder="admin@tradeflow.io" 
                  className="pl-12 bg-slate-950/50 border-slate-800 h-12 focus:border-indigo-500 transition-all rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Passwort</label>
                <Link to="/forgot-password" className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors">Vergessen?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-12 bg-slate-950/50 border-slate-800 h-12 focus:border-indigo-500 transition-all rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-500/20 transition-all mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  AUTH...
                </div>
              ) : (
                <>SIGN IN <LogIn className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>

          <div className="mt-8 flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-slate-600 font-black tracking-widest backdrop-blur-xl">Oder via SSO</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleSSO("google")}
                className="flex items-center justify-center h-12 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
              >
                <Globe className="w-5 h-5 mr-3 text-indigo-500" />
                <span className="text-sm font-bold text-slate-300 tracking-tight">Google</span>
              </button>
              <button 
                 onClick={() => handleSSO("microsoft")}
                 className="flex items-center justify-center h-12 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
              >
                <Lock className="w-5 h-5 mr-3 text-blue-400" />
                <span className="text-sm font-bold text-slate-300 tracking-tight">Microsoft</span>
              </button>
            </div>
          </div>

          <p className="text-center mt-8 text-sm text-slate-500 font-medium">
            Du hast noch keinen Account?{" "}
            <Link to="/register" className="text-indigo-500 font-black hover:text-indigo-400 transition-colors underline underline-offset-4 decoration-indigo-500/30">
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
