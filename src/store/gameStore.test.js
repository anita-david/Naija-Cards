// Ensure localStorage exists before importing the store (store reads localStorage on import)
globalThis.localStorage = (() => {
  let store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => (store[k] = v + ""),
    clear: () => (store = {}),
    removeItem: (k) => delete store[k],
  };
})();

import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "./gameStore";

describe("gameStore basic actions", () => {
  beforeEach(() => {
    // reset store state to defaults
    useGameStore.getState().reset();
    // clear any persisted bests
    localStorage.clear();
  });

  it("markDone increases score and streak", () => {
    const gs = useGameStore.getState();
    expect(gs.score).toBe(0);
    expect(gs.streak).toBe(0);

    // simulate marking a card done with some time left
    gs.markDone(30);

    const state = useGameStore.getState();
    expect(state.score).toBeGreaterThan(0);
    expect(state.streak).toBe(1);
  });

  it("nextCard finishes game when at last index and saves best", () => {
    const cards = [
      { word: "A", description: [] },
      { word: "B", description: [] },
    ];
    const gs = useGameStore.getState();
    gs.setDeck(cards);
    // move index to last
    useGameStore.setState({ index: cards.length - 1, score: 42 });

    // call nextCard and assert finished
    gs.nextCard(cards.length);
    const state = useGameStore.getState();
    expect(state.finished).toBe(true);

    // localStorage should have been updated for bestScore
    const raw = localStorage.getItem("naija_cards_best");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw);
    expect(parsed.bestScore).toBeGreaterThanOrEqual(42);
  });
});
