import { ScrollView, Pressable, StyleSheet, Text, View } from "react-native";
import type { GameMode } from "@/types/game";
import { useTheme } from "@/theme/ThemeProvider";

const MODES: Array<{ mode: GameMode; label: string; helper: string }> = [
  { mode: "winner", label: "Winner", helper: "Single champion" },
  { mode: "loser", label: "Loser", helper: "One doomed finger" },
  { mode: "multiple-winners", label: "Multiple", helper: "Two lucky players" },
  { mode: "teams", label: "Teams", helper: "Split the room" },
  { mode: "elimination", label: "Elimination", helper: "Round-by-round knockout" },
];

interface ModeSelectorProps {
  value: GameMode;
  onChange: (mode: GameMode) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: theme.colors.textMuted }]}>Pick the chaos format</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {MODES.map((item) => {
          const active = item.mode === value;
          return (
            <Pressable
              key={item.mode}
              onPress={() => onChange(item.mode)}
              style={[
                styles.card,
                {
                  backgroundColor: active ? theme.colors.accent : theme.colors.panelAlt,
                  borderColor: active ? theme.colors.accentSecondary : theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.title, { color: active ? theme.colors.background : theme.colors.text }]}>
                {item.label}
              </Text>
              <Text style={[styles.helper, { color: active ? theme.colors.background : theme.colors.textMuted }]}>
                {item.helper}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    gap: 12,
    paddingRight: 20,
  },
  card: {
    width: 132,
    borderRadius: 22,
    borderWidth: 2,
    padding: 14,
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
  },
  helper: {
    fontSize: 12,
    fontWeight: "700",
  },
});
