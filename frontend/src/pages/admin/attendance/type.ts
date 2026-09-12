export type AttendanceStatus =
  | "Present"
  | "Late"
  | "Absent";

export type AttendanceMethod =
  | "QR Scan"
  | "Manual"
  | "Auto";

export type AttendanceRecord = {
  id: number;
  studentId: string;
  studentName: string;
  classCode: string;
  className: string;
  subject: string;
  date: string;
  time: string;
  status: AttendanceStatus;
  method: AttendanceMethod;
  startTime?: string;
  endTime?: string;
};
