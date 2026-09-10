import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";

import ClassModal from "./classmodal";
import ClassTable from "./classtable";
import type { Class, ClassFormData } from "./type";

const emptyClass: ClassFormData = {
  classCode: "",
  subject: "",
  instructor: "",
  schedule: "",
  room: "",
  active: true,
};

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingClass, setEditingClass] =
    useState<Class | null>(null);

  const [form, setForm] =
    useState<ClassFormData>(emptyClass);

  const filteredClasses = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return classes;
    }

    return classes.filter(
      (classItem) =>
        classItem.classCode
          .toLowerCase()
          .includes(query) ||
        classItem.subject
          .toLowerCase()
          .includes(query) ||
        classItem.instructor
          .toLowerCase()
          .includes(query) ||
        classItem.room.toLowerCase().includes(query)
    );
  }, [classes, search]);

  const openAddModal = () => {
    setEditingClass(null);
    setForm(emptyClass);
    setShowModal(true);
  };

  const openEditModal = (classItem: Class) => {
    setEditingClass(classItem);

    setForm({
      classCode: classItem.classCode,
      subject: classItem.subject,
      instructor: classItem.instructor,
      schedule: classItem.schedule,
      room: classItem.room,
      active: classItem.active,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClass(null);
    setForm(emptyClass);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !form.classCode ||
      !form.subject ||
      !form.instructor ||
      !form.schedule ||
      !form.room
    ) {
      return;
    }

    if (editingClass) {
      setClasses((currentClasses) =>
        currentClasses.map((classItem) =>
          classItem.id === editingClass.id
            ? {
                ...classItem,
                ...form,
              }
            : classItem
        )
      );
    } else {
      const newClass: Class = {
        id: Date.now(),
        ...form,
      };

      setClasses((currentClasses) => [
        ...currentClasses,
        newClass,
      ]);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (!confirmed) {
      return;
    }

    setClasses((currentClasses) =>
      currentClasses.filter(
        (classItem) => classItem.id !== id
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Classes
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage classes and subjects for attendance.
          </p>
        </div>

        <Button onClick={openAddModal}>
          + Add Class
        </Button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <Input
          type="search"
          placeholder="Search by class code, subject, instructor, or room..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      {/* Table */}
      <ClassTable
        classes={filteredClasses}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {/* Modal */}
      {showModal && (
        <ClassModal
          form={form}
          isEditing={editingClass !== null}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}