import { Download, FileText } from "lucide-react";

import { Button } from "@/components/common/button";
import { useApp } from "@/context/app-context";

export default function Report() {
  const { students, attendance } = useApp();

  const total = students.length;
  const present = attendance.filter(
    (a) => a.status === "Present"
  ).length;
  const late = attendance.filter(
    (a) => a.status === "Late"
  ).length;
  const absent = attendance.filter(
    (a) => a.status === "Absent"
  ).length;
  const rate = total
    ? Math.round(
        ((present + late) / total) *
          100
      )
    : 0;

  const download = () => {
    const rows = [
      [
        "Student ID",
        "Student Name",
        "Date",
        "Time",
        "Class",
        "Subject",
        "Status",
        "Method",
      ],
      ...attendance.map((a) => [
        a.studentId,
        students.find((s) => s.studentId === a.studentId)
          ?.name ?? "",
        a.date,
        a.time,
        a.className,
        a.subject,
        a.status,
        a.method,
      ]),
    ];

    const csv = rows
      .map((r) =>
        r.map((v) => `"${v}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Attendance Report
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Generate summaries and export attendance data.
          </p>
        </div>

        <Button type="button" onClick={download}>
          <Download size={17} />
          Generate CSV
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="block text-sm font-medium text-slate-500">
            Total Students
          </span>
          <strong className="mt-2 block text-3xl font-bold text-slate-900">
            {total}
          </strong>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm">
          <span className="block text-sm font-medium text-green-700">
            Present
          </span>
          <strong className="mt-2 block text-3xl font-bold text-green-900">
            {present}
          </strong>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <span className="block text-sm font-medium text-red-700">
            Absent
          </span>
          <strong className="mt-2 block text-3xl font-bold text-red-900">
            {absent}
          </strong>
        </div>

        <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
          <span className="block text-sm font-medium text-orange-700">
            Late
          </span>
          <strong className="mt-2 block text-3xl font-bold text-orange-900">
            {late}
          </strong>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attendance Percentage */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Attendance Percentage
          </h3>

          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-8 border-blue-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">
                  {rate}%
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Overall Rate
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Attendance Breakdown
          </h3>

          <div className="mt-8 space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Present
                </span>
                <b className="text-sm font-semibold text-slate-900">
                  {present}
                </b>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{
                    width: `${
                      attendance.length
                        ? (present / attendance.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Late
                </span>
                <b className="text-sm font-semibold text-slate-900">
                  {late}
                </b>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-orange-500"
                  style={{
                    width: `${
                      attendance.length
                        ? (late / attendance.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Absent
                </span>
                <b className="text-sm font-semibold text-slate-900">
                  {absent}
                </b>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{
                    width: `${
                      attendance.length
                        ? (absent / attendance.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Note */}
      <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
          <FileText
            size={22}
            className="text-blue-600"
          />
        </div>

        <div>
          <strong className="block font-semibold text-slate-900">
            Report options
          </strong>

          <p className="mt-1 text-sm text-slate-500">
            For a production version, this page can be
            connected to a backend to generate monthly PDF
            reports, class summaries, student attendance
            cards, and downloadable Excel files.
          </p>
        </div>
      </div>
    </div>
  );
}