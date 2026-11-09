
# HW2 - 88-Key Polyphonic Piano & Concurrent FIFO Sequencer

## 1. Scope

Implement an 88-key piano using React 19, TypeScript,
Vite, CSS Modules, and the Web Audio API.

Requirements:
- Algorithmically generate MIDI 21-108 (A0-C8).
- Render 52 white and 36 black keys.
- Use accessible native buttons.
- Support up to 8 simultaneous oscillator voices.
- Steal the oldest active voice when the limit is exceeded.
- Apply smooth audio attack and release.
- Record MIDI note events and timing.
- Replay recordings at 0.5x, 1x, and 2x.
- Cancel playback using AbortController.
- Isolate PianoKey renders using React.memo.
- Verify 375px layout, accessibility and lifecycle cleanup.

## 2. Task Decomposition

### Phase 1 - Project Setup
- [x] T01: Create homework2 React 19 + Vite + TypeScript project.
- [x] T02: Verify dependencies, ESLint and production build.
- [x] T03: Review shared project-rules.md and Lab 02 bridge.
- [x] T04: Define implementation and verification plan.

### Phase 2 - Contracts and Piano Data
- [x] T05: Define PianoNote and PianoKey props contracts.
- [x] T06: Define PolyphonicSynth interface.
- [x] T07: Define recording and replay event contracts.
- [x] T08: Generate 88 MIDI notes algorithmically.
- [x] T09: Verify A0-C8 and 52/36 key counts.
- [x] T10: Implement MIDI-to-frequency calculation.

### Phase 3 - UI and Render Isolation
- [x] T11: Implement accessible PianoKey component.
- [x] T12: Implement 88-key piano layout.
- [x] T13: Add mouse and pointer interactions.
- [x] T14: Implement pressed-state management.
- [x] T15: Apply React.memo to PianoKey.
- [ ] T16: Verify render isolation using React Profiler.

### Phase 4 - Polyphonic Audio Engine
- [ ] T17: Create and resume AudioContext.
- [ ] T18: Implement oscillator and gain voice creation.
- [ ] T19: Implement eight-voice concurrency limit.
- [ ] T20: Implement FIFO voice stealing using Map.
- [ ] T21: Implement click-free note release envelope.
- [ ] T22: Implement engine disposal and voice cleanup.

### Phase 5 - Recording and Replay
- [ ] T23: Implement note event recording.
- [ ] T24: Capture durationMs and deltaMs.
- [ ] T25: Implement FIFO sequence playback.
- [ ] T26: Implement 0.5x, 1x and 2x replay.
- [ ] T27: Implement Stop Sequence cancellation.
- [ ] T28: Abort replay on component unmount.

### Phase 6 - Accessibility and Verification
- [ ] T29: Verify accessible names and button semantics.
- [ ] T30: Verify focus and keyboard interaction.
- [ ] T31: Verify responsive layout at 375px.
- [ ] T32: Verify eight simultaneous voices.
- [ ] T33: Verify ninth-note FIFO voice stealing.
- [ ] T34: Verify recording timing and replay order.
- [ ] T35: Verify cancellation and resource cleanup.
- [ ] T36: Verify React Profiler render isolation.
- [ ] T37: Run Lighthouse Accessibility audit.
- [ ] T38: Run ESLint and production build.
- [ ] T39: Inspect Console and React DevTools.

### Phase 7 - Documentation and Delivery
- [ ] T40: Record verified AI failures in root audit.
- [ ] T41: Document fixes and retest results.
- [ ] T42: Complete HW2 README.
- [ ] T43: Capture screenshots and test evidence.
- [ ] T44: Include HW2 evidence in submission PDF.
- [ ] T45: Verify Git history and final submission.

## 3. Architecture

- src/types/piano.ts: Piano and recording contracts.
- src/data/piano-notes.ts: Algorithmic note generation.
- src/audio/PolyphonicSynth.ts: Audio engine.
- src/components/PianoKey.tsx: Memoized key.
- src/components/PianoKeyboard.tsx: 88-key interface.
- src/components/Sequencer.tsx: Recording and replay.
- src/App.tsx: Composition and lifecycle.

## 4. AI Governance

- Follow ../project-rules.md.
- Contracts before implementation.
- No deprecated React APIs.
- Avoid div-soup and inaccessible controls.
- Record genuine AI failures in ../AI_FAILURE_AUDIT.md.
- Maintain atomic Git commits.
- Never claim tests passed without execution.

## 5. Progress Log

### Commit 17 - Project Initialization
Status: In progress.

Verification:
- [x] Vite scaffold generated.
- [x] Dependencies installed.
- [x] ESLint passed.
- [x] Production build passed.

Next: TypeScript contracts and MIDI note generation.

Commit 18 - Contracts and Piano Data:
- PianoNote, PianoKeyProps, RecordedNote contracts.
- PolyphonicSynthContract interface.
- Algorithmic generation of 88 keys.
- 52 white and 36 black notes verified.
- MIDI frequency calculations verified.
- Automated piano data tests passed.

Commit 19 - Piano Interface:
- Memoized PianoKey component implemented.
- 88-key interface created.
- Pointer and keyboard interactions implemented.
- Component location corrected to src/components/.
- React Profiler verification pending.