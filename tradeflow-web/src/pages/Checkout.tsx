import { useStore } from "../stores/useStore"
import { Button } from "../components/ui/button"
import { ShoppingBag, ChevronRight, ShieldCheck, Zap, Trash2, CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import api from "../lib/api"

// We need the same product list to find names/prices
const PRODUCTS = [
  { id: "bundle_ai_elite", name: "AI Elite Bundle", price: 99.00 },
  { id: "strat_momentum_pro", name: "Momentum Pro v4", price: 29.00 },
  { id: "layout_pro_dark", name: "Deep Dark UI Pro", price: 19.00 },
  { id: "risk_shield_auto", name: "Risk Shield Auto", price: 45.00 },
  { id: "ai_market_gpt", name: "Market GPT Logic", price: 59.00 },
  { id: "pack_essentials", name: "Dashboard Essentials", price: 9.00 },
  { id: "pack_analytics_pro", name: "Analytics Pro Pack", price: 19.00 },
  { id: "pack_ai_insight", name: "AI Insight Pack", price: 24.00 },
  { id: "pack_risk_control", name: "Risk Control Pack", price: 21.00 },
  { id: "pack_bot_monitoring", name: "Bot Monitoring Pack", price: 18.00 },
  { id: "pack_journal_pro", name: "Journal Pro Pack", price: 14.00 },
  { id: "bundle_elite_dash", name: "Elite Dashboard Pack", price: 29.00 },
  { id: "bundle_operator", name: "Operator Bundle", price: 39.00 },
  { id: "pack_layout_master", name: "Layout Master Pack", price: 12.00 },
  { id: "pack_market_insight", name: "Market Insight Pack", price: 17.00 },
  { id: "pack_alert_intel", name: "Alert Intelligence", price: 11.00 },
  { id: "upgrade_elite_control", name: "Elite Control Upgrade", price: 49.00 }
]

export function Checkout() {
  const { cart, removeFromCart, completeCheckout, clearCart } = useStore()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const cartItems = PRODUCTS.filter(p => cart.includes(p.id))
  const total = cartItems.reduce((acc, curr) => acc + curr.price, 0)

  const handleCheckout = async () => {
    setIsProcessing(true)
    try {
      // Perform real backend checkout
      await api.post("/admin/store/checkout", { cart })
      
      // Update local state and entitlements
      completeCheckout()
      
      setIsSuccess(true)
    } catch (err) {
      alert("Fehler bei der Zahlung. Bitte versuche es erneut.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFinish = () => {
    clearCart()
    navigate("/dashboard")
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 animate-in zoom-in duration-500">
           <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <div>
           <h2 className="text-3xl font-black text-white">Zahlung erfolgreich!</h2>
           <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">DEINE FEATURES WURDEN SOFORT FREIGESCHALTET</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full">
           <p className="text-sm font-medium text-slate-300 leading-relaxed">
             Du hast nun vollen Zugriff auf alle gekauften Module und Layouts. Gehe zum Dashboard, um dein neues Setup zu testen.
           </p>
        </div>
        <Button onClick={handleFinish} className="bg-primary hover:bg-primary/90 text-white font-black px-12 py-7 rounded-2xl shadow-xl shadow-primary/20">
           ZUM DASHBOARD WECHSELN <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-2">
         <h1 className="text-4xl font-black text-white tracking-tight">Dein Warenkorb</h1>
         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PRODUKTE VOR DEM KAUF ÜBERPRÜFEN</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Cart Items */}
         <div className="lg:col-span-2 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-3xl group hover:border-slate-700 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
                         <Zap className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                         <h3 className="text-lg font-black text-white">{item.name}</h3>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">FREISCHALTUNG SOFORT</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className="text-xl font-black text-white">€{item.price.toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                      >
                         <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-6 bg-slate-900 border border-dashed border-slate-800 rounded-[40px]">
                 <ShoppingBag className="w-16 h-16 text-slate-800 mx-auto" />
                 <p className="text-slate-500 font-bold uppercase text-[10px]">Dein Warenkorb ist leer</p>
                 <Button onClick={() => navigate("/store")} variant="link" className="text-primary font-black">ZURÜCK ZUM STORE</Button>
              </div>
            )}
         </div>

         {/* Summary */}
         <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] sticky top-24 space-y-8">
               <h3 className="text-xl font-black text-white">Bestellübersicht</h3>
               
               <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                     <span>Zwischensumme</span>
                     <span>€{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                     <span>Steuern (0%)</span>
                     <span>€0.00</span>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex justify-between">
                     <span className="text-lg font-black text-white">Total</span>
                     <span className="text-3xl font-black text-primary">€{total.toFixed(2)}</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                     <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                     <p className="text-[10px] font-bold text-slate-400">Sichere SSL Verschlüsselung aktiv. Keine Kreditkartendaten werden gespeichert.</p>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || isProcessing}
                    className="w-full py-8 text-lg font-black bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-2xl shadow-primary/30"
                  >
                    {isProcessing ? "VERARBEITET..." : "Zahlungspflichtig bestellen"}
                  </Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
