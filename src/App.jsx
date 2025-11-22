import { useEffect, useState, useRef } from "react";
import { useGameStore } from "./store/gameStore";
import { naijaCards } from "./data/naijaCards";
import Timer from "./components/Timer";
import ScoreBoard from "./components/ScoreBoard";
import EndScreen from "./components/EndScreen";
import CardView from "./components/CardView";
import HomeScreen from "./components/HomeScreen";
import SettingsDrawer from "./components/SettingsDrawer";
import Confetti from "./components/Confetti";
import StreakBadge from "./components/StreakBadge";
import ErrorOverlay from "./components/ErrorOverlay";
import ConfirmModal from "./components/ConfirmModal";
import UndoToast from "./components/UndoToast";
import { AnimatePresence } from "framer-motion";

// simple shuffle
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function App() {
  // use individual selectors to avoid returning a fresh object each render
  const index = useGameStore((s) => s.index);
  const nextCard = useGameStore((s) => s.nextCard);
  const timeLeft = useGameStore((s) => s.timeLeft);
  const playing = useGameStore((s) => s.playing);
  const startGame = useGameStore((s) => s.startGame);
  const finished = useGameStore((s) => s.finished);
  const deck = useGameStore((s) => s.deck);
  const setDeck = useGameStore((s) => s.setDeck);
  const pause = useGameStore((s) => s.pause);
  const resume = useGameStore((s) => s.resume);
  const paused = useGameStore((s) => s.paused);
  const best = useGameStore((s) => s.best);
  const reset = useGameStore((s) => s.reset);

  const [showHome, setShowHome] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  // quit/undo UI state
  const prevSnapshotRef = useRef(null);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const difficulty = useGameStore((s) => s.settings?.difficulty);

  useEffect(() => {
    if (timeLeft === 0 && playing && deck.length) {
      // ensure next card called by store; older logic preserved
      nextCard(deck.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleStart = () => {
    // filter by selected difficulty (simple heuristic matching the CategorySelect)
    const classify = (card) => {
      const word = String(card.word || "").trim();
      const compactLen = word.replace(/\s+/g, "").length;
      if (compactLen <= 6) return "easy";
      if (compactLen <= 12) return "medium";
      return "hard";
    };

    let pool = naijaCards.slice();
    if (difficulty) {
      pool = pool.filter((c) => classify(c) === difficulty);
    }
    if (!pool.length) pool = naijaCards.slice();

    const shuffled = shuffle(pool);
    setDeck(shuffled);
    setShowHome(false);
    // small countdown before actual play
    setCountdown(3);
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t);
          startGame();
          setCountdown(0);
          return 0;
        }
        return c - 1;
      });
    }, 900);
  };

  const handleQuit = () => {
    setShowQuitConfirm(true);
  };

  const performQuit = () => {
    // snapshot relevant state for undo (avoid copying functions)
    const state = useGameStore.getState();
    const keys = [
      "index",
      "score",
      "timeLeft",
      "playing",
      "finished",
      "deck",
      "baseTime",
      "countdown",
      "paused",
      "streak",
      "combo",
      "multiplier",
      "settings",
      "best",
      "celebration",
      "lastAward",
    ];
    const snap = {};
    for (const k of keys) snap[k] = state[k];
    prevSnapshotRef.current = snap;

    try {
      reset();
    } catch (e) {
      void e;
    }
    setShowHome(true);
    setShowQuitConfirm(false);
    setShowUndoToast(true);
  };

  const handleUndo = () => {
    const snap = prevSnapshotRef.current;
    if (!snap) return;
    try {
      useGameStore.setState(snap);
      setShowHome(false);
      setShowUndoToast(false);
      prevSnapshotRef.current = null;
    } catch (e) {
      void e;
    }
  };

  if (finished) return <EndScreen />;

  if (showHome || !playing) {
    return (
      <div className="min-h-screen">
        <ErrorOverlay />
        <HomeScreen
          onStart={handleStart}
          onOpenSettings={() => setSettingsOpen(true)}
          best={best}
        />
        <SettingsDrawer
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </div>
    );
  }

  const currentCard = deck[index] ?? naijaCards[index];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-2 relative">
      <ErrorOverlay />
      <ConfirmModal
        open={showQuitConfirm}
        title="Quit current game"
        message="Quit current game and return to home?"
        onConfirm={performQuit}
        onCancel={() => setShowQuitConfirm(false)}
      />
      <UndoToast
        open={showUndoToast}
        message="Game quit"
        onUndo={handleUndo}
        onClose={() => setShowUndoToast(false)}
      />
      {/* celebration overlays */}
      <Confetti />
      <StreakBadge />
      <div className="w-full max-w-md flex items-center justify-between px-4">
        <ScoreBoard />
        <div className="flex items-center gap-3">
          <Timer />
          <button
            onClick={() => (paused ? resume() : pause())}
            className=" bg-white border border-gray-200 px-3 py-1 rounded-lg"
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={handleQuit}
            className=" bg-white border border-red-200 text-red-700 rounded-lg"
          >
            Quit
          </button>
        </div>
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {countdown > 0 ? (
            <div
              key="countdown"
              className="w-80 h-64 rounded-3xl bg-white shadow-2xl flex items-center justify-center"
            >
              <div className="text-6xl font-bold">
                {countdown === 0 ? "Go" : countdown}
              </div>
            </div>
          ) : (
            <div
              key={index}
              className="w-80 h-64 flex items-start justify-center"
            >
              {currentCard ? (
                <CardView card={currentCard} />
              ) : (
                <div>No card</div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-10 text-sm opacity-80 ">
        Card {index + 1} of {deck.length || naijaCards.length}
      </p>

      <footer className="absolute bottom-6 text-xs">
        Built with ❤️ in Nigeria
      </footer>
    </div>
  );
}
