import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

// For Protected Platform Workspaces
export const ProtectedRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const isVerifiedUser = isAuthenticated && user?.verificationOptions?.status === "verified";

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // If completely unauthenticated, kick them to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but unverified, force them to the verify screen
  if (!isVerifiedUser) {
    return <Navigate to={`/verify?email=${encodeURIComponent(user?.email || "")}`} replace />;
  }

  return <Outlet />;
};

// For Guest-Only Channels (Login, Register, Forgot Password, Verify)
export const PublicOnlyRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const isVerifiedUser = isAuthenticated && user?.verificationOptions?.status === "verified";

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // If they are logged in and fully verified, block guest pages and route to home
  if (isVerifiedUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};