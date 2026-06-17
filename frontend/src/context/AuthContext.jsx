import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/userApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("auth-token"));
  const [loading, setLoading] = useState(() => {
    return !!localStorage.getItem("auth-token");
  });

  const loadUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true); // Ensure lock is closed during active hydration requests
      const data = await getCurrentUser();

      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        handleSessionClear();
      }
    } catch (error) {
      console.error("Session profile token validation failed:", error);
      handleSessionClear();
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClear = () => {
    localStorage.removeItem("auth-token");
    setUser(null);
    setToken(null);
  };

  const login = (newToken, loggedInUser) => {
    localStorage.setItem("auth-token", newToken);
    setToken(newToken);
    setUser(loggedInUser);
    setLoading(false);
  };

  const logout = () => {
    handleSessionClear();
    setLoading(false);
  };

  // Run validation checks on mount and whenever the active token transitions
  useEffect(() => {
    loadUser();
  }, [token]);

  const value = {
    user,
    setUser,
    token,
    setToken,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, useAuth };