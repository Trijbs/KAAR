import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export function ChaosBanner() {
  const { theme } = useTheme();

  return (
    <View style={[styles.banner, { backgroundColor: theme.colors.chaos, borderColor: theme.colors.accent }]}>
      <Text style={[styles.eyebrow, { color: theme.colors.text }]}>Influenced Mode Active</Text>
      <Text style={[styles.body, { color: theme.colors.text }]}>
        Chaos Mode is visible, separate, and never disguised as fair random.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 20,
    padding: 14,
    gap: 4,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  body: {
    fontSize: 13,
    fontWeight: "700",
  },
});
