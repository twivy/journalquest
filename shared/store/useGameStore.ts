"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getLevelFromXP } from "@/shared/utils/xp";

export type Quest = {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  createdAt: number;
  isDefault: boolean;
};

export type RewardStatus = "locked" | "unlocked" | "claimed";

export type Reward = {
  id: string;
  title: string;
  xpRequired: number;
  status: RewardStatus;
};

export type DayPage = {
  day: number;
  quests: Quest[];
};

type GameState = {
  currentDay: number;
  totalXP: number;
  level: number;
  streak: number;
  days: DayPage[];
  rewards: Reward[];
  toggleQuestCompletion: (day: number, questId: string) => void;
  addQuest: (day: number, title: string, xp: number) => void;
  removeQuest: (day: number, questId: string) => void;
  nextDay: () => void;
  prevDay: () => void;
  claimReward: (rewardId: string) => void;
  addReward: (title: string, xpRequired: number) => void;
};

const DEFAULT_QUESTS: Array<Omit<Quest, "id" | "createdAt">> = [
  { title: "Baca Quran", xp: 30, completed: false, isDefault: true },
  { title: "Bangun Pagi", xp: 20, completed: false, isDefault: true },
  { title: "Baca Buku", xp: 25, completed: false, isDefault: true },
  { title: "Belajar", xp: 35, completed: false, isDefault: true }
];

const buildDays = (): DayPage[] =>
  Array.from({ length: 100 }, (_, index) => ({
    day: index + 1,
    quests: DEFAULT_QUESTS.map((quest, questIndex) => ({
      ...quest,
      id: `d${index + 1}-q${questIndex + 1}`,
      createdAt: Date.now() + questIndex
    }))
  }));

const initialRewards: Reward[] = [
  { id: "r1", title: "Coffee Break", xpRequired: 200, status: "locked" },
  { id: "r2", title: "Movie Night", xpRequired: 500, status: "locked" },
  { id: "r3", title: "Weekend Adventure", xpRequired: 1000, status: "locked" }
];

const unlockRewards = (rewards: Reward[], totalXP: number): Reward[] =>
  rewards.map((reward) => {
    if (reward.status === "claimed") return reward;
    if (totalXP >= reward.xpRequired) return { ...reward, status: "unlocked" };
    return { ...reward, status: "locked" };
  });

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentDay: 1,
      totalXP: 0,
      level: 1,
      streak: 0,
      days: buildDays(),
      rewards: initialRewards,
      toggleQuestCompletion: (day, questId) =>
        set((state) => {
          let xpDelta = 0;
          const days = state.days.map((page) => {
            if (page.day !== day) return page;
            return {
              ...page,
              quests: page.quests.map((quest) => {
                if (quest.id !== questId) return quest;
                const nextCompleted = !quest.completed;
                xpDelta = nextCompleted ? quest.xp : -quest.xp;
                return { ...quest, completed: nextCompleted };
              })
            };
          });

          const totalXP = Math.max(0, state.totalXP + xpDelta);
          return {
            days,
            totalXP,
            level: getLevelFromXP(totalXP),
            rewards: unlockRewards(state.rewards, totalXP)
          };
        }),
      addQuest: (day, title, xp) =>
        set((state) => ({
          days: state.days.map((page) =>
            page.day === day
              ? {
                  ...page,
                  quests: [
                    ...page.quests,
                    {
                      id: `${day}-${Date.now()}`,
                      title,
                      xp,
                      completed: false,
                      createdAt: Date.now(),
                      isDefault: false
                    }
                  ]
                }
              : page
          )
        })),
      removeQuest: (day, questId) =>
        set((state) => ({
          days: state.days.map((page) =>
            page.day === day
              ? {
                  ...page,
                  quests: page.quests.filter((quest) => quest.id !== questId)
                }
              : page
          )
        })),
      nextDay: () => set((state) => ({ currentDay: Math.min(100, state.currentDay + 1) })),
      prevDay: () => set((state) => ({ currentDay: Math.max(1, state.currentDay - 1) })),
      claimReward: (rewardId) =>
        set((state) => ({
          rewards: state.rewards.map((reward) =>
            reward.id === rewardId && reward.status === "unlocked"
              ? { ...reward, status: "claimed" }
              : reward
          )
        })),
      addReward: (title, xpRequired) =>
        set((state) => {
          const nextRewards = [
            ...state.rewards,
            {
              id: `custom-${Date.now()}`,
              title,
              xpRequired,
              status: "locked" as const
            }
          ];
          return {
            rewards: unlockRewards(nextRewards, state.totalXP)
          };
        })
    }),
    { name: "fantasy-journal-store" }
  )
);

export const useCurrentDayData = () =>
  useGameStore((state) => state.days.find((day) => day.day === state.currentDay));
