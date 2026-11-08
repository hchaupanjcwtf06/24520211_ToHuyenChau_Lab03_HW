
# Lab 03 HW1 - AI Governance Rules

## 1. Technology Stack

- React 19
- Vite
- TypeScript
- Modern JavaScript (ES2024)
- Web Audio API
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
- Clean up event listeners, timers, animation frames,
  and audio resources.

## 4. Accessibility Rules

- Target WCAG 2.2 AA.
- Target Lighthouse Accessibility 100.
- Use semantic HTML instead of unnecessary div wrappers.
- Use native button elements for drum pads.
- Give every pad a meaningful accessible name.
- Use aria-pressed to communicate pressed state.
- Provide visible keyboard focus indicators.
- Do not remove focus outlines without replacements.
- Use output with aria-live="polite" for hit history.
- Provide visible feedback independently of audio.
- Label form controls using htmlFor and useId where needed.
- Support a 375px viewport without horizontal overflow.
- Do not use blocking window.alert().

## 5. Keyboard Rules

- Use KeyboardEvent.code, not deprecated keyCode.
- Support KeyW, KeyA, KeyS, KeyD, KeyJ, KeyK, KeyL.
- Handle keydown and keyup as required by the contract.
- Ignore repeated keydown events using event.repeat.
- Ignore shortcuts when focus is inside editable controls.
- Respect text inputs, textareas, selects, and editable content.
- Avoid duplicate triggers from keyboard and button events.
- Remove global listeners during effect cleanup.
- Preserve native Tab, Enter, and Space behavior.

## 6. Audio Engine Rules

- Initialize or resume AudioContext after user interaction.
- Support independent drum hits without FIFO serialization.
- Track active audio sources for cleanup.
- Release or disconnect resources after playback.
- Use AnalyserNode for visualization.
- Define the decibel meter reference and calculation.
- Do not treat raw frequency bytes as decibel values.
- Avoid creating a new AudioContext for every hit.
- Handle audio loading and playback failures.
- Do not leak audio resources on unmount.

## 7. Component Architecture

- Define TypeScript contracts before implementation.
- Use stable IDs for drum pads and hit history entries.
- Keep audio engine responsibilities separate from UI.
- Keep rendering logic separate from audio processing.
- Use React state only for information needed by the UI.
- Prefer refs for mutable external resources.
- Avoid unnecessary re-renders during visualization.

## 8. Security and Code Quality

- Avoid dangerouslySetInnerHTML.
- Do not use insecure HTTP assets.
- Avoid legacy APIs and deprecated keyboard events.
- Run lint and build checks.
- Investigate browser console warnings and errors.
- Do not claim tests passed without running them.

## 9. AI Failure Audit

Maintain AI_FAILURE_AUDIT.md during implementation.

Document at least three verified AI-assisted coding failures.

For each failure, record:

1. Task or AI prompt.
2. Incorrect code or behavior.
3. Technical explanation.
4. Evidence or reproducible verification.
5. Corrective implementation.
6. Retest result.

Never fabricate AI failures or DevTools evidence.

## 10. Git and Submission

- Maintain TASK_DECOMPOSITION.md continuously.
- Use atomic Git commits.
- Keep all homework folders inside one repository.
- Keep HW1 source and documentation under homework1.
- Preserve Lab 02 source without modification.
- Capture screenshots of the final implementation.
- Collect required evidence into one PDF.
- Verify the submission before pushing final changes.
