import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { api, getToken } from "@/lib/api";
import { AppContext } from "@/context/app-context";
import type { AttendanceRecord } from "@/pages/admin/attendance/type";
import type { Student } from "@/pages/admin/students/type";

type AppProviderProps = {
  children: ReactNode;
};

function sameAttendanceIdentity(
  a: AttendanceRecord,
  b: AttendanceRecord
): boolean {
  return (
    a.studentId === b.studentId &&
    a.date === b.date &&
    a.subject === b.subject &&
    a.className === b.className
  );
}

function messageFromError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export function AppProvider({ children }: AppProviderProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setStudents([]);
      setAttendance([]);
      setError(null);
      setLoading(false);
    };

    window.addEventListener(
      "attendance:unauthorized",
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        "attendance:unauthorized",
        handleUnauthorized
      );
    };
  }, []);

  const refresh = useCallback(async () => {
    await Promise.resolve();

    if (!getToken()) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [loadedStudents, loadedAttendance] = await Promise.all([
        api.students.list(),
        api.attendance.list(),
      ]);

      setStudents(loadedStudents);
      setAttendance(loadedAttendance);
    } catch (error) {
      console.error("Failed to load data:", error);
      setError(`Failed to load data: ${messageFromError(error)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setStudents([]);
    setAttendance([]);
  }, []);

  const addStudent = useCallback((student: Student) => {
    api.students
      .create(student)
      .then((created) => {
        setStudents((currentStudents) => [
          ...currentStudents.filter(
            (current) => current.studentId !== created.studentId
          ),
          created,
        ]);
      })
      .catch((error) => {
        console.error("Failed to add student:", error);
        setError(messageFromError(error));
      });
  }, []);

  const updateStudent = useCallback((student: Student) => {
    api.students
      .update(student.id, student)
      .then((updated) => {
        setStudents((currentStudents) =>
          currentStudents.map((current) =>
            current.id === updated.id ? updated : current
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update student:", error);
        setError(messageFromError(error));
      });
  }, []);

  const deleteStudent = useCallback((id: number) => {
    api.students
      .remove(id)
      .then(() => {
        setStudents((currentStudents) =>
          currentStudents.filter((student) => student.id !== id)
        );
      })
      .catch((error) => {
        console.error("Failed to delete student:", error);
        setError(messageFromError(error));
      });
  }, []);

  const addAttendance = useCallback((record: AttendanceRecord) => {
    api.attendance
      .create(record)
      .then((result) => {
        setAttendance((currentAttendance) => {
          if (result.created) {
            return [...currentAttendance, result.attendance];
          }

          return currentAttendance.map((current) =>
            sameAttendanceIdentity(current, result.attendance)
              ? result.attendance
              : current
          );
        });
      })
      .catch((error) => {
        console.error("Failed to record attendance:", error);
        setError(messageFromError(error));
      });
  }, []);

  const updateAttendanceStatus = useCallback(
    (id: number, status: AttendanceRecord["status"]) => {
      api.attendance
        .update(id, status)
        .then((updated) => {
          setAttendance((currentAttendance) =>
            currentAttendance.map((record) =>
              record.id === updated.id ? updated : record
            )
          );
        })
        .catch((error) => {
          console.error("Failed to update attendance:", error);
          setError(messageFromError(error));
        });
    },
    []
  );

  const resetDemoData = useCallback(() => {
    api
      .reset()
      .then(() => {
        setStudents([]);
        setAttendance([]);
      })
      .catch((error) => {
        console.error("Failed to reset data:", error);
        setError(messageFromError(error));
      });
  }, []);

  const value = useMemo(
    () => ({
      students,
      attendance,
      loading,
      error,
      addStudent,
      updateStudent,
      deleteStudent,
      addAttendance,
      updateAttendanceStatus,
      resetDemoData,
      refresh,
      clearData,
      clearError,
    }),
    [
      students,
      attendance,
      loading,
      error,
      addStudent,
      updateStudent,
      deleteStudent,
      addAttendance,
      updateAttendanceStatus,
      resetDemoData,
      refresh,
      clearData,
      clearError,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}