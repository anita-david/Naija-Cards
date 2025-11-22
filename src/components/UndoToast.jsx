import React, { useEffect } from "react";

export default function UndoToast({
  open,
  message = "Action completed",
  onUndo,
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-60">
      <div className="bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-4 border">
        <div className="text-sm text-gray-800">{message}</div>
        <button
          onClick={onUndo}
          className="ml-2 bg-naijaGreen text-white px-3 py-1 rounded-md text-sm"
        >
          Undo
        </button>
        <button onClick={onClose} className="ml-2 text-xs text-gray-500">
          ✕
        </button>
      </div>
    </div>
  );
}
