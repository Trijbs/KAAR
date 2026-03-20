import type { Player } from "@/types/game";

export type RandomSource = () => number;

export function shufflePlayers(players: Player[], random: RandomSource = Math.random) {
  const next = [...players];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

export function chooseOne(players: Player[], random: RandomSource = Math.random) {
  if (players.length === 0) {
    throw new Error("Cannot choose from an empty player list.");
  }
  return players[Math.floor(random() * players.length)];
}

export function chooseMany(players: Player[], count: number, random: RandomSource = Math.random) {
  return shufflePlayers(players, random).slice(0, Math.min(players.length, count));
}
