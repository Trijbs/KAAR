import test from "node:test";
import assert from "node:assert/strict";
import { resolveGame } from "../src/features/game/selection";
import type { Player } from "../src/types/game";

const players: Player[] = [
  { id: "a", label: "Alpha", color: "#f00" },
  { id: "b", label: "Bravo", color: "#0f0" },
  { id: "c", label: "Charlie", color: "#00f" },
];

test("elimination mode highlights all survivors except the eliminated player", () => {
  const result = resolveGame(
    "elimination",
    players,
    { enabled: false, strategy: "fair", weightBoost: 5 },
    () => 0.1,
  );

  assert.equal(result.eliminatedId, "a");
  assert.deepEqual(result.highlightedIds, ["b", "c"]);
});
