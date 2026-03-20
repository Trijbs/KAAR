# KAAR

KAAR is an internal multiplayer finger-selection party app prototype for touch screens. It is inspired by chaotic creator-party energy, but all visuals and logic in this repo are original and designed so licensed collaboration assets can be dropped in later.

## Product brief

KAAR solves the awkward "who goes first / who loses / who teams up" moment in party settings with a high-energy touch ritual:

- Everyone places a finger on the arena.
- The room locks in.
- A dramatic reveal selects the outcome.
- The group instantly replays for the next round.

The core fun loop is tactile setup, social suspense, and exaggerated reveal feedback. The replay loop is one tap: reset, place fingers again, run the next mode.

## Stack choice

Expo React Native is the right fit for this prototype.

- It is the fastest route to a runnable cross-platform mobile prototype.
- React Native gives direct access to multi-touch responder events for the finger arena.
- Expo keeps the prototype lightweight for theme swaps, haptics, offline behavior, and future asset pipelines.

## Feature map

Implemented in this pass:

- Instant-play home screen
- Finger arena with multi-touch tracking
- Game modes: winner, loser, multiple winners, teams, elimination
- Fair random logic separated from chaos logic
- Visible Chaos Mode with explicit influence controls
- Reveal card and replay loop
- Settings for sound and vibration
- Dark mode toggle
- Theme system with `prototype` and `collab` themes
- Session history
- Local persistence for settings, theme, and history
- Editable nicknames after lock-in
- Best-of round tracking with scoreboard
- Original dare prompts for loser and elimination reveals
- Native share result action
- Locked finger positions preserved on reveal
- Suspense-first reveal animation pass
- Continue button for elimination rounds
- Live player count and clearer onboarding card
- Pre-lock countdown for party readability
- Reduced-motion aware animation behavior
- Theme asset slot layer for future licensed overlays and sound packs
- EAS build scaffold and mobile package identifiers
- Original local sound pack wired through Expo audio
- Proper best-of series summary and reset flow
- Original placeholder icon, adaptive icon, and splash assets
- Offline-first behavior with no runtime network dependency

Planned next:

- Editable nicknames per player
- Generated hype audio assets
- Best-of match flow
- Punishments / dares deck
- Shareable result card

## UX flow

1. Open app into the home screen and land directly in the arena.
2. Choose a mode in one horizontal swipe.
3. Keep fair mode on by default or visibly switch into Chaos Mode.
4. Everyone touches the arena.
5. Lock players.
6. Hit reveal for the suspense moment.
7. View results, teams, or elimination outcome.
8. Replay instantly.

## Design system

### Visual direction

- Loud, saturated gradients
- Heavy typography with oversized headings
- Rounded cards with bold outlines
- Fast, pulsing motion and spotlighted touch blobs
- Original creator-party tone without copying real assets

### Color system

- `electricLime`: spotlight energy
- `hyperCoral`: loud action color
- `laserBlue`: contrast accent
- `warningPink`: chaos indicator
- `ultravioletInk`: default dark canvas

### Motion system

- Quick UI response: `180ms`
- Standard transitions: `320ms`
- Suspense reveal rhythm: `900ms`

## Theme system

- `prototype`: the default original visual language in this repo
- `collab`: intentionally neutral placeholders for future licensed swap-ins

The collab theme changes tokens only. It does not ship any third-party assets.

## Project scaffold

```text
KAAR/
  App.tsx
  src/
    components/
    features/
      arena/
      game/
      settings/
    lib/
    theme/
    types/
  docs/
    ASSET_SWAP_GUIDE.md
  tests/
```

## Architecture notes

- Fair randomness lives in [`src/features/game/random.ts`](/Users/trijbs/KAAR/src/features/game/random.ts)
- Chaos logic lives in [`src/features/game/chaos.ts`](/Users/trijbs/KAAR/src/features/game/chaos.ts)
- Game resolution lives in [`src/features/game/selection.ts`](/Users/trijbs/KAAR/src/features/game/selection.ts)
- Touch handling lives in [`src/features/arena/useTouchArena.ts`](/Users/trijbs/KAAR/src/features/arena/useTouchArena.ts)
- Theme switching lives in [`src/theme/ThemeProvider.tsx`](/Users/trijbs/KAAR/src/theme/ThemeProvider.tsx)

## Mandatory requirement handling

- Default mode is fair and unbiased
- Chaos Mode is off by default
- Chaos Mode is visibly labeled `Influenced Mode Active`
- Influenced selection paths are separated in code from fair selection paths
- No hidden manipulation in fair mode

## QA plan

Covered now:

- Pure logic tests for fair and influenced selection
- Pure logic tests for round tracking and series winners
- Manual checks for replay flow, theme switching, and lock/reveal loop

Still required on device:

- 3 to 8 finger stress test on iOS
- 3 to 8 finger stress test on Android
- Rotation and notch safe area checks
- Haptic tuning

## Roadmap

### Phase 1

- Finish the polished reveal animation layer
- Add editable nicknames
- Add best-of rounds and dare prompts

### Phase 2

- Add generated original audio pack
- Add local persistence for settings and session history
- Add shareable result summary

### Phase 3

- Add placeholder collab asset slots for motion packs and overlays
- Add accessibility pass for larger text and reduced motion

## Run

```bash
npm install
npm run start
```

## Deliverables status

- Product brief: complete
- Feature map: complete
- UX flow: complete
- Design system: complete
- Theme system: complete
- Project scaffold: complete
- Core screens: initial slice complete
- Touch engine: initial slice complete
- Game logic: initial slice complete
- README: complete
- Asset swap guide: complete
- Test plan: included below and in tests
- Roadmap: complete
