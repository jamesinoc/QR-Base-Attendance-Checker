import { useEffect } from "react";

import { AlertCircle, X } from "lucide-react";

import { useApp } from "@/context/app-context";

export default function ErrorToast() {
  const { error, clearError } = useApp();

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(clearError, 6000);
    return () => clearTimeout(timer);
  }, [error, clearError]);

  if (!error) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-lg"
    >
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1">{error}</p>

      <button
        type="button"
        onClick={clearError}
        className="shrink-0 text-red-400 hover:text-red-700"
        aria-label="Dismiss error"
      >
        <X size={16} />
      </button>
    </div>
  );
}