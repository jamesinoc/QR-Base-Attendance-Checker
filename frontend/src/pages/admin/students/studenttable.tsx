import { Edit3, Trash2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

import type { Student } from "./type";

type StudentTableProps = {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
  onQr: (student: Student) => void;
};

export default function StudentTable({
  students,
  onEdit,
  onDelete,
  onQr,
}: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-600">
          No students found
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Add a student to begin managing attendance.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                ID
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Course
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Year Level
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Contact
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-slate-50"
              >
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  {student.studentId}
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">
                    {student.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {student.email}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {student.course}
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {student.yearLevel}
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {student.phone}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      student.active
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {student.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onQr(student)}
                      title="QR Code"
                      className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <QRCodeCanvas
                        value={student.qrValue || student.studentId}
                        size={25}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(student)}
                      title="Edit"
                      className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(student.id)}
                      title="Delete"
                      className="inline-flex items-center justify-center rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
