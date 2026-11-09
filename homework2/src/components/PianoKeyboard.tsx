import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PIANO_NOTES, WHITE_NOTES, BLACK_NOTES } from '../data/piano-notes';
import { PolyphonicSynth } from '../audio/PolyphonicSynth';
import { PianoKey } from './PianoKey';
import styles from './PianoKeyboard.module.css';

export function PianoKeyboard() {
  const [pressedNotes, setPressedNotes] = useState<ReadonlySet<number>>(() => new Set());
  const [activeVoiceCount, setActiveVoiceCount] = useState<number>(0);
  const [lastNoteName, setLastNoteName] = useState<string>('None');

  const synthRef = useRef<PolyphonicSynth | null>(null);

  // Bảng tra cứu O(1) tần số và tên nốt từ MIDI number
  const noteLookup = useMemo(() => {
    const map = new Map<number, { freq: number; name: string }>();
    for (const note of PIANO_NOTES) {
      map.set(note.midi, { freq: note.frequencyHz, name: note.noteName });
    }
    return map;
  }, []);

  // Khởi tạo Audio Engine và cleanup xác định khi unmount
  useEffect(() => {
    const synth = new PolyphonicSynth(8);
    synthRef.current = synth;

    return () => {
      void synth.dispose();
      synthRef.current = null;
    };
  }, []);

  const handleNoteOn = useCallback((midi: number) => {
    const noteInfo = noteLookup.get(midi);
    if (!noteInfo) return;

    if (synthRef.current) {
      synthRef.current.noteOn(midi, noteInfo.freq);
      setActiveVoiceCount(synthRef.current.getActiveVoiceCount());
    }

    setPressedNotes((prev) => {
      if (prev.has(midi)) return prev;
      const next = new Set(prev);
      next.add(midi);
      return next;
    });
    setLastNoteName(noteInfo.name);
  }, [noteLookup]);

  const handleNoteOff = useCallback((midi: number) => {
    if (synthRef.current) {
      synthRef.current.noteOff(midi);
      setActiveVoiceCount(synthRef.current.getActiveVoiceCount());
    }

    setPressedNotes((prev) => {
      if (!prev.has(midi)) return prev;
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });
  }, []);

  return (
    <section className={styles.section} aria-label="88-Key Piano Keyboard">
      <header className={styles.statusHeader}>
        <dl className={styles.statusList}>
          <div className={styles.statusGroup}>
            <dt>Active Voices:</dt>
            <dd>
              <output role="status" aria-live="polite" className={styles.statusValue}>
                {activeVoiceCount} / 8
              </output>
            </dd>
          </div>
          <div className={styles.statusGroup}>
            <dt>Last Note:</dt>
            <dd>
              <output role="status" aria-live="polite" className={styles.statusValue}>
                {lastNoteName}
              </output>
            </dd>
          </div>
        </dl>
      </header>

      <section
        className={styles.scrollArea}
        tabIndex={0}
        role="region"
        aria-label="Piano keys scrollable area"
      >
        <div className={styles.keyboard}>
          <ul className={styles.whiteKeys} role="list" aria-label="Natural keys">
            {WHITE_NOTES.map((note) => (
              <li key={note.midi} className={styles.whiteKeyItem}>
                <PianoKey
                  note={note}
                  isPressed={pressedNotes.has(note.midi)}
                  onNoteOn={handleNoteOn}
                  onNoteOff={handleNoteOff}
                />
              </li>
            ))}
          </ul>

          <ul className={styles.blackKeys} role="list" aria-label="Accidental keys">
            {BLACK_NOTES.map((note) => {
              // Tính số lượng phím trắng đứng trước nốt đen này để xác định vị trí đặt phím
              const whiteIndex =
                (note as unknown as { whiteIndex?: number }).whiteIndex ??
                WHITE_NOTES.filter((w) => w.midi < note.midi).length;

              return (
                <li
                  key={note.midi}
                  className={styles.blackPosition}
                  style={{ '--white-index': whiteIndex } as React.CSSProperties}
                >
                  <PianoKey
                    note={note}
                    isPressed={pressedNotes.has(note.midi)}
                    onNoteOn={handleNoteOn}
                    onNoteOff={handleNoteOff}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </section>
  );
}