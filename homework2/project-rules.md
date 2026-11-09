# Lab 03 HW2 - AI Governance Rules

## 1. Technology Stack

- React 19
- Vite
- TypeScript
- Modern JavaScript (ES2024)
- Web Audio API (Polyphonic Synthesizer)
- Semantic HTML5
- CSS Modules for component styling

## 2. Development Workflow

Follow this sequence:

1. Update TASK_DECOMPOSITION.md.
2. Define component and state contracts.
3. Implement one vertical slice.
4. Test the implemented behavior.
5. Audit the implementation.
6. Update task status and create an atomic Git commit.

Do not generate the entire homework in one step.
Do not mark incomplete or untested tasks as completed.

## 3. React 19 Rules

- Use functional components and Hooks.
- Mount the application with createRoot().
- Use StrictMode during development.
- Do not use ReactDOM.render().
- Do not use class components.
- Do not use Component.defaultProps.
- Do not mutate React state directly.
- Do not store values in state if they can be derived.
- Do not use unnecessary effects to synchronize state.
- Isolate re-renders of the 88 piano keys using React.memo.
- Guarantee that triggering one key only re-renders that specific key.
- Maintain stable callback references across renders with useCallback.
- Clean up event listeners, timers, animation frames, and audio resources deterministically.

## 4. Accessibility Rules

- Target WCAG 2.2 AA compliance.
- Target Lighthouse Accessibility 100.
- Use semantic HTML instead of unnecessary div wrappers (<main>, <section>, <article>, <header>, <dl>, <output>).
- Use native button elements for all piano keys and control triggers.
- Give every key a clear accessible name indicating note name and octave.
- Use aria-pressed to communicate key pressed states.
- Provide visible keyboard focus indicators without removing outlines.
- Use output with aria-live="polite" for sequencer status and active voices.
- Provide visible feedback independently of audio.
- Label form controls using htmlFor and useId where needed.
- Support a 375px viewport with a smoothly scrollable horizontal keyboard container (tabIndex={0}).
- Do not use blocking window.alert().

## 5. Keyboard and Pointer Rules

- Use KeyboardEvent.code and KeyboardEvent.key, not deprecated keyCode or keypress.
- Support pointer interaction via Pointer Events (pointerdown, pointerup, pointercancel).
- Manage pointer capture with setPointerCapture and release on pointer up/cancel.
- Handle keydown and keyup for keyboard navigation.
- Ignore repeated keydown events using event.repeat.
- Ignore piano shortcuts when focus is inside editable form controls.
- Preserve native Tab, Enter, and Space behavior.
- Remove all global listeners during effect cleanup.

## 6. Audio Engine Rules

- Initialize or resume AudioContext only after user interaction.
- Share a single AudioContext across the application.
- Support polyphonic synthesis with an 8-voice concurrency limit.
- Implement FIFO voice stealing using an ES6 Map when the 9th voice triggers.
- Apply click-free ADSR envelopes (10ms attack ramp, exponential release ramp).
- Disconnect AudioNode instances after release to prevent audio memory leaks.
- Terminate all active voices on stopAll and dispose AudioContext on unmount.
- Do not leak audio nodes, intervals, or oscillators.

## 7. Sequencer and Component Architecture

- Define TypeScript contracts before implementation.
- Separate audio engine logic cleanly from UI rendering.
- Record note events with timestamp deltas (deltaMs) and press durations (durationMs).
- Maintain recorded sequences in FIFO chronological order.
- Implement variable-speed replay (0.5x, 1x, 2x) mathematically without state desynchronization.
- Use AbortController and AbortSignal to cancel async replay immediately on stop or unmount.
- Use React state only for UI presentation and refs for audio engine lifecycles.

## 8. Security and Code Quality

- Avoid dangerouslySetInnerHTML.
- Do not use insecure HTTP assets.
- Avoid legacy APIs and deprecated keyboard properties.
- Run npm run lint and npm run build before every commit.
- Execute validation scripts (node scripts/check-piano.mjs).
- Investigate browser console warnings, errors, and profiling traces.
- Do not claim tasks or tests passed without verification.

## 9. AI Failure Audit

Maintain AI_FAILURE_AUDIT.md during implementation.

Document at least three verified AI-assisted coding failures across the lab.

For each failure, record:

1. Task or AI prompt.
2. Incorrect code or behavior.
3. Technical explanation.
4. Evidence or reproducible verification.
5. Corrective implementation.
6. Retest result.

Never fabricate AI failures or DevTools evidence.

## 10. Git and Submission

- Maintain TASK_DECOMPOSITION.md continuously with atomic progress.
- Use atomic Git commits adhering to Conventional Commits.
- Keep all homework folders inside one single repository.
- Keep HW2 source and documentation strictly under homework2.
- Preserve HW1 and Lab 02 source files without unintended mutations.
- Prepare codebase for the 3-Minute Live Defense refactoring challenge.
- Verify production build and linting before pushing final commits.