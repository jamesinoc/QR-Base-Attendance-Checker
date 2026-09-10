import type { ChangeEvent } from "react";

import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";

type AttendanceSetupProps = {
  classCode: string;
  subject: string;
  date: string;
  onClassChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onStart: () => void;
};

export function AttendanceSetup({
  classCode,
  subject,
  date,
  onClassChange,
  onSubjectChange,
  onDateChange,
  onStart,
}: AttendanceSetupProps) {
  const handleClassChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onClassChange(event.target.value);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Attendance Setup
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Select the class and subject before starting the QR attendance.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Class */}
        <div>
          <label
            htmlFor="classCode"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Class
          </label>

          <select
            id="classCode"
            value={classCode}
            onChange={handleClassChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select a class</option>
            <option value="BSIT-101">BSIT-101</option>
            <option value="BSIT-102">BSIT-102</option>
            <option value="BSIT-103">BSIT-103</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Subject
          </label>

          <Input
            id="subject"
            type="text"
            placeholder="Enter subject"
            value={subject}
            onChange={(event) => onSubjectChange(event.target.value)}
          />
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="attendanceDate"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Attendance Date
          </label>

          <Input
            id="attendanceDate"
            type="date"
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          onClick={onStart}
          disabled={!classCode || !subject || !date}
        >
          Start Attendance
        </Button>
      </div>
    </div>
  );
}