const PARTY_NAMES = [
  "Chaos Fox",
  "Pixel Storm",
  "Turbo Lime",
  "Snack Attack",
  "Bass Drop",
  "Neon Goblin",
  "Drama Magnet",
  "Rizz Rocket",
];

export function createPlayerLabel(index: number) {
  return PARTY_NAMES[index % PARTY_NAMES.length];
}

export function createHistoryId() {
  return `${Date.now()}-${Math.round(Math.random() * 10000)}`;
}
