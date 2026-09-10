import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";

import StudentModal from "./studentmodal";
import StudentTable from "./studenttable";
import type { Student, StudentFormData } from "./types";

const emptyStudent: StudentFormData = {
  studentId: "",
  name: "",
  course: "BSIT",
  yearLevel: "1st Year",
  email: "",
  phone: "",
  active: true,
};

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingStudent, setEditingStudent] =
    useState<Student | null>(null);

  const [form, setForm] =
    useState<StudentFormData>(emptyStudent);

  const filteredStudents = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return students;
    }

    return students.filter(
      (student) =>
        student.studentId
          .toLowerCase()
          .includes(query) ||
        student.name.toLowerCase().includes(query) ||
        student.course.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
    );
  }, [students, search]);

  const openAddModal = () => {
    setEditingStudent(null);
    setForm(emptyStudent);
    setShowModal(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);

    setForm({
      studentId: student.studentId,
      name: student.name,
      course: student.course,
      yearLevel: student.yearLevel,
      email: student.email,
      phone: student.phone,
      active: student.active,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setForm(emptyStudent);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !form.studentId ||
      !form.name ||
      !form.email ||
      !form.phone
    ) {
      return;
    }

    if (editingStudent) {
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === editingStudent.id
            ? {
                ...student,
                ...form,
              }
            : student
        )
      );
    } else {
      const newStudent: Student = {
        id: Date.now(),
        ...form,
      };

      setStudents((currentStudents) => [
        ...currentStudents,
        newStudent,
      ]);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    setStudents((currentStudents) =>
      currentStudents.filter(
        (student) => student.id !== id
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Students
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage students registered in the attendance
            system.
          </p>
        </div>

        <Button onClick={openAddModal}>
          + Add Student
        </Button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <Input
          type="search"
          placeholder="Search by student ID, name, course, or email..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      {/* Table */}
      <StudentTable
        students={filteredStudents}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {/* Modal */}
      {showModal && (
        <StudentModal
          form={form}
          isEditing={editingStudent !== null}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}