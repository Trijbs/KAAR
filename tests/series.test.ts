import test from "node:test";
import assert from "node:assert/strict";
import { getSeriesRoundsPlayed, getSeriesStandings } from "../src/lib/rounds";

test("series rounds played is the sum of points", () => {
  assert.equal(
    getSeriesRoundsPlayed([
      { playerId: "a", points: 2 },
      { playerId: "b", points: 1 },
    ]),
    3,
  );
});

test("series standings sorts by score descending", () => {
  const standings = getSeriesStandings(
    [
      { playerId: "a", points: 1 },
      { playerId: "b", points: 3 },
      { playerId: "c", points: 2 },
    ],
    [
      { id: "a", label: "Alpha", color: "#f00" },
      { id: "b", label: "Bravo", color: "#0f0" },
      { id: "c", label: "Charlie", color: "#00f" },
    ],
  );

  assert.deepEqual(standings.map((entry) => entry.playerId), ["b", "c", "a"]);
});
