import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../common/Loader";

export const ProtectedRoute = ({ isAuthenticated, isAuthLoading }) => {
  // 1. MUST CHECK LOADING FIRST! Hold route evaluation until API resolves
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <Loader text="refreshing..."/>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PublicOnlyRoute = ({ isAuthenticated, isAuthLoading }) => {
  // 1. MUST CHECK LOADING FIRST! Prevents showing login form on rapid refreshes
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <Loader text="refreshing..."/>
      </div>
    );
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};