import { StyleSheet, Text, View } from "react-native";
import type { GameResult, Player } from "@/types/game";
import { useTheme } from "@/theme/ThemeProvider";

interface ResultCardProps {
  result: GameResult | null;
  players: Player[];
}

export function ResultCard({ result, players }: ResultCardProps) {
  const { theme } = useTheme();
  if (!result) {
    return null;
  }

  const playerById = players.reduce<Record<string, Player>>((accumulator, player) => {
    accumulator[player.id] = player;
    return accumulator;
  }, {});

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{result.title}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{result.subtitle}</Text>

      <View style={styles.badgeRow}>
        {result.highlightedIds.map((id) => (
          <View key={id} style={[styles.badge, { backgroundColor: playerById[id]?.color ?? theme.colors.accent }]}>
            <Text style={[styles.badgeText, { color: theme.colors.background }]}>{playerById[id]?.label ?? id}</Text>
          </View>
        ))}
      </View>

      {result.teamAssignments ? (
        <View style={styles.teamGrid}>
          {result.teamAssignments.map((team) => (
            <View key={team.name} style={[styles.teamCard, { backgroundColor: theme.colors.panelAlt }]}>
              <Text style={[styles.teamTitle, { color: theme.colors.text }]}>{team.name}</Text>
              <Text style={[styles.teamPlayers, { color: theme.colors.textMuted }]}>
                {team.playerIds.map((id) => playerById[id]?.label ?? id).join(", ")}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 26,
    padding: 18,
    gap: 12,
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "900",
  },
  teamGrid: {
    gap: 10,
  },
  teamCard: {
    borderRadius: 20,
    padding: 14,
    gap: 4,
  },
  teamTitle: {
    fontSize: 14,
    fontWeight: "900",
  },
  teamPlayers: {
    fontSize: 13,
    fontWeight: "700",
  },
});
