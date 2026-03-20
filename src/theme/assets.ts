export interface ThemeAssetSet {
  wordmark: string;
  stickerLabel: string;
  hypeLabel: string;
  overlaySlot: string;
  soundPackSlot: string;
}

export const prototypeAssets: ThemeAssetSet = {
  wordmark: "KAAR Prototype",
  stickerLabel: "Original Energy Pack",
  hypeLabel: "Party Lab Visuals",
  overlaySlot: "prototype-overlay-slot",
  soundPackSlot: "prototype-sound-slot",
};

export const collabAssets: ThemeAssetSet = {
  wordmark: "KAAR Collab Slot",
  stickerLabel: "Licensed Sticker Slot",
  hypeLabel: "Collab Motion Slot",
  overlaySlot: "collab-overlay-slot",
  soundPackSlot: "collab-sound-slot",
};
