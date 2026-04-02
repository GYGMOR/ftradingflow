import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../stores/useStore";
import api from "../lib/api";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  useEffect(() => {
    const handleSSOSuccess = async () => {
      const token = searchParams.get("token");
      
      if (token) {
        try {
          // Save token temporarily to fetch profile
          localStorage.setItem("tf_auth_token", token);
          
          // Fetch the user profile from the backend using the new token
          const response = await api.get("/auth/me");
          
          // Complete login in store
          login(response.data.user, token);
          
          // Redirect to premium dashboard
          navigate("/dashboard");
        } catch (err) {
          console.error("SSO Profile Fetch Failed", err);
          navigate("/login?error=sso_sync_failed");
        }
      } else {
        navigate("/login?error=no_token");
      }
    };

    handleSSOSuccess();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen bg-[#0B0E17] flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6" />
      <h2 className="text-xl font-black text-white tracking-tight">Authentifizierung erfolgreich</h2>
      <p className="text-slate-500 text-sm font-medium mt-2">Wir laden dein persönliches Terminal...</p>
    </div>
  );
}
