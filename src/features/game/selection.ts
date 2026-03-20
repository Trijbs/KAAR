import { createHistoryId } from "@/lib/names";
import type { ChaosConfig, GameMode, GameResult, Player, SessionHistoryItem } from "@/types/game";
import { chooseInfluencedLoser, chooseInfluencedWinner } from "./chaos";
import { chooseMany, chooseOne, shufflePlayers, type RandomSource } from "./random";

export function resolveGame(
  mode: GameMode,
  players: Player[],
  chaos: ChaosConfig,
  random: RandomSource = Math.random,
): GameResult {
  if (players.length < 2) {
    throw new Error("At least two players are required.");
  }

  if (mode === "winner") {
    const winner = chooseInfluencedWinner(players, chaos, random);
    return {
      mode,
      title: `${winner.label} takes the crown`,
      subtitle: "One finger. One winner. Maximum drama.",
      highlightedIds: [winner.id],
    };
  }

  if (mode === "loser") {
    const loser = chooseInfluencedLoser(players, chaos, random);
    return {
      mode,
      title: `${loser.label} eats the challenge`,
      subtitle: "The chaos points in exactly one direction.",
      highlightedIds: [loser.id],
      eliminatedId: loser.id,
    };
  }

  if (mode === "multiple-winners") {
    const targetWinner = chooseInfluencedWinner(players, chaos, random);
    const bonusWinners = chooseMany(
      players.filter((player) => player.id !== targetWinner.id),
      Math.max(1, Math.min(players.length - 1, 1)),
      random,
    );
    const winners = [targetWinner, ...bonusWinners].slice(0, Math.min(players.length, 2));
    return {
      mode,
      title: "Double winner drop",
      subtitle: winners.map((player) => player.label).join(" + "),
      highlightedIds: winners.map((player) => player.id),
    };
  }

  if (mode === "teams") {
    const shuffled = shufflePlayers(players, random);
    const teamA = shuffled.filter((_, index) => index % 2 === 0);
    const teamB = shuffled.filter((_, index) => index % 2 === 1);
    return {
      mode,
      title: "Teams are locked",
      subtitle: `Team Volt vs Team Echo`,
      highlightedIds: shuffled.map((player) => player.id),
      teamAssignments: [
        { name: "Team Volt", playerIds: teamA.map((player) => player.id) },
        { name: "Team Echo", playerIds: teamB.map((player) => player.id) },
      ],
    };
  }

  const eliminated = chaos.enabled
    ? chooseInfluencedLoser(players, chaos, random)
    : chooseOne(players, random);
  const survivors = players.filter((player) => player.id !== eliminated.id);
  return {
    mode,
    title: `${eliminated.label} is out this round`,
    subtitle: `${survivors.length} players survive to the next showdown.`,
    highlightedIds: survivors.map((player) => player.id),
    eliminatedId: eliminated.id,
    metadata: {
      survivors: survivors.length,
    },
  };
}

export function buildHistoryItem(result: GameResult): SessionHistoryItem {
  return {
    id: createHistoryId(),
    createdAt: new Date().toISOString(),
    mode: result.mode,
    title: result.title,
    subtitle: result.subtitle,
  };
}
