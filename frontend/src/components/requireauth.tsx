import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

import { useApp } from "@/context/app-context";
import { isAuthenticated } from "@/lib/api";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="mt-4 text-sm text-slate-500">Loading your data...</p>
      </div>
    </div>
  );
}

export default function RequireAuth() {
  const { loading, refresh } = useApp();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated()) {
      refresh();
    }
  }, [refresh]);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return <Outlet />;
}