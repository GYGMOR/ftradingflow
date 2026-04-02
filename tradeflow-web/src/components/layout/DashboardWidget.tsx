import { type ReactNode } from "react"
import { Lock, Crown } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { useStore, type UserRole } from "../../stores/useStore"

interface DashboardWidgetProps {
  title: string;
  children: ReactNode;
  premiumTier?: "PRO" | "ELITE" | "ADMIN";
  isLocked?: boolean;
  className?: string;
}

export function DashboardWidget({ title, children, premiumTier, isLocked: manualLock, className }: DashboardWidgetProps) {
  const { userRole } = useStore()
  
  // Role Priority Check
  const hasAccess = (current: UserRole, required: string) => {
    const roles = ["TRIAL", "STANDARD", "PREMIUM", "PUBLISHER", "ADMIN"]
    const currentIdx = roles.indexOf(current)
    const requiredIdx = roles.indexOf(required === "ELITE" ? "PREMIUM" : required)
    return currentIdx >= requiredIdx
  }

  const isLocked = manualLock || (premiumTier && !hasAccess(userRole, premiumTier))

  return (
    <div className={cn(
      "bg-[#141827] border border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col relative group transition-all duration-300 hover:border-slate-700", 
      className,
      isLocked && "select-none"
    )}>
      {/* Widget Header */}
      <div className="px-4 py-3 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/20">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h3>
        {isLocked && <Lock className="w-3 h-3 text-amber-500/50" />}
        {!isLocked && premiumTier && <Crown className="w-3 h-3 text-ai" />}
      </div>

      {/* Widget Content */}
      <div className={cn("flex-1 p-4 relative", isLocked && "blur-md opacity-40 pointer-events-none overflow-hidden")}>
        {children}
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-x-0 bottom-0 top-[35px] z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-[#0B0E17]/80 to-transparent">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mb-3 border border-amber-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <p className="text-white font-black text-xs text-center mb-4 tracking-tight uppercase">
            {premiumTier || "FEATURE"} GESPERRT
          </p>
          <Button variant="outline" className="text-[10px] h-8 border-amber-500/50 text-amber-100 hover:bg-amber-500/20 bg-amber-500/10 font-bold">
            JETZT UPGRADEN
          </Button>
        </div>
      )}

      {/* Drag Handle (Visual indicator) */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-800 rounded-full opacity-0 group-hover:opacity-100 cursor-move transition-opacity" />
    </div>
  )
}
