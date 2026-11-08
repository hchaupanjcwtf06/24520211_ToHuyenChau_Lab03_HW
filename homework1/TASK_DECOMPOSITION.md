
# Lab 03 - Homework 1: Production Studio Drum Kit

## 1. Project Information

- Course: Web Application Development
- Homework: Lab 03 - HW1
- Project: Production Studio Drum Kit
- Technology: React 19, Vite, TypeScript
- Accessibility Target: WCAG 2.2 AA
- Lighthouse Accessibility Target: 100
- Status: Initial Planning
- Planning Version: 0.1

## 2. Project Objective

Build an accessible, responsive Drum Kit application using React 19.

The application must support seven keyboard-controlled drum pads,
visual feedback, an accessible hit history, and a visual audio meter.

The implementation must follow modern React practices, preserve
state integrity, and properly clean up external resources.

## 3. Lab 02 Continuity

### 3.1 Lab 02 HW1 - DataGrid

Review and reuse applicable engineering techniques:

- Keyboard interaction with onKeyDown
- Focus management using useRef
- Keyboard event default prevention
- Accessible labels and ARIA attributes
- React state management
- TypeScript component contracts

### 3.2 Lab 02 HW2 - Audio Engine

Review applicable audio concepts:

- Audio playback architecture
- Audio resource management
- Web Audio API
- Cleanup and lifecycle handling

Do not directly copy unrelated DataGrid logic into Drum Kit.

## 4. Functional Requirements

- FR-01: Display seven drum pads (W, A, S, D, J, K, L).
- FR-02: Trigger corresponding drum sounds.
- FR-03: Support physical keyboard codes using e.code.
- FR-04: Handle keydown and keyup correctly.
- FR-05: Prevent repeated triggers from held keys.
- FR-06: Ignore drum shortcuts while typing in form controls.
- FR-07: Provide accessible drum pad buttons.
- FR-08: Show active pad visual feedback.
- FR-09: Display an accessible visual hit history.
- FR-10: Display a visual decibel meter.
- FR-11: Remove listeners and release resources correctly.

## 5. Non-Functional Requirements

- NFR-01: Use React 19 functional components.
- NFR-02: Use Vite and TypeScript.
- NFR-03: Use semantic HTML.
- NFR-04: Follow WCAG 2.2 AA.
- NFR-05: Target Lighthouse Accessibility 100.
- NFR-06: Support 375px responsive layouts.
- NFR-07: Prevent horizontal overflow at 375px.
- NFR-08: Avoid deprecated React APIs.
- NFR-09: Use immutable state updates.
- NFR-10: Provide deterministic effect cleanup.
- NFR-11: Avoid unnecessary state and effects.
- NFR-12: Document AI-assisted development and verification.

## 6. Task Decomposition

### Phase 1 - Planning and Governance

- [x] T01: Create initial TASK_DECOMPOSITION.md.
- [x] T02: Inspect existing Lab 02 HW1 source.
- [x] T03: Review applicable Lab 02 HW2 audio code.
- [x] T04: Define React 19 engineering rules.
- [x] T05: Create project-rules.md.
- [x] T06: Define acceptance criteria and test strategy.

### Phase 2 - Project Setup

- [x] T07: Initialize React 19 + Vite + TypeScript.
- [x] T08: Configure project structure.
- [x] T09: Verify development server.
- [x] T10: Verify lint and production build.

### Phase 3 - Contracts and Architecture

- [x] T11: Define DrumPad TypeScript interface.
- [x] T12: Define stable pad IDs and physical key mapping.
- [x] T13: Define audio engine contract.
- [x] T14: Define hit history and visual state contracts.
- [x] T15: Define component responsibilities.

### Phase 4 - Drum Kit UI

- [x] T16: Implement semantic page structure.
- [x] T17: Implement reusable DrumPad component.
- [x] T18: Implement seven-pad layout.
- [x] T19: Implement active pad visual feedback.
- [x] T20: Implement responsive styles.

### Phase 5 - Keyboard and Audio Engine

- [x] T21: Implement e.code keyboard mapping.
- [x] T22: Implement keydown and keyup listeners.
- [x] T23: Implement anti-repeat guard.
- [x] T24: Implement form input focus isolation.
- [x] T25: Implement audio playback.
- [x] T26: Implement resource and listener cleanup.

### Phase 6 - Accessibility and Visualization

- [x] T27: Implement accessible button names.
- [x] T28: Implement aria-pressed state.
- [x] T29: Implement visual hit history.
- [x] T30: Implement output with aria-live="polite".
- [x] T31: Implement visual decibel meter.
- [x] T32: Verify keyboard focus and interaction.

### Phase 7 - Testing and Verification

- [x] T33: Test all seven drum pads.
- [x] T34: Test keydown, keyup, and key holding.
- [x] T35: Test input focus isolation.
- [x] T36: Test listener and audio cleanup.
- [x] T37: Test 375px responsive layout.
- [x] T38: Run Lighthouse Accessibility audit.
- [x] T39: Inspect browser console and React DevTools.
- [ ] T40: Document at least three verified AI failure cases.
- [x] T41: Fix and retest identified problems.

### Phase 8 - Documentation and Submission

- [ ] T42: Complete README.md.
- [ ] T43: Finalize project-rules.md.
- [ ] T44: Finalize AI_FAILURE_AUDIT.md.
- [ ] T45: Capture application screenshots.
- [ ] T46: Capture testing and audit evidence.
- [ ] T47: Combine screenshots into one PDF.
- [ ] T48: Verify Git history and final repository.
- [ ] T49: Verify submission completeness.

## 7. Git Commit Strategy

Use atomic commits aligned with verified task groups.

Planned commit groups:

- C01: Initial task decomposition
- C02: Lab 02 continuity audit
- C03: Governance rules and contracts
- C04: React 19 project initialization
- C05: Drum Pad data and TypeScript contracts
- C06: Semantic application structure
- C07: Reusable DrumPad component
- C08: Responsive Drum Kit layout
- C09: Keyboard event handling
- C10: Audio engine implementation
- C11: Keyboard and audio cleanup
- C12: Hit history and accessibility
- C13: Visual decibel meter
- C14: Functional and accessibility verification
- C15: AI failure audit and fixes
- C16: Documentation and submission evidence

Commit groups are a plan, not a fixed limit.
Only commit actual, coherent, verified changes.

## 8. Verification Policy

For each implementation task:

1. Implement one small feature.
2. Run relevant checks.
3. Verify the behavior.
4. Update this task decomposition.
5. Create an atomic Git commit.
6. Continue to the next task.

Do not mark a task as complete without evidence.

## 9. Submission Evidence

Prepare one PDF containing:

- Final desktop UI screenshot
- Final 375px mobile UI screenshot
- Keyboard interaction evidence
- Visual hit history and meter evidence
- Lighthouse Accessibility result
- Relevant DevTools verification screenshots
- Git commit history evidence

The PDF evidence package is an additional submission requirement.

## 10. Progress Log

### Version 0.1 - Initial Planning

- Defined homework scope.
- Identified Lab 02 continuity requirements.
- Decomposed development into eight phases.
- Defined initial verification and commit strategy.

Current status: Planning in progress.
Implementation has not started.

### Version 0.2 - Lab 02 Code Audit

- Completed DataGrid source audit.
- Completed Audio Engine source audit.
- Completed Visualizer and FIFO Queue audit.
- Identified polyphony limitation in the old AudioEngine.
- Decided to implement independent drum hit playback.
- Recorded initial architecture decisions.

Completed tasks: T01, T02, T03.
Next tasks: T04, T05, T06.

## 11. Lab 02 Source Code Audit

### 11.1. Audit Scope

Reviewed source files:

- Lab02/homework1/src/components/DataGrid.tsx
- Lab02/homework1/src/types/grid.ts
- Lab02/homework2/src/audio-engine.ts
- Lab02/homework2/src/Visualizer.tsx
- Lab02/homework2/src/audio-task-queue.ts

Audit method: Source inspection.

Runtime behavior has not yet been independently verified.

### 11.2. DataGrid Audit Results

Reusable engineering patterns:

- useState for independent component state.
- useRef for persistent references.
- useId for accessible control identification.
- onKeyDown for keyboard handling.
- preventDefault for appropriate keyboard interactions.
- aria-label for accessible names.
- aria-live="polite" for status announcements.
- Immutable array updates.
- TypeScript interfaces for component contracts.

Important differences:

- DataGrid uses event.key for navigation.
- Drum Kit requires event.code for physical key mapping.
- DataGrid manages complex cell focus.
- Drum Kit should primarily use native button navigation.
- DataGrid does not implement global keyboard listener cleanup.

Decision:

Reuse engineering principles, not DataGrid-specific logic.

### 11.3. Audio Engine Audit Results

Reusable architecture:

- Lazy AudioContext initialization.
- AudioContext.resume() after interaction.
- AudioBufferSourceNode playback.
- GainNode volume control.
- AnalyserNode integration.
- AbortController-based cancellation.
- Explicit audio resource disposal.

Identified architectural limitation:

The original AudioEngine stores only one activeSource reference.

This does not provide complete tracking of multiple
simultaneously active audio sources.

HW1 decision:

Implement a polyphonic audio engine with a collection
of active AudioBufferSourceNode instances.

### 11.4. Visualizer Audit Results

Reusable patterns:

- useRef for Canvas DOM access.
- requestAnimationFrame for visual updates.
- cancelAnimationFrame during cleanup.
- Direct Canvas drawing to avoid frequent React renders.
- AnalyserNode frequency data access.

Important distinction:

Frequency data normalized to 0-255 is not directly
a decibel measurement.

HW1 must define an explicit meter calculation and
reference level before implementation.

### 11.5. Audio Task Queue Audit Results

The existing AudioTaskQueue uses serialized FIFO execution.

Decision:

Do not serialize live drum hits through this queue.

Reason:

Drum Kit requires simultaneous audio playback and
low-latency response to independent key presses.

The existing queue may remain a learning reference
for cancellation and resource management.

### 11.6. HW1 Architectural Decisions

- AD-01: Use React 19 functional components.
- AD-02: Use TypeScript contracts before implementation.
- AD-03: Use physical KeyboardEvent.code mapping.
- AD-04: Use native accessible button elements.
- AD-05: Implement polyphonic playback.
- AD-06: Track all active audio sources.
- AD-07: Integrate AnalyserNode with the audio output graph.
- AD-08: Use requestAnimationFrame for visual updates.
- AD-09: Clean up keyboard listeners and audio resources.
- AD-10: Keep Lab 02 source files unchanged.

### 11.7. Audit Verification

DataGrid source inspection: PASS.
TypeScript contracts inspection: PASS.
Audio Engine architecture inspection: PASS.
Visualizer lifecycle inspection: PASS.
FIFO Queue suitability inspection: PASS.

Runtime verification: NOT YET PERFORMED.

Audit status:
## 12. HW1 Acceptance Criteria

### AC-01: Drum Pads
- Exactly seven required pads are displayed.
- W, A, S, D, J, K, L have valid key mappings.
- Each pad is a native accessible button.
- Each pad has a meaningful accessible name.

### AC-02: Keyboard Interaction
- Physical key codes trigger the correct pads.
- Repeated keydown events do not cause hit spam.
- Keyup correctly releases the pressed visual state.
- Shortcuts do not trigger while typing in editable controls.
- Native Tab navigation remains functional.
- Enter and Space interaction does not cause duplicate hits.

### AC-03: Audio
- Each required pad produces an audible sound.
- Independent hits can overlap.
- Audio playback starts after a user gesture.
- Active audio resources are released correctly.
- Audio failures do not crash the application.

### AC-04: Visual Feedback
- The pressed pad has visible feedback.
- Hit history is visually readable.
- Hit history uses output with aria-live="polite".
- A visual audio meter is displayed.
- The meter calculation is documented.

### AC-05: Accessibility
- All buttons are keyboard accessible.
- Focus indicators are visible.
- Pad pressed states are exposed using aria-pressed.
- Visual feedback does not depend on hearing.
- WCAG 2.2 AA requirements are reviewed.
- Lighthouse Accessibility target is 100.

### AC-06: Responsive Layout
- No horizontal overflow at 375px.
- Drum pads remain usable at narrow widths.
- Text and interactive controls remain readable.

### AC-07: React and Resource Safety
- React 19 and createRoot are used.
- No deprecated React or keyboard APIs.
- Global event listeners have cleanup.
- Animation frames have cleanup.
- Audio resources have cleanup.
- StrictMode does not leave duplicate active listeners.

### AC-08: Submission
- Task decomposition reflects actual progress.
- Project rules are included.
- At least three verified AI failures are documented.
- Git commits reflect actual incremental development.
- Final screenshots are collected into one PDF.
- README explains setup, testing, and features.

## 13. Governance Progress

### Version 0.3 - Governance and Acceptance Criteria

- Defined React 19 engineering constraints.
- Defined accessibility and keyboard rules.
- Defined audio resource lifecycle rules.
- Defined acceptance criteria AC-01 through AC-08.
- Prepared testing and evidence requirements.

Completed tasks: T01-T06.
Next task: T07 - Initialize React 19 with Vite.

## 14. React 19 Project Initialization

### Version 0.4 - Project Setup

- Initialized Vite with React and TypeScript.
- Preserved existing governance documentation.
- Confirmed React 19 dependencies.
- Verified development server.
- Verified ESLint.
- Verified production build.

Completed tasks: T01-T10.
Next phase: TypeScript Contracts and Architecture.

Verification status: PASS.


## 15. Phase 3 - Contracts and Architecture

### Version 0.5 - Domain Contracts

Created contracts:

- src/types/drum.ts
- src/data/drum-pads.ts
- src/audio/audio-contract.ts

### Component Responsibilities

App.tsx:
- Render the main semantic page structure.
- Compose the Drum Kit application.

DrumKit.tsx:
- Coordinate keyboard input and visual state.
- Connect user interaction with the audio engine.
- Maintain hit history.

DrumPad.tsx:
- Render one accessible button.
- Expose aria-pressed state.
- Display active visual feedback.

HitHistory.tsx:
- Display recent triggered hits.
- Provide accessible live announcements.

DecibelMeter.tsx:
- Display the audio signal level.
- Use AnalyserNode data.
- Calculate a documented dBFS measurement.
- Stop animation updates during cleanup.

useDrumKeyboard.ts:
- Map physical key codes to drum pads.
- Handle keydown and keyup.
- Prevent OS auto-repeat.
- Ignore editable controls.
- Clean up keyboard listeners.

DrumAudioEngine implementation:
- Initialize and resume AudioContext.
- Load and decode audio samples.
- Support overlapping drum hits.
- Track active source nodes.
- Release audio resources.

### Architecture Decisions

- Domain data is separated from UI components.
- Physical keyboard mapping uses KeyboardEvent.code.
- Every pad has a stable ID.
- Audio processing is separated from React rendering.
- Hit history uses immutable React state.
- Animation frames will not cause React re-render loops.
- The audio meter will use a defined dBFS reference.

### Verification

- TypeScript contracts compile successfully.
- ESLint passes.
- Production build passes.
- No audio or UI behavior is claimed as implemented yet.

Completed tasks: T01-T15.
Next task: T16 - Implement semantic page structure.

### Version 0.6 - Semantic UI Skeleton

- Implemented semantic App and DrumKit structure.
- Implemented reusable DrumPad component.
- Rendered seven pads with stable keys.
- Added a temporary click preview.
- Verified lint, build, and basic click behavior.
- Audio and keyboard controls are not yet implemented.

Completed: T16, T17, T18.
Pending: T19, T20.

### Version 0.7 - Responsive Drum Kit UI

- Implemented scoped CSS Modules.
- Replaced default Vite styling.
- Added desktop and mobile pad layouts.
- Added visible keyboard focus.
- Added hover and active visual styles.
- Verified 375px viewport without horizontal overflow.
- Verified lint and production build.

Completed: T16, T17, T18, T20.
Pending: T19, keyboard and audio integration.


## 16. Phase 5 - Keyboard Interaction

### Version 0.8 - Keyboard Event Engine

Implemented:
- Physical keyboard mapping with event.code.
- keydown and keyup handlers.
- Anti-repeat using event.repeat and heldCodes.
- Editable input focus isolation.
- Window blur pressed-state reset.
- Keyboard listener cleanup.
- Active visual state through React.
- Native button interaction preserved.

### Verification Checklist

- [x] All seven keyboard mappings work.
- [x] Repeated keydown does not cause repeated triggers.
- [x] Multiple held keys update their own pad states.
- [x] Editable input focus prevents drum shortcuts.
- [x] Tab focus remains visible.
- [x] Enter and Space activate focused buttons once.
- [x] Window blur resets held pad states.
- [x] ESLint passes.
- [x] Production build passes.

### Known Limitation

Keyboard testing showed inconsistent behavior with
Vietnamese input method settings.

Physical key events were observed under English input mode.
Full Vietnamese IME compatibility is not yet verified.

### Next Step

Implement a polyphonic Web Audio Engine.

Audio playback, decibel meter, and hit history are
not yet implemented.


## 17. Phase 5 - Polyphonic Audio Engine

### Version 0.9 - Audio Engine Implementation

Implemented:
- WebDrumAudioEngine class.
- AudioContext initialization and resume.
- Shared GainNode and AnalyserNode.
- Audio sample loading and decoding.
- AudioBuffer caching.
- Independent AudioBufferSourceNode playback.
- Active voice tracking using Set.
- Source cleanup through onended.
- Explicit engine disposal.
- AbortSignal checks during sample loading.

### Architecture Notes

The Lab 02 AudioEngine tracked only one active source.

The Lab 03 implementation uses a Set of active
AudioBufferSourceNode instances to support polyphony.

The FIFO AudioTaskQueue is not used for live drum hits.

### Verification

- [x] TypeScript compilation passes.
- [x] ESLint passes.
- [x] Production build passes.
- [ ] Audio playback tested in browser.
- [ ] Multiple overlapping voices tested.
- [ ] Audio cleanup verified on unmount.

### Current Limitations

The audio engine is not yet connected to DrumKit.

Sample assets have not been integrated.

Runtime audio functionality has not yet been verified.

### Next Step

Connect seven drum pads to real audio samples
and verify audio lifecycle behavior.

## 18. Phase 5 - Audio Integration

### Version 1.0 - Drum Audio Playback

Implemented:
- Seven generated WAV sound assets.
- Audio sample manifest.
- Audio engine integration with DrumKit.
- Lazy AudioContext initialization.
- Audio sample loading and decoding.
- Cached AudioBuffer playback.
- Independent polyphonic drum voices.
- Loading, ready, and error states.
- Audio disposal on component unmount.

### Verification Checklist

- [x] All seven pads produce different sounds.
- [x] Mouse click triggers playback.
- [x] Keyboard shortcuts trigger playback.
- [x] Two sounds can overlap.
- [x] Key holding does not spam sound.
- [x] Repeated hits work after keyup.
- [x] Audio files load successfully.
- [x] Refresh and retry behavior works.
- [x] ESLint passes.
- [x] Production build passes.

### Known Limitation

Initial audio loading may introduce first-hit latency.
Keyboard behavior with Vietnamese IME requires
additional verification.

### Next Step

Implement accessible hit history and visual decibel meter.

## 19. Accessible Hit History

### Version 1.1 - Hit History

Implemented:
- Reusable HitHistory component.
- Immutable history state.
- Unique hit IDs using crypto.randomUUID().
- Most recent 8 hits displayed.
- Latest hit announcement using output and aria-live.
- Visible hit names and timestamps.
- No successful hit recorded before audio triggering.

Verification:
- [x] Keyboard hits update history.
- [x] Mouse clicks update history.
- [x] Newest hit appears first.
- [x] History stays within 8 entries.
- [x] Anti-repeat does not add duplicate hits.
- [x] Live announcements verified with screen reader.
- [x] ESLint passes.
- [x] Production build passes.

Next: Visual Decibel Meter and lifecycle verification.

## 21. Lifecycle and Accessibility Verification

### Version 1.3 - Keyboard and Audio Lifecycle

Implemented:
- Improved interactive-control focus isolation.
- Added explicit Drum Pad identification.
- Added visibilitychange pressed-state reset.
- Preserved native button activation.
- Maintained keyboard listener cleanup.
- Reviewed audio disposal behavior.

### Verification
- [x] Seven keyboard mappings pass.
- [x] Anti-repeat passes.
- [x] Multiple held keys pass.
- [x] Input isolation passes.
- [x] Enter/Space button activation passes.
- [x] Window blur reset passes.
- [x] Audio playback after reload passes.
- [x] No uncaught runtime errors.
- [x] ESLint passes.
- [x] Production build passes.

### Outstanding Checks
- Full component unmount/resource lifecycle audit.
- Screen reader verification.
- Lighthouse Accessibility audit.
- Final responsive and interaction audit.
- AI failure audit completion.
- Screenshot evidence PDF.

Next: Final verification and submission preparation.

## 23. AI Failure Correction and Retesting

### Verified Correction

AF-HW1-01 - React Ref Access During Render

- Root cause identified.
- Ref access moved out of JSX render.
- ESLint passed after correction.
- Production build passed.
- Drum audio playback retested.
- Decibel meter retested.

### Remaining Audit Work

- Verify additional genuine AI failure cases.
- Preserve error messages and correction evidence.