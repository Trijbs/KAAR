export const palette = {
  electricLime: "#d7ff3f",
  hyperCoral: "#ff5d73",
  laserBlue: "#33d6ff",
  acidOrange: "#ff9d2e",
  ultravioletInk: "#11131d",
  midnightSmoke: "#191d2b",
  cloudWhite: "#f6f7fb",
  graphite: "#2f3343",
  neonMint: "#4cffb2",
  warningPink: "#ff3dbb",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 28,
  pill: 999,
};

export const typography = {
  display: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900" as const,
    letterSpacing: -1,
  },
  title: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "800" as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  micro: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
  },
};

export const motion = {
  quick: 180,
  medium: 320,
  suspense: 900,
};
