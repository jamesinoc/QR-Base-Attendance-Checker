import { Button } from "@/components/common/button";

import type { Class } from "./type";

type ClassTableProps = {
  classes: Class[];
  onEdit: (classItem: Class) => void;
  onDelete: (id: number) => void;
};

export default function ClassTable({
  classes,
  onEdit,
  onDelete,
}: ClassTableProps) {
  if (classes.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-600">
          No classes found
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Add a class to begin managing your subjects.
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
                Class Code
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Subject
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Instructor
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Schedule
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Room
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
            {classes.map((classItem) => (
              <tr
                key={classItem.id}
                className="hover:bg-slate-50"
              >
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                  {classItem.classCode}
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {classItem.subject}
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {classItem.instructor}
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {classItem.schedule}
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {classItem.room}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      classItem.active
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {classItem.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onEdit(classItem)}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onDelete(classItem.id)}
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