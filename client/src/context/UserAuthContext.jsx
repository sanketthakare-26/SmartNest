import { createContext, useContext, useState, useEffect } from "react";
import { userAuthApi } from "../lib/api";
import { toast } from "sonner";

const UserAuthContext = createContext(undefined);

export const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserToken = async () => {
      const storedToken = localStorage.getItem("smartnest_user_token");
      const storedUser = localStorage.getItem("smartnest_user_data");

      if (storedToken && storedUser) {
        try {
          const res = await userAuthApi.me(storedToken);
          setToken(storedToken);
          setUser(res.user || JSON.parse(storedUser));
        } catch (err) {
          console.warn("User token verification failed:", err);
          localStorage.removeItem("smartnest_user_token");
          localStorage.removeItem("smartnest_user_data");
        }
      }
      setLoading(false);
    };

    verifyUserToken();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await userAuthApi.login(email, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("smartnest_user_token", data.token);
      localStorage.setItem("smartnest_user_data", JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name}!`);
    } catch (err) {
      toast.error(err.message || "Invalid email or password");
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await userAuthApi.register(name, email, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("smartnest_user_token", data.token);
      localStorage.setItem("smartnest_user_data", JSON.stringify(data.user));
      toast.success(`Account created! Welcome, ${data.user.name}!`);
    } catch (err) {
      toast.error(err.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("smartnest_user_token");
    localStorage.removeItem("smartnest_user_data");
    toast.success("Logged out successfully");
  };

  return (
    <UserAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
};
