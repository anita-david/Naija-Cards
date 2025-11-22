import React from "react";
import { useGameStore } from "../store/gameStore";

export default function SettingsDrawer({ open, onClose }) {
  // avoid returning a fresh object from the selector (can cause re-render loops)
  const settings = useGameStore((s) => s.settings);
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  const setSoundEnabled = useGameStore((s) => s.setSoundEnabled);
  const setConfettiEnabled = useGameStore((s) => s.setConfettiEnabled);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center p-4 z-40">
      <div className="w-full md:w-96 bg-white rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-bold mb-3">Settings</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <div className="flex gap-2">
            {["easy", "medium", "hard"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`py-2 px-3 rounded-md border ${
                  settings.difficulty === d
                    ? "bg-naijaGold text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {d[0].toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Audio & Effects
          </label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-between">
              <span className="text-sm">Sound</span>
              <input
                type="checkbox"
                checked={!!settings.sound}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm">Confetti</span>
              <input
                type="checkbox"
                checked={!!settings.confetti}
                onChange={(e) => setConfettiEnabled(e.target.checked)}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-lg bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
