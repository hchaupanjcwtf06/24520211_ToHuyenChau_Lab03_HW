
# Homework 1 - Production Studio Drum Kit

## Overview

A responsive seven-pad drum kit built with React 19,
TypeScript, Vite, and the Web Audio API.

The application supports keyboard and mouse interaction,
polyphonic audio playback, hit history, and a live
RMS decibel meter.

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS Modules
- Web Audio API

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Drum Controls

| Key | Sound |
|-----|-------|
| W | Kick |
| A | Snare |
| S | Closed Hi-Hat |
| D | Open Hi-Hat |
| J | Clap |
| K | Tom |
| L | Crash |

Users can also click drum pads.

## Features

- Seven interactive drum pads
- Physical keyboard mapping using event.code
- Keydown and keyup handling
- Anti-repeat protection
- Editable input focus isolation
- Accessible native buttons
- aria-pressed interaction feedback
- Polyphonic AudioBufferSourceNode playback
- Generated WAV samples
- Recent hit history
- Accessible live announcements
- RMS dBFS meter using AnalyserNode
- Audio and event listener cleanup
- Responsive layout for 375px screens

## Audio Architecture

The audio engine manages AudioContext, GainNode,
AnalyserNode, decoded AudioBuffers, and active sources.

Each hit creates an independent AudioBufferSourceNode
to support overlapping sounds.

Audio resources are disposed when the DrumKit unmounts.

## Accessibility

The interface uses semantic HTML, accessible button
names, keyboard support, visible focus styles,
and live announcements.

Accessibility verification results are documented
in TASK_DECOMPOSITION.md.

## Verification

Run:

```bash
npm run lint
npm run build
```

Manual verification covers keyboard interaction,
anti-repeat, audio playback, lifecycle cleanup,
responsive layout, and accessibility.

## Project Documentation

- TASK_DECOMPOSITION.md - Implementation and test progress
- ../AI_FAILURE_AUDIT.md - Shared AI failure audit
- ../project-rules.md - Project governance, if applicable

## Known Limitations

- First-hit audio playback may have loading latency.
- WAV sounds are synthesized samples, not studio recordings.
- Keyboard behavior may vary with Vietnamese IME.
- The meter displays digital RMS dBFS, not physical dB SPL.

## Evidence

Final screenshots are collected in the submission PDF.
