
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

- [ ] T01: Create initial TASK_DECOMPOSITION.md.
- [ ] T02: Inspect existing Lab 02 HW1 source.
- [ ] T03: Review applicable Lab 02 HW2 audio code.
- [ ] T04: Define React 19 engineering rules.
- [ ] T05: Create project-rules.md.
- [ ] T06: Define acceptance criteria and test strategy.

### Phase 2 - Project Setup

- [ ] T07: Initialize React 19 + Vite + TypeScript.
- [ ] T08: Configure project structure.
- [ ] T09: Verify development server.
- [ ] T10: Verify lint and production build.

### Phase 3 - Contracts and Architecture

- [ ] T11: Define DrumPad TypeScript interface.
- [ ] T12: Define stable pad IDs and physical key mapping.
- [ ] T13: Define audio engine contract.
- [ ] T14: Define hit history and visual state contracts.
- [ ] T15: Define component responsibilities.

### Phase 4 - Drum Kit UI

- [ ] T16: Implement semantic page structure.
- [ ] T17: Implement reusable DrumPad component.
- [ ] T18: Implement seven-pad layout.
- [ ] T19: Implement active pad visual feedback.
- [ ] T20: Implement responsive styles.

### Phase 5 - Keyboard and Audio Engine

- [ ] T21: Implement e.code keyboard mapping.
- [ ] T22: Implement keydown and keyup listeners.
- [ ] T23: Implement anti-repeat guard.
- [ ] T24: Implement form input focus isolation.
- [ ] T25: Implement audio playback.
- [ ] T26: Implement resource and listener cleanup.

### Phase 6 - Accessibility and Visualization

- [ ] T27: Implement accessible button names.
- [ ] T28: Implement aria-pressed state.
- [ ] T29: Implement visual hit history.
- [ ] T30: Implement output with aria-live="polite".
- [ ] T31: Implement visual decibel meter.
- [ ] T32: Verify keyboard focus and interaction.

### Phase 7 - Testing and Verification

- [ ] T33: Test all seven drum pads.
- [ ] T34: Test keydown, keyup, and key holding.
- [ ] T35: Test input focus isolation.
- [ ] T36: Test listener and audio cleanup.
- [ ] T37: Test 375px responsive layout.
- [ ] T38: Run Lighthouse Accessibility audit.
- [ ] T39: Inspect browser console and React DevTools.
- [ ] T40: Document at least three verified AI failure cases.
- [ ] T41: Fix and retest identified problems.

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