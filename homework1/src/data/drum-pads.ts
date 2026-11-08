
import type {
    DrumKeyCode,
    DrumPadDefinition
  } from '../types/drum';
  
  /**
   * Stable drum configuration.
   * No dynamic array index keys are used.
   */
  export const DRUM_PADS: readonly DrumPadDefinition[] = [
    {
      id: 'kick',
      code: 'KeyW',
      keyLabel: 'W',
      label: 'Kick Drum'
    },
    {
      id: 'snare',
      code: 'KeyA',
      keyLabel: 'A',
      label: 'Snare Drum'
    },
    {
      id: 'closed-hihat',
      code: 'KeyS',
      keyLabel: 'S',
      label: 'Closed Hi-Hat'
    },
    {
      id: 'open-hihat',
      code: 'KeyD',
      keyLabel: 'D',
      label: 'Open Hi-Hat'
    },
    {
      id: 'clap',
      code: 'KeyJ',
      keyLabel: 'J',
      label: 'Hand Clap'
    },
    {
      id: 'tom',
      code: 'KeyK',
      keyLabel: 'K',
      label: 'Tom Drum'
    },
    {
      id: 'crash',
      code: 'KeyL',
      keyLabel: 'L',
      label: 'Crash Cymbal'
    }
  ];
  
  /** Maps physical keyboard codes to drum definitions. */
  export const DRUM_PAD_MAP: ReadonlyMap<
    DrumKeyCode,
    DrumPadDefinition
  > = new Map(
    DRUM_PADS.map((pad) => [pad.code, pad])
  );
  