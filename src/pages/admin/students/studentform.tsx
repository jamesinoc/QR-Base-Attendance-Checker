import type { FormEvent } from "react";

import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";

import type { StudentFormData } from "./type";

type StudentFormProps = {
  form: StudentFormData;
  isEditing: boolean;
  onChange: (data: StudentFormData) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function StudentForm({
  form,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const handleStudentIdChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");

    onChange({
      ...form,
      studentId: numbersOnly,
    });
  };

  const handlePhoneChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");

    onChange({
      ...form,
      phone: numbersOnly,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Student ID */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Student ID
          </label>

          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter student ID"
            value={form.studentId}
            onChange={(event) =>
              handleStudentIdChange(event.target.value)
            }
            required
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <Input
            type="text"
            placeholder="Enter full name"
            value={form.name}
            onChange={(event) =>
              onChange({
                ...form,
                name: event.target.value,
              })
            }
            required
          />
        </div>

        {/* Course */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Course
          </label>

          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={form.course}
            onChange={(event) =>
              onChange({
                ...form,
                course: event.target.value,
              })
            }
          >
            <option value="BSIT">BSIT</option>
            <option value="BSCS">BSCS</option>
            <option value="BSIS">BSIS</option>
            <option value="BSE">BSE</option>
            <option value="BSBA">BSBA</option>
          </select>
        </div>

        {/* Year Level */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Year Level
          </label>

          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={form.yearLevel}
            onChange={(event) =>
              onChange({
                ...form,
                yearLevel: event.target.value,
              })
            }
          >
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>

          <Input
            type="email"
            placeholder="student@example.com"
            value={form.email}
            onChange={(event) =>
              onChange({
                ...form,
                email: event.target.value,
              })
            }
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phone
          </label>

          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={(event) =>
              handlePhoneChange(event.target.value)
            }
            required
          />
        </div>
      </div>

      {/* Active */}
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(event) =>
            onChange({
              ...form,
              active: event.target.checked,
            })
          }
          className="h-4 w-4 rounded border-slate-300 text-blue-600"
        />

        <span className="text-sm font-medium text-slate-700">
          Student is active
        </span>
      </label>

      {/* Buttons */}
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit">
          {isEditing ? "Update Student" : "Add Student"}
        </Button>
      </div>
    </form>
  );
}