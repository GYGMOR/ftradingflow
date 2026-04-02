import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/api'

export type NotificationType = "TRADE" | "WARNING" | "INFO" | "SYSTEM" | "AI";
export type UserRole = "TRIAL" | "STANDARD" | "PREMIUM" | "PUBLISHER" | "ADMIN";

export interface StoreProduct {
  id: string;
  name: string;
  type: "STRATEGY" | "BUNDLE" | "DASHBOARD_PACK" | "RISK_PACK";
  priceCHF: number;
  description: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  avatarUrl: string | null;
}

interface UserStore {
  // Auth State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  
  isDark: boolean;
  toggleTheme: () => void;
  botActive: boolean;
  toggleBot: () => void;
  capital: number;
  openTradesCount: number;
  dailyTrades: number;
  winRate: number;
  setCapital: (val: number) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // New Layout & Notification States
  chartLayout: "single" | "split" | "quad";
  setChartLayout: (layout: "single" | "split" | "quad") => void;
  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;

  // SaaS States
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  purchasedStrategies: string[];
  purchaseStrategy: (id: string) => void;
  activeStrategies: string[];
  toggleActiveStrategy: (id: string) => void;
  // Dashboard Persistence & Scenes
  activeScene: string;
  setActiveScene: (scene: string) => void;
  dashboardLayouts: Record<string, any>; // Stores layout objects per scene
  saveLayout: (id: string, layout: any) => void;
  isLayoutLocked: boolean;
  toggleLayoutLock: () => void;
  
  // Store & Bundles
  cart: string[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Dynamic Dashboard States
  activeWidgets: string[];
  setWidgetActive: (id: string, active: boolean) => void;
  toggleWidget: (id: string) => void;
  purchasedLayouts: string[];
  purchasedWidgets: string[];
  isFeatureUnlocked: (featureId: string) => boolean;
  completeCheckout: () => void;
  applyPreset: (presetId: "classic" | "scalper" | "ai") => void;
  syncWithBackend: () => Promise<void>;
}

export const useStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Auth Implementation
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        localStorage.setItem("tf_auth_token", token);
        set({ user, token, isAuthenticated: true, userRole: user.role });
        get().syncWithBackend();
      },
      logout: () => {
        localStorage.removeItem("tf_auth_token");
        set({ user: null, token: null, isAuthenticated: false, userRole: "TRIAL" });
      },

      isDark: true,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      botActive: true,
      toggleBot: () => set((state) => ({ botActive: !state.botActive })),
      capital: 12450.00,
      openTradesCount: 2,
      dailyTrades: 14,
      winRate: 67.3,
      setCapital: (val) => set({ capital: val }),
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      
      chartLayout: "single",
      setChartLayout: (layout) => set({ chartLayout: layout }),
      
      notifications: [
        { id: "1", type: "TRADE", title: "Trade ausgeführt", message: "BTC/USDT Kauf 0.15 BTC", timestamp: new Date(Date.now() - 3 * 60000), read: false },
        { id: "2", type: "WARNING", title: "Stop-Loss getriggert", message: "ETH -€12.50", timestamp: new Date(Date.now() - 28 * 60000), read: false },
        { id: "3", type: "AI", title: "Neue Strategie verfügbar", message: "AI Scalper v2 trainiert.", timestamp: new Date(Date.now() - 120 * 60000), read: true },
      ],
      addNotification: (n) => set((state) => ({
        notifications: [{ id: Math.random().toString(36).substr(2, 9), ...n, timestamp: new Date(), read: false }, ...state.notifications]
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      markAllRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      userRole: "STANDARD",
      setUserRole: (role) => set({ userRole: role }),
      purchasedStrategies: ["strat-ema-10"], // Pre-purchased default strategy
      purchaseStrategy: (id) => set((state) => ({ purchasedStrategies: [...state.purchasedStrategies, id] })),
      activeStrategies: ["strat-ema-10"],
      toggleActiveStrategy: (id) => set((state) => ({
        activeStrategies: state.activeStrategies.includes(id) 
          ? state.activeStrategies.filter(s => s !== id)
          : [...state.activeStrategies, id]
      })),
      activeScene: "classic",
      setActiveScene: (scene) => set({ activeScene: scene }),
      dashboardLayouts: {},
      saveLayout: async (scene, layout) => {
        set((state) => ({
          dashboardLayouts: { ...state.dashboardLayouts, [scene]: layout }
        }));
        
        // Sync to backend if authenticated
        const { token, isAuthenticated } = get();
        if (token && isAuthenticated) {
          try {
            await api.post("/admin/layouts", { sceneName: scene, layoutData: layout });
          } catch (err) {
            console.error("Layout sync failed", err);
          }
        }
      },
      isLayoutLocked: true,
      toggleLayoutLock: () => set((state) => ({ isLayoutLocked: !state.isLayoutLocked })),
      
      cart: [],
      addToCart: (pid) => set((state) => ({ cart: state.cart.includes(pid) ? state.cart : [...state.cart, pid] })),
      removeFromCart: (pid) => set((state) => ({ cart: state.cart.filter(id => id !== pid) })),
      clearCart: () => set({ cart: [] }),

      // Dynamic Dashboard Implementations
      activeWidgets: ["capital", "daily_pnl", "winrate", "bot_status", "main_chart", "sentiment", "ai_radar", "heatmap"],
      setWidgetActive: (id, active) => set((state) => ({
         activeWidgets: active 
          ? (state.activeWidgets.includes(id) ? state.activeWidgets : [...state.activeWidgets, id])
          : state.activeWidgets.filter(w => w !== id)
      })),
      toggleWidget: (id) => set((state) => ({
        activeWidgets: state.activeWidgets.includes(id)
          ? state.activeWidgets.filter(w => w !== id)
          : [...state.activeWidgets, id]
      })),
      purchasedLayouts: ["layout-classic"],
      purchasedWidgets: ["capital", "daily_pnl", "winrate", "bot_status", "main_chart"],
      isFeatureUnlocked: (featureId: string) => {
        const state = get();
        if (state.user?.role === "ADMIN") return true;
        return state.purchasedWidgets.includes(featureId) || state.purchasedLayouts.includes(featureId);
      },
      completeCheckout: () => {
        const { cart, purchasedWidgets, purchasedLayouts } = useStore.getState();
        
        // Define Entitlement Mapping
        const ENTITLEMENTS: Record<string, { widgets?: string[], layouts?: string[], role?: UserRole }> = {
          "bundle_ai_elite": { 
             widgets: ["sentiment", "ai_radar", "heatmap", "ai_decision_feed", "last_signals"], 
             layouts: ["ai_focused"],
             role: "PREMIUM" 
          },
          "pack_essentials": { widgets: ["bot_toggle", "bot_status_live", "watchlist_mini"] },
          "pack_analytics_pro": { widgets: ["session_perf", "coin_strength", "journal_snapshot"] },
          "pack_ai_insight": { widgets: ["ai_decision_feed", "sentiment", "ai_radar"] },
          "pack_risk_control": { widgets: ["risk_score", "drawdown_guard", "risk_dashboard"] },
          "pack_bot_monitoring": { widgets: ["node_health", "bot_status_live"] },
          "bundle_elite_dash": { layouts: ["scalper", "ai_focused"], widgets: ["order_flow"] },
          "upgrade_elite_control": { role: "ADMIN" } // Elite upgrade mimics Admin for demo
        };

        let newWidgets = [...purchasedWidgets];
        let newLayouts = [...purchasedLayouts];
        let newRole = useStore.getState().userRole;

        cart.forEach(pid => {
          const ent = ENTITLEMENTS[pid];
          if (ent) {
            if (ent.widgets) newWidgets = [...new Set([...newWidgets, ...ent.widgets])];
            if (ent.layouts) newLayouts = [...new Set([...newLayouts, ...ent.layouts])];
            if (ent.role) newRole = ent.role;
          }
        });

        set({ 
          purchasedWidgets: newWidgets, 
          purchasedLayouts: newLayouts, 
          userRole: newRole,
          cart: [] 
        });
      },
      applyPreset: (presetId) => {
        const presets = {
          classic: ["capital", "daily_pnl", "winrate", "bot_status", "main_chart", "sentiment", "ai_radar", "heatmap"],
          scalper: ["bot_status", "main_chart", "order_flow", "risk_dashboard"],
          ai: ["capital", "bot_status", "sentiment", "ai_radar", "heatmap", "order_flow"]
        }
        set({ activeWidgets: presets[presetId] })
      },
      syncWithBackend: async () => {
        const { token, isAuthenticated } = get();
        if (!token || !isAuthenticated) return;
        
        try {
          // Fetch saved layouts
          const layoutRes = await api.get("/admin/layouts");
          const layouts: Record<string, any> = {};
          layoutRes.data.forEach((l: any) => {
            layouts[l.sceneName] = l.layoutData;
          });
          
          if (Object.keys(layouts).length > 0) {
            set({ dashboardLayouts: layouts });
          }

          console.log("Dashboard Layouts synced from cloud.");
        } catch (err) {
          console.error("Sync failed", err);
        }
      }
    }),
    {
      name: 'tradeflow-storage-v5', // Bump for expansion
    }
  )
)
