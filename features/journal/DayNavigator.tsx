"use client";

import { useGameStore } from "@/shared/store/useGameStore";

export function DayNavigator() {
  const currentDay = useGameStore((state) => state.currentDay);
  const nextDay = useGameStore((state) => state.nextDay);
  const prevDay = useGameStore((state) => state.prevDay);
  const jumpDay = useGameStore((state) => state.currentDay);

  return (
    <div className="day-nav">
      <button onClick={prevDay} disabled={currentDay === 1}>
        Previous
      </button>
      <div className="day-slider-wrap">
        <input type="range" min={1} max={100} value={jumpDay} readOnly />
        <p>Day {currentDay}</p>
      </div>
      <button onClick={nextDay} disabled={currentDay === 100}>
        Next
      </button>
    </div>
  );
}
