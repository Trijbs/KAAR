import { StyleSheet, Text, View } from "react-native";
import type { Player, ScoreboardEntry } from "@/types/game";
import { getWinningThreshold } from "@/lib/rounds";
import { useTheme } from "@/theme/ThemeProvider";

interface ScoreboardCardProps {
  scoreboard: ScoreboardEntry[];
  players: Player[];
  bestOf: 1 | 3 | 5;
}

export function ScoreboardCard({ scoreboard, players, bestOf }: ScoreboardCardProps) {
  const { theme } = useTheme();
  const playerMap = players.reduce<Record<string, Player>>((accumulator, player) => {
    accumulator[player.id] = player;
    return accumulator;
  }, {});

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Best of {bestOf}</Text>
      <Text style={[styles.helper, { color: theme.colors.textMuted }]}>
        First to {getWinningThreshold(bestOf)} points wins the series.
      </Text>
      <View style={styles.list}>
        {scoreboard.map((entry) => (
          <View key={entry.playerId} style={[styles.row, { backgroundColor: theme.colors.panelAlt }]}>
            <View style={[styles.swatch, { backgroundColor: playerMap[entry.playerId]?.color ?? theme.colors.accent }]} />
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {playerMap[entry.playerId]?.label ?? entry.playerId}
            </Text>
            <Text style={[styles.points, { color: theme.colors.accent }]}>{entry.points}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 24,
    padding: 18,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
  },
  helper: {
    fontSize: 13,
    fontWeight: "700",
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
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
  },
  points: {
    fontSize: 18,
    fontWeight: "900",
  },
});
