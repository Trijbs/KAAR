import { useMemo, useRef, useState } from "react";
import { createPlayerLabel } from "@/lib/names";
import type { ArenaTouch, Player } from "@/types/game";

const TOUCH_COLORS = ["#ff5d73", "#33d6ff", "#d7ff3f", "#ff9d2e", "#4cffb2", "#ff3dbb"];

function normalizeTouches(touches: readonly any[]): ArenaTouch[] {
  return touches.map((touch, index) => ({
    id: touch.identifier ?? index,
    x: touch.locationX ?? 0,
    y: touch.locationY ?? 0,
    radius: 44 + ((touch.identifier ?? index) % 3) * 6,
    color: TOUCH_COLORS[(touch.identifier ?? index) % TOUCH_COLORS.length],
  }));
}

export function useTouchArena() {
  const [touches, setTouches] = useState<ArenaTouch[]>([]);
  const [lockedPlayers, setLockedPlayers] = useState<Player[]>([]);
  const lockCounter = useRef(0);

  const updateTouchesFromEvent = (event: any) => {
    if (lockedPlayers.length > 0) {
      return;
    }
    const nextTouches = normalizeTouches(event.nativeEvent.touches ?? []);
    setTouches(nextTouches);
  };

  const resetArena = () => {
    setTouches([]);
    setLockedPlayers([]);
    lockCounter.current = 0;
  };

  const lockPlayers = () => {
    if (touches.length < 2) {
      return [];
    }
    const nextPlayers = touches.map((touch, index) => ({
      id: `player-${lockCounter.current}-${touch.id}`,
      label: createPlayerLabel(index),
      color: touch.color,
    }));
    lockCounter.current += 1;
    setLockedPlayers(nextPlayers);
    return nextPlayers;
  };

  const updateLockedPlayers = (updater: (players: Player[]) => Player[]) => {
    setLockedPlayers((current) => updater(current));
  };

  const playerColorMap = useMemo(
    () =>
      lockedPlayers.reduce<Record<string, string>>((accumulator, player) => {
        accumulator[player.id] = player.color;
        return accumulator;
      }, {}),
    [lockedPlayers],
  );

  return {
    touches,
    lockedPlayers,
    playerColorMap,
    updateTouchesFromEvent,
    lockPlayers,
    updateLockedPlayers,
    resetArena,
  };
}
