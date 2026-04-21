"use client";

import { useMemo } from "react";
import { useGameStore } from "@/shared/store/useGameStore";
import { XP_PER_LEVEL } from "@/shared/utils/xp";

export function ProgressPanel() {
  const totalXP = useGameStore((state) => state.totalXP);
  const level = useGameStore((state) => state.level);
  const currentDay = useGameStore((state) => state.currentDay);
  const progress = useMemo(() => (totalXP % XP_PER_LEVEL) / XP_PER_LEVEL, [totalXP]);
  const tier = level <= 2 ? "Apprentice Wanderer" : level <= 5 ? "Disciplined Ranger" : "Elite Hero";

  return (
    <section className="progress-panel">
      <p className="ledger-title">Hero's Ledger</p>
      <div className="ledger-line">
        <span>LV {level}</span>
        <span>{tier}</span>
      </div>
      <div className="ledger-line">
        <span>XP Total</span>
        <span>{totalXP}</span>
      </div>
      <div className="xp-track">
        <div className="xp-fill" style={{ transform: `scaleX(${Math.max(0.03, progress)})` }} />
      </div>
      <div className="ledger-grid">
        <article>
          <small>Streak</small>
          <strong>0 days</strong>
        </article>
        <article>
          <small>Days Done</small>
          <strong>{currentDay}/100</strong>
        </article>
        <article>
          <small>Quests</small>
          <strong>4+</strong>
        </article>
        <article>
          <small>Current</small>
          <strong>Day {currentDay}</strong>
        </article>
      </div>
    </section>
  );
}
