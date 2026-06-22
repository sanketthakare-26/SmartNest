import React, { createContext, useState, useEffect, useContext } from "react";
import { 
  signInWithEmailAndPassword as fbSignIn, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth, isMockFirebase } from "../lib/firebase";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Auth state
  useEffect(() => {
    if (isMockFirebase) {
      // Mock Auth Check
      const mockUserStr = localStorage.getItem("mockAdminUser");
      if (mockUserStr) {
        setUser(JSON.parse(mockUserStr));
      }
      setLoading(false);
    } else {
      // Firebase Auth Check
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          try {
            const token = await currentUser.getIdToken();
            localStorage.setItem("adminToken", token);
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || "Admin",
            });
          } catch (err) {
            console.error("Error retrieving ID token", err);
          }
        } else {
          localStorage.removeItem("adminToken");
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    if (isMockFirebase) {
      // Mock Authentication Simulation
      if (email === "admin@smartnest.com" && password === "admin123") {
        const mockUser = { uid: "mock-uid-123", email, displayName: "Demo Admin" };
        localStorage.setItem("mockAdminUser", JSON.stringify(mockUser));
        localStorage.setItem("adminToken", "mock-jwt-token-xyz");
        setUser(mockUser);
        return mockUser;
      } else {
        const err = new Error("Invalid admin credentials. Use admin@smartnest.com / admin123");
        setError(err.message);
        throw err;
      }
    } else {
      // Firebase Sign In
      try {
        const userCredential = await fbSignIn(auth, email, password);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem("adminToken", token);
        return userCredential.user;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    }
  };

  // Logout handler
  const logout = async () => {
    if (isMockFirebase) {
      localStorage.removeItem("mockAdminUser");
      localStorage.removeItem("adminToken");
      setUser(null);
    } else {
      try {
        await fbSignOut(auth);
        localStorage.removeItem("adminToken");
        setUser(null);
      } catch (err) {
        console.error("Firebase logout failed", err);
      }
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, error, login, logout, isMock: isMockFirebase }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
