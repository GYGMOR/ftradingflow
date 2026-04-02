import { useState, useEffect } from "react"
import { Minimize2, Square, X, Maximize2 } from "lucide-react"
import { usePlatform } from "../../hooks/usePlatform"
import { cn } from "../../lib/utils"

export function Titlebar() {
  const { isDesktop } = usePlatform()
  const [isMaximized, setIsMaximized] = useState(false)

  // Use dynamic imports for Tauri to avoid breaking the Web build
  const [windowApi, setWindowApi] = useState<any>(null)

  useEffect(() => {
    if (isDesktop) {
      // Use @vite-ignore to prevent Vite from analyzing this during web-only dev
      import(/* @vite-ignore */ "@tauri-apps/api/window").then((api) => {
        setWindowApi(api.getCurrentWindow())
      }).catch(err => {
        console.warn("Tauri API not available (Web Mode):", err)
      })
    }
  }, [isDesktop])

  if (!isDesktop) return null

  const handleMinimize = () => windowApi?.minimize()
  const handleMaximize = async () => {
    await windowApi?.toggleMaximize()
    const maximized = await windowApi?.isMaximized()
    setIsMaximized(maximized)
  }
  const handleClose = () => windowApi?.close()

  return (
    <div 
      data-tauri-drag-region
      className="h-[40px] bg-[#0A0D14] border-b border-white/5 flex items-center justify-between px-4 select-none fixed top-0 inset-x-0 z-[9999] backdrop-blur-md"
    >
      {/* Platform Branding */}
      <div className="flex items-center gap-3 pointer-events-none">
        <div className="w-5 h-5 bg-primary/20 rounded flex items-center justify-center border border-primary/30">
          <div className="w-2 h-2 bg-primary animate-pulse rounded-full" />
        </div>
        <span className="text-[10px] font-black tracking-[0.2em] text-white/50 uppercase">TradeFlow Desktop</span>
      </div>

      {/* Center Label (Optional) */}
      <div className="absolute left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500 uppercase tracking-widest pointer-events-none">
        Secure Command Center
      </div>

      {/* Window Controls */}
      <div className="flex items-center">
        <button 
          onClick={handleMinimize}
          className="w-10 h-[40px] flex items-center justify-center text-slate-500 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Minimize2 className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={handleMaximize}
          className="w-10 h-[40px] flex items-center justify-center text-slate-500 hover:bg-white/5 hover:text-white transition-colors"
        >
          {isMaximized ? <Square className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
        <button 
          onClick={handleClose}
          className="w-10 h-[40px] flex items-center justify-center text-slate-500 hover:bg-rose-500/20 hover:text-rose-500 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
