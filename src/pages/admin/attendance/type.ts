export type AttendanceStatus =
  | "Present"
  | "Late"
  | "Absent";

export type AttendanceRecord = {
  id: number;
  studentId: string;
  studentName: string;
  classCode: string;
  subject: string;
  date: string;
  time: string;
  status: AttendanceStatus;
};