import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { MoreVertical, X } from "lucide-react";

import logo from "@/assets/logo.png";
import { Button } from "@/components/common/button";

const navigation = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    name: "Students",
    path: "/admin/students",
  },
  {
    name: "Attendance History",
    path: "/admin/history",
  },
  {
    name: "Attendance",
    path: "/admin/attendance",
  },
  {
    name: "Reports",
    path: "/admin/reports",
  },
  {
    name: "Settings",
    path: "/admin/settings",
  },
];

export default function Layout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-[#ffffff] lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-slate-200 px-6 py-5">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white-600 text-sm font-bold text-white">
                <img
                  src={logo}
                  alt="Teacher Attendance logo"
                  className="h-8 w-8 rounded-lg object-contain"
                />
              </div>

              <div>
                <h1 className="font-bold text-slate-900">
                  Teacher Attendance
                </h1>

                <p className="text-xs text-slate-500">
                  Attendance System
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-slate-200 p-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleLogout}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-[#ffffff] lg:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <Link
              to="/admin/dashboard"
              className="font-bold text-slate-900"
            >
              QR Attendance
            </Link>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleLogout}
              >
                Sign Out
              </Button>

              <button
                type="button"
                aria-label={
                  menuOpen ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((value) => !value)}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <MoreVertical className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav className="border-t border-slate-200 bg-[#ffffff] px-4 py-3">
              <div className="flex flex-col space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </nav>
          )}
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}