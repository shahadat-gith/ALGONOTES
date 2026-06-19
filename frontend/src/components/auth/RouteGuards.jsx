import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";
import { getSafeNextPath, toLoginWithNext, toVerifyWithNext } from "../../utils/authRedirect";

// For Protected Platform Workspaces
export const ProtectedRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  const nextPath = getSafeNextPath(`${location.pathname}${location.search}`);
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
    return <Navigate to={toLoginWithNext(nextPath)} replace />;
  }

  // If logged in but unverified, force them to the verify screen
  if (!isVerifiedUser) {
    return <Navigate to={toVerifyWithNext(user?.email || "", nextPath)} replace />;
  }

  return <Outlet />;
};

// For Guest-Only Channels (Login, Register, Forgot Password, Verify)
export const PublicOnlyRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  const nextPath = getSafeNextPath(new URLSearchParams(location.search).get("next"), "/");
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
    return <Navigate to={nextPath} replace />;
  }

  // If authenticated but not verified, force verify flow only.
  if (isAuthenticated && !isVerifiedUser && !location.pathname.startsWith("/verify")) {
    return <Navigate to={toVerifyWithNext(user?.email || "", nextPath)} replace />;
  }

  return <Outlet />;
};