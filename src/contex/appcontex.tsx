import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Student } from "@/pages/admin/students/type";
import type { AttendanceRecord } from "@/pages/admin/attendance/type";

type AppContextType = {
  students: Student[];
  attendance: AttendanceRecord[];

  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: number) => void;

  addAttendance: (record: AttendanceRecord) => void;
  updateAttendanceStatus: (
    id: number,
    status: AttendanceRecord["status"]
  ) => void;
};

const AppContext = createContext<AppContextType | undefined>(
  undefined
);

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({
  children,
}: AppProviderProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<
    AttendanceRecord[]
  >([]);

  const addStudent = (student: Student) => {
    setStudents((currentStudents) => [
      ...currentStudents,
      student,
    ]);
  };

  const updateStudent = (student: Student) => {
    setStudents((currentStudents) =>
      currentStudents.map((currentStudent) =>
        currentStudent.id === student.id
          ? student
          : currentStudent
      )
    );
  };

  const deleteStudent = (id: number) => {
    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== id)
    );
  };

  const addAttendance = (record: AttendanceRecord) => {
    setAttendance((currentAttendance) => [
      ...currentAttendance,
      record,
    ]);
  };

  const updateAttendanceStatus = (
    id: number,
    status: AttendanceRecord["status"]
  ) => {
    setAttendance((currentAttendance) =>
      currentAttendance.map((record) =>
        record.id === id
          ? {
              ...record,
              status,
            }
          : record
      )
    );
  };

  const value = useMemo(
    () => ({
      students,
      attendance,
      addStudent,
      updateStudent,
      deleteStudent,
      addAttendance,
      updateAttendanceStatus,
    }),
    [students, attendance]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used inside an AppProvider"
    );
  }

  return context;
}