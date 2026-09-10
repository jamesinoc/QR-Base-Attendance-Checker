import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router";

import "@/style/global.css";

import { AppProvider } from "@/context/appcontext";

import Login from "@/pages/auth/login";
import SignUp from "@/pages/auth/signup";
import Layout from "@/pages/layout";

import Dashboard from "@/pages/admin/dashboard";
import Students from "@/pages/admin/students";
import History from "@/pages/admin/history";
import Attendance from "@/pages/admin/attendance";
import Report from "@/pages/admin/report";
import Settings from "@/pages/admin/settings/settings";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Authentication */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Layout */}
        <Route path="/admin" element={<Layout />}>
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
        </Route>
      </Routes>
    </BrowserRouter>
  </AppProvider>
);