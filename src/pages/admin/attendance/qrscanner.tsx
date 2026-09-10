import { useState } from "react";

import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";

type QRScannerProps = {
  onScan: (studentId: string) => void;
  onStop: () => void;
};

export function QRScanner({
  onScan,
  onStop,
}: QRScannerProps) {
  const [qrValue, setQrValue] = useState("");
  const [error, setError] = useState("");

  const handleScan = () => {
    const value = qrValue.trim();

    if (!value) {
      setError("Please enter a QR code value.");
      return;
    }

    setError("");
    onScan(value);
    setQrValue("");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          QR Code Scanner
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Scan a student's QR code to record their attendance.
        </p>
      </div>

      {/* Scanner Area */}
      <div className="mx-auto flex max-w-md flex-col items-center">
        <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-blue-400 bg-slate-50">
          <div className="absolute left-8 right-8 top-1/2 h-0.5 bg-blue-500" />

          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100">
              <span className="text-2xl font-bold text-blue-600">
                QR
              </span>
            </div>

            <p className="text-sm font-medium text-slate-700">
              Scanner Ready
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Waiting for QR code...
            </p>
          </div>
        </div>

        {/* Manual QR Input */}
        <div className="mt-6 w-full">
          <label
            htmlFor="qrValue"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            QR Code Value
          </label>

          <Input
            id="qrValue"
            type="text"
            placeholder="Enter student ID or QR value"
            value={qrValue}
            onChange={(event) => {
              setQrValue(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleScan();
              }
            }}
          />

          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button
            type="button"
            onClick={handleScan}
            className="mt-4 w-full"
          >
            Simulate QR Scan
          </Button>
        </div>

        {/* Stop Button */}
        <Button
          type="button"
          variant="secondary"
          onClick={onStop}
          className="mt-4 w-full"
        >
          Stop Attendance
        </Button>
      </div>
    </div>
  );
}