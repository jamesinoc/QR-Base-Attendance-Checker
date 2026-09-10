import { useState } from "react";

import { Card } from "@/components/common/card";

import { AttendanceSetup } from "./atttendancesetup";
import { AttendanceTable } from "./attendancetable";
import { QRScanner } from "./qrscanner";
import type { AttendanceRecord } from "./type";

export default function Attendance() {
  const [classCode, setClassCode] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");

  const [isAttendanceStarted, setIsAttendanceStarted] =
    useState(false);

  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  const handleStartAttendance = () => {
    if (!classCode || !subject || !date) {
      return;
    }

    setIsAttendanceStarted(true);
  };

  const handleStopAttendance = () => {
    setIsAttendanceStarted(false);
  };

  const handleScan = (studentId: string) => {
    const existingRecord = records.find(
      (record) => record.studentId === studentId
    );

    if (existingRecord) {
      return;
    }

    const now = new Date();

    const newRecord: AttendanceRecord = {
      id: Date.now(),
      studentId,
      studentName: `Student ${studentId}`,
      classCode,
      subject,
      date,
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Present",
    };

    setRecords((currentRecords) => [
      ...currentRecords,
      newRecord,
    ]);
  };

  const handleStatusChange = (
    id: number,
    status: AttendanceRecord["status"]
  ) => {
    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.id === id
          ? {
              ...record,
              status,
            }
          : record
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          QR Attendance
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Start an attendance session and scan student QR codes.
        </p>
      </div>

      {/* Attendance Setup */}
      {!isAttendanceStarted && (
        <AttendanceSetup
          classCode={classCode}
          subject={subject}
          date={date}
          onClassChange={setClassCode}
          onSubjectChange={setSubject}
          onDateChange={setDate}
          onStart={handleStartAttendance}
        />
      )}

      {/* Active Attendance */}
      {isAttendanceStarted && (
        <>
          <Card className="p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active Attendance
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {classCode}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {subject} • {date}
                </p>
              </div>

              <button
                type="button"
                onClick={handleStopAttendance}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                Stop Attendance
              </button>
            </div>
          </Card>

          {/* QR Scanner */}
          <QRScanner
            onScan={handleScan}
            onStop={handleStopAttendance}
          />

          {/* Attendance Table */}
          <AttendanceTable
            records={records}
            onStatusChange={handleStatusChange}
          />
        </>
      )}
    </div>
  );
}