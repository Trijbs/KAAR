import { memo, useEffect, useMemo, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ArenaTouch, Player } from "@/types/game";
import { useTheme } from "@/theme/ThemeProvider";

interface TouchArenaProps {
  touches: ArenaTouch[];
  players: Player[];
  highlightedIds: string[];
  locked: boolean;
  isRevealing: boolean;
  countdown: number | null;
  onTouchEvent: (event: any) => void;
}

function TouchArenaComponent({
  touches,
  players,
  highlightedIds,
  locked,
  isRevealing,
  countdown,
  onTouchEvent,
}: TouchArenaProps) {
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();
  const pulse = useRef(new Animated.Value(0.9)).current;
  const suspense = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reducedMotion) {
      pulse.setValue(1);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 520,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.92,
          duration: 520,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      suspense.setValue(isRevealing ? 0.15 : 0);
      return;
    }
    if (!isRevealing) {
      suspense.stopAnimation();
      suspense.setValue(0);
      return;
    }

    Animated.sequence([
      Animated.timing(suspense, {
        toValue: 1,
        duration: 720,
        useNativeDriver: true,
      }),
      Animated.timing(suspense, {
        toValue: 0.2,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isRevealing, reducedMotion, suspense]);

  useEffect(() => {
    if (reducedMotion) {
      shimmer.setValue(0.15);
      return;
    }
    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [reducedMotion, shimmer]);

  const liveMarkers = useMemo(() => {
    if (locked) {
      return players.map((player, index) => ({
        id: player.id,
        label: player.label,
        color: player.color,
        x: Math.max(18, (player.x ?? 56 + (index % 3) * 110) - ((player.radius ?? 44) * 0.9)),
        y: Math.max(18, (player.y ?? 72 + Math.floor(index / 3) * 110) - ((player.radius ?? 44) * 0.9)),
        radius: player.radius ?? 44,
      }));
    }

    return touches.map((touch, index) => ({
      id: `${touch.id}`,
      label: `${index + 1}`,
      color: touch.color,
      x: Math.max(20, touch.x - touch.radius),
      y: Math.max(20, touch.y - touch.radius),
      radius: touch.radius,
    }));
  }, [locked, players, touches]);

  return (
    <Pressable
      style={[styles.arena, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={onTouchEvent}
      onResponderMove={onTouchEvent}
      onResponderRelease={onTouchEvent}
      onResponderTerminate={onTouchEvent}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Finger Arena</Text>
        <Text style={[styles.helper, { color: theme.colors.textMuted }]}>
          {locked ? "Players locked. Reveal when ready." : "Everyone slam a finger on the screen."}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusPill, { backgroundColor: theme.colors.panelAlt }]}>
            <Text style={[styles.statusText, { color: theme.colors.text }]}>
              {locked ? `${players.length} locked in` : `${touches.length} live touches`}
            </Text>
          </View>
          {countdown !== null ? (
            <View style={[styles.statusPill, { backgroundColor: theme.colors.accent }]}>
              <Text style={[styles.statusText, { color: theme.colors.background }]}>Locking in {countdown}</Text>
            </View>
          ) : null}
          {isRevealing ? (
            <View style={[styles.statusPill, { backgroundColor: theme.colors.danger }]}>
              <Text style={[styles.statusText, { color: theme.colors.background }]}>Reveal live</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.playfield}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.shimmer,
            {
              backgroundColor: theme.colors.glow,
              opacity: shimmer.interpolate({
                inputRange: [0, 1],
                outputRange: [0.12, 0.02],
              }),
              transform: [
                {
                  translateX: shimmer.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-180, 260],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            styles.suspenseOverlay,
            {
              opacity: suspense.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.4],
              }),
            },
          ]}
        />
        {countdown !== null ? (
          <View pointerEvents="none" style={styles.countdownWrap}>
            <Text style={[styles.countdownText, { color: theme.colors.text }]}>{countdown}</Text>
          </View>
        ) : null}
        {liveMarkers.map((marker) => {
          const highlighted = highlightedIds.includes(marker.id);
          return (
            <Animated.View
              key={marker.id}
              style={[
                styles.marker,
                {
                  left: marker.x,
                  top: marker.y,
                  width: marker.radius * 2,
                  height: marker.radius * 2,
                  backgroundColor: marker.color,
                  borderColor: highlighted ? theme.colors.accentSecondary : theme.colors.panel,
                  transform: [
                    { scale: highlighted ? pulse : 1 },
                    {
                      scale: isRevealing
                        ? suspense.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.12],
                          })
                        : 1,
                    },
                  ],
                  shadowColor: marker.color,
                },
              ]}
            >
              <Text style={[styles.markerText, { color: theme.colors.background }]}>{marker.label}</Text>
            </Animated.View>
          );
        })}
      </View>
    </Pressable>
  );
}

export const TouchArena = memo(TouchArenaComponent);

const styles = StyleSheet.create({
  arena: {
    minHeight: 360,
    borderRadius: 30,
    borderWidth: 2,
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
  },
  helper: {
    fontSize: 13,
    fontWeight: "700",
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 8,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  playfield: {
    flex: 1,
    minHeight: 290,
  },
  countdownWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  countdownText: {
    fontSize: 108,
    lineHeight: 110,
    fontWeight: "900",
    opacity: 0.16,
  },
  shimmer: {
    position: "absolute",
    top: -40,
    left: 0,
    width: 160,
    height: 420,
    borderRadius: 999,
  },
  suspenseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
  },
  marker: {
    position: "absolute",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 9,
  },
  markerText: {
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },
});
