import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { cardVariants } from "../animations";
import { useGameStore } from "../store/gameStore";

export default function CardView({ card, onDone }) {
  const [flipped, setFlipped] = useState(false);
  const timeLeft = useGameStore((s) => s.timeLeft);
  const markDone = useGameStore((s) => s.markDone);

  const handleDone = () => {
    if (markDone) markDone(timeLeft);
    if (onDone) onDone();
  };

  return (
    <Motion.div
      variants={cardVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="w-full h-full mt-5 relative flex flex-col items-center justify-center p-4 gap "
      role="article"
      aria-live="polite"
    >
      <Motion.div
        onClick={() => setFlipped((f) => !f)}
        className={`w-full h-full rounded-3xl shadow-2xl p-6 cursor-pointer select-none transform-gpu overflow-hidden min-h-80`}
        style={{
          perspective: 1200,
          background: "linear-gradient(135deg,#FDE68A 0%, #F59E0B 100%)",
        }}
      >
        <Motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-full h-full relative flex flex-col items-center justify-center"
        >
          {/* front */}
          <Motion.div
            aria-hidden={flipped}
            className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <h1 className="text-4xl font-extrabold mb-2 text-naijaGreen leading-tight">
              {card.word}
            </h1>
            <p className="text-sm text-green-900/90">Tap to reveal the forbidden words</p>
          </Motion.div>

          {/* back */}
          <Motion.div
            aria-hidden={!flipped}
            className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center px-6 pb-6"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9))",
            }}
          >
            <h3 className="text-sm font-bold mb-4 text-naijaGreen">Forbidden Words</h3>

            <ul className="grid grid-cols-1 gap-3 w-full max-w-md place-items-center">
              {card.description.map((desc, i) => (
                <li
                  key={i}
                  className="capitalize text-sm font-medium text-gray-800 bg-white/90 px-4 py-2 rounded-full shadow-sm text-center inline-block max-w-full"
                >
                  {desc}
                </li>
              ))}
            </ul>
          </Motion.div>
        </Motion.div>
      </Motion.div>

      {/* action below the card so it never overlaps the back face */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleDone}
          className="bg-naijaGreen text-white py-2 px-5 rounded-full font-semibold hover:opacity-95 flex items-center gap-2 shadow-lg "
          aria-label="Mark as done"
        >
          <span>Done</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
				
      </div>
    </Motion.div>
  );
}

