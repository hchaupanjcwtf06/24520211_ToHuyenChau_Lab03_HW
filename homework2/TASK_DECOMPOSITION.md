
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
- [x] T16: Verify render isolation using React Profiler.

### Phase 4 - Polyphonic Audio Engine
- [x] T17: Create and resume AudioContext.
- [x] T18: Implement oscillator and gain voice creation.
- [x] T19: Implement eight-voice concurrency limit.
- [x] T20: Implement FIFO voice stealing using Map.
- [x] T21: Implement click-free note release envelope.
- [x] T22: Implement engine disposal and voice cleanup.

### Phase 5 - Recording and Replay
- [x] T23: Implement note event recording.
- [x] T24: Capture durationMs and deltaMs.
- [x] T25: Implement FIFO sequence playback.
- [x] T26: Implement 0.5x, 1x and 2x replay.
- [x] T27: Implement Stop Sequence cancellation.
- [x] T28: Abort replay on component unmount.

### Phase 6 - Accessibility and Verification
- [ ] T29: Verify accessible names and button semantics.
- [ ] T30: Verify focus and keyboard interaction.
- [ ] T31: Verify responsive layout at 375px.
- [ ] T32: Verify eight simultaneous voices.
- [ ] T33: Verify ninth-note FIFO voice stealing.
- [x] T34: Verify recording timing and replay order.
- [x] T35: Verify cancellation and resource cleanup.
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

### Commit 18 - Contracts and Piano Data:
- PianoNote, PianoKeyProps, RecordedNote contracts.
- PolyphonicSynthContract interface.
- Algorithmic generation of 88 keys.
- 52 white and 36 black notes verified.
- MIDI frequency calculations verified.
- Automated piano data tests passed.

### Commit 19 - Piano Interface:
- Memoized PianoKey component implemented.
- 88-key interface created.
- Pointer and keyboard interactions implemented.
- Component location corrected to src/components/.
- React Profiler verification pending.

### Commit 20 - Polyphonic Audio Engine
Status: Completed.

Scope:
- T17: Create and resume AudioContext.
- T18: Implement oscillator and gain voice creation.
- T19: Enforce eight-voice concurrency limit.
- T20: Implement FIFO voice stealing using Map.

Implementation constraints:
- Follow PolyphonicSynthContract.
- Use Web Audio API.
- Maintain MIDI-based voice tracking.
- Reuse the AudioContext.
- Do not exceed eight active voices.

Verification:
- [x] AudioContext initializes successfully.
- [x] AudioContext resumes after user interaction.
- [x] Oscillator produces audible sound.
- [x] Maximum eight voices enforced.
- [x] Ninth note steals the oldest active voice.
- [x] ESLint passes.
- [x] Production build passes.

Next:
- Commit 21: Click-free release envelope and resource cleanup.

### Commit 21 - Click-Free Release Envelope & Resource Cleanup
Status: Completed.

Scope:
- T21: Click-free note release envelope using exponentialRampToValueAtTime.
- T22: Engine disposal and voice cleanup.

Implementation constraints:
- Avoid audio clicks/pops with smooth gain ramp.
- Disconnect nodes after release completes to prevent memory leaks.
- Safely close AudioContext on engine dispose.

Verification:
- [x] Attack ramp (10ms) and release ramp (50ms) implemented.
- [x] Audio nodes disconnected after release phase.
- [x] Automated test scripts passed (check-adsr-cleanup.mjs).
- [x] ESLint passes.
- [x] Production build passes.

Next:
- Commit 22: Connect polyphonic synth to 88-key piano keyboard.

### Commit 22 - Connect Polyphonic Synth to Piano Keyboard
Status: Completed.

Scope:
- Integrated PolyphonicSynth into PianoKeyboard component using useRef.
- Implemented deterministic lifecycle disposal in useEffect cleanup.
- Connected pointer/touch events to trigger noteOn and noteOff with O(1) frequency lookup.
- Added accessible status header with live voice count and last played note (<output role="status" aria-live="polite">).
- Corrected CSS Module bindings and absolute positioning for accidental black keys.

Verification:
- [x] Audio produces clean sound on key interaction.
- [x] Polyphony limit of 8 voices verified on live UI.
- [x] FIFO voice stealing verified when 9th key is triggered.
- [x] ESLint passes with zero warnings.
- [x] Production build passes.

Next:
- Commit 23: Verify render isolation with React Profiler.

### Commit 23 - Verify Render Isolation with React Profiler
Status: Completed.

Scope:
- T16: Profile 88-key piano rendering using React DevTools Profiler.
- Verified that pressing/releasing a single key re-renders only that specific PianoKey and its container.
- Confirmed the remaining 87 PianoKey instances stay memoized ("Did not render").

Verification:
- [x] React DevTools Profiler inspected.
- [x] "Highlight updates when components render" verified in browser.
- [x] 87 sibling keys remain isolated without re-renders.

Next:
- Commit 24: Implement FIFO note event recording (T23, T24).

### Commit 24 - Note Event Recording & FIFO Timing Capture
Status: Completed.

Scope:
- T23: Implemented usePianoRecorder hook managing recording states (isRecording, recordedNotes).
- T24: Captured deltaMs and durationMs using performance.now() without drifting.
- Verified FIFO note capture according to RecordedNote contract.

Verification:
- [x] Automated timing and sequence tests passed (check-recorder-timing.mjs).
- [x] ESLint passes with zero warnings.
- [x] Production build passes.

Next:
- Commit 25: Variable-speed replay engine with AbortController (T25-T28).

### Commit 25 - Variable-Speed Replay Engine with AbortController
Status: Completed.

Scope:
- T25: Implemented sequential FIFO melody playback in usePianoPlayback hook.
- T26: Added speed multipliers (0.5x, 1x, 2x) scaling deltaMs and durationMs.
- T27: Implemented instant cancellation mechanism using W3C AbortController and AbortSignal.
- T28: Bound deterministic abort cleanup in useEffect return on unmount.

Verification:
- [x] Automated FIFO playback test passed (check-playback-abort.mjs).
- [x] AbortController instant cancellation verified without promise leakage.
- [x] Variable speeds (0.5x, 1x, 2x) verified.
- [x] ESLint passes with zero warnings.
- [x] Production build passes.

Next:
- Commit 26: Sequencer UI controls and end-to-end integration.

### Commit 26 - Sequencer UI Controls & End-to-End Integration
Status: Completed.

Scope:
- Built accessible Sequencer component with semantic W3C markup (<fieldset>, <legend>, <button type="button">, <output>).
- Integrated usePianoRecorder and usePianoPlayback into PianoKeyboard component.
- Connected live keyboard triggers to recorder buffer and automated replay loop.
- Verified variable speeds (0.5x, 1x, 2x) and instantaneous AbortController cancellation on live UI.

Verification:
- [x] End-to-end manual test of recording, playback order, and key highlighting passed.
- [x] AbortController halts replay immediately on Stop Replay.
- [x] ESLint passes with zero warnings.
- [x] Production build passes.

Next:
- Commit 27: Keyboard navigation and WCAG 2.2 AA accessibility verification (T29, T30, T31).