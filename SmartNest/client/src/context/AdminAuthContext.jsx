import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../lib/api";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = sessionStorage.getItem("smartnest_admin_token");
      const storedAdmin = sessionStorage.getItem("smartnest_admin_user");

      if (storedToken && storedAdmin) {
        try {
          const res = await authApi.me(storedToken);
          setToken(storedToken);
          setAdmin(res.admin || JSON.parse(storedAdmin));
        } catch (err) {
          console.warn("Session verification failed:", err);
          // clear expired session
          sessionStorage.removeItem("smartnest_admin_token");
          sessionStorage.removeItem("smartnest_admin_user");
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      setToken(data.token);
      setAdmin(data.admin);
      sessionStorage.setItem("smartnest_admin_token", data.token);
      sessionStorage.setItem("smartnest_admin_user", JSON.stringify(data.admin));
    } catch (err) {
      throw new Error(err.message || "Invalid credentials");
    }
  };

  const logout = async () => {
    setToken(null);
    setAdmin(null);
    sessionStorage.removeItem("smartnest_admin_token");
    sessionStorage.removeItem("smartnest_admin_user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

