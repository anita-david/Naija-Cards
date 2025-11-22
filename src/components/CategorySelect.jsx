import React from "react";
import { useGameStore } from "../store/gameStore";
import { naijaCards } from "../data/naijaCards";

// small heuristic to classify a card into easy/medium/hard
function classify(card) {
  const word = String(card.word || "").trim();
  const compactLen = word.replace(/\s+/g, "").length;
  // base on compact length
  if (compactLen <= 6) return "easy";
  if (compactLen <= 12) return "medium";
  return "hard";
}

export default function CategorySelect() {
  const difficulty = useGameStore((s) => s.settings?.difficulty || "easy");
  const setDifficulty = useGameStore((s) => s.setDifficulty);

  const counts = React.useMemo(() => {
    const c = { easy: 0, medium: 0, hard: 0 };
    for (const card of naijaCards) {
      const d = classify(card);
      c[d]++;
    }
    return c;
  }, []);

  const btn = (level, label) => (
    <button
      key={level}
      onClick={() => setDifficulty(level)}
      className={`px-3 py-2 rounded-lg border font-medium shadow-sm transition-all ${
        difficulty === level
          ? "bg-naijaGreen text-white border-transparent"
          : "bg-white text-naijaGreen border-naijaGold"
      }`}
    >
      {label} <span className="ml-2 text-xs opacity-80">({counts[level]})</span>
    </button>
  );

  return (
    <div className="flex items-center gap-3">
      {btn("easy", "Easy")}
      {btn("medium", "Medium")}
      {btn("hard", "Hard")}
    </div>
  );
}
