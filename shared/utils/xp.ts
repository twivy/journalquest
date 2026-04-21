export const XP_PER_LEVEL = 1000;

export const getLevelFromXP = (xp: number): number => Math.floor(xp / XP_PER_LEVEL) + 1;
