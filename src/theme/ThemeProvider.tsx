import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import type { ThemeName } from "@/types/game";
import { loadThemePreferences, saveThemePreferences } from "@/lib/storage";
import {
  collabDarkTheme,
  collabLightTheme,
  prototypeDarkTheme,
  prototypeLightTheme,
  type ThemeDefinition,
} from "./themes";

interface ThemeContextValue {
  theme: ThemeDefinition;
  isDark: boolean;
  themeName: ThemeName;
  toggleDarkMode: () => void;
  setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [isDark, setIsDark] = useState(true);
  const [themeName, setThemeName] = useState<ThemeName>("prototype");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadThemePreferences()
      .then((preferences) => {
        setIsDark(preferences.isDark);
        setThemeName(preferences.themeName);
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    saveThemePreferences({ isDark, themeName }).catch(() => undefined);
  }, [hydrated, isDark, themeName]);

  const theme = useMemo(() => {
    if (themeName === "collab") {
      return isDark ? collabDarkTheme : collabLightTheme;
    }
    return isDark ? prototypeDarkTheme : prototypeLightTheme;
  }, [isDark, themeName]);

  const value = useMemo(
    () => ({
      theme,
      isDark,
      themeName,
      toggleDarkMode: () => setIsDark((current) => !current),
      setThemeName,
    }),
    [isDark, theme, themeName],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return value;
}
