import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import Button from "../../components/common/Button";
import { KeyRound, Mail, AlertCircle, Cpu } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login, isMock } = useAdminAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Failed to log in. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="glow-point bg-primary top-[30%] left-[30%]" />
      <div className="glow-point bg-secondary bottom-[30%] right-[30%]" />

      <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-900 flex flex-col gap-6 relative z-10 text-left">
        <div className="text-center flex flex-col items-center gap-2">
          <div className="p-3 bg-primary/10 rounded-full border border-primary/20 text-primary w-fit">
            <Cpu size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-white">SmartNest Admin</h2>
          <p className="text-xs text-gray-500">Sign in to manage the devices catalog</p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isMock && (
          <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-xl text-xs text-primary/80">
            <span className="font-semibold block mb-0.5">Development Mode Bypass:</span>
            Use <code className="bg-slate-950 px-1 py-0.5 rounded text-white font-mono">admin@smartnest.com</code> and password <code className="bg-slate-950 px-1 py-0.5 rounded text-white font-mono">admin123</code>.
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2.5 pl-9 rounded-lg text-sm text-white focus:outline-none w-full"
                placeholder="admin@smartnest.com"
              />
              <Mail className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2.5 pl-9 rounded-lg text-sm text-white focus:outline-none w-full"
                placeholder="••••••••"
              />
              <KeyRound className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full mt-4 py-3"
          >
            Authenticate Admin
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
