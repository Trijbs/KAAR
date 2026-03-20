import { Audio } from "expo-av";

const SOUND_MAP = {
  lockIn: require("../../../assets/sounds/lock-in.wav"),
  revealRise: require("../../../assets/sounds/reveal-rise.wav"),
  winBlast: require("../../../assets/sounds/win-blast.wav"),
} as const;

let audioModeReady = false;

async function ensureAudioMode() {
  if (audioModeReady) {
    return;
  }

  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    allowsRecordingIOS: false,
    shouldDuckAndroid: true,
  });
  audioModeReady = true;
}

export async function playSoundEffect(name: keyof typeof SOUND_MAP, enabled: boolean) {
  if (!enabled) {
    return;
  }

  try {
    await ensureAudioMode();
    const { sound } = await Audio.Sound.createAsync(SOUND_MAP[name], { shouldPlay: true, volume: 0.8 });
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded || !status.didJustFinish) {
        return;
      }
      sound.unloadAsync().catch(() => undefined);
    });
  } catch {
    return;
  }
}
