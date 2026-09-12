import { useEffect, useMemo, useRef, useState } from "react";

import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock3,
  Info,
  Keyboard,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/common/button";
import { useApp } from "@/context/app-context";

import {
  LATE_WINDOW,
  PRESENT_WINDOW,
  computeStatus,
  formatManilaDateLong,
  formatManilaTime,
  formatTime,
  toManilaDate,
  toManilaMinutes,
  toMinutes,
} from "@/lib/attendance";

import QRScanner from "./qrscanner";
import type { AttendanceMethod } from "./type";

export default function Attendance() {
  const { students, attendance, addAttendance, updateAttendanceStatus } =
    useApp();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"qr" | "manual">("qr");
  const [className, setClassName] = useState("BSIT 3A");
  const [subject, setSubject] = useState("Web Development");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [studentCode, setStudentCode] = useState("");
  const [message, setMessage] = useState("");
  const autoAbsentRef = useRef(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // All date/time values below use the Asia/Manila timezone.
  const date = toManilaDate(now);
  const time = formatManilaTime(now);
  const dateLong = formatManilaDateLong(now);

  const stateRef = useRef({
    startTime,
    endTime,
    students,
    attendance,
    date,
    subject,
    className,
  });
  useEffect(() => {
    stateRef.current = {
      startTime,
      endTime,
      students,
      attendance,
      date,
      subject,
      className,
    };
  });

  const startMin = toMinutes(startTime);

  const statusCounts = useMemo(() => {
    const records = attendance.filter(
      (a) =>
        a.date === date &&
        a.subject === subject &&
        a.className === className
    );
    return {
      present: records.filter((a) => a.status === "Present").length,
      late: records.filter((a) => a.status === "Late").length,
      absent: records.filter((a) => a.status === "Absent").length,
    };
  }, [attendance, date, subject, className]);

  const markAttendance = (
    code: string,
    method: AttendanceMethod = "Manual"
  ) => {
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setMessage("Invalid QR code or student ID.");
      return;
    }

    const {
      students: liveStudents,
      attendance: liveAttendance,
      date: liveDate,
      subject: liveSubject,
      className: liveClassName,
      startTime: liveStartTime,
      endTime: liveEndTime,
    } = stateRef.current;

    const student = liveStudents.find(
      (s) => s.studentId === trimmedCode || s.qrValue === trimmedCode
    );

    if (!student) {
      setMessage(`${trimmedCode} not found. Check the student ID or QR code.`);
      return;
    }

    if (!student.active) {
      setMessage(`${student.name} is currently inactive.`);
      return;
    }

    // The actual timestamp of the scan (Asia/Manila).
    const scanTime = new Date();
    const scanDate = toManilaDate(scanTime);
    const scanMinutes = toManilaMinutes(scanTime);
    const scanDisplay = formatManilaTime(scanTime);

    // One attendance record per student per class/session/date.
    const already = liveAttendance.find(
      (a) =>
        a.studentId === student.studentId &&
        a.date === liveDate &&
        a.subject === liveSubject &&
        a.className === liveClassName
    );

    if (already) {
      // A student who was auto-marked Absent may still scan; their status
      // is recomputed from the actual scan time, never forced to Present.
      if (already.status === "Absent" && already.method === "Auto") {
        const updated = computeStatus(
          scanDate,
          scanMinutes,
          liveDate,
          liveStartTime
        );
        updateAttendanceStatus(already.id, updated);
        setMessage(
          `${student.name} updated to ${updated} at ${scanDisplay}.`
        );
        setStudentCode("");
        return;
      }

      setMessage(
        `${student.name} is already marked ${already.status} (recorded at ${already.time}).`
      );
      return;
    }

    // Always derive the status from the actual scan time vs. the schedule.
    const finalStatus = computeStatus(
      scanDate,
      scanMinutes,
      liveDate,
      liveStartTime
    );

    addAttendance({
      id: Date.now(),
      studentId: student.studentId,
      studentName: student.name,
      classCode: liveClassName,
      className: liveClassName,
      subject: liveSubject,
      date: liveDate,
      time: scanDisplay,
      status: finalStatus,
      method,
      startTime: liveStartTime,
      endTime: liveEndTime,
    });

    setMessage(`${student.name} marked ${finalStatus} at ${scanDisplay}.`);
    setStudentCode("");
  };

  useEffect(() => {
    autoAbsentRef.current = false;
  }, [startTime]);

  useEffect(() => {
    if (!startTime || autoAbsentRef.current) return;

    // Cutoff check uses Asia/Manila time consistently.
    if (toManilaMinutes(now) - toMinutes(startTime) <= LATE_WINDOW) return;

    autoAbsentRef.current = true;

    const unmarked = students
      .filter((s) => s.active)
      .filter(
        (s) =>
          !attendance.some(
            (a) =>
              a.studentId === s.studentId &&
              a.date === date &&
              a.subject === subject &&
              a.className === className
          )
      );

    unmarked.forEach((s) => {
      addAttendance({
        id: Date.now() + Math.floor(Math.random() * 1000),
        studentId: s.studentId,
        studentName: s.name,
        classCode: className,
        className,
        subject,
        date,
        time: formatManilaTime(now),
        status: "Absent",
        method: "Auto",
        startTime,
        endTime,
      });
    });
  }, [now, startTime, endTime, students, attendance, date, subject, className, addAttendance]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/admin/dashboard")}
        >
          <ArrowLeft size={17} />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">
          Take Attendance
        </h1>
        <div className="w-24" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left Panel — Class Schedule */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Class
              </label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-[#ffffff] px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="BSIT 3A">BSIT 3A</option>
                <option value="BSIT 3B">BSIT 3B</option>
                <option value="BSCS 2A">BSCS 2A</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-[#ffffff] px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Web Development">Web Development</option>
                <option value="Database Management">
                  Database Management
                </option>
                <option value="System Integration">
                  System Integration
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Class Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-[#ffffff] px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Class End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-[#ffffff] px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Attendance Rules (24-hr)
              </label>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
                <p>
                  <span className="font-bold text-green-700">Present:</span>{" "}
                  {formatTime(startMin)} – {formatTime(startMin + PRESENT_WINDOW)}
                </p>
                <p>
                  <span className="font-bold text-orange-600">Late:</span>{" "}
                  {formatTime(startMin + PRESENT_WINDOW + 1)} –{" "}
                  {formatTime(startMin + LATE_WINDOW)}
                </p>
                <p>
                  <span className="font-bold text-red-600">Absent:</span>{" "}
                  After {formatTime(startMin + LATE_WINDOW)} or no scan
                </p>
                <p className="mt-2 border-t border-slate-200 pt-2">
                  Status is calculated per scan from the exact scan time.
                  Scanning does not automatically mark a student Present.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Schedule Date
              </label>
              <input
                value={dateLong}
                readOnly
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
              <p className="mt-1 text-xs text-slate-400">
                {date} — Asia/Manila
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Current Time (24-hr, Asia/Manila)
              </label>
              <input
                value={time}
                readOnly
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-mono text-slate-900 outline-none"
              />
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
              <Info size={18} className="mt-0.5 shrink-0" />
              <p>
                The schedule above applies to today's date. Each scan is
                compared against the Class Start Time using the exact
                scan time to determine Present, Late, or Absent.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel — Scanner & Results */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode("qr")}
              className={`flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                mode === "qr"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Camera size={17} />
              QR Scan
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                mode === "manual"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Keyboard size={17} />
              Manual Select
            </button>
          </div>

          {mode === "qr" ? (
            <QRScanner
              onScan={(code) => markAttendance(code, "QR Scan")}
              onError={(err) => setMessage(err)}
            />
          ) : (
            <div className="mx-auto max-w-md space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Select Student
                </label>
                <select
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-[#ffffff] px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select student</option>
                  {students
                    .filter((s) => s.active)
                    .map((student) => (
                      <option key={student.id} value={student.studentId}>
                        {student.studentId} — {student.name}
                      </option>
                    ))}
                </select>
              </div>
              <Button
                type="button"
                onClick={() => markAttendance(studentCode, "Manual")}
                className="w-full"
              >
                Mark Attendance
              </Button>
              <p className="text-center text-xs text-slate-400">
                Manual marking also uses the actual scan time against the
                schedule rules.
              </p>
            </div>
          )}

          {/* Scan Feedback */}
          {message && (
            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-center text-sm font-medium text-blue-700">
              {message}
            </div>
          )}

          {/* Status Count Boxes */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle2 size={22} className="text-green-600" />
              <span className="mt-1 text-2xl font-bold text-green-700">
                {statusCounts.present}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-green-600">
                Present
              </span>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-orange-200 bg-orange-50 p-4">
              <Clock3 size={22} className="text-orange-600" />
              <span className="mt-1 text-2xl font-bold text-orange-700">
                {statusCounts.late}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                Late
              </span>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-red-200 bg-red-50 p-4">
              <XCircle size={22} className="text-red-600" />
              <span className="mt-1 text-2xl font-bold text-red-700">
                {statusCounts.absent}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-red-600">
                Absent
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}