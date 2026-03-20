import { Modal, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import type { ThemeName } from "@/types/game";
import { useTheme } from "@/theme/ThemeProvider";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  bestOf: 1 | 3 | 5;
  onSoundChange: (enabled: boolean) => void;
  onVibrationChange: (enabled: boolean) => void;
  onBestOfChange: (value: 1 | 3 | 5) => void;
  themeName: ThemeName;
}

export function SettingsModal(props: SettingsModalProps) {
  const { theme, toggleDarkMode, isDark, setThemeName } = useTheme();

  return (
    <Modal visible={props.visible} animationType="slide" transparent onRequestClose={props.onClose}>
      <View style={styles.scrim}>
        <View style={[styles.panel, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
          <SettingRow
            label="Sound Effects"
            value={props.soundEnabled}
            onChange={props.onSoundChange}
            textColor={theme.colors.text}
          />
          <SettingRow
            label="Vibration"
            value={props.vibrationEnabled}
            onChange={props.onVibrationChange}
            textColor={theme.colors.text}
          />
          <SettingRow label="Dark Mode" value={isDark} onChange={toggleDarkMode} textColor={theme.colors.text} />

          <View style={styles.bestOfSection}>
            <Text style={[styles.rowLabel, { color: theme.colors.text }]}>Series length</Text>
            <View style={styles.themeRow}>
              {[1, 3, 5].map((value) => (
                <Pressable
                  key={value}
                  onPress={() => props.onBestOfChange(value as 1 | 3 | 5)}
                  style={[
                    styles.themeChip,
                    {
                      backgroundColor: props.bestOf === value ? theme.colors.accent : theme.colors.panelAlt,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: props.bestOf === value ? theme.colors.background : theme.colors.text,
                      fontWeight: "800",
                    }}
                  >
                    Best of {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.themeRow}>
            {(["prototype", "collab"] as const).map((name) => (
              <Pressable
                key={name}
                onPress={() => setThemeName(name)}
                style={[
                  styles.themeChip,
                  {
                    backgroundColor: props.themeName === name ? theme.colors.accent : theme.colors.panelAlt,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: props.themeName === name ? theme.colors.background : theme.colors.text,
                    fontWeight: "800",
                  }}
                >
                  {name === "prototype" ? "Prototype Theme" : "Collab Theme"}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable onPress={props.onClose} style={[styles.close, { backgroundColor: theme.colors.accent }]}>
            <Text style={[styles.closeText, { color: theme.colors.background }]}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function SettingRow(props: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  textColor: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: props.textColor }]}>{props.label}</Text>
      <Switch value={props.value} onValueChange={props.onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: "rgba(10, 12, 20, 0.45)",
    justifyContent: "flex-end",
  },
  panel: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 2,
    padding: 20,
    gap: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  themeRow: {
    flexDirection: "row",
    gap: 12,
  },
  bestOfSection: {
    gap: 10,
  },
  themeChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  close: {
    marginTop: 6,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  closeText: {
    fontSize: 15,
    fontWeight: "900",
  },
});
