import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AdminAuthContext";
import { Lock, Mail, AlertCircle } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Login — SmartNest";
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16 bg-gradient-hero">
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 shadow-lift backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft mb-3">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage SmartNest products, categories and enquiries.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="email"
                placeholder="admin@smartnest.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-foreground text-background font-semibold text-sm transition hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
