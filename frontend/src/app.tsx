import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";

import RequireAuth, { LoadingScreen } from "@/components/requireauth";
import GuestOnly from "@/components/guestonly";

const Login = lazy(() => import("@/pages/auth/login"));
const SignUp = lazy(() => import("@/pages/auth/signup"));
const Layout = lazy(() => import("@/pages/layout"));
const NotFound = lazy(() => import("@/pages/notfound"));

const Dashboard = lazy(() => import("@/pages/admin/dashboard"));
const Students = lazy(() => import("@/pages/admin/students"));
const History = lazy(() => import("@/pages/admin/history"));
const Attendance = lazy(() => import("@/pages/admin/attendance"));
const Report = lazy(() => import("@/pages/admin/report"));
const Settings = lazy(
  () => import("@/pages/admin/settings/settings")
);

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Authentication */}
        <Route element={<GuestOnly />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Admin Layout */}
        <Route path="/admin" element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            <Route
              path="students"
              element={<Students />}
            />

            <Route
              path="history"
              element={<History />}
            />

            <Route
              path="attendance"
              element={<Attendance />}
            />

            <Route
              path="reports"
              element={<Report />}
            />

            <Route
              path="settings"
              element={<Settings />}
            />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* Top-level catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}