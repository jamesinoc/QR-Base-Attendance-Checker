import type { FormEvent } from "react";

import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";

import type { ClassFormData } from "./type";

type ClassFormProps = {
  form: ClassFormData;
  isEditing: boolean;
  onChange: (data: ClassFormData) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function ClassForm({
  form,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}: ClassFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Class Code */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Class Code
          </label>

          <Input
            type="text"
            placeholder="e.g. IT101"
            value={form.classCode}
            onChange={(event) =>
              onChange({
                ...form,
                classCode: event.target.value,
              })
            }
            required
          />
        </div>

        {/* Subject */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Subject
          </label>

          <Input
            type="text"
            placeholder="e.g. Web Development"
            value={form.subject}
            onChange={(event) =>
              onChange({
                ...form,
                subject: event.target.value,
              })
            }
            required
          />
        </div>

        {/* Instructor */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Instructor
          </label>

          <Input
            type="text"
            placeholder="Enter instructor name"
            value={form.instructor}
            onChange={(event) =>
              onChange({
                ...form,
                instructor: event.target.value,
              })
            }
            required
          />
        </div>

        {/* Schedule */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Schedule
          </label>

          <Input
            type="text"
            placeholder="e.g. Mon & Wed 8:00 AM - 9:30 AM"
            value={form.schedule}
            onChange={(event) =>
              onChange({
                ...form,
                schedule: event.target.value,
              })
            }
            required
          />
        </div>

        {/* Room */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Room
          </label>

          <Input
            type="text"
            placeholder="e.g. Room 301"
            value={form.room}
            onChange={(event) =>
              onChange({
                ...form,
                room: event.target.value,
              })
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
          Class is active
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
          {isEditing ? "Update Class" : "Add Class"}
        </Button>
      </div>
    </form>
  );
}