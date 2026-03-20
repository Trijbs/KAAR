import type { GameMode, Player, ScoreboardEntry } from "@/types/game";

export function getWinningThreshold(bestOf: 1 | 3 | 5) {
  return Math.floor(bestOf / 2) + 1;
}

export function buildInitialScoreboard(players: Player[]): ScoreboardEntry[] {
  return players.map((player) => ({
    playerId: player.id,
    points: 0,
  }));
}

export function awardPoints(
  scoreboard: ScoreboardEntry[],
  highlightedIds: string[],
  mode: GameMode,
) {
  if (mode !== "winner" && mode !== "multiple-winners") {
    return scoreboard;
  }

  return scoreboard.map((entry) => ({
    ...entry,
    points: highlightedIds.includes(entry.playerId) ? entry.points + 1 : entry.points,
  }));
}

export function findSeriesLeader(
  scoreboard: ScoreboardEntry[],
  players: Player[],
  bestOf: 1 | 3 | 5,
) {
  const threshold = getWinningThreshold(bestOf);
  const winner = scoreboard.find((entry) => entry.points >= threshold);
  if (!winner) {
    return null;
  }
  return players.find((player) => player.id === winner.playerId) ?? null;
}

export function getSeriesStandings(scoreboard: ScoreboardEntry[], players: Player[]) {
  const playerMap = players.reduce<Record<string, Player>>((accumulator, player) => {
    accumulator[player.id] = player;
    return accumulator;
  }, {});

  return [...scoreboard]
    .sort((left, right) => right.points - left.points)
    .map((entry) => ({
      ...entry,
      player: playerMap[entry.playerId] ?? null,
    }));
}

export function getSeriesRoundsPlayed(scoreboard: ScoreboardEntry[]) {
  return scoreboard.reduce((total, entry) => total + entry.points, 0);
}
