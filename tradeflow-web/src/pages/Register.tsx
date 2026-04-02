import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../stores/useStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { UserPlus, Mail, Lock, User, ShieldCheck, ArrowLeft } from "lucide-react";
import api from "../lib/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/auth/register", { email, password, fullName });
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registrierung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E17] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-[450px] z-10">
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <Link to="/login" className="flex items-center text-xs font-black text-slate-500 hover:text-white transition-colors mb-6 group uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Zurück zum Login
          </Link>

          <div className="flex flex-col items-center mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight">Account erstellen</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Werde Teil des TradeFlow Netzwerks</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs py-3 px-4 rounded-xl flex items-center animate-shake">
                <ShieldCheck className="w-4 h-4 mr-2 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Vollständiger Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <Input 
                  type="text" 
                  placeholder="Max Mustermann" 
                  className="pl-12 bg-slate-950/50 border-slate-800 h-12 focus:border-indigo-500 transition-all rounded-xl"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Adresse</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <Input 
                  type="email" 
                  placeholder="name@beispiel.de" 
                  className="pl-12 bg-slate-950/50 border-slate-800 h-12 focus:border-indigo-500 transition-all rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Passwort</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <Input 
                  type="password" 
                  placeholder="Min. 8 Zeichen" 
                  className="pl-12 bg-slate-950/50 border-slate-800 h-12 focus:border-indigo-500 transition-all rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 space-y-2">
               <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                 <ShieldCheck className="w-3 h-3 mr-2 text-indigo-500" />
                 Sicherheitshinweis
               </div>
               <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                 Deine Daten werden nach modernsten Standards verschlüsselt gespeichert (AES-256 / Bcrypt).
               </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-500/20 transition-all mt-4"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  CREATING...
                </div>
              ) : (
                <>ACCOUNT ERSTELLEN <UserPlus className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500 font-medium">
            Bereits Mitglied?{" "}
            <Link to="/login" className="text-indigo-500 font-black hover:text-indigo-400 transition-colors underline underline-offset-4 decoration-indigo-500/30">
              Zum Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
