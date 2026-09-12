import { Navigate, Outlet } from "react-router";

import { isAuthenticated } from "@/lib/api";

export default function GuestOnly() {
  if (isAuthenticated()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}