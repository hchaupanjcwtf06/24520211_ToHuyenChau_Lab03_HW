import { useCallback, useRef, useState } from 'react';
import type { RecordedNote } from '../types/piano';

interface ActiveNoteTiming {
  readonly startTime: number;
  readonly deltaMs: number;
}

export function usePianoRecorder() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedNotes, setRecordedNotes] = useState<readonly RecordedNote[]>([]);

  // Lưu trữ thời điểm bắt đầu và deltaMs của từng nốt đang nhấn
  const activeNoteStartsRef = useRef(new Map<number, ActiveNoteTiming>());

  // Mốc thời gian của sự kiện trước đó để tính khoảng cách deltaMs
  const lastEventTimeRef = useRef<number>(0);

  const startRecording = useCallback(() => {
    setRecordedNotes([]);
    activeNoteStartsRef.current.clear();
    lastEventTimeRef.current = performance.now();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    activeNoteStartsRef.current.clear();
  }, []);

  const clearRecording = useCallback(() => {
    setRecordedNotes([]);
    activeNoteStartsRef.current.clear();
  }, []);

  const recordNoteOn = useCallback(
    (midi: number) => {
      if (!isRecording) return;
      const now = performance.now();
      const deltaMs = Math.max(0, Math.round(now - lastEventTimeRef.current));

      // Lưu nguyên object { startTime, deltaMs } vào Map
      activeNoteStartsRef.current.set(midi, {
        startTime: now,
        deltaMs,
      });

      lastEventTimeRef.current = now;
    },
    [isRecording]
  );

  const recordNoteOff = useCallback(
    (midi: number, freqHz: number) => {
      if (!isRecording) return;
      const timing = activeNoteStartsRef.current.get(midi);
      if (!timing) return;

      const now = performance.now();
      const durationMs = Math.max(10, Math.round(now - timing.startTime));
      const deltaMs = timing.deltaMs;

      activeNoteStartsRef.current.delete(midi);

      const noteEntry: RecordedNote = {
        midi,
        freqHz,
        durationMs,
        deltaMs,
      };

      setRecordedNotes((prev) => [...prev, noteEntry]);
    },
    [isRecording]
  );

  return {
    isRecording,
    recordedNotes,
    startRecording,
    stopRecording,
    clearRecording,
    recordNoteOn,
    recordNoteOff,
  };
}