
/**
 * Lab 03 HW1 - Drum Kit Domain Contracts
 *
 * Physical keyboard mapping uses KeyboardEvent.code.
 * Do not use deprecated keyCode.
 */

export type DrumKeyCode =
  | 'KeyW'
  | 'KeyA'
  | 'KeyS'
  | 'KeyD'
  | 'KeyJ'
  | 'KeyK'
  | 'KeyL';

export type DrumSoundId =
  | 'kick'
  | 'snare'
  | 'closed-hihat'
  | 'open-hihat'
  | 'clap'
  | 'tom'
  | 'crash';

/** Immutable configuration for a single drum pad. */
export interface DrumPadDefinition {
  readonly id: DrumSoundId;
  readonly code: DrumKeyCode;
  readonly keyLabel: string;
  readonly label: string;
}

/** One successfully triggered drum hit. */
export interface DrumHit {
  readonly id: string;
  readonly padId: DrumSoundId;
  readonly label: string;
  readonly occurredAtMs: number;
}

/** Visual audio meter reading in dBFS. */
export interface MeterReading {
  readonly dbfs: number;
  readonly normalizedLevel: number;
}

/** Props contract for the future DrumPad component. */
export interface DrumPadProps {
  readonly pad: DrumPadDefinition;
  readonly isPressed: boolean;
  readonly onTrigger: (id: DrumSoundId) => void;
}
