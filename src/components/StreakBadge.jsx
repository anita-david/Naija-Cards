import React from "react";
import { motion as Motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import soundManager from "../utils/soundManager";
import { useEffect } from "react";

export default function StreakBadge() {
  const celebration = useGameStore((s) => s.celebration);
  const streak = useGameStore((s) => s.streak);
  const settings = useGameStore((s) => s.settings);

  useEffect(() => {
    if (!celebration?.active) return;
    if (!settings?.sound) return;
    try {
      if (celebration.type === "finish") soundManager.play("finish");
      else soundManager.play("streak");
    } catch {
      /* ignore */
    }
  }, [celebration, settings?.sound]);

  if (!celebration?.active) return null;

  const text =
    celebration.type === "finish" ? "Level Complete!" : `🔥 Streak x${streak}`;

  return (
    <div
      style={{ pointerEvents: "none" }}
      className="fixed inset-0 flex items-start justify-center z-50 mt-24"
    >
      <Motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [1.1, 0.98, 1], opacity: 1 }}
        exit={{ opacity: 0 }}
        // keyframe arrays must use a tween type; spring supports only two keyframes
        transition={{ duration: 0.9, type: "tween", ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-yellow-100"
      >
        <div className="text-lg font-extrabold text-naijaGreen">{text}</div>
      </Motion.div>
    </div>
  );
}
