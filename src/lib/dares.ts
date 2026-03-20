export const DARES = [
  "Do your victory speech in full sports-commentator mode.",
  "Let the group assign your next snack combo.",
  "Trade your phone wallpaper for a chaotic color block for one hour.",
  "Narrate the next round like it is a championship final.",
  "Give the winner a dramatic intro song using only your voice.",
  "Post a harmless one-line compliment in the group chat.",
];

export function pickDare(seed: number) {
  return DARES[seed % DARES.length];
}
