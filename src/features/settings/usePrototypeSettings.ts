import { useState } from "react";

export function usePrototypeSettings() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  return {
    soundEnabled,
    vibrationEnabled,
    setSoundEnabled,
    setVibrationEnabled,
  };
}
