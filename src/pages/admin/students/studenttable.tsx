import { Button } from "@/components/common/button";

import type { Student } from "./type";

type StudentTableProps = {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
};

export default function StudentTable({
  students,
  onEdit,
  onDelete,
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
        <table className="w-full min-w-225">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Student ID
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Course
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Year
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
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

                <td className="px-6 py-4 text-sm text-slate-700">
                  {student.name}
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {student.course}
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {student.yearLevel}
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {student.email}
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
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onEdit(student)}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onDelete(student.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
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