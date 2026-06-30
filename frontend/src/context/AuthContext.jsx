import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/userApi";

const USER_TOKEN_KEY = "user-token";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(USER_TOKEN_KEY));
  const [loading, setLoading] = useState(() => {
    return !!localStorage.getItem(USER_TOKEN_KEY);
  });

  const loadUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getCurrentUser();

      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        handleSessionClear();
      }
    } catch (error) {
      handleSessionClear();
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClear = () => {
    localStorage.removeItem(USER_TOKEN_KEY);
    setUser(null);
    setToken(null);
  };

  const login = (newToken, loggedInUser) => {
    localStorage.setItem(USER_TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(loggedInUser);
    setLoading(false);
  };

  const logout = () => {
    handleSessionClear();
    setLoading(false);
  };

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