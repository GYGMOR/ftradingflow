import { X, Lock, ShieldCheck, ChevronRight, ShoppingBag, Sparkles } from "lucide-react"
import { Button } from "./button"
import { cn } from "../../lib/utils"
import { useNavigate } from "react-router-dom"

interface PremiumTeaserModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  tier?: "PRO" | "ELITE";
}

export function PremiumTeaserModal({ isOpen, onClose, featureName, tier = "PRO" }: PremiumTeaserModalProps) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleGoToStore = () => {
    onClose()
    navigate("/store")
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with "Schleier" effect */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-500 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#0B0E17] border border-slate-800 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Top Accent Gradient */}
        <div className={cn(
          "h-2 w-full",
          tier === "ELITE" ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" : "bg-gradient-to-r from-indigo-500 via-primary to-indigo-600"
        )} />

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-500 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 pt-12 flex flex-col items-center text-center">
          {/* Icon Container */}
          <div className="relative mb-8">
            <div className={cn(
              "w-24 h-24 rounded-3xl flex items-center justify-center border-2 rotate-6 transition-transform hover:rotate-0 duration-500",
              tier === "ELITE" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              <Lock className="w-10 h-10" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0B0E17] rounded-2xl flex items-center justify-center border border-slate-800 shadow-xl">
               <Sparkles className={cn("w-5 h-5", tier === "ELITE" ? "text-amber-500" : "text-primary")} />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 mb-10">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">
              {featureName} <br /> 
              <span className={cn(
                "bg-clip-text text-transparent",
                tier === "ELITE" ? "bg-gradient-to-r from-amber-400 to-yellow-600" : "bg-gradient-to-r from-indigo-400 to-primary"
              )}>
                FREISCHALTEN
              </span>
            </h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] px-10 leading-relaxed">
              Dieses Modul ist Teil des <span className="text-white">{tier} PACKS</span>. Erhalte Zugriff auf Echtzeit-Daten, KI-Handelssignale und exklusive Layouts.
            </p>
          </div>

          {/* Features Preview List */}
          <div className="w-full space-y-2 mb-10">
            {[
              "Echtzeit-Analyse & Deep Insights",
              "KI-gestützte Entscheidungshilfen",
              "Unbegrenzte Node-Anbindung",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                <ShieldCheck className={cn("w-4 h-4", tier === "ELITE" ? "text-amber-500" : "text-emerald-500")} />
                <span className="text-xs font-black text-slate-300 uppercase tracking-tight">{f}</span>
                <ChevronRight className="ml-auto w-3.5 h-3.5 text-slate-600" />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 w-full gap-4">
             <Button 
               onClick={handleGoToStore}
               className={cn(
                 "h-16 rounded-2xl font-black gap-3 text-sm tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-95",
                 tier === "ELITE" 
                   ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-500/20" 
                   : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
               )}
             >
                <ShoppingBag className="w-5 h-5" />
                JETZT IM STORE FREISCHALTEN
             </Button>
             <button 
               onClick={onClose}
               className="text-[10px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-[0.2em] py-2 transition-colors"
             >
               Vielleicht später
             </button>
          </div>
        </div>

        {/* Dynamic Background Element */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      </div>
    </div>
  )
}
