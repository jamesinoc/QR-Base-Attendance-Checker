import { Link } from "react-router";

import { Button } from "@/components/common/button";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here's an overview of your attendance system.
          </p>
        </div>

        <Link to="/admin/attendance">
          <Button>Start Attendance</Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Students */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Students
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            0
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Registered students
          </p>
        </div>

        {/* Total Classes */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Classes
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            0
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Active classes
          </p>
        </div>

        {/* Present Today */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Present Today
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            0
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Students present
          </p>
        </div>

        {/* Late Today */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Late Today
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-500">
            0
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Students late
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Quickly access the most common attendance tasks.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link to="/admin/students">
            <Button
              variant="secondary"
              className="w-full"
            >
              Manage Students
            </Button>
          </Link>

          <Link to="/admin/classes">
            <Button
              variant="secondary"
              className="w-full"
            >
              Manage Classes
            </Button>
          </Link>

          <Link to="/admin/reports">
            <Button
              variant="secondary"
              className="w-full"
            >
              View Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Today's Attendance */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Today's Attendance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recent attendance activity will appear here.
            </p>
          </div>

          <Link
            to="/admin/attendance"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View attendance
          </Link>
        </div>

        <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-8 text-center">
          <p className="text-sm text-slate-500">
            No attendance records yet.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Start an attendance session to begin recording attendance.
          </p>
        </div>
      </div>
    </div>
  );
}