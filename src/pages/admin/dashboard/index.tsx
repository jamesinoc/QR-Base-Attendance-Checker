import {
  CheckCircle2,
  Clock3,
  GraduationCap,
  UserX,
} from "lucide-react";
import type { CSSProperties } from "react";

import { useApp } from "@/context/appcontext";

export default function Dashboard() {
  const { students, attendance } = useApp();

  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = attendance.filter(
    (a) => a.date === today
  );
  const present = todayRecords.filter(
    (a) => a.status === "Present"
  ).length;
  const late = todayRecords.filter(
    (a) => a.status === "Late"
  ).length;
  const absent = todayRecords.filter(
    (a) => a.status === "Absent"
  ).length;
  const total = students.filter((s) => s.active).length;
  const percentage = total
    ? Math.round(((present + late) / total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Overview of today's attendance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Students */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Students
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {total}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Registered active students
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
              <GraduationCap
                size={22}
                className="text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Present Today */}
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">
                Present Today
              </p>

              <p className="mt-2 text-3xl font-bold text-green-900">
                {present}
              </p>

              <p className="mt-1 text-xs text-green-600">
                {percentage}% attendance rate
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
              <CheckCircle2
                size={22}
                className="text-green-700"
              />
            </div>
          </div>
        </div>

        {/* Absent Today */}
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">
                Absent Today
              </p>

              <p className="mt-2 text-3xl font-bold text-red-900">
                {absent}
              </p>

              <p className="mt-1 text-xs text-red-600">
                Needs follow-up
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">
              <UserX size={22} className="text-red-700" />
            </div>
          </div>
        </div>

        {/* Late Today */}
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">
                Late Today
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-900">
                {late}
              </p>

              <p className="mt-1 text-xs text-orange-600">
                Late arrivals
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
              <Clock3
                size={22}
                className="text-orange-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Attendance Overview */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Today's Attendance Overview
          </h3>

          <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row">
            {/* Donut */}
            <div
              className="relative flex h-44 w-44 shrink-0 items-center justify-center rounded-full"
              style={
                {
                  background: `conic-gradient(#343a40 ${percentage}%, #dee2e6 0%)`,
                  "--pct": `${percentage}%`,
                } as CSSProperties
              }
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                <div className="text-3xl font-bold text-slate-900">
                  {percentage}%
                </div>
                <div className="text-xs text-slate-500">
                  Attendance
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
                Present <b className="ml-auto text-slate-900">{present}</b>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="inline-block h-3 w-3 rounded-full bg-orange-500" />
                Late <b className="ml-auto text-slate-900">{late}</b>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
                Absent <b className="ml-auto text-slate-900">{absent}</b>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Recent Activities
          </h3>

          <div className="mt-4 space-y-1">
            {attendance.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                <p className="text-sm text-slate-500">
                  No attendance records yet.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Start an attendance session to begin
                  recording activity.
                </p>
              </div>
            ) : (
              attendance.slice(0, 5).map((record) => {
                const student = students.find(
                  (s) => s.studentId === record.studentId
                );

                const activityStyles = {
                  Present: "bg-green-100 text-green-700",
                  Late: "bg-orange-100 text-orange-700",
                  Absent: "bg-red-100 text-red-700",
                };

                return (
                  <div
                    key={record.id}
                    className="flex items-center gap-4 rounded-lg p-3 transition hover:bg-slate-50"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        activityStyles[record.status]
                      }`}
                    >
                      <CheckCircle2 size={17} />
                    </div>

                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {student?.name ?? "Unknown"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {record.status} attendance • {record.time}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}