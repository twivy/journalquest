"use client";

export const playSfx = (src: string, volume = 0.5) => {
  if (typeof window === "undefined") return;
  const audio = new Audio(src);
  audio.volume = Math.max(0, Math.min(1, volume));
  void audio.play().catch(() => {
    // Ignore autoplay/user-gesture restrictions.
  });
};
