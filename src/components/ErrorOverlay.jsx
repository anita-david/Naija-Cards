import React, { useEffect, useState } from "react";

// Simple dev-only overlay to capture JS errors and unhandled rejections
export default function ErrorOverlay() {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const onError = (event) => {
      const message =
        event?.message ||
        String(event?.error || event?.reason || "Unknown error");
      setErrors((e) =>
        [
          { type: "error", message, stack: event?.error?.stack || null },
          ...e,
        ].slice(0, 10)
      );
    };

    const onRejection = (event) => {
      const message = event?.reason
        ? String(event.reason)
        : "Unhandled rejection";
      setErrors((e) =>
        [
          { type: "rejection", message, stack: event?.reason?.stack || null },
          ...e,
        ].slice(0, 10)
      );
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (!errors.length) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        left: 12,
        right: 12,
        zIndex: 9999,
      }}
    >
      <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-900 p-3 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <strong>Runtime errors (dev)</strong>
          <button
            onClick={() => setErrors([])}
            className="bg-red-200 text-red-900 px-2 py-1 rounded"
          >
            Clear
          </button>
        </div>
        <div className="mt-2 text-xs space-y-2 max-h-48 overflow-auto">
          {errors.map((err, i) => (
            <div key={i} className="border rounded p-2 bg-white">
              <div className="font-mono text-xs">{err.type}</div>
              <div className="wrap-break-word text-sm">{err.message}</div>
              {err.stack && (
                <pre className="text-xs mt-1 whitespace-pre-wrap">
                  {err.stack}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
