import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserAuth } from "../../context/UserAuthContext";
import logoImg from "@/assets/logo.jpg";
import { toast } from "sonner";
import { auth, googleProvider, signInWithPopup } from "../../lib/firebase";

export function AuthModal({ isOpen, onClose, initialTab = "login" }) {
  const [isLogin, setIsLogin] = useState(initialTab === "login");
  const { login, register, googleLogin } = useUserAuth();
  
  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);

  // Sync initialTab when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialTab === "login");
    }
  }, [isOpen, initialTab]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      // Reset & Close
      setLoginEmail("");
      setLoginPassword("");
      onClose();
    } catch (err) {
      // toast is handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regConfirmPassword) return;
    if (regPassword !== regConfirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await register(regName, regEmail, regPassword);
      // Reset & Close
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");
      onClose();
    } catch (err) {
      // toast is handled in context
    } finally {
      setLoading(false);
    }
  };

  // Real Firebase Google Sign-In linked to Mongoose Atlas backend
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userObj = result.user;
      if (!userObj.email) {
        throw new Error("No email returned from Google Account");
      }
      await googleLogin(userObj.displayName, userObj.email);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Google Sign-In failed");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
            style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-lift md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition active:scale-95"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Logo / Header with imported logo image */}
            <div className="flex flex-col items-center text-center">
              <img
                src={logoImg}
                alt="SmartNest Logo"
                className="h-12 w-12 rounded-2xl object-cover shadow-soft transition-transform duration-300 hover:scale-105"
              />
              <h2 className="mt-2.5 text-xl font-bold tracking-tight">SmartNest Account</h2>
              <p className="text-xs text-muted-foreground">Control and monitor your smart spaces</p>
            </div>

            {/* Forms Sliding Window */}
            <div className="relative mt-8 overflow-hidden">
              <motion.div
                className="flex w-[200%]"
                animate={{ x: isLogin ? "0%" : "-50%" }}
                transition={{ type: "spring", stiffness: 320, damping: 30, mass: 0.8 }}
              >
                {/* ─── Sign In Form ─── */}
                <form onSubmit={handleLoginSubmit} className="w-1/2 pr-3">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="h-10 w-full rounded-xl border border-border bg-secondary/20 px-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background transition"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Password
                        </label>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            toast.info("Password reset simulated.");
                          }}
                          className="text-[10px] font-bold text-primary hover:underline"
                        >
                          Forgot Password?
                        </a>
                      </div>
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-10 w-full rounded-xl border border-border bg-secondary/20 px-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-11 w-full items-center justify-center rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition active:scale-[0.98] disabled:opacity-55"
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </button>

                    {/* OR Separator divider */}
                    <div className="relative my-4 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/80"></div>
                      </div>
                      <span className="relative bg-card px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        or
                      </span>
                    </div>

                    {/* Google OAuth Button */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card text-xs font-bold hover:bg-secondary transition active:scale-[0.98] disabled:opacity-55 cursor-pointer"
                    >
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>

                    {/* Short Message for Tab Switching */}
                    <p className="text-center text-xs text-muted-foreground mt-4 pt-1">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="font-bold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer outline-none"
                      >
                        Sign Up
                      </button>
                    </p>
                  </div>
                </form>

                {/* ─── Sign Up Form ─── */}
                <form onSubmit={handleRegisterSubmit} className="w-1/2 pl-3">
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="John Doe"
                        className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-3.5 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-3.5 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-3.5 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-3.5 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-10 w-full items-center justify-center rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition active:scale-[0.98] disabled:opacity-55 mt-2"
                    >
                      {loading ? "Creating account..." : "Sign Up"}
                    </button>

                    {/* OR Separator divider */}
                    <div className="relative my-3 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/80"></div>
                      </div>
                      <span className="relative bg-card px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        or
                      </span>
                    </div>

                    {/* Google OAuth Button */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card text-xs font-bold hover:bg-secondary transition active:scale-[0.98] disabled:opacity-55 cursor-pointer"
                    >
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>

                    {/* Short Message for Tab Switching */}
                    <p className="text-center text-xs text-muted-foreground mt-4 pt-1">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="font-bold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer outline-none"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
