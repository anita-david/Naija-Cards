// components/ScoreBoard.jsx
import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";
import PointsPopup from "./PointsPopup";

export default function ScoreBoard() {
  const score = useGameStore((s) => s.score);
  const best = useGameStore((s) => s.best);
  const [display, setDisplay] = useState(score);

  // simple tween when score updates
  useEffect(() => {
    let raf;
    const start = display;
    const end = score;
    const diff = end - start;
    const duration = 300;
    const startTime = performance.now();
    const step = (t) => {
      const pct = Math.min(1, (t - startTime) / duration);
      setDisplay(Math.round(start + diff * pct));
      if (pct < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-1 relative">
      <div className="text-2xl font-semibold text-naijaGreen flex items-center gap-3">
        <div>Score:</div>
        <div className="text-naijaGold">{display}</div>
        <PointsPopup />
      </div>
      <div className="text-xs text-gray-600">
        Best:{" "}
        <span className="font-medium text-naijaGold">
          {best?.bestScore ?? 0}
        </span>
      </div>
    </div>
  );
}
