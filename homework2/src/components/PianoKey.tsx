
import { memo } from 'react';
import type { PianoKeyProps } from '../types/piano';
import styles from './PianoKey.module.css';

export const PianoKey = memo(function PianoKey({
  note,
  isPressed,
  onNoteOn,
  onNoteOff,
}: PianoKeyProps) {
  return (
    <button
      type="button"
      className={`${styles.key} ${
        note.isBlack ? styles.black : styles.white
      }`}
      aria-label={`${note.noteName}, ${note.frequencyHz.toFixed(2)} hertz`}
      aria-pressed={isPressed}
      data-pressed={isPressed}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        onNoteOn(note.midi);
      }}
      onPointerUp={() => onNoteOff(note.midi)}
      onPointerCancel={() => onNoteOff(note.midi)}
      onLostPointerCapture={() => onNoteOff(note.midi)}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        if (!event.repeat) onNoteOn(note.midi);
      }}
      onKeyUp={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        onNoteOff(note.midi);
      }}
      onBlur={() => onNoteOff(note.midi)}
    >
      <span className={styles.label}>{note.noteName}</span>
    </button>
  );
});
