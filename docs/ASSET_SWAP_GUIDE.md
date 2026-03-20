# Asset Swap Guide

This prototype is intentionally built without third-party brand assets.

## Current state

- Theme 1 `prototype` uses original gradients, colors, and copy.
- Theme 2 `collab` is a placeholder token set for future licensed collaboration assets.
- No logos, creator photos, thumbnails, or imported sound packs are bundled.

## Safe swap points

### Visual tokens

Replace colors and gradients in:

- [`src/theme/themes.ts`](/Users/trijbs/KAAR/src/theme/themes.ts)
- [`src/theme/tokens.ts`](/Users/trijbs/KAAR/src/theme/tokens.ts)

### Decorative assets

Future overlays, stickers, and sound packs should be introduced behind a theme adapter layer. Add references under `assets/` and read them from theme-specific config instead of importing directly inside screens.

Current theme asset slot definitions live in:

- [`src/theme/assets.ts`](/Users/trijbs/KAAR/src/theme/assets.ts)
- [`src/theme/themes.ts`](/Users/trijbs/KAAR/src/theme/themes.ts)

### Audio

Sound playback now routes through:

- [`src/features/audio/soundFx.ts`](/Users/trijbs/KAAR/src/features/audio/soundFx.ts)

The bundled prototype pack uses original generated `.wav` files in:

- [`assets/sounds/lock-in.wav`](/Users/trijbs/KAAR/assets/sounds/lock-in.wav)
- [`assets/sounds/reveal-rise.wav`](/Users/trijbs/KAAR/assets/sounds/reveal-rise.wav)
- [`assets/sounds/win-blast.wav`](/Users/trijbs/KAAR/assets/sounds/win-blast.wav)

Swap these through the theme asset layer and keep playback triggered by settings plus reveal state, not hardwired into ad hoc components.

### App packaging assets

Original generated packaging placeholders live in:

- [`assets/generated/icon.png`](/Users/trijbs/KAAR/assets/generated/icon.png)
- [`assets/generated/adaptive-icon.png`](/Users/trijbs/KAAR/assets/generated/adaptive-icon.png)
- [`assets/generated/splash.png`](/Users/trijbs/KAAR/assets/generated/splash.png)

These are safe internal placeholders and can be replaced later with licensed art.

### Typography

When licensed fonts are available, add them through Expo font loading and map them in one place in the theme layer.

## Guardrails

- Keep all partner assets isolated to the collab theme.
- Preserve the prototype theme as the clean fallback.
- Never mix fairness logic with collab styling logic.
