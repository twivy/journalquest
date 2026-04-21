"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DayNavigator } from "@/features/journal/DayNavigator";
import { ProgressPanel } from "@/features/progression/ProgressPanel";
import { QuestList } from "@/features/quests/QuestList";
import { RewardVault } from "@/features/rewards/RewardVault";
import { playSfx } from "@/shared/audio/sfx";
import { useCurrentDayData, useGameStore } from "@/shared/store/useGameStore";

export function OpenBook() {
  const dayData = useCurrentDayData();
  const rewards = useGameStore((state) => state.rewards);
  const currentDay = useGameStore((state) => state.currentDay);
  const previousDay = useRef(currentDay);
  const [flipDirection, setFlipDirection] = useState<1 | -1>(1);
  const [isFlipping, setIsFlipping] = useState(false);

  if (!dayData) return null;

  useEffect(() => {
    if (previousDay.current === currentDay) return;
    const direction = currentDay > previousDay.current ? 1 : -1;
    setFlipDirection(direction);
    setIsFlipping(true);
    const audioTimer = window.setTimeout(() => {
      playSfx("/audio/dragon-studio-flipping-book-page-499646.mp3", 0.52);
    }, 280);
    const settleTimer = window.setTimeout(() => {
      setIsFlipping(false);
    }, 760);
    previousDay.current = currentDay;
    return () => {
      window.clearTimeout(audioTimer);
      window.clearTimeout(settleTimer);
    };
  }, [currentDay]);

  return (
    <main className="scene">
      <motion.section
        className="book-shell"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="title-overline">The Chronicle of</p>
        <h1>100 Days - Nico</h1>
        <p className="title-subline">a beautiful day quest</p>
        <div className="journal-layout">
          <section className="journal-main">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentDay}
                className={`page-flip-layer ${flipDirection === 1 ? "flip-next" : "flip-prev"} ${
                  isFlipping ? "is-flipping" : ""
                }`}
                initial={{ rotateY: 88 * flipDirection, x: 24 * flipDirection, opacity: 0.5 }}
                animate={{ rotateY: 0, x: 0, opacity: 1 }}
                exit={{ rotateY: -30 * flipDirection, x: -12 * flipDirection, opacity: 0.15 }}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className={`page-flip-shadow ${flipDirection === 1 ? "shadow-next" : "shadow-prev"}`}
                  initial={{ opacity: 0.45, scaleX: 0.45 }}
                  animate={{ opacity: 0, scaleX: 1 }}
                  exit={{ opacity: 0.22 }}
                  transition={{ duration: 0.62, ease: "easeOut" }}
                />
                <QuestList day={dayData.day} quests={dayData.quests} />
              </motion.div>
            </AnimatePresence>
            <DayNavigator />
          </section>
          <aside className="journal-sidebar">
            <ProgressPanel />
            <RewardVault rewards={rewards} />
          </aside>
        </div>
        <p className="page-footnote">Page {currentDay}/100</p>
      </motion.section>
    </main>
  );
}
