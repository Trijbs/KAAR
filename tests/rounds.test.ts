import test from "node:test";
import assert from "node:assert/strict";
import { awardPoints, findSeriesLeader, getWinningThreshold } from "../src/lib/rounds";

test("best-of thresholds are correct", () => {
  assert.equal(getWinningThreshold(1), 1);
  assert.equal(getWinningThreshold(3), 2);
  assert.equal(getWinningThreshold(5), 3);
});

test("points are only awarded in winner-based modes", () => {
  const scoreboard = [
    { playerId: "a", points: 0 },
    { playerId: "b", points: 0 },
  ];
  const next = awardPoints(scoreboard, ["a"], "loser");
  assert.deepEqual(next, scoreboard);
});

test("series leader resolves once threshold is reached", () => {
  const leader = findSeriesLeader(
    [
      { playerId: "a", points: 2 },
      { playerId: "b", points: 1 },
    ],
    [
      { id: "a", label: "Alpha", color: "#f00" },
      { id: "b", label: "Bravo", color: "#0f0" },
    ],
    3,
  );

  assert.equal(leader?.id, "a");
});
