import { memo } from 'react';
import type { PianoNote } from '../types/piano';
import styles from './PianoKey.module.css';

interface PianoKeyProps {
  readonly note: PianoNote;
  readonly isPressed: boolean;
  readonly onNoteOn: (midi: number) => void;
  readonly onNoteOff: (midi: number) => void;
}

export const PianoKey = memo(function PianoKey({
  note,
  isPressed,
  onNoteOn,
  onNoteOff,
}: PianoKeyProps) {
  const isBlack = note.isBlack;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.repeat) return; // Chặn spam keydown của hệ điều hành
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNoteOn(note.midi);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNoteOff(note.midi);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.key} ${isBlack ? styles.blackKey : styles.whiteKey}`}
      aria-label={`${note.noteName} (MIDI ${note.midi})`}
      aria-pressed={isPressed}
      data-pressed={isPressed ? 'true' : 'false'}
      onPointerDown={() => onNoteOn(note.midi)}
      onPointerUp={() => onNoteOff(note.midi)}
      onPointerLeave={() => {
        if (isPressed) onNoteOff(note.midi);
      }}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <span className={styles.keyLabel}>{note.noteName}</span>
    </button>
  );
});