import { useState } from "react";
import { naijaCards } from "../data/naijaCards";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function Card() {
  const [index, setIndex] = useState(0);
  const currentCard = naijaCards[index];

  const nextCard = () => {
    if (index < naijaCards.length - 1) setIndex(index + 1);
  };
  const prevCard = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-8 tracking-wide text-naijaGold">
        Naija Culture Deck 🇳🇬
      </h1>

      <div className="relative w-80 h-64 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <Motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-naijaWhite text-naijaGreen w-full h-full rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6 text-center border-4 border-naijaGold"
          >
            <h1 className="text-4xl font-bold mb-4">{currentCard.word}</h1>

            <h3 className="text-m font-bold mb-4">Forbidden Words</h3>

            <ul className="space-y-1">
              {currentCard.description.map((desc, i) => (
                <li key={i} className="capitalize text-sm font-medium">
                  {desc}
                </li>
              ))}
            </ul>
          </Motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={prevCard}
          disabled={index === 0}
          className="bg-naijaGold text-naijaGreen font-semibold py-2 px-5 rounded-xl shadow-md disabled:opacity-40 hover:bg-yellow-400 transition"
        >
          Previous
        </button>
        <button
          onClick={nextCard}
          disabled={index === naijaCards.length - 1}
          className="bg-naijaGold text-naijaGreen font-semibold py-2 px-5 rounded-xl shadow-md disabled:opacity-40 hover:bg-yellow-400 transition"
        >
          Next
        </button>
      </div>

      <p className="mt-4 text-sm opacity-80 pt-8 ">
        Card {index + 1} of {naijaCards.length}
      </p>

      <footer className="absolute bottom-6 text-xs ">
        Built with ❤️ in Nigeria
      </footer>
    </div>
  );
}
