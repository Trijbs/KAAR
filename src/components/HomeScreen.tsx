import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NicknameModal } from "@/components/NicknameModal";
import { usePrototypeSettings } from "@/features/settings/usePrototypeSettings";
import { buildHistoryItem, resolveGame } from "@/features/game/selection";
import { useTouchArena } from "@/features/arena/useTouchArena";
import type { ChaosConfig, ChaosStrategy, GameMode, GameResult, Player, ScoreboardEntry, SessionHistoryItem } from "@/types/game";
import { loadHistory, saveHistory } from "@/lib/storage";
import { awardPoints, buildInitialScoreboard, findSeriesLeader } from "@/lib/rounds";
import { pickDare } from "@/lib/dares";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/theme/ThemeProvider";
import { ChaosBanner } from "./ChaosBanner";
import { ModeSelector } from "./ModeSelector";
import { ResultCard } from "./ResultCard";
import { ScoreboardCard } from "./ScoreboardCard";
import { SettingsModal } from "./SettingsModal";
import { TouchArena } from "./TouchArena";

const CHAOS_LABELS: Record<ChaosStrategy, string> = {
  fair: "Fair only",
  "pick-winner": "Choose winner",
  "pick-loser": "Choose loser",
  weighted: "Weighted randomness",
};

export function HomeScreen() {
  const { theme, themeName } = useTheme();
  const reducedMotion = useReducedMotion();
  const settings = usePrototypeSettings();
  const arena = useTouchArena();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [mode, setMode] = useState<GameMode>("winner");
  const [chaosEnabled, setChaosEnabled] = useState(false);
  const [chaosStrategy, setChaosStrategy] = useState<ChaosStrategy>("pick-winner");
  const [chaosTargetPlayerId, setChaosTargetPlayerId] = useState<string | undefined>();
  const [result, setResult] = useState<GameResult | null>(null);
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);
  const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([]);
  const [dare, setDare] = useState<string | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadHistory()
      .then((items) => setHistory(items))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    saveHistory(history).catch(() => undefined);
  }, [history]);

  useEffect(() => {
    if (!arena.lockedPlayers.find((player) => player.id === chaosTargetPlayerId)) {
      setChaosTargetPlayerId(arena.lockedPlayers[0]?.id);
    }
  }, [arena.lockedPlayers, chaosTargetPlayerId]);

  useEffect(() => {
    if (arena.lockedPlayers.length > 0) {
      setScoreboard((current) => {
        if (current.length === arena.lockedPlayers.length) {
          return current;
        }
        return buildInitialScoreboard(arena.lockedPlayers);
      });
    }
  }, [arena.lockedPlayers]);

  const chaosConfig: ChaosConfig = useMemo(
    () => ({
      enabled: chaosEnabled,
      strategy: chaosEnabled ? chaosStrategy : "fair",
      targetPlayerId: chaosTargetPlayerId,
      weightBoost: 5,
    }),
    [chaosEnabled, chaosStrategy, chaosTargetPlayerId],
  );

  const triggerHaptic = async () => {
    if (!settings.vibrationEnabled) {
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleLockPlayers = async () => {
    if (arena.touches.length < 2) {
      Alert.alert("Need more fingers", "Get at least two people touching the arena first.");
      return;
    }

    if (!reducedMotion) {
      setCountdown(3);
      if (settings.vibrationEnabled) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      for (const nextCount of [2, 1]) {
        await new Promise((resolve) => setTimeout(resolve, 260));
        setCountdown(nextCount);
        if (settings.vibrationEnabled) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 220));
    }

    const players = arena.lockPlayers();
    setCountdown(null);
    if (players.length < 2) {
      Alert.alert("Need more fingers", "Get at least two people touching the arena first.");
      return;
    }
    setScoreboard(buildInitialScoreboard(players));
    setResult(null);
    setDare(null);
    reveal.setValue(0);
    await triggerHaptic();
  };

  const handleReveal = async () => {
    try {
      setIsRevealing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await new Promise((resolve) => setTimeout(resolve, 850));
      const nextResult = resolveGame(mode, arena.lockedPlayers, chaosConfig);
      setResult(nextResult);
      setHistory((current) => [buildHistoryItem(nextResult), ...current].slice(0, 6));
      setDare(
        nextResult.mode === "loser" || nextResult.mode === "elimination"
          ? pickDare(history.length)
          : null,
      );
      setScoreboard((current) => awardPoints(current, nextResult.highlightedIds, nextResult.mode));
      await triggerHaptic();
      Animated.spring(reveal, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        tension: 90,
      }).start();
    } catch (error) {
      Alert.alert("Reveal blocked", error instanceof Error ? error.message : "Unknown reveal error.");
    } finally {
      setIsRevealing(false);
    }
  };

  const handleReplay = () => {
    reveal.setValue(0);
    setResult(null);
    setDare(null);
    setIsRevealing(false);
    setCountdown(null);
    arena.resetArena();
    setScoreboard([]);
  };

  const handleNextEliminationRound = () => {
    if (!result?.eliminatedId) {
      return;
    }
    const survivors = arena.lockedPlayers.filter((player) => player.id !== result.eliminatedId);
    reveal.setValue(0);
    setResult(null);
    setDare(null);
    setIsRevealing(false);
    arena.replaceLockedPlayers(survivors);
  };

  const highlightedIds = result?.highlightedIds ?? [];
  const seriesLeader = findSeriesLeader(scoreboard, arena.lockedPlayers, settings.bestOf);

  return (
    <LinearGradient colors={theme.gradient} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <NicknameModal
          visible={Boolean(editingPlayer)}
          initialValue={editingPlayer?.label ?? ""}
          onClose={() => setEditingPlayer(null)}
          onSave={(value) => {
            if (!editingPlayer) {
              return;
            }
            arena.updateLockedPlayers((players) =>
              players.map((player) => (player.id === editingPlayer.id ? { ...player, label: value } : player)),
            );
            setEditingPlayer(null);
          }}
        />
        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
          soundEnabled={settings.soundEnabled}
          vibrationEnabled={settings.vibrationEnabled}
          bestOf={settings.bestOf}
          onSoundChange={settings.setSoundEnabled}
          onVibrationChange={settings.setVibrationEnabled}
          onBestOfChange={settings.setBestOf}
          themeName={themeName}
        />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heroRow}>
            <View style={styles.heroText}>
              <Text style={[styles.kicker, { color: theme.colors.accent }]}>Internal Prototype Theme</Text>
              <Text style={[styles.display, { color: theme.colors.text }]}>KAAR</Text>
              <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                Loud party energy, zero hidden rigging, and a clearly labeled chaos switch for intentional influence.
              </Text>
            </View>

            <Pressable
              onPress={() => setSettingsVisible(true)}
              style={[styles.settingsButton, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}
            >
              <Text style={[styles.settingsText, { color: theme.colors.text }]}>Settings</Text>
            </Pressable>
          </View>

          <ModeSelector value={mode} onChange={setMode} />

          <View style={styles.toggles}>
            <Pressable
              onPress={() => setChaosEnabled(false)}
              style={[
                styles.toggle,
                {
                  backgroundColor: !chaosEnabled ? theme.colors.success : theme.colors.panel,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.toggleText, { color: !chaosEnabled ? theme.colors.background : theme.colors.text }]}>
                Fair Random
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setChaosEnabled(true)}
              style={[
                styles.toggle,
                {
                  backgroundColor: chaosEnabled ? theme.colors.danger : theme.colors.panel,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.toggleText, { color: chaosEnabled ? theme.colors.background : theme.colors.text }]}>
                Chaos Mode
              </Text>
            </Pressable>
          </View>

          {chaosEnabled ? (
            <View style={styles.section}>
              <ChaosBanner />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chaosRow}>
                {(["pick-winner", "pick-loser", "weighted"] as const).map((strategy) => (
                  <Pressable
                    key={strategy}
                    onPress={() => setChaosStrategy(strategy)}
                    style={[
                      styles.chaosChip,
                      {
                        backgroundColor: chaosStrategy === strategy ? theme.colors.danger : theme.colors.panel,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: chaosStrategy === strategy ? theme.colors.background : theme.colors.text,
                        fontWeight: "900",
                      }}
                    >
                      {CHAOS_LABELS[strategy]}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              {arena.lockedPlayers.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chaosRow}>
                  {arena.lockedPlayers.map((player) => (
                    <Pressable
                      key={player.id}
                      onPress={() => setChaosTargetPlayerId(player.id)}
                      style={[
                        styles.targetChip,
                        {
                          backgroundColor: chaosTargetPlayerId === player.id ? player.color : theme.colors.panel,
                          borderColor: player.color,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color:
                            chaosTargetPlayerId === player.id ? theme.colors.background : theme.colors.text,
                          fontWeight: "900",
                        }}
                      >
                        {player.label}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              ) : (
                <Text style={[styles.microcopy, { color: theme.colors.textMuted }]}>
                  Lock players first to aim the influence target.
                </Text>
              )}
            </View>
          ) : null}

          <TouchArena
            touches={arena.touches}
            players={arena.lockedPlayers}
            highlightedIds={highlightedIds}
            locked={arena.lockedPlayers.length > 0}
            isRevealing={isRevealing}
            countdown={countdown}
            onTouchEvent={arena.updateTouchesFromEvent}
          />

          {!arena.lockedPlayers.length ? (
            <View style={[styles.infoCard, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
              <View style={styles.infoRow}>
                <View>
                  <Text style={[styles.infoTitle, { color: theme.colors.text }]}>Instant onboarding</Text>
                  <Text style={[styles.infoBody, { color: theme.colors.textMuted }]}>
                    Put down 2 to 8 fingers, tap lock, then let the reveal do the talking.
                  </Text>
                </View>
                <View style={[styles.playerCountBadge, { backgroundColor: theme.colors.panelAlt }]}>
                  <Text style={[styles.playerCountValue, { color: theme.colors.accent }]}>{arena.touches.length}</Text>
                  <Text style={[styles.playerCountLabel, { color: theme.colors.textMuted }]}>players live</Text>
                </View>
              </View>
            </View>
          ) : null}

          {arena.lockedPlayers.length > 0 ? (
            <View style={[styles.playerCard, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
              <Text style={[styles.playerTitle, { color: theme.colors.text }]}>Nicknames</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chaosRow}>
                {arena.lockedPlayers.map((player) => (
                  <Pressable
                    key={player.id}
                    onPress={() => setEditingPlayer(player)}
                    style={[styles.targetChip, { backgroundColor: player.color, borderColor: player.color }]}
                  >
                    <Text style={[styles.playerChipText, { color: theme.colors.background }]}>{player.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View style={styles.buttonRow}>
            <Pressable
              onPress={handleLockPlayers}
              style={[styles.primaryButton, { backgroundColor: theme.colors.accent }]}
            >
              <Text style={[styles.primaryLabel, { color: theme.colors.background }]}>Lock Players</Text>
            </Pressable>
            <Pressable
              onPress={handleReveal}
              disabled={arena.lockedPlayers.length < 2}
              style={[
                styles.secondaryButton,
                {
                  backgroundColor: arena.lockedPlayers.length >= 2 ? theme.colors.panel : theme.colors.panelAlt,
                  borderColor: theme.colors.border,
                  opacity: arena.lockedPlayers.length >= 2 ? 1 : 0.55,
                },
              ]}
            >
              <Text style={[styles.secondaryLabel, { color: theme.colors.text }]}>Reveal</Text>
            </Pressable>
          </View>

          <Animated.View
            style={{
              opacity: reveal,
              transform: [
                {
                  scale: reveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
                {
                  translateY: reveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
              ],
            }}
          >
            <ResultCard result={result} players={arena.lockedPlayers} dare={dare} />
          </Animated.View>

          {arena.lockedPlayers.length > 0 ? (
            <ScoreboardCard scoreboard={scoreboard} players={arena.lockedPlayers} bestOf={settings.bestOf} />
          ) : null}

          {seriesLeader ? (
            <View style={[styles.seriesCard, { backgroundColor: theme.colors.accent, borderColor: theme.colors.border }]}>
              <Text style={[styles.seriesEyebrow, { color: theme.colors.background }]}>Series Winner</Text>
              <Text style={[styles.seriesTitle, { color: theme.colors.background }]}>{seriesLeader.label}</Text>
            </View>
          ) : null}

          {mode === "elimination" && result?.eliminatedId && arena.lockedPlayers.length > 2 ? (
            <Pressable
              onPress={handleNextEliminationRound}
              style={[styles.primaryButton, { backgroundColor: theme.colors.accentSecondary }]}
            >
              <Text style={[styles.primaryLabel, { color: theme.colors.background }]}>Next Elimination Round</Text>
            </Pressable>
          ) : null}

          <Pressable onPress={handleReplay} style={[styles.replayButton, { borderColor: theme.colors.border }]}>
            <Text style={[styles.replayText, { color: theme.colors.text }]}>Replay Round</Text>
          </Pressable>

          <View style={[styles.historyCard, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
            <Text style={[styles.historyTitle, { color: theme.colors.text }]}>Session History</Text>
            {history.length === 0 ? (
              <Text style={[styles.historyEmpty, { color: theme.colors.textMuted }]}>
                No rounds yet. Hit reveal to start the streak.
              </Text>
            ) : (
              history.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  <Text style={[styles.historyMode, { color: theme.colors.accent }]}>{item.mode}</Text>
                  <Text style={[styles.historyHeadline, { color: theme.colors.text }]}>{item.title}</Text>
                  <Text style={[styles.historySubline, { color: theme.colors.textMuted }]}>{item.subtitle}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 18,
  },
  heroRow: {
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  display: {
    fontSize: 40,
    lineHeight: 42,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    maxWidth: 300,
  },
  settingsButton: {
    borderWidth: 2,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingsText: {
    fontSize: 14,
    fontWeight: "900",
  },
  toggles: {
    flexDirection: "row",
    gap: 12,
  },
  toggle: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "900",
  },
  section: {
    gap: 12,
  },
  chaosRow: {
    gap: 10,
    paddingRight: 20,
  },
  chaosChip: {
    borderRadius: 999,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  targetChip: {
    borderRadius: 999,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  microcopy: {
    fontSize: 13,
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButton: {
    width: 120,
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
  },
  primaryLabel: {
    fontSize: 16,
    fontWeight: "900",
  },
  secondaryLabel: {
    fontSize: 16,
    fontWeight: "900",
  },
  replayButton: {
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
  },
  replayText: {
    fontSize: 15,
    fontWeight: "900",
  },
  historyCard: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 18,
    gap: 12,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  historyEmpty: {
    fontSize: 14,
    fontWeight: "700",
  },
  historyItem: {
    gap: 2,
  },
  historyMode: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  historyHeadline: {
    fontSize: 15,
    fontWeight: "900",
  },
  historySubline: {
    fontSize: 13,
    fontWeight: "600",
  },
  playerCard: {
    borderWidth: 2,
    borderRadius: 24,
    padding: 16,
    gap: 10,
  },
  playerTitle: {
    fontSize: 18,
    fontWeight: "900",
  },
  playerChipText: {
    fontSize: 13,
    fontWeight: "900",
  },
  infoCard: {
    borderWidth: 2,
    borderRadius: 24,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "900",
  },
  infoBody: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    maxWidth: 220,
  },
  playerCountBadge: {
    minWidth: 92,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  playerCountValue: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "900",
  },
  playerCountLabel: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  seriesCard: {
    borderWidth: 2,
    borderRadius: 24,
    padding: 18,
    gap: 6,
    alignItems: "center",
  },
  seriesEyebrow: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  seriesTitle: {
    fontSize: 28,
    fontWeight: "900",
  },
});
