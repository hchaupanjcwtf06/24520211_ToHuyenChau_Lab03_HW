import { useCallback, useEffect, useRef, useState } from 'react';
import type { RecordedNote } from '../types/piano';

export type PlaybackSpeed = 0.5 | 1 | 2;

interface PlaybackCallbacks {
  readonly onNoteOn: (midi: number, freqHz: number) => void;
  readonly onNoteOff: (midi: number) => void;
  readonly onStopAll: () => void;
}

/**
 * Hàm sleep bất đồng bộ hỗ trợ ngắt tức thời qua AbortSignal
 */
function abortableSleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const timerId = window.setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      window.clearTimeout(timerId);
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal.addEventListener('abort', onAbort, { once: true });
  });
}

export function usePianoPlayback(callbacks: PlaybackCallbacks) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(-1);

  const abortControllerRef = useRef<AbortController | null>(null);
  const callbacksRef = useRef<PlaybackCallbacks>(callbacks);

  // Giữ tham chiếu callbacks luôn mới nhất
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Dừng phát lại và dọn dẹp các nốt đang vang
  const stopPlayback = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    callbacksRef.current.onStopAll();
    setIsPlaying(false);
    setCurrentNoteIndex(-1);
  }, []);

  // T28: Tự động hủy phát lại khi unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  // T25 & T26: Phát lại chuỗi nốt tuần tự theo tốc độ
  const startPlayback = useCallback(
    async (notes: readonly RecordedNote[]) => {
      if (notes.length === 0 || isPlaying) return;

      // Hủy phiên phát cũ nếu có
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      const { signal } = controller;

      setIsPlaying(true);

      try {
        for (let i = 0; i < notes.length; i++) {
          if (signal.aborted) break;

          const note = notes[i];
          setCurrentNoteIndex(i);

          // Co giãn khoảng nghỉ deltaMs theo tốc độ
          const scaledDeltaMs = Math.max(0, note.deltaMs / speed);
          if (scaledDeltaMs > 0) {
            await abortableSleep(scaledDeltaMs, signal);
          }

          if (signal.aborted) break;

          // Bật nốt
          callbacksRef.current.onNoteOn(note.midi, note.freqHz);

          // Co giãn thời lượng giữ nốt durationMs theo tốc độ
          const scaledDurationMs = Math.max(20, note.durationMs / speed);
          await abortableSleep(scaledDurationMs, signal);

          // Tắt nốt
          callbacksRef.current.onNoteOff(note.midi);
        }
      } catch (err: unknown) {
        // Bỏ qua lỗi ngắt có chủ đích (AbortError)
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        throw err;
      } finally {
        callbacksRef.current.onStopAll();
        setIsPlaying(false);
        setCurrentNoteIndex(-1);
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [isPlaying, speed]
  );

  return {
    isPlaying,
    speed,
    currentNoteIndex,
    setSpeed,
    startPlayback,
    stopPlayback,
  };
}