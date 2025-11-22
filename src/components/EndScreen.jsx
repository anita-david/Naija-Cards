import React from "react";
import { useGameStore } from "../store/gameStore";

export default function EndScreen() {
  const score = useGameStore((s) => s.score);
  const startGame = useGameStore((s) => s.startGame);
  const reset = useGameStore((s) => s.reset);
  const best = useGameStore((s) => s.best);

  const shareScore = async () => {
    const text = `I scored ${score} points playing Naija Culture Deck! 🇳🇬`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Naija Culture Deck", text });
      } catch {
        // user cancelled or not available
      }
    } else {
      // fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        alert("Score copied to clipboard!");
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <h2 className="text-3xl font-bold text-naijaGold">Level Complete 🎉</h2>

      <div className="text-lg">Total Score</div>
      <div className="text-5xl font-extrabold text-naijaGreen">{score}</div>

      <div className="mt-2 text-sm text-gray-600">
        Best score:{" "}
        <span className="font-semibold text-naijaGold">
          {best?.bestScore ?? 0}
        </span>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={startGame}
          className="bg-naijaGold text-naijaGreen py-2 px-4 rounded-xl font-semibold hover:bg-yellow-400 transition"
        >
          Play Again
        </button>

        <button
          onClick={reset}
          className="bg-white border border-naijaGold text-naijaGreen py-2 px-4 rounded-xl font-semibold hover:bg-gray-100 transition"
        >
          Back to Home
        </button>

        <button
          onClick={shareScore}
          className="bg-naijaGreen text-white py-2 px-4 rounded-xl"
        >
          Share
        </button>
      </div>

      <footer className="absolute bottom-6 text-xs">
        Built with ❤️ in Nigeria
      </footer>
    </div>
  );
}
