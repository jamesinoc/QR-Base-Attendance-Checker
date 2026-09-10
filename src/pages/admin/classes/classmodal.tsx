import type { FormEvent } from "react";

import ClassForm from "./classform";
import type { ClassFormData } from "./type";

type ClassModalProps = {
  form: ClassFormData;
  isEditing: boolean;
  onChange: (data: ClassFormData) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function ClassModal({
  form,
  isEditing,
  onChange,
  onSubmit,
  onClose,
}: ClassModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditing ? "Edit Class" : "Add Class"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the class information below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <ClassForm
            form={form}
            isEditing={isEditing}
            onChange={onChange}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}