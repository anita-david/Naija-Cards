// store/gameStore.js
import { create } from "zustand";

const STORAGE_KEY = "naija_cards_best";

const loadBest = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { bestScore: 0, longestStreak: 0, fastestTime: null };
    return JSON.parse(raw);
  } catch {
    return { bestScore: 0, longestStreak: 0, fastestTime: null };
  }
};

const saveBest = (obj) => {
  try {
    const prev = loadBest();
    const merged = { ...prev, ...obj };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* ignore */
  }
};

export const useGameStore = create((set, get) => ({
  // core state (preserve original public names)
  index: 0,
  score: 0,
  timeLeft: 60,
  playing: false,
  finished: false,

  // additional state
  deck: [], // will hold shuffled cards (App will pass naijaCards)
  baseTime: 60,
  countdown: 0,
  paused: false,
  streak: 0,
  combo: 0,
  multiplier: 1,
  settings: {
    difficulty: "easy",
    sound: true,
    animationSpeed: 1,
    confetti: true,
  },
  best: loadBest(),
  // celebration state for confetti / reward animations
  celebration: { active: false, type: null },

  // keep compatibility: startGame exists
  startGame: () => {
    set((state) => ({
      playing: true,
      score: 0,
      index: 0,
      timeLeft: state.baseTime,
      finished: false,
      streak: 0,
      combo: 0,
      multiplier: 1,
    }));
  },

  // setup deck (App should call this with naijaCards shuffled)
  setDeck: (deckArray) => set({ deck: deckArray }),

  // convenience to configure difficulty which changes baseTime
  setDifficulty: (level) =>
    set(() => {
      let base = 60;
      if (level === "medium") base = 45;
      if (level === "hard") base = 30;
      return {
        settings: { ...get().settings, difficulty: level },
        baseTime: base,
        timeLeft: base,
      };
    }),

  // go to next card, preserve old behaviour if deck length provided
  nextCard: (length) =>
    set((state) => {
      const l = length ?? state.deck.length;
      const isLast = state.index >= l - 1;
      if (isLast) {
        // finish game and persist bests
        saveBest({
          bestScore: Math.max(get().best.bestScore || 0, state.score),
          longestStreak: Math.max(get().best.longestStreak || 0, state.streak),
        });
        // trigger finish celebration if user allows
        if (get().settings?.confetti) {
          try {
            get().triggerCelebration("finish", 2500);
          } catch {
            /* ignore */
          }
        }
        return { timeLeft: state.baseTime, playing: false, finished: true };
      }
      return {
        index: state.index < l - 1 ? state.index + 1 : state.index,
        timeLeft: state.baseTime,
      };
    }),

  // toggle sound on/off
  setSoundEnabled: (on) =>
    set((state) => ({ settings: { ...state.settings, sound: !!on } })),

  // toggle confetti on/off
  setConfettiEnabled: (on) =>
    set((state) => ({ settings: { ...state.settings, confetti: !!on } })),

  prevCard: () =>
    set((state) => ({
      index: state.index > 0 ? state.index - 1 : 0,
      timeLeft: state.baseTime,
      finished: false,
    })),

  // classic incrementScore kept for compatibility
  incrementScore: (points) => set((state) => ({ score: state.score + points })),

  // action used when player marks card done — calculates multiplier & streak
  markDone: (timeLeftOnCard) => {
    const state = get();
    const basePoints = 5;
    // multiplier: streak based + speed bonus
    const streakBonus = Math.floor(state.streak / 3); // every 3 increases
    const speedMultiplier =
      1 + Math.max(0, Math.round((timeLeftOnCard / state.baseTime) * 2)) / 10; // small bonus
    const totalMultiplier = (1 + streakBonus) * speedMultiplier;
    const points = Math.round(basePoints * totalMultiplier);
    const newStreak = state.streak + 1;
    set({
      score: state.score + points,
      streak: newStreak,
      combo: Math.min(100, state.combo + 10),
      multiplier: totalMultiplier,
      lastAward: points,
    });

    // clear transient award after a short time
    setTimeout(() => {
      try {
        set({ lastAward: null });
      } catch {
        /* ignore */
      }
    }, 1200);

    // celebrate milestones (every 5 correct in a row)
    if (newStreak > 0 && newStreak % 5 === 0) {
      // trigger confetti/streak badge for ~2s
      get().triggerCelebration("streak", 2200);
    }

    // move next
    get().nextCard(state.deck.length);
  },

  // trigger a celebration animation (confetti / badge); duration in ms
  triggerCelebration: (type = "streak", duration = 1800) => {
    try {
      set({ celebration: { active: true, type } });
      setTimeout(() => {
        set({ celebration: { active: false, type: null } });
      }, duration);
    } catch {
      // ignore
    }
  },

  // when player fails or time hits zero
  registerMiss: () =>
    set((state) => ({
      streak: 0,
      combo: Math.max(0, state.combo - 10),
      multiplier: 1,
    })),

  // decrease the timer (used by Timer component)
  decrementTime: () =>
    set((state) => {
      if (!state.playing || state.paused) return {};
      if (state.timeLeft > 0) return { timeLeft: state.timeLeft - 1 };
      // time hit zero -> register miss and go next
      get().registerMiss();
      get().nextCard(state.deck.length);
      return { timeLeft: state.baseTime };
    }),

  pause: () => set({ paused: true }),
  resume: () => set({ paused: false }),

  // full reset
  reset: () =>
    set({
      index: 0,
      score: 0,
      timeLeft: 60,
      playing: false,
      finished: false,
      deck: [],
      streak: 0,
      combo: 0,
      multiplier: 1,
    }),
}));
