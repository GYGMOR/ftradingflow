import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Trading } from "./pages/Trading";
import { Strategies } from "./pages/Strategies";
import { Analytics } from "./pages/Analytics";
import { Store } from "./pages/Store";
import { Settings } from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthSuccess from "./pages/AuthSuccess";
import { Exchanges } from "./pages/Exchanges";
import { ControlCenter } from "./pages/ControlCenter";
import { RiskCenter } from "./pages/RiskCenter";
import { AIAnalytics } from "./pages/AIAnalytics";
import { ServerNodes } from "./pages/ServerNodes";
import { TradeJournal } from "./pages/TradeJournal";
import { Logs } from "./pages/Logs";
import { Checkout } from "./pages/Checkout";
import { Backtest } from "./pages/Backtest";
import { AdminDashboard } from "./pages/AdminDashboard";
import { useStore } from "./stores/useStore";
import { ThemeManager } from "./components/layout/ThemeManager";
import { Titlebar } from "./components/layout/Titlebar";
import { usePlatform } from "./hooks/usePlatform";
import api from "./lib/api";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  const [mounted, setMounted] = useState(false);
  const { login, logout, isAuthenticated } = useStore();
  const { platform } = usePlatform();

  useEffect(() => {
    setMounted(true);
    
    // Set platform-specific data attribute for CSS
    document.body.dataset.platform = platform;
    
    // Auth Sync Logic
    const syncAuth = async () => {
      const token = localStorage.getItem("tf_auth_token");
      if (token && !isAuthenticated) {
        try {
          const response = await api.get("/auth/me");
          login(response.data.user, token);
        } catch (err) {
          console.error("Auth sync failed", err);
          logout();
        }
      }
    };

    syncAuth();
  }, [login, logout, isAuthenticated, platform]);

  if (!mounted) return null;

  return (
    <Router>
      <Titlebar />
      <ThemeManager />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="trading" element={<Trading />} />
          <Route path="strategies" element={<Strategies />} />
          <Route path="backtest" element={<Backtest />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="store" element={<Store />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="control-center" element={<ControlCenter />} />
          <Route path="risk-center" element={<RiskCenter />} />
          <Route path="ai-insights" element={<AIAnalytics />} />
          <Route path="server-nodes" element={<ServerNodes />} />
          <Route path="exchanges" element={<Exchanges />} />
          <Route path="settings" element={<Settings />} />
          <Route path="journal" element={<TradeJournal />} />
          <Route path="logs" element={<Logs />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
