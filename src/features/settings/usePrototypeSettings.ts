import { useEffect, useState } from "react";
import { loadSettings, saveSettings } from "@/lib/storage";

export function usePrototypeSettings() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [bestOf, setBestOf] = useState<1 | 3 | 5>(3);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadSettings()
      .then((settings) => {
        setSoundEnabled(settings.soundEnabled);
        setVibrationEnabled(settings.vibrationEnabled);
        setBestOf(settings.bestOf);
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    saveSettings({ soundEnabled, vibrationEnabled, bestOf }).catch(() => undefined);
  }, [bestOf, hydrated, soundEnabled, vibrationEnabled]);

  return {
    soundEnabled,
    vibrationEnabled,
    bestOf,
    setSoundEnabled,
    setVibrationEnabled,
    setBestOf,
  };
}
