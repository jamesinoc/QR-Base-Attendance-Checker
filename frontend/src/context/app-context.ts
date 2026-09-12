import { createContext, useContext } from "react";

import type { AttendanceRecord } from "@/pages/admin/attendance/type";
import type { Student } from "@/pages/admin/students/type";

export type AppContextType = {
  students: Student[];
  attendance: AttendanceRecord[];
  loading: boolean;
  error: string | null;

  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: number) => void;

  addAttendance: (record: AttendanceRecord) => void;
  updateAttendanceStatus: (
    id: number,
    status: AttendanceRecord["status"]
  ) => void;

  resetDemoData: () => void;
  refresh: () => Promise<void>;
  clearData: () => void;
  clearError: () => void;
};

export const AppContext = createContext<AppContextType | undefined>(
  undefined
);

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside an AppProvider");
  }

  return context;
}