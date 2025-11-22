import React from "react";
import CategorySelect from "./CategorySelect";

export default function HomeScreen({ onStart, onOpenSettings, best }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="bg-linear-to-br from-naijaGold to-yellow-300 p-6 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-extrabold text-naijaGreen">
          Naija Culture Deck 🇳🇬
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Fast-play word game — explain the word without saying the forbidden
          words.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <CategorySelect />

        <button
          onClick={onStart}
          className="bg-naijaGreen text-white py-3 px-6 rounded-xl font-semibold shadow hover:scale-[1.02] transform transition"
        >
          Play Now
        </button>

        <button
          onClick={onOpenSettings}
          className="bg-white border border-naijaGold text-naijaGreen py-2 px-4 rounded-xl font-medium shadow-sm"
        >
          Settings
        </button>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <div>
          Best Score:{" "}
          <span className="font-bold text-naijaGold">
            {best?.bestScore ?? 0}
          </span>
        </div>
        <div>
          Longest Streak:{" "}
          <span className="font-bold text-naijaGold">
            {best?.longestStreak ?? 0}
          </span>
        </div>
      </div>

      <footer className="absolute bottom-6 text-xs">
        Built with ❤️ in Nigeria
      </footer>
    </div>
  );
}
