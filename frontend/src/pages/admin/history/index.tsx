import { useMemo, useState } from "react";

import { Search } from "lucide-react";
import { useApp } from "@/context/app-context";
import type { AttendanceRecord } from "@/pages/admin/attendance/type";

export default function History() {
  const {
    attendance,
    students,
    updateAttendanceStatus,
  } = useApp();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [date, setDate] = useState("");

  const records = useMemo(
    () =>
      attendance.filter((record) => {
        const student = students.find(
          (s) => s.studentId === record.studentId
        );

        const text =
          `${student?.name ?? ""} ${record.studentId} ${record.subject} ${record.className}`
            .toLowerCase();

        return (
          text.includes(query.toLowerCase()) &&
          (status === "All" || record.status === status) &&
          (!date || record.date === date)
        );
      }),
    [attendance, students, query, status, date]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Attendance History
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Review, filter, and correct attendance records.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search student..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {records.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-600">
              No attendance records found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Take attendance to begin recording history.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Time
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Student
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Class
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Subject
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Method
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {records.map((record) => {
                  const student = students.find(
                    (s) => s.studentId === record.studentId
                  );

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {record.date}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {record.time}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">
                          {student?.name ?? "Unknown"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {record.studentId}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {record.className}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {record.subject}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={record.status}
                          onChange={(event) =>
                            updateAttendanceStatus(
                              record.id,
                              event.target
                                .value as AttendanceRecord["status"]
                            )
                          }
                          className={`rounded-full border-0 bg-transparent px-3 py-1 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-100 ${
                            record.status === "Present"
                              ? "bg-green-100 text-green-700"
                              : record.status === "Late"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          <option value="Present">Present</option>
                          <option value="Late">Late</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {record.method}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}