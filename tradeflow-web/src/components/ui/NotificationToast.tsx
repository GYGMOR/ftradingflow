import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info, AlertTriangle, X, TrendingUp, Sparkles } from "lucide-react"
import { useStore, type AppNotification, type NotificationType } from "../../stores/useStore"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"

const iconMap: Record<NotificationType, React.ReactNode> = {
  "TRADE": <TrendingUp className="w-5 h-5 text-success" />,
  "WARNING": <AlertTriangle className="w-5 h-5 text-destructive" />,
  "INFO": <Info className="w-5 h-5 text-primary" />,
  "SYSTEM": <AlertTriangle className="w-5 h-5 text-warning" />,
  "AI": <Sparkles className="w-5 h-5 text-ai" />
}

const borderMap: Record<NotificationType, string> = {
  "TRADE": "border-l-success",
  "WARNING": "border-l-destructive",
  "INFO": "border-l-primary",
  "SYSTEM": "border-l-warning",
  "AI": "border-l-ai"
}

export function NotificationToast() {
  const { notifications, removeNotification } = useStore()
  const [toasts, setToasts] = useState<AppNotification[]>([])

  // Mock listener to briefly show toasts when newly added.
  // In a real app we would subscribe to an event or use a separate toast store.
  // Here we just display the newest unread up to 4 for 5 seconds if they were created < 5 seconds ago.
  useEffect(() => {
    const recent = notifications.filter(n => !n.read && (Date.now() - new Date(n.timestamp).getTime() < 5000)).slice(0, 4)
    setToasts(recent)
  }, [notifications])

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none w-80">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`pointer-events-auto bg-card border border-border shadow-xl rounded-lg overflow-hidden border-l-4 ${borderMap[toast.type]}`}
          >
            <div className="p-4 flex items-start">
              <div className="shrink-0 mr-3 mt-0.5">
                {iconMap[toast.type]}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-card-foreground leading-tight">{toast.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{toast.message}</p>
                <div className="text-[10px] text-muted-foreground mt-2 font-medium">
                  {formatDistanceToNow(new Date(toast.timestamp), { addSuffix: true, locale: de })}
                </div>
              </div>
              <button 
                onClick={() => removeNotification(toast.id)}
                className="shrink-0 ml-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
