import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

interface NicknameModalProps {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => void;
}

export function NicknameModal({ visible, initialValue, onClose, onSave }: NicknameModalProps) {
  const { theme } = useTheme();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <View style={[styles.panel, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Rename player</Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="Enter nickname"
            placeholderTextColor={theme.colors.textMuted}
            style={[
              styles.input,
              {
                color: theme.colors.text,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.panelAlt,
              },
            ]}
            maxLength={18}
          />
          <View style={styles.row}>
            <Pressable onPress={onClose} style={[styles.secondary, { borderColor: theme.colors.border }]}>
              <Text style={[styles.secondaryText, { color: theme.colors.text }]}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onSave(value.trim() || initialValue)}
              style={[styles.primary, { backgroundColor: theme.colors.accent }]}
            >
              <Text style={[styles.primaryText, { color: theme.colors.background }]}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  panel: {
    borderWidth: 2,
    borderRadius: 24,
    padding: 18,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
  },
  input: {
    borderWidth: 2,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  secondary: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 14,
  },
  secondaryText: {
    fontWeight: "900",
    fontSize: 15,
  },
  primary: {
    flex: 1,
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 14,
  },
  primaryText: {
    fontWeight: "900",
    fontSize: 15,
  },
});
