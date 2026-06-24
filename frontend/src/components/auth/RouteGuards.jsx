import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";
import { getSafeNextPath, toLoginWithNext } from "../../utils/authRedirect";

// For Protected Platform Workspaces
export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const nextPath = getSafeNextPath(`${location.pathname}${location.search}`);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // If completely unauthenticated, kick them to login
  if (!isAuthenticated) {
    return <Navigate to={toLoginWithNext(nextPath)} replace />;
  }

  return <Outlet />;
};

// For Guest-Only Channels (Login, Register, Forgot Password)
export const PublicOnlyRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const nextPath = getSafeNextPath(new URLSearchParams(location.search).get("next"), "/");

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // If they are logged in, block guest pages and route to home
  if (isAuthenticated) {
    return <Navigate to={nextPath} replace />;
  }

  return <Outlet />;
};