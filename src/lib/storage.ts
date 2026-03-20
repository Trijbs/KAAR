import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppSettings, SessionHistoryItem, ThemeName } from "@/types/game";

const STORAGE_KEYS = {
  settings: "kaar/settings",
  history: "kaar/history",
  theme: "kaar/theme",
} as const;

const defaultSettings: AppSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  bestOf: 3,
};

export async function loadSettings() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.settings);
  if (!raw) {
    return defaultSettings;
  }
  return {
    ...defaultSettings,
    ...JSON.parse(raw),
  } as AppSettings;
}

export async function saveSettings(settings: AppSettings) {
  await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export async function loadHistory() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.history);
  if (!raw) {
    return [] as SessionHistoryItem[];
  }
  return JSON.parse(raw) as SessionHistoryItem[];
}

export async function saveHistory(history: SessionHistoryItem[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
}

export async function loadThemePreferences() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.theme);
  if (!raw) {
    return {
      isDark: true,
      themeName: "prototype" as ThemeName,
    };
  }
  return JSON.parse(raw) as { isDark: boolean; themeName: ThemeName };
}

export async function saveThemePreferences(preferences: { isDark: boolean; themeName: ThemeName }) {
  await AsyncStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(preferences));
}
