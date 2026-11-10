import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PIANO_NOTES, WHITE_NOTES, BLACK_NOTES } from '../data/piano-notes';
import { PolyphonicSynth } from '../audio/PolyphonicSynth';
import { usePianoRecorder } from '../hooks/usePianoRecorder';
import { usePianoPlayback } from '../hooks/usePianoPlayback';
import { PianoKey } from './PianoKey';
import { Sequencer } from './Sequencer';
import styles from './PianoKeyboard.module.css';

export function PianoKeyboard() {
  const [pressedNotes, setPressedNotes] = useState<ReadonlySet<number>>(() => new Set());
  const [activeVoiceCount, setActiveVoiceCount] = useState<number>(0);
  const [lastNoteName, setLastNoteName] = useState<string>('None');

  const synthRef = useRef<PolyphonicSynth | null>(null);

  // Hook ghi âm
  const recorder = usePianoRecorder();

  // Bảng tra cứu O(1) tần số và tên nốt từ MIDI number
  const noteLookup = useMemo(() => {
    const map = new Map<number, { freq: number; name: string }>();
    for (const note of PIANO_NOTES) {
      map.set(note.midi, { freq: note.frequencyHz, name: note.noteName });
    }
    return map;
  }, []);

  // Khởi tạo Audio Engine và cleanup khi unmount
  useEffect(() => {
    const synth = new PolyphonicSynth(8);
    synthRef.current = synth;

    return () => {
      void synth.dispose();
      synthRef.current = null;
    };
  }, []);

  // Kích âm cho 1 nốt (dùng cho cả tương tác người dùng lẫn playback tự động)
  const triggerNoteOn = useCallback(
    (midi: number, freqHz: number) => {
      if (synthRef.current) {
        synthRef.current.noteOn(midi, freqHz);
        setActiveVoiceCount(synthRef.current.getActiveVoiceCount());
      }
      setPressedNotes((prev) => {
        if (prev.has(midi)) return prev;
        const next = new Set(prev);
        next.add(midi);
        return next;
      });
      const name = noteLookup.get(midi)?.name ?? 'None';
      setLastNoteName(name);
    },
    [noteLookup]
  );

  // Tắt âm cho 1 nốt
  const triggerNoteOff = useCallback((midi: number) => {
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

  // Ngắt toàn bộ nốt
  const triggerStopAll = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.stopAll();
      setActiveVoiceCount(0);
    }
    setPressedNotes(new Set());
  }, []);

  // Hook phát lại sequencer
  const playback = usePianoPlayback({
    onNoteOn: triggerNoteOn,
    onNoteOff: triggerNoteOff,
    onStopAll: triggerStopAll,
  });

  // Xử lý khi người dùng tương tác phím (kèm ghi âm)
  const handleNoteOn = useCallback(
    async (midi: number) => {
      const noteInfo = noteLookup.get(midi);
      if (!noteInfo) return;

      if (synthRef.current) {
        await synthRef.current.start();
      }

      triggerNoteOn(midi, noteInfo.freq);
      recorder.recordNoteOn(midi);
    },
    [noteLookup, triggerNoteOn, recorder]
  );

  const handleNoteOff = useCallback(
    (midi: number) => {
      const noteInfo = noteLookup.get(midi);
      if (!noteInfo) return;

      triggerNoteOff(midi);
      recorder.recordNoteOff(midi, noteInfo.freq);
    },
    [noteLookup, triggerNoteOff, recorder]
  );

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

      {/* Sequencer Toolbar */}
      <Sequencer
        isRecording={recorder.isRecording}
        isPlaying={playback.isPlaying}
        recordedCount={recorder.recordedNotes.length}
        currentNoteIndex={playback.currentNoteIndex}
        speed={playback.speed}
        onStartRecord={recorder.startRecording}
        onStopRecord={recorder.stopRecording}
        onClearRecord={recorder.clearRecording}
        onStartPlayback={() => void playback.startPlayback(recorder.recordedNotes)}
        onStopPlayback={playback.stopPlayback}
        onSpeedChange={playback.setSpeed}
      />

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