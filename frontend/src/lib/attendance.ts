// Philippines does not observe DST; it is always UTC+8.
const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;

import type { AttendanceStatus } from "@/pages/admin/attendance/type";

export const PRESENT_WINDOW = 15;
export const LATE_WINDOW = 30;

export function toMinutes(value: string) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime(totalMinutes: number) {
  const h = Math.floor(((totalMinutes % 1440) + 1440) % 1440 / 60);
  const m = ((totalMinutes % 1440) + 1440) % 1440 % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Convert a Date to its Asia/Manila wall-clock representation.
// Works identically regardless of the browser/server timezone.
export function toManilaDate(date: Date): string {
  return new Date(date.getTime() + MANILA_OFFSET_MS)
    .toISOString()
    .slice(0, 10);
}

export function toManilaMinutes(date: Date): number {
  const shifted = new Date(date.getTime() + MANILA_OFFSET_MS);
  return shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
}

export function formatManilaTime(date: Date): string {
  const shifted = new Date(date.getTime() + MANILA_OFFSET_MS);
  return `${String(shifted.getUTCHours()).padStart(2, "0")}:${String(shifted.getUTCMinutes()).padStart(2, "0")}`;
}

export function formatManilaDateLong(date: Date): string {
  const shifted = new Date(date.getTime() + MANILA_OFFSET_MS);
  return shifted.toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function computeStatus(
  scanDate: string,
  scanMinutes: number,
  classDate: string,
  classStartTime: string
): AttendanceStatus {
  if (!classStartTime || !classDate) return "Absent";
  if (scanDate !== classDate) return "Absent";

  const startMin = toMinutes(classStartTime);
  const diff = scanMinutes - startMin;

  if (diff >= 0 && diff <= PRESENT_WINDOW) return "Present";
  if (diff > PRESENT_WINDOW && diff <= LATE_WINDOW) return "Late";
  return "Absent";
}