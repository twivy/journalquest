"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { playSfx } from "@/shared/audio/sfx";
import { Quest, useGameStore } from "@/shared/store/useGameStore";

type Props = {
  day: number;
  quests: Quest[];
};

export function QuestList({ day, quests }: Props) {
  const [title, setTitle] = useState("");
  const [xp, setXp] = useState(20);
  const toggleQuestCompletion = useGameStore((state) => state.toggleQuestCompletion);
  const addQuest = useGameStore((state) => state.addQuest);
  const removeQuest = useGameStore((state) => state.removeQuest);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    addQuest(day, title.trim(), Math.max(5, xp));
    setTitle("");
    setXp(20);
  };
  const activeQuests = quests.filter((quest) => !quest.completed);
  const completedQuests = quests.filter((quest) => quest.completed);
  const onCompleteQuest = (questId: string) => {
    toggleQuestCompletion(day, questId);
    playSfx("/audio/universfield-game-bonus-144751.mp3", 0.45);
  };

  return (
    <div className="panel quest-paper">
      <p className="paper-overline">- Quest Journal -</p>
      <h2>Day {String(day).padStart(3, "0")}</h2>
      <p className="section-label">Fixed Quests</p>
      <ul className="quest-list">
        {activeQuests.map((quest) => (
          <li key={quest.id} className="quest-item">
            <button
              className="quest-check"
              onClick={() => onCompleteQuest(quest.id)}
              aria-label={`Complete ${quest.title}`}
            >
              <span>✓</span>
            </button>
            <motion.span
              className="quest-title"
              initial={false}
              animate={{ opacity: 1 }}
            >
              {quest.title}
            </motion.span>
            <span className="quest-xp">+{quest.xp} XP</span>
            {!quest.isDefault && (
              <button className="remove-btn" onClick={() => removeQuest(day, quest.id)}>
                x
              </button>
            )}
          </li>
        ))}
      </ul>
      <p className="section-label">Completed</p>
      <ul className="quest-list compact">
        {completedQuests.length === 0 && <li className="empty-line">No completed quest yet</li>}
        {completedQuests.map((quest) => (
          <li key={quest.id} className="quest-item done-item completed-row">
            <button
              className="quest-check done"
              onClick={() => toggleQuestCompletion(day, quest.id)}
              aria-label={`Cancel completion ${quest.title}`}
            >
              <span>✓</span>
            </button>
            <span className="quest-title done completed-title">
              {quest.title}
            </span>
            <span className="quest-xp">+{quest.xp} XP</span>
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit} className="add-quest-form">
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="+ Tambah Side Quest" />
        <input
          type="number"
          min={5}
          max={200}
          value={xp}
          onChange={(event) => setXp(Number(event.target.value) || 20)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
