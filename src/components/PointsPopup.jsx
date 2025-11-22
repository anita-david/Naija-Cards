import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";

export default function PointsPopup() {
  const lastAward = useGameStore((s) => s.lastAward);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (lastAward == null) return;
    setValue(lastAward > 0 ? `+${lastAward}` : `${lastAward}`);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(t);
  }, [lastAward]);

  return (
    <div className="relative">
      {value && (
        <Motion.div
          aria-live="polite"
          initial={{ y: -8, opacity: 0, scale: 0.9 }}
          animate={
            visible
              ? { y: 0, opacity: 1, scale: [1.08, 0.98, 1] }
              : { y: -10, opacity: 0, scale: 0.9 }
          }
          transition={{
            duration: 0.6,
            type: "tween",
            ease: "easeOut",
          }}
          className="absolute -top-6 right-0 text-sm font-bold text-naijaGold"
        >
          {value}
        </Motion.div>
      )}
    </div>
  );
}
