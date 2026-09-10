import { type FormEvent, useMemo, useState } from "react";

import { Download, Plus, Search } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

import { Button } from "@/components/common/button";
import { useApp } from "@/context/appcontext";

import StudentModal from "./studentmodal";
import StudentTable from "./studenttable";
import type { Student, StudentFormData } from "./type";

const emptyStudent: StudentFormData = {
  studentId: "",
  name: "",
  course: "BSIT",
  yearLevel: "1st Year",
  email: "",
  phone: "",
  active: true,
  qrValue: "",
};

export default function Students() {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
  } = useApp();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] =
    useState<StudentFormData>(emptyStudent);
  const [qrStudent, setQrStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    const search = query.toLowerCase().trim();

    if (!search) {
      return students;
    }

    return students.filter((student: Student) =>
      [
        student.studentId,
        student.name,
        student.course,
        student.email,
      ].some((value) =>
        value.toLowerCase().includes(search)
      )
    );
  }, [students, query]);

  const handleOpenAdd = () => {
    setEditing(null);
    setForm(emptyStudent);
    setOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditing(student);

    setForm({
      studentId: student.studentId,
      name: student.name,
      course: student.course,
      yearLevel: student.yearLevel,
      email: student.email,
      phone: student.phone,
      active: student.active,
      qrValue: student.qrValue,
    });

    setOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.studentId.trim() ||
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim()
    ) {
      return;
    }

    if (!/^\d+$/.test(form.studentId)) {
      return;
    }

    if (!/^\d+$/.test(form.phone)) {
      return;
    }

    if (editing) {
      updateStudent({
        ...editing,
        ...form,
        qrValue: form.studentId,
      });
    } else {
      const newStudent: Student = {
        id: Date.now(),
        ...form,
        qrValue: form.studentId,
      };

      addStudent(newStudent);
    }

    setOpen(false);
    setEditing(null);
    setForm(emptyStudent);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    deleteStudent(id);
  };

  const exportCsv = () => {
    const rows = [
      [
        "Student ID",
        "Name",
        "Course",
        "Year Level",
        "Email",
        "Phone",
      ],
      ...filteredStudents.map((s) => [
        s.studentId,
        s.name,
        s.course,
        s.yearLevel,
        s.email,
        s.phone,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${cell.replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Students
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage student profiles and QR codes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={exportCsv}
          >
            <Download size={17} />
            Export CSV
          </Button>

          <Button
            type="button"
            onClick={handleOpenAdd}
          >
            <Plus size={17} />
            Add Student
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search student..."
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Student Table */}
      <StudentTable
        students={filteredStudents}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onQr={setQrStudent}
      />

      {/* Student Modal */}
      {open && (
        <StudentModal
          isEditing={editing !== null}
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={() => {
            setOpen(false);
            setEditing(null);
            setForm(emptyStudent);
          }}
        />
      )}

      {/* QR Code Modal */}
      {qrStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  QR Code — {qrStudent.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setQrStudent(null)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            {/* QR Content */}
            <div className="flex flex-col items-center gap-4 p-6">
              <QRCodeCanvas
                value={qrStudent.qrValue || qrStudent.studentId}
                size={230}
                includeMargin
              />

              <strong className="text-sm font-semibold text-slate-900">
                {qrStudent.studentId}
              </strong>

              <p className="text-center text-sm text-slate-500">
                Use this QR code for attendance scanning.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
