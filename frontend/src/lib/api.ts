import type { AttendanceRecord } from "@/pages/admin/attendance/type";
import type { Student } from "@/pages/admin/students/type";

const TOKEN_KEY = "attendance_token";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  school?: string | null;
};

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiBody = Record<string, unknown>;

export function extractErrorMessage(data: unknown): string {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (typeof record.message === "string") {
      return record.message;
    }

    if (record.errors && typeof record.errors === "object") {
      const errors = record.errors as Record<string, unknown>;
      const first = Object.values(errors)[0];

      if (Array.isArray(first) && typeof first[0] === "string") {
        return first[0];
      }
    }
  }

  return "Something went wrong. Please try again.";
}

async function request<T>(
  path: string,
  options: { method?: string; body?: ApiBody } = {}
): Promise<T> {
  const { method = "GET", body } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && token) {
      setToken(null);
      window.dispatchEvent(new Event("attendance:unauthorized"));
    }

    throw new ApiError(extractErrorMessage(data), response.status);
  }

  return data as T;
}

type StudentApi = {
  id: number;
  user_id: number;
  student_id: string;
  name: string;
  course: string | null;
  year_level: string | null;
  email: string | null;
  phone: string | null;
  qr_value: string | null;
  active: boolean;
};

export function fromStudentApi(raw: StudentApi): Student {
  return {
    id: raw.id,
    studentId: raw.student_id,
    name: raw.name,
    course: raw.course ?? "",
    yearLevel: raw.year_level ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    active: raw.active,
    qrValue: raw.qr_value || raw.student_id,
  };
}

export function toStudentPayload(student: Student): ApiBody {
  return {
    student_id: student.studentId,
    name: student.name,
    course: student.course,
    year_level: student.yearLevel,
    email: student.email,
    phone: student.phone,
    qr_value: student.qrValue || student.studentId,
    active: student.active,
  };
}

type AttendanceApi = {
  id: number;
  user_id: number;
  student_id: string;
  student_name: string;
  class_code: string | null;
  class_name: string;
  subject: string;
  date: string;
  time: string;
  status: AttendanceRecord["status"];
  method: AttendanceRecord["method"];
  start_time: string | null;
  end_time: string | null;
};

export function fromAttendanceApi(raw: AttendanceApi): AttendanceRecord {
  return {
    id: raw.id,
    studentId: raw.student_id,
    studentName: raw.student_name,
    classCode: raw.class_code || raw.class_name,
    className: raw.class_name,
    subject: raw.subject,
    date: raw.date,
    time: raw.time,
    status: raw.status,
    method: raw.method,
    startTime: raw.start_time ?? undefined,
    endTime: raw.end_time ?? undefined,
  };
}

export function toAttendancePayload(record: AttendanceRecord): ApiBody {
  return {
    student_id: record.studentId,
    student_name: record.studentName,
    class_code: record.classCode,
    class_name: record.className,
    subject: record.subject,
    date: record.date,
    time: record.time,
    status: record.status,
    method: record.method,
    start_time: record.startTime ?? null,
    end_time: record.endTime ?? null,
  };
}

export const api = {
  auth: {
    register(payload: {
      name: string;
      email: string;
      school?: string;
      password: string;
    }) {
      return request<{ user: AuthUser; token: string }>("/register", {
        method: "POST",
        body: {
          name: payload.name,
          email: payload.email,
          school: payload.school ?? "",
          password: payload.password,
          password_confirmation: payload.password,
        },
      });
    },

    login(payload: { email: string; password: string }) {
      return request<{ user: AuthUser; token: string }>("/login", {
        method: "POST",
        body: payload,
      });
    },

    logout() {
      return request<{ message: string }>("/logout", { method: "POST" });
    },

    me() {
      return request<{ user: AuthUser }>("/me");
    },
  },

  students: {
    async list(): Promise<Student[]> {
      const data = await request<{ students: StudentApi[] }>("/students");
      return data.students.map(fromStudentApi);
    },

    async create(student: Student): Promise<Student> {
      const data = await request<{ student: StudentApi }>("/students", {
        method: "POST",
        body: toStudentPayload(student),
      });
      return fromStudentApi(data.student);
    },

    async update(id: number, student: Student): Promise<Student> {
      const data = await request<{ student: StudentApi }>(
        `/students/${id}`,
        {
          method: "PUT",
          body: toStudentPayload(student),
        }
      );
      return fromStudentApi(data.student);
    },

    async remove(id: number): Promise<void> {
      await request<{ message: string }>(`/students/${id}`, {
        method: "DELETE",
      });
    },
  },

  attendance: {
    async list(): Promise<AttendanceRecord[]> {
      const data = await request<{ attendance: AttendanceApi[] }>(
        "/attendance"
      );
      return data.attendance.map(fromAttendanceApi);
    },

    async create(record: AttendanceRecord): Promise<{
      attendance: AttendanceRecord;
      created: boolean;
    }> {
      const data = await request<{
        attendance: AttendanceApi;
        created: boolean;
      }>("/attendance", {
        method: "POST",
        body: toAttendancePayload(record),
      });
      return {
        attendance: fromAttendanceApi(data.attendance),
        created: data.created,
      };
    },

    async update(
      id: number,
      status: AttendanceRecord["status"]
    ): Promise<AttendanceRecord> {
      const data = await request<{ attendance: AttendanceApi }>(
        `/attendance/${id}`,
        {
          method: "PUT",
          body: { status },
        }
      );
      return fromAttendanceApi(data.attendance);
    },
  },

  reset() {
    return request<{ message: string }>("/reset", { method: "POST" });
  },
};