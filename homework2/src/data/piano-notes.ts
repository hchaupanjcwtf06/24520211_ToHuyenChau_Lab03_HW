
import type { PianoNote } from '../types/piano';

const NOTE_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;

const FIRST_MIDI = 21;
const LAST_MIDI = 108;

export function midiToFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function generatePianoNotes(): readonly PianoNote[] {
  return Array.from(
    { length: LAST_MIDI - FIRST_MIDI + 1 },
    (_, index): PianoNote => {
      const midi = FIRST_MIDI + index;
      const pitchClass = midi % 12;
      const octave = Math.floor(midi / 12) - 1;
      const noteName = `${NOTE_NAMES[pitchClass]}${octave}`;

      return {
        midi,
        noteName,
        frequencyHz: midiToFrequency(midi),
        isBlack: NOTE_NAMES[pitchClass].includes('#'),
        octave,
      };
    },
  );
}

export const PIANO_NOTES = generatePianoNotes();

export const WHITE_NOTES =
  PIANO_NOTES.filter((note) => !note.isBlack);

export const BLACK_NOTES =
  PIANO_NOTES.filter((note) => note.isBlack);
