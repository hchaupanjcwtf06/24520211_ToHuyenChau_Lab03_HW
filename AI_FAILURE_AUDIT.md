# Lab 03 - AI Failure Audit

## 1. Homework 1 - Drum Kit

### AF-HW1-01: React Ref Access During Render

### Context
Commit 12 - Visual Decibel Meter integration.

### AI-Generated Failure
The generated DrumKit JSX accessed:

```tsx
engineRef.current?.getAnalyser()
```

during React rendering.

### Evidence
ESLint reported:

- Rule: react-hooks/refs
- File: src/components/DrumKit.tsx
- Error: Cannot access refs during render

### Root Cause
React refs are intended for mutable values outside
the rendering process.

Reading engineRef.current in JSX violates the
React Hooks purity rule enforced by ESLint.

### Correction
Introduced React state:

```tsx
const [analyser, setAnalyser] =
  useState<AnalyserNode | null>(null);
```

Updated the analyser from the audio playback handler
and passed the state value to DecibelMeter.

### Verification
- [X] ESLint passes after correction.
- [X] Production build passes.
- [X] Audio playback still works.
- [X] Decibel meter responds to audio.

### Status
Pending final verification.

## 2. Homework 2 - 88-Key Polyphonic Piano & Concurrent FIFO Sequencer

### AF-HW2-01: Unresumed AudioContext on Initial Interaction (Autoplay Policy)

### Context
Commit 22 - Connecting PolyphonicSynth audio engine to PianoKeyboard component.

### AI-Generated Failure
The generated `handleNoteOn` handler invoked `synthRef.current.noteOn(midi, freq)` synchronously without awaiting or resuming the `AudioContext`:

```tsx
const handleNoteOn = useCallback((midi: number) => {
  const noteInfo = noteLookup.get(midi);
  if (!noteInfo) return;

  if (synthRef.current) {
    synthRef.current.noteOn(midi, noteInfo.freq);
    setActiveVoiceCount(synthRef.current.getActiveVoiceCount());
  }
  // ...
}, [noteLookup]);
```

### Evidence
Browser playback remained silent on the very first key interactions.
Chrome DevTools Console reported:
- `The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page.`
Active voice state incremented (`1 / 8`), but no audio was output.

### Root Cause
Under modern browser Autoplay policies, `AudioContext` initializes in a `suspended` state. Calling `noteOn` without awaiting an explicit `resume()` causes quick pointer clicks to trigger `noteOff` and disconnect nodes before the audio thread transitions to `running`.

### Correction
Refactored `handleNoteOn` to be asynchronous, explicitly awaiting `synthRef.current.start()` upon user interaction prior to triggering `noteOn`:

```tsx
const handleNoteOn = useCallback(async (midi: number) => {
  const noteInfo = noteLookup.get(midi);
  if (!noteInfo) return;

  if (synthRef.current) {
    await synthRef.current.start();
    synthRef.current.noteOn(midi, noteInfo.freq);
    setActiveVoiceCount(synthRef.current.getActiveVoiceCount());
  }
  // ...
}, [noteLookup]);
```

### Verification
- [X] Audible sound renders immediately on first key interaction.
- [X] AudioContext transitions to 'running' state upon user gesture.
- [X] ESLint passes without errors.
- [X] Production build passes.

### Status
Resolved.

---

### AF-HW2-02: CSS Module Selector Mismatch & Accidental Key Alignment Drift

### Context
Commit 22 - 88-Key Piano layout and accidental black key positioning.

### AI-Generated Failure
The generated `PianoKeyboard.tsx` attempted to bind CSS Module class names that did not match `PianoKeyboard.module.css`:

```tsx
// Inside PianoKeyboard.tsx
<section className={styles.keyboardSection}>
  <div className={styles.keysContainer}>
    <ul className={styles.whiteKeysList}>...</ul>
    <ul className={styles.blackKeysList}>...</ul>
  </div>
</section>
```

Meanwhile, `PianoKeyboard.module.css` defined `.section`, `.keyboard`, `.whiteKeys`, and `.blackPosition`. Furthermore, `.blackPosition` lacked relative mathematical horizontal offsets.

### Evidence
The piano layout collapsed in the browser:
- Black keys dropped out of the flow or stacked over key index 0.
- Pointer clicks on natural keys were obstructed by unconfigured overlay dimensions.

### Root Cause
Class name divergence between JSX and scoped CSS modules prevented styles from applying. Additionally, piano accidental keys require programmatic horizontal displacement calculated against natural key indices: `left: calc(var(--white-index) * var(--white-key-width) - (var(--black-key-width) / 2))`.

### Correction
Synchronized all CSS class names between TSX and CSS modules (`styles.section`, `styles.keyboard`, `styles.whiteKeys`, `styles.blackKeys`, `styles.blackPosition`). Injected the dynamic `--white-index` CSS variable computed from preceding white keys, and applied `pointer-events: none` to the list container with `pointer-events: auto` to individual black key buttons.

### Verification
- [X] All 52 white keys and 36 black keys render in realistic piano alignment.
- [X] Accidental keys overlay precisely between natural key boundaries.
- [X] Click events register across both natural and accidental keys.
- [X] Production build passes.

### Status
Resolved.

---

### AF-HW2-03: Malformed Generic Syntax & Parameter Type Mismatch in Event Recorder

### Context
Commit 24 - FIFO note event recording hook (`usePianoRecorder.ts`).

### AI-Generated Failure
The generated TypeScript code contained malformed generic angle brackets and type mismatches in ref storage:

```typescript
// AI-generated syntax error:
const activeNoteStartsRef = useRef>(new Map());

// AI-generated type mismatch:
activeNoteStartsRef.current.set(midi, now); // Passing number into an ActiveNoteTiming map
```

### Evidence
TypeScript compiler (`tsc -b`) failed with errors:
- `Operator '>' cannot be applied to types '{ <T>(initialValue: T): RefObject<T>; ... }' and 'Map<any, any>'`
- `Argument of type 'number' is not assignable to parameter of type '{ startTime: number; deltaMs: number; }'`

### Root Cause
A typographical error omitted the opening angle bracket `<` on `useRef`, causing the TypeScript parser to interpret `>` as a greater-than binary comparison operator against the `useRef` function. Additionally, `recordNoteOn` passed a primitive timestamp (`number`) instead of the declared composite interface `{ startTime, deltaMs }`.

### Correction
Defined an explicit `ActiveNoteTiming` interface, fixed the generic instantiation to `useRef(new Map<number, ActiveNoteTiming>())`, and updated `recordNoteOn` to construct and store the full composite timing object:

```typescript
interface ActiveNoteTiming {
  readonly startTime: number;
  readonly deltaMs: number;
}

const activeNoteStartsRef = useRef(new Map<number, ActiveNoteTiming>());

activeNoteStartsRef.current.set(midi, {
  startTime: now,
  deltaMs,
});
```

### Verification
- [X] TypeScript compiler passes without errors (`npm run build`).
- [X] Automated timing unit test passes (`node scripts/check-recorder-timing.mjs`).
- [X] ESLint passes with zero warnings.

### Status
Resolved.

## 3. Homework 3 - KRAFTON x PUBG Vietnam Championship & Airdrop Arena

### AF-HW3-01: React 19 Render-Phase Impurity (`react-hooks/purity`) in Timer & App Initialization

### Context
Commit 31 & Commit 34 - Initializing dynamic target epoch timestamps for `usePubgAirdropTimer` and component layout.

### AI-Generated Failure
The generated code invoked `Date.now()` directly inside `useRef` initializers and `useMemo` hooks:

```tsx
// Inside usePubgAirdropTimer.ts:
const lastTickTimeRef = useRef<number>(Date.now());

// Inside App.tsx:
const timerTargets = useMemo(() => {
  const now = Date.now();
  return {
    warmupTargetEpochMs: now + 20_000,
    expireTargetEpochMs: now + 180_000,
  };
}, []);
```

### Evidence
ESLint and TypeScript build failed immediately under React 19 compiler rules:
- `error: Cannot call impure function during render. Date.now is an impure function. Calling an impure function can produce unstable results (react-hooks/purity).`

### Root Cause
React 19 strictly enforces pure render execution. `Date.now()` returns non-deterministic values across renders. Reading system time during JSX or hook evaluation breaks idempotent component rendering.

### Correction
1. In `usePubgAirdropTimer.ts`, initialized `lastTickTimeRef` to `null` and deferred timestamp assignment to `useEffect`.
2. In `App.tsx`, moved base timestamp calculations to top-level module scope constants evaluated once upon initial module evaluation:

```tsx
const INITIAL_NOW = Date.now();
const TIMER_TARGETS = {
  warmupTargetEpochMs: INITIAL_NOW + 20_000,
  expireTargetEpochMs: INITIAL_NOW + 180_000,
} as const;
```

### Verification
- [X] `npm run lint` passes with 0 errors and 0 warnings.
- [X] Production build compiles successfully.

### Status
Resolved.

---

### AF-HW3-02: Missing Unused Variable Pruning and State Propagation Typo

### Context
Commit 31 - Hook lifecycle modeling and airdrop status derivation.

### AI-Generated Failure
The generated hook imported unused types and declared an unreferenced parameter in the state updater:

```typescript
import type { AirdropPhase, AirdropTimerState } from '../types/pubg';

setTimerState(prev => {
  const next = calculateCurrentState();
  return { ...next, isStale };
});
```

### Evidence
TypeScript compiler (`tsc -b`) and ESLint reported:
- `TS6196: 'AirdropPhase' is declared but never used.`
- `TS6133: 'prev' is declared but its value is never read.`
- Build failed during `vite build` client packaging.

### Root Cause
The code generator imported unnecessary structural types that were already subsumed by `AirdropTimerState` and copied standard callback idioms without validating strict zero-unused-variable compiler flags (`@typescript-eslint/no-unused-vars`).

### Correction
Removed unused `AirdropPhase` type import. Refactored state dispatch to pass the computed state object directly without an unused arrow parameter:

```typescript
import type { AirdropTimerState } from '../types/pubg';

const next = calculateCurrentState();
setTimerState({
  ...next,
  isStale: drift > 250,
});
```

### Verification
- [X] `tsc -b` completes with 0 errors.
- [X] ESLint passes cleanly.

### Status
Resolved.

---

### AF-HW3-03: WCAG AA Color Contrast Failures and Default Mobile Viewport Horizontal Clipping

### Context
Commit 35 - 375px mobile responsiveness and Lighthouse Accessibility compliance.

### AI-Generated Failure
The default CSS styling produced by Vite combined with raw template classes caused two critical defects:
1. Low color contrast on badge tags (`badgeLive` used `#ffffff` on `#10b981`, contrast ratio 2.4:1; required >= 4.5:1).
2. Default `#root` and `body` rules inherited `display: flex; place-items: center;` without universal `box-sizing: border-box`, causing severe horizontal clipping on 375px iPhone SE viewports.

### Evidence
1. Lighthouse Accessibility score dropped to 96/100 due to contrast violations.
2. In Chrome DevTools 375px viewport mode, text overflowed outside the screen edges on both left and right sides.

### Root Cause
CSS styling prioritized decorative aesthetics over strict WCAG 2.2 AA contrast standards. The absence of a global reset and box-sizing normalization led to padding-induced viewport explosion.

### Correction
1. Applied high-contrast color pairings: `#022c22` dark text on `#10b981` green background (contrast 8.6:1), and high-legibility secondary text `#d1d5db`.
2. Normalized `box-sizing: border-box`, stripped centering flex layouts from `#root`, set root `overflow-x: hidden`, and added CSS media query columns for `.itemList`.

### Verification
- [X] Lighthouse Accessibility score: 100 / 100.
- [X] Mobile viewport 375px displays zero horizontal scrolling.
- [X] High-contrast visual inspection verified across all UI states.

### Status
Resolved.