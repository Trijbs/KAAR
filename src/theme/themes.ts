import { palette, radius, spacing, typography, motion } from "./tokens";
import type { ThemeName } from "@/types/game";

export interface ThemeDefinition {
  name: ThemeName;
  isDark: boolean;
  colors: {
    background: string;
    panel: string;
    panelAlt: string;
    text: string;
    textMuted: string;
    accent: string;
    accentSecondary: string;
    success: string;
    danger: string;
    border: string;
    glow: string;
    chaos: string;
  };
  gradient: [string, string, string];
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  motion: typeof motion;
}

export const prototypeLightTheme: ThemeDefinition = {
  name: "prototype",
  isDark: false,
  colors: {
    background: palette.cloudWhite,
    panel: "#ffffff",
    panelAlt: "#eef1fb",
    text: "#141623",
    textMuted: "#5d6378",
    accent: palette.hyperCoral,
    accentSecondary: palette.laserBlue,
    success: palette.neonMint,
    danger: palette.warningPink,
    border: "#d7dbeb",
    glow: "rgba(255, 93, 115, 0.26)",
    chaos: "#fff1a6",
  },
  gradient: ["#fff1db", "#ffd7f3", "#c7f5ff"],
  spacing,
  radius,
  typography,
  motion,
};

export const prototypeDarkTheme: ThemeDefinition = {
  ...prototypeLightTheme,
  isDark: true,
  colors: {
    background: palette.ultravioletInk,
    panel: "#171a27",
    panelAlt: "#202538",
    text: "#f8f8ff",
    textMuted: "#a5acc9",
    accent: palette.electricLime,
    accentSecondary: palette.laserBlue,
    success: palette.neonMint,
    danger: palette.warningPink,
    border: "#32384e",
    glow: "rgba(215, 255, 63, 0.22)",
    chaos: "#574800",
  },
  gradient: ["#26152f", "#11131d", "#0d2c38"],
};

export const collabLightTheme: ThemeDefinition = {
  ...prototypeLightTheme,
  name: "collab",
  colors: {
    ...prototypeLightTheme.colors,
    accent: "#bcc6ff",
    accentSecondary: "#ffd8b2",
    glow: "rgba(188, 198, 255, 0.24)",
  },
  gradient: ["#f8f8f8", "#ece7ff", "#ffe8d7"],
};

export const collabDarkTheme: ThemeDefinition = {
  ...prototypeDarkTheme,
  name: "collab",
  colors: {
    ...prototypeDarkTheme.colors,
    accent: "#ccd2ff",
    accentSecondary: "#f8c786",
    glow: "rgba(204, 210, 255, 0.2)",
  },
  gradient: ["#101018", "#1a1730", "#2c1f1a"],
};
