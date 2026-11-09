
import { useCallback, useState } from 'react';
import {
  WHITE_NOTES,
  BLACK_NOTES,
  PIANO_NOTES,
} from '../data/piano-notes';
import { PianoKey } from './PianoKey';
import styles from './PianoKeyboard.module.css';

export function PianoKeyboard() {
  const [pressedNotes, setPressedNotes] =
    useState<ReadonlySet<number>>(() => new Set());

  const [lastNote, setLastNote] = useState<string>('None');

  const handleNoteOn = useCallback((midi: number) => {
    setPressedNotes((previous) => {
      if (previous.has(midi)) return previous;
      const next = new Set(previous);
      next.add(midi);
      return next;
    });

    const note = PIANO_NOTES.find((item) => item.midi === midi);
    if (note) setLastNote(note.noteName);
  }, []);

  const handleNoteOff = useCallback((midi: number) => {
    setPressedNotes((previous) => {
      if (!previous.has(midi)) return previous;
      const next = new Set(previous);
      next.delete(midi);
      return next;
    });
  }, []);

  return (
    <section
      className={styles.section}
      aria-labelledby="piano-heading"
    >
      <header className={styles.heading}>
        <p className={styles.eyebrow}>POLYPHONIC SYNTHESIS</p>
        <h2 id="piano-heading">GRAND PIANO 88</h2>
        <p>88 notes. A0 to C8. Eight-voice audio coming next.</p>
      </header>

      <output className={styles.status} aria-live="polite">
        Last note: {lastNote}
      </output>

      <p className={styles.hint}>
        Scroll horizontally to explore all 88 keys.
        Click a key, or focus it with Tab and press Enter or Space.
      </p>

      <section
        className={styles.scrollArea}
        aria-label="Scrollable 88-key piano keyboard"
        tabIndex={0}
      >
        <section
          className={styles.keyboard}
          aria-label="Piano keys"
        >
          <section className={styles.whiteKeys} aria-label="White keys">
            {WHITE_NOTES.map((note) => (
              <PianoKey
                key={note.midi}
                note={note}
                isPressed={pressedNotes.has(note.midi)}
                onNoteOn={handleNoteOn}
                onNoteOff={handleNoteOff}
              />
            ))}
          </section>

          {BLACK_NOTES.map((note) => {
            const whiteBefore = WHITE_NOTES.filter(
              (white) => white.midi < note.midi
            ).length;

            return (
              <section
                className={styles.blackPosition}
                key={note.midi}
                style={{
                  left: `calc(${whiteBefore} * var(--white-key-width) - var(--black-key-width) / 2)`,
                }}
              >
                <PianoKey
                  note={note}
                  isPressed={pressedNotes.has(note.midi)}
                  onNoteOn={handleNoteOn}
                  onNoteOff={handleNoteOff}
                />
              </section>
            );
          })}
        </section>
      </section>

      <p className={styles.counter}>
        {WHITE_NOTES.length} WHITE · {BLACK_NOTES.length} BLACK ·
        {' '}{pressedNotes.size} PRESSED
      </p>
    </section>
  );
}
