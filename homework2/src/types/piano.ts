export interface PianoNote {
    readonly midi: number;
    readonly noteName: string;
    readonly frequencyHz: number;
    readonly isBlack: boolean;
    readonly octave: number;
  }
  
  export interface PianoKeyProps {
    readonly note: PianoNote;
    readonly isPressed: boolean;
    readonly onNoteOn: (midi: number) => void;
    readonly onNoteOff: (midi: number) => void;
  }
  
  export interface RecordedNote {
    readonly midi: number;
    readonly freqHz: number;
    readonly durationMs: number;
    readonly deltaMs: number;
  }
  
  export type PlaybackSpeed = 0.5 | 1 | 2;