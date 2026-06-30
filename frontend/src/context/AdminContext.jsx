import { createContext, useContext, useState } from "react";

const ADMIN_TOKEN_KEY = "admin-token";

// Clean up any stale admin-token left in localStorage from previous sessions
// Admin uses sessionStorage only — no permanent login.
localStorage.removeItem(ADMIN_TOKEN_KEY);

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => !!sessionStorage.getItem(ADMIN_TOKEN_KEY));

  const adminLogin = (adminToken) => {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, adminToken);
    setIsAdmin(true);
  };

  const adminLogout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setIsAdmin(false);
  };

  const value = {
    isAdmin,
    adminLogin,
    adminLogout,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export { AdminContext, useAdmin };
