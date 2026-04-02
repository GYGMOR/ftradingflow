import { useState, useEffect } from "react"
import { Minimize2, Square, X, Maximize2 } from "lucide-react"
import { usePlatform } from "../../hooks/usePlatform"

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
      className="h-[40px] bg-[#0A0D14]/80 border-b border-white/10 flex items-center justify-between px-4 select-none fixed top-0 inset-x-0 z-[999999] backdrop-blur-xl shadow-lg ring-1 ring-white/5"
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
        {/* Minimize */}
        <button 
          onClick={handleMinimize}
          className="w-[46px] h-[40px] flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          title="Minimieren"
        >
          <svg width="10" height="1" viewBox="0 0 10 1" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="10" height="1" fill="currentColor"/>
          </svg>
        </button>

        {/* Maximize / Restore */}
        <button 
          onClick={handleMaximize}
          className="w-[46px] h-[40px] flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          title={isMaximized ? "Verkleinern" : "Maximieren"}
        >
          {isMaximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 1.5V2.5H1.5V8.5H7.5V7.5H8.5V1.5H2.5ZM7.5 2.5V7.5H2.5V2.5H7.5Z" fill="currentColor"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor"/>
            </svg>
          )}
        </button>

        {/* Close */}
        <button 
          onClick={handleClose}
          className="w-[46px] h-[40px] flex items-center justify-center text-white/70 hover:bg-[#c42b1c] hover:text-white transition-colors"
          title="Schließen"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0.7L0.7 0L5 4.3L9.3 0L10 0.7L5.7 5L10 9.3L9.3 10L5 5.7L0.7 10L0 9.3L4.3 5L0 0.7Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
