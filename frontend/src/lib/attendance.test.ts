import { describe, it, expect } from "vitest";

import {
  toMinutes,
  formatTime,
  computeStatus,
  PRESENT_WINDOW,
  LATE_WINDOW,
} from "./attendance";

describe("toMinutes", () => {
  it("converts midnight", () => {
    expect(toMinutes("00:00")).toBe(0);
  });

  it("converts noon", () => {
    expect(toMinutes("12:00")).toBe(720);
  });

  it("converts a time with non-zero minutes", () => {
    expect(toMinutes("08:45")).toBe(525);
  });
});

describe("formatTime", () => {
  it("formats midnight", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("formats noon", () => {
    expect(formatTime(720)).toBe("12:00");
  });

  it("formats time with minutes", () => {
    expect(formatTime(525)).toBe("08:45");
  });

  it("wraps around past midnight", () => {
    expect(formatTime(1500)).toBe("01:00");
  });
});

describe("computeStatus", () => {
  const classDate = "2026-09-11";
  const startTime = "08:00";

  it("returns Absent when start time is missing", () => {
    expect(computeStatus("2026-09-11", 480, classDate, "")).toBe("Absent");
  });

  it("returns Absent when scan date differs from class date", () => {
    expect(computeStatus("2026-09-12", 480, classDate, startTime)).toBe(
      "Absent"
    );
  });

  it("returns Present within the present window", () => {
    const scanMin = toMinutes(startTime) + 5;
    expect(computeStatus(classDate, scanMin, classDate, startTime)).toBe(
      "Present"
    );
  });

  it("returns Present at the exact present window boundary", () => {
    const scanMin = toMinutes(startTime) + PRESENT_WINDOW;
    expect(computeStatus(classDate, scanMin, classDate, startTime)).toBe(
      "Present"
    );
  });

  it("returns Late just past the present window", () => {
    const scanMin = toMinutes(startTime) + PRESENT_WINDOW + 1;
    expect(computeStatus(classDate, scanMin, classDate, startTime)).toBe(
      "Late"
    );
  });

  it("returns Late at the exact late window boundary", () => {
    const scanMin = toMinutes(startTime) + LATE_WINDOW;
    expect(computeStatus(classDate, scanMin, classDate, startTime)).toBe(
      "Late"
    );
  });

  it("returns Absent after the late window", () => {
    const scanMin = toMinutes(startTime) + LATE_WINDOW + 1;
    expect(computeStatus(classDate, scanMin, classDate, startTime)).toBe(
      "Absent"
    );
  });

  it("returns Absent when scanning before class start", () => {
    const scanMin = toMinutes(startTime) - 10;
    expect(computeStatus(classDate, scanMin, classDate, startTime)).toBe(
      "Absent"
    );
  });

  it("returns Present at exactly class start time", () => {
    const scanMin = toMinutes(startTime);
    expect(computeStatus(classDate, scanMin, classDate, startTime)).toBe(
      "Present"
    );
  });
});