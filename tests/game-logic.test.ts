import test from "node:test";
import assert from "node:assert/strict";
import type { ChaosConfig, Player } from "../src/types/game";
import { resolveGame } from "../src/features/game/selection";
import { chooseInfluencedWinner } from "../src/features/game/chaos";

const players: Player[] = [
  { id: "a", label: "Alpha", color: "#f00" },
  { id: "b", label: "Bravo", color: "#0f0" },
  { id: "c", label: "Charlie", color: "#00f" },
  { id: "d", label: "Delta", color: "#ff0" },
];

function createSequence(values: number[]) {
  let index = 0;
  return () => {
    const value = values[index % values.length];
    index += 1;
    return value;
  };
}

test("fair winner mode highlights exactly one player", () => {
  const result = resolveGame(
    "winner",
    players,
    { enabled: false, strategy: "fair", weightBoost: 5 },
    createSequence([0.1]),
  );
  assert.equal(result.highlightedIds.length, 1);
});

test("pick-winner chaos selects the targeted player", () => {
  const config: ChaosConfig = {
    enabled: true,
    strategy: "pick-winner",
    targetPlayerId: "c",
    weightBoost: 5,
  };

  const winner = chooseInfluencedWinner(players, config, createSequence([0.99]));
  assert.equal(winner.id, "c");
});

test("weighted chaos increases the frequency of the targeted player", () => {
  const config: ChaosConfig = {
    enabled: true,
    strategy: "weighted",
    targetPlayerId: "b",
    weightBoost: 6,
  };

  let targetWins = 0;
  let otherWins = 0;
  const random = createSequence([0.0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9]);

  for (let round = 0; round < 70; round += 1) {
    const winner = chooseInfluencedWinner(players, config, random);
    if (winner.id === "b") {
      targetWins += 1;
    } else {
      otherWins += 1;
    }
  }

  assert.ok(targetWins > otherWins);
});
