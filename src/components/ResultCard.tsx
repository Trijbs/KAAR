import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import type { GameResult, Player } from "@/types/game";
import { useTheme } from "@/theme/ThemeProvider";

interface ResultCardProps {
  result: GameResult | null;
  players: Player[];
  dare?: string | null;
}

export function ResultCard({ result, players, dare }: ResultCardProps) {
  const { theme } = useTheme();
  if (!result) {
    return null;
  }

  const playerById = players.reduce<Record<string, Player>>((accumulator, player) => {
    accumulator[player.id] = player;
    return accumulator;
  }, {});
  const isEliminationFinal = result.mode === "elimination" && result.highlightedIds.length === 1;
  const champion = isEliminationFinal ? playerById[result.highlightedIds[0]] : null;
  const shareMessage = isEliminationFinal
    ? `${result.title}\n${result.subtitle}\nChampion: ${champion?.label ?? "Unknown"}`
    : `${result.title}\n${result.subtitle}`;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
      {champion ? (
        <View style={[styles.championCard, { backgroundColor: champion.color }]}>
          <Text style={[styles.championEyebrow, { color: theme.colors.background }]}>Final Showdown Winner</Text>
          <Text style={[styles.championName, { color: theme.colors.background }]}>{champion.label}</Text>
        </View>
      ) : null}

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
              <View style={styles.teamBadgeRow}>
                {team.playerIds.map((id) => (
                  <View
                    key={id}
                    style={[styles.miniBadge, { backgroundColor: playerById[id]?.color ?? theme.colors.accent }]}
                  >
                    <Text style={[styles.miniBadgeText, { color: theme.colors.background }]}>
                      {playerById[id]?.label ?? id}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {dare ? (
        <View style={[styles.dareCard, { backgroundColor: theme.colors.panelAlt }]}>
          <Text style={[styles.dareEyebrow, { color: theme.colors.accent }]}>Party dare</Text>
          <Text style={[styles.dareText, { color: theme.colors.text }]}>{dare}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={() =>
          Share.share({
            message: shareMessage,
          })
        }
        style={[styles.shareButton, { borderColor: theme.colors.border }]}
      >
        <Text style={[styles.shareText, { color: theme.colors.text }]}>Share Result</Text>
      </Pressable>
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
  championCard: {
    borderRadius: 22,
    padding: 16,
    gap: 4,
  },
  championEyebrow: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  championName: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "900",
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
  dareCard: {
    borderRadius: 20,
    padding: 14,
    gap: 6,
  },
  dareEyebrow: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dareText: {
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
  },
  teamCard: {
    borderRadius: 20,
    padding: 14,
    gap: 10,
  },
  teamTitle: {
    fontSize: 14,
    fontWeight: "900",
  },
  teamBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  miniBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  miniBadgeText: {
    fontSize: 12,
    fontWeight: "900",
  },
  shareButton: {
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 12,
  },
  shareText: {
    fontSize: 14,
    fontWeight: "900",
  },
});
