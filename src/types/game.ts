export type GameMode =
  | "winner"
  | "loser"
  | "multiple-winners"
  | "teams"
  | "elimination";

export type ChaosStrategy = "fair" | "pick-winner" | "pick-loser" | "weighted";

export type ThemeName = "prototype" | "collab";

export interface Player {
  id: string;
  label: string;
  color: string;
  x?: number;
  y?: number;
  radius?: number;
}

export interface TeamAssignment {
  name: string;
  playerIds: string[];
}

export interface GameResult {
  mode: GameMode;
  title: string;
  subtitle: string;
  highlightedIds: string[];
  teamAssignments?: TeamAssignment[];
  eliminatedId?: string;
  metadata?: Record<string, number | string>;
}

export interface ChaosConfig {
  enabled: boolean;
  strategy: ChaosStrategy;
  targetPlayerId?: string;
  weightBoost: number;
}

export interface ArenaTouch {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
}

export interface SessionHistoryItem {
  id: string;
  createdAt: string;
  mode: GameMode;
  title: string;
  subtitle: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  bestOf: 1 | 3 | 5;
}

export interface ScoreboardEntry {
  playerId: string;
  points: number;
}
