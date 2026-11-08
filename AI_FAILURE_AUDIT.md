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
