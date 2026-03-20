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

Add original or licensed sounds through a future `src/features/audio/` module. Keep sound playback driven by settings and reveal state, not hardwired into UI components.

### Typography

When licensed fonts are available, add them through Expo font loading and map them in one place in the theme layer.

## Guardrails

- Keep all partner assets isolated to the collab theme.
- Preserve the prototype theme as the clean fallback.
- Never mix fairness logic with collab styling logic.
