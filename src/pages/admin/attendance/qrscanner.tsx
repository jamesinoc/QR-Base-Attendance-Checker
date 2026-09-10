import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type QRScannerProps = {
  onScan: (code: string) => void;
  onError: (message: string) => void;
};

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [error, setError] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  onScanRef.current = onScan;
  onErrorRef.current = onError;

  useEffect(() => {
    let cancelled = false;
    let lastCode = "";
    let clearTimer: ReturnType<typeof setTimeout> | undefined;
    setError(false);

    const resetClearTimer = () => {
      if (clearTimer) clearTimeout(clearTimer);
      // If the same QR code stops being decoded (moved out of frame),
      // forget it so presenting it again re-triggers a scan.
      clearTimer = setTimeout(() => {
        lastCode = "";
      }, 2500);
    };

    let scanner: Html5Qrcode | null = null;

    try {
      const container = document.getElementById("qr-reader");
      if (!container) return;

      scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
    } catch {
      if (!cancelled) {
        setError(true);
        onErrorRef.current("Scanner initialization failed. Use Manual Select instead.");
      }
      return;
    }

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          if (cancelled) return;

          const code = decodedText.trim();
          if (!code) return;

          // Emit a code only when a different QR code is detected, or when
          // the previous code was out of frame long enough to reset. This
          // prevents re-firing the same code every few frames while the
          // same QR code stays in the camera view.
          if (code !== lastCode) {
            lastCode = code;
            resetClearTimer();
            onScanRef.current(code);
          } else {
            // Still seeing the same code — keep it in frame, don't re-emit.
            resetClearTimer();
          }
        },
        () => undefined
      )
      .catch(() => {
        if (!cancelled) {
          setError(true);
          onErrorRef.current("Camera access is unavailable. Use Manual Select instead.");
        }
      });

    return () => {
      cancelled = true;
      if (clearTimer) clearTimeout(clearTimer);
      const active = scannerRef.current;
      scannerRef.current = null;

      if (active) {
        active
          .stop()
          .catch(() => undefined)
          .finally(() => {
            try {
              active.clear();
            } catch {
              // already cleared
            }
          });
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-72 w-full max-w-md items-center justify-center overflow-hidden rounded-xl">
        <div id="qr-reader" className="w-full" />
      </div>
      <p className="mt-4 text-sm text-slate-500">
        {error
          ? "Camera unavailable. Click Manual Select above."
          : "Allow camera access and align the QR code within the frame."}
      </p>
    </div>
  );
}
