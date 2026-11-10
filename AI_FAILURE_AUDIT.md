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