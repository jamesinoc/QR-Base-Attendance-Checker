import { Button } from "@/components/common/button";

import { AttendanceStatus } from "./attendancestatus";
import type { AttendanceRecord } from "./type";

type AttendanceTableProps = {
  records: AttendanceRecord[];
  onStatusChange: (
    id: number,
    status: AttendanceRecord["status"]
  ) => void;
};

export function AttendanceTable({
  records,
  onStatusChange,
}: AttendanceTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Attendance Records
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Students scanned during this attendance session.
        </p>
      </div>

      {records.length === 0 ? (
        <div className="p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <span className="text-lg font-bold text-slate-500">
              QR
            </span>
          </div>

          <p className="mt-4 text-sm font-medium text-slate-700">
            No attendance records yet
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Scan a student's QR code to record attendance.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">
                  Student ID
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Student Name
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Class
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Subject
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Date
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Time
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Status
                </th>

                <th className="px-6 py-4 text-right font-semibold text-slate-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {record.studentId}
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    {record.studentName}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {record.classCode}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {record.subject}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {record.date}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {record.time}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={record.status} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        className="px-3 py-2 text-xs"
                        onClick={() =>
                          onStatusChange(record.id, "Present")
                        }
                      >
                        Present
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        className="px-3 py-2 text-xs"
                        onClick={() =>
                          onStatusChange(record.id, "Late")
                        }
                      >
                        Late
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        className="px-3 py-2 text-xs"
                        onClick={() =>
                          onStatusChange(record.id, "Absent")
                        }
                      >
                        Absent
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

type AttendanceStatus = {
  status: AttendanceRecord["status"];
};

function StatusBadge({ status }: AttendanceStatus) {
  const statusStyles = {
    Present: "bg-green-100 text-green-700",
    Late: "bg-orange-100 text-orange-700",
    Absent: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}