import { chooseOne, type RandomSource } from "./random";
import type { ChaosConfig, Player } from "@/types/game";

export function isChaosActive(config: ChaosConfig) {
  return config.enabled && config.strategy !== "fair";
}

function weightedPool(players: Player[], targetPlayerId: string, weightBoost: number) {
  const pool: Player[] = [];
  for (const player of players) {
    pool.push(player);
    if (player.id === targetPlayerId) {
      for (let count = 0; count < weightBoost; count += 1) {
        pool.push(player);
      }
    }
  }
  return pool;
}

export function chooseInfluencedWinner(
  players: Player[],
  config: ChaosConfig,
  random: RandomSource = Math.random,
) {
  if (!isChaosActive(config) || !config.targetPlayerId) {
    return chooseOne(players, random);
  }

  if (config.strategy === "pick-winner") {
    return players.find((player) => player.id === config.targetPlayerId) ?? chooseOne(players, random);
  }

  if (config.strategy === "weighted") {
    return chooseOne(weightedPool(players, config.targetPlayerId, config.weightBoost), random);
  }

  return chooseOne(players, random);
}

export function chooseInfluencedLoser(
  players: Player[],
  config: ChaosConfig,
  random: RandomSource = Math.random,
) {
  if (!isChaosActive(config) || !config.targetPlayerId) {
    return chooseOne(players, random);
  }

  if (config.strategy === "pick-loser") {
    return players.find((player) => player.id === config.targetPlayerId) ?? chooseOne(players, random);
  }

  if (config.strategy === "weighted") {
    return chooseOne(weightedPool(players, config.targetPlayerId, config.weightBoost), random);
  }

  return chooseOne(players, random);
}
