import { describe, it, expect } from "vitest";

import type { AttendanceRecord } from "@/pages/admin/attendance/type";
import type { Student } from "@/pages/admin/students/type";

import {
  extractErrorMessage,
  fromStudentApi,
  toStudentPayload,
  fromAttendanceApi,
  toAttendancePayload,
} from "./api";

describe("extractErrorMessage", () => {
  it("returns the message property when present", () => {
    expect(extractErrorMessage({ message: "Something broke" })).toBe(
      "Something broke"
    );
  });

  it("returns the first validation error from the errors property", () => {
    const data = {
      errors: { email: ["Email already taken", "Invalid email"] },
    };
    expect(extractErrorMessage(data)).toBe("Email already taken");
  });

  it("returns the default message when data is null", () => {
    expect(extractErrorMessage(null)).toBe(
      "Something went wrong. Please try again."
    );
  });

  it("returns the default message for an unrelated object", () => {
    expect(extractErrorMessage({ foo: "bar" })).toBe(
      "Something went wrong. Please try again."
    );
  });
});

describe("fromStudentApi", () => {
  it("converts snake_case keys to camelCase", () => {
    const result = fromStudentApi({
      id: 1,
      user_id: 1,
      student_id: "20240001",
      name: "Juan Dela Cruz",
      course: "BSIT",
      year_level: "3rd Year",
      email: "juan@example.com",
      phone: "09171234567",
      qr_value: "20240001",
      active: true,
    });

    expect(result).toEqual({
      id: 1,
      studentId: "20240001",
      name: "Juan Dela Cruz",
      course: "BSIT",
      yearLevel: "3rd Year",
      email: "juan@example.com",
      phone: "09171234567",
      qrValue: "20240001",
      active: true,
    });
  });

  it("defaults nullable fields to empty string", () => {
    const result = fromStudentApi({
      id: 2,
      user_id: 1,
      student_id: "20240002",
      name: "Maria Santos",
      course: null,
      year_level: null,
      email: null,
      phone: null,
      qr_value: null,
      active: false,
    });

    expect(result.course).toBe("");
    expect(result.yearLevel).toBe("");
    expect(result.email).toBe("");
    expect(result.phone).toBe("");
    expect(result.qrValue).toBe("20240002");
  });
});

describe("toStudentPayload", () => {
  it("converts camelCase keys to snake_case", () => {
    const student: Student = {
      id: 1,
      studentId: "20240001",
      name: "Juan Dela Cruz",
      course: "BSIT",
      yearLevel: "3rd Year",
      email: "juan@example.com",
      phone: "09171234567",
      qrValue: "20240001",
      active: true,
    };

    expect(toStudentPayload(student)).toEqual({
      student_id: "20240001",
      name: "Juan Dela Cruz",
      course: "BSIT",
      year_level: "3rd Year",
      email: "juan@example.com",
      phone: "09171234567",
      qr_value: "20240001",
      active: true,
    });
  });
});

describe("fromAttendanceApi", () => {
  it("converts snake_case keys and maps start/end time to startTime/endTime", () => {
    const result = fromAttendanceApi({
      id: 1,
      user_id: 1,
      student_id: "20240001",
      student_name: "Juan Dela Cruz",
      class_code: "BSIT3A",
      class_name: "BSIT 3A",
      subject: "Web Development",
      date: "2026-09-11",
      time: "08:05",
      status: "Present",
      method: "QR Scan",
      start_time: "08:00",
      end_time: "10:00",
    });

    expect(result).toEqual({
      id: 1,
      studentId: "20240001",
      studentName: "Juan Dela Cruz",
      classCode: "BSIT3A",
      className: "BSIT 3A",
      subject: "Web Development",
      date: "2026-09-11",
      time: "08:05",
      status: "Present",
      method: "QR Scan",
      startTime: "08:00",
      endTime: "10:00",
    });
  });

  it("maps null start/end time to undefined startTime/endTime", () => {
    const result = fromAttendanceApi({
      id: 2,
      user_id: 1,
      student_id: "20240002",
      student_name: "Maria Santos",
      class_code: null,
      class_name: "BSIT 3A",
      subject: "Web Dev",
      date: "2026-09-11",
      time: "08:18",
      status: "Late",
      method: "Manual",
      start_time: null,
      end_time: null,
    });

    expect(result.startTime).toBeUndefined();
    expect(result.endTime).toBeUndefined();
  });
});

describe("toAttendancePayload", () => {
  it("converts camelCase keys and maps startTime/endTime to start_time/end_time", () => {
    const record: AttendanceRecord = {
      id: 1,
      studentId: "20240001",
      studentName: "Juan Dela Cruz",
      classCode: "BSIT3A",
      className: "BSIT 3A",
      subject: "Web Development",
      date: "2026-09-11",
      time: "08:05",
      status: "Present",
      method: "QR Scan",
      startTime: "08:00",
      endTime: "10:00",
    };

    expect(toAttendancePayload(record)).toEqual({
      student_id: "20240001",
      student_name: "Juan Dela Cruz",
      class_code: "BSIT3A",
      class_name: "BSIT 3A",
      subject: "Web Development",
      date: "2026-09-11",
      time: "08:05",
      status: "Present",
      method: "QR Scan",
      start_time: "08:00",
      end_time: "10:00",
    });
  });

  it("sends null for undefined startTime/endTime", () => {
    const record: AttendanceRecord = {
      id: 2,
      studentId: "20240002",
      studentName: "Maria Santos",
      classCode: "",
      className: "BSIT 3A",
      subject: "Web Dev",
      date: "2026-09-11",
      time: "08:18",
      status: "Late",
      method: "Manual",
    };

    const payload = toAttendancePayload(record);
    expect(payload.start_time).toBeNull();
    expect(payload.end_time).toBeNull();
  });
});