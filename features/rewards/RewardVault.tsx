"use client";

import { FormEvent, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { playSfx } from "@/shared/audio/sfx";
import { Reward, useGameStore } from "@/shared/store/useGameStore";

type Props = {
  rewards: Reward[];
};

export function RewardVault({ rewards }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [xpRequired, setXpRequired] = useState(1000);
  const totalXP = useGameStore((state) => state.totalXP);
  const claimReward = useGameStore((state) => state.claimReward);
  const addReward = useGameStore((state) => state.addReward);

  const onClaim = (rewardId: string) => {
    claimReward(rewardId);
    playSfx("/audio/universfield-game-bonus-144751.mp3", 0.65);
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#fcd34d", "#f59e0b", "#fef3c7"]
    });
  };

  const onSubmitReward = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    addReward(title.trim(), Math.max(50, xpRequired));
    setTitle("");
    setXpRequired(1000);
    setIsModalOpen(false);
  };

  return (
    <div className="panel vault-panel">
      <div className="vault-header">
        <h2>Treasure Vault</h2>
        <button className="vault-add-btn" onClick={() => setIsModalOpen(true)} aria-label="Add custom reward">
          +
        </button>
      </div>
      <div className="reward-grid">
        {rewards.map((reward) => (
          <motion.article
            key={reward.id}
            className={`reward-card ${reward.status}`}
            whileHover={{ scale: reward.status !== "locked" ? 1.02 : 1 }}
          >
            <p>
              <span className="reward-lock">🔒</span>
              {reward.title}
            </p>
            <small>
              {Math.min(totalXP, reward.xpRequired)} / {reward.xpRequired} XP
            </small>
            <div className="reward-progress">
              <div
                className="reward-progress-fill"
                style={{
                  transform: `scaleX(${Math.max(0.02, Math.min(1, totalXP / reward.xpRequired))})`
                }}
              />
            </div>
            {reward.status === "unlocked" && <button onClick={() => onClaim(reward.id)}>Claim</button>}
            {reward.status === "locked" && <span>Locked</span>}
            {reward.status === "claimed" && <span>Claimed</span>}
          </motion.article>
        ))}
      </div>
      {isModalOpen && (
        <div className="reward-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <form className="reward-modal" onClick={(event) => event.stopPropagation()} onSubmit={onSubmitReward}>
            <button type="button" className="reward-modal-close" onClick={() => setIsModalOpen(false)}>
              ×
            </button>
            <h3>New Treasure</h3>
            <p>~ your future reward awaits ~</p>
            <label htmlFor="reward-title">Reward</label>
            <input
              id="reward-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Beli sepatu baru"
              aria-label="Reward title"
            />
            <label htmlFor="reward-xp">Unlock at XP</label>
            <input
              id="reward-xp"
              type="number"
              min={50}
              step={50}
              value={xpRequired}
              onChange={(event) => setXpRequired(Number(event.target.value) || 1000)}
              aria-label="Required XP"
            />
            <button type="submit">Bind Treasure</button>
          </form>
        </div>
      )}
    </div>
  );
}
