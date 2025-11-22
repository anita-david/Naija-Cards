import { spring } from "framer-motion";

// Centralized motion variants used across components
export const cardVariants = {
  enter: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    y: 0,
    transition: { duration: 0.45, ...spring },
  },
  initial: { opacity: 0, scale: 0.9, rotate: -4, y: 20 },
  exit: {
    opacity: 0,
    scale: 0.9,
    rotate: 6,
    y: -20,
    transition: { duration: 0.35 },
  },
  flipFront: { rotateY: 0, transition: { duration: 0.5 } },
  flipBack: { rotateY: 180, transition: { duration: 0.5 } },
};

export const pop = {
  initial: { scale: 0.95, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 18 },
  },
};

export const pulse = (delay = 0) => ({
  animate: {
    scale: [1, 1.03, 1],
    boxShadow: [
      "0 0 0 rgba(0,0,0,0)",
      "0 10px 30px rgba(0,0,0,0.12)",
      "0 0 0 rgba(0,0,0,0)",
    ],
    // keyframe arrays must use a non-spring animator (tween) — spring supports only 2 keyframes
    transition: { type: "tween", repeat: Infinity, duration: 1.6, delay },
  },
});

export const ringColors = (pct) => {
  if (pct > 0.6) return "#16a34a"; // green
  if (pct > 0.25) return "#f59e0b"; // yellow
  return "#dc2626"; // red
};

export default {
  cardVariants,
  pop,
  pulse,
  ringColors,
};
