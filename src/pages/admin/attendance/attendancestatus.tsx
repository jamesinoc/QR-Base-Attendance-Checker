import type { AttendanceStatus as AttendanceStatusType } from "./type";

type AttendanceStatusProps = {
  status: AttendanceStatusType;
};

export function AttendanceStatus({
  status,
}: AttendanceStatusProps) {
  const statusStyles = {
    Present: "bg-green-100 text-green-700",
    Late: "bg-orange-100 text-orange-700",
    Absent: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[status]
      }`}
    >
      {status}
    </span>
  );
}