// components/Timer.jsx
import { useEffect } from "react";
// using CSS-based pulse to avoid framer-motion import here
import { useGameStore } from "../store/gameStore";
import { ringColors } from "../animations";

export default function Timer() {
  const timeLeft = useGameStore((s) => s.timeLeft);
  const baseTime = useGameStore((s) => s.baseTime);
  const decrementTime = useGameStore((s) => s.decrementTime);
  const playing = useGameStore((s) => s.playing);
  const paused = useGameStore((s) => s.paused);

  useEffect(() => {
    if (!playing || paused) return;
    const timer = setInterval(() => decrementTime(), 1000);
    return () => clearInterval(timer);
  }, [playing, paused, decrementTime]);

  const radius = 28;
  const stroke = 6;
  const normalized = Math.max(
    0,
    Math.min(1, baseTime ? timeLeft / baseTime : 1)
  );
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (1 - normalized);

  const color = ringColors(normalized);

  return (
    <div className="flex items-center gap-3">
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        className="transform -rotate-90"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="36"
          cy="36"
          r={radius}
          stroke="#e6e6e6"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dash}
          fill="none"
          style={{ filter: "url(#glow)" }}
        />
      </svg>

      <div className={`text-center ${timeLeft <= 3 ? "animate-pulse" : ""}`}>
        <div className="text-sm text-gray-600">Time</div>
        <div className="text-xl font-bold text-naijaGold">{timeLeft}s</div>
      </div>
    </div>
  );
}
