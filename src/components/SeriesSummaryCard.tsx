import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import type { Player, ScoreboardEntry } from "@/types/game";
import { getSeriesRoundsPlayed, getSeriesStandings, getWinningThreshold } from "@/lib/rounds";
import { useTheme } from "@/theme/ThemeProvider";

interface SeriesSummaryCardProps {
  winner: Player;
  scoreboard: ScoreboardEntry[];
  players: Player[];
  bestOf: 1 | 3 | 5;
  onReset: () => void;
}

export function SeriesSummaryCard({ winner, scoreboard, players, bestOf, onReset }: SeriesSummaryCardProps) {
  const { theme } = useTheme();
  const standings = getSeriesStandings(scoreboard, players);
  const roundsPlayed = getSeriesRoundsPlayed(scoreboard);

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
      <View style={[styles.hero, { backgroundColor: winner.color }]}>
        <Text style={[styles.eyebrow, { color: theme.colors.background }]}>Series Complete</Text>
        <Text style={[styles.winnerName, { color: theme.colors.background }]}>{winner.label}</Text>
        <Text style={[styles.helper, { color: theme.colors.background }]}>
          Reached {getWinningThreshold(bestOf)} wins in {roundsPlayed} round{roundsPlayed === 1 ? "" : "s"}.
        </Text>
      </View>

      <View style={styles.list}>
        {standings.map((entry) => (
          <View key={entry.playerId} style={[styles.row, { backgroundColor: theme.colors.panelAlt }]}>
            <Text style={[styles.rank, { color: theme.colors.accent }]}>
              {standings.findIndex((item) => item.playerId === entry.playerId) + 1}
            </Text>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {entry.player?.label ?? entry.playerId}
            </Text>
            <Text style={[styles.points, { color: theme.colors.text }]}>{entry.points} pts</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          onPress={() =>
            Share.share({
              message: `${winner.label} won the KAAR best-of-${bestOf} series in ${roundsPlayed} rounds.`,
            })
          }
          style={[styles.secondaryButton, { borderColor: theme.colors.border }]}
        >
          <Text style={[styles.secondaryText, { color: theme.colors.text }]}>Share Series</Text>
        </Pressable>
        <Pressable onPress={onReset} style={[styles.primaryButton, { backgroundColor: theme.colors.accent }]}>
          <Text style={[styles.primaryText, { color: theme.colors.background }]}>New Series</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 26,
    padding: 18,
    gap: 14,
  },
  hero: {
    borderRadius: 22,
    padding: 16,
    gap: 4,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  winnerName: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "900",
  },
  helper: {
    fontSize: 13,
    fontWeight: "800",
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  rank: {
    width: 24,
    fontSize: 16,
    fontWeight: "900",
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
  },
  points: {
    fontSize: 13,
    fontWeight: "900",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 12,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: "900",
  },
  primaryButton: {
    flex: 1,
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 12,
  },
  primaryText: {
    fontSize: 14,
    fontWeight: "900",
  },
});
