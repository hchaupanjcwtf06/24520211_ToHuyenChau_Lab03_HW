import type { PlaybackSpeed } from '../hooks/usePianoPlayback';
import styles from './Sequencer.module.css';

interface SequencerProps {
  readonly isRecording: boolean;
  readonly isPlaying: boolean;
  readonly recordedCount: number;
  readonly currentNoteIndex: number;
  readonly speed: PlaybackSpeed;
  readonly onStartRecord: () => void;
  readonly onStopRecord: () => void;
  readonly onClearRecord: () => void;
  readonly onStartPlayback: () => void;
  readonly onStopPlayback: () => void;
  readonly onSpeedChange: (speed: PlaybackSpeed) => void;
}

export function Sequencer({
  isRecording,
  isPlaying,
  recordedCount,
  currentNoteIndex,
  speed,
  onStartRecord,
  onStopRecord,
  onClearRecord,
  onStartPlayback,
  onStopPlayback,
  onSpeedChange,
}: SequencerProps) {
  // Trạng thái hiển thị văn bản cho aria-live
  let statusText = 'Idle';
  if (isRecording) {
    statusText = `Recording... (${recordedCount} notes captured)`;
  } else if (isPlaying) {
    statusText = `Playing sequence at ${speed}x (Note ${currentNoteIndex + 1}/${recordedCount})`;
  } else if (recordedCount > 0) {
    statusText = `Ready to play (${recordedCount} notes in queue)`;
  }

  return (
    <section className={styles.sequencerSection} aria-label="Melody Sequencer Controls">
      <div className={styles.controlsBar}>
        <fieldset className={styles.buttonGroup}>
          <legend className="sr-only" style={{ display: 'none' }}>Recording Controls</legend>
          {isRecording ? (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnRecord}`}
              onClick={onStopRecord}
              aria-pressed="true"
              aria-label="Stop Recording"
            >
              ⏹ Stop Recording
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnRecord}`}
              onClick={onStartRecord}
              disabled={isPlaying}
              aria-pressed="false"
              aria-label="Start Recording"
            >
              ⏺ Record
            </button>
          )}

          {isPlaying ? (
            <button
              type="button"
              className={`${styles.btn}`}
              onClick={onStopPlayback}
              aria-pressed="true"
              aria-label="Stop Playback"
            >
              ⏹ Stop Replay
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPlay}`}
              onClick={onStartPlayback}
              disabled={isRecording || recordedCount === 0}
              aria-pressed="false"
              aria-label="Play Recorded Sequence"
            >
              ▶ Play ({recordedCount})
            </button>
          )}

          <button
            type="button"
            className={styles.btn}
            onClick={onClearRecord}
            disabled={isRecording || isPlaying || recordedCount === 0}
            aria-label="Clear Recorded Notes"
          >
            Clear
          </button>
        </fieldset>

        <fieldset className={styles.buttonGroup}>
          <legend className="sr-only" style={{ display: 'none' }}>Replay Speed</legend>
          <div className={styles.speedSelector} role="group" aria-label="Replay Speed Selector">
            {([0.5, 1, 2] as const).map((s) => (
              <button
                key={s}
                type="button"
                className={styles.speedBtn}
                aria-pressed={speed === s}
                disabled={isPlaying}
                onClick={() => onSpeedChange(s)}
                aria-label={`Playback speed ${s}x`}
              >
                {s}x
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className={styles.statusPanel}>
        <span>Sequencer Status:</span>
        <output role="status" aria-live="polite" className={styles.liveOutput}>
          {statusText}
        </output>
      </div>
    </section>
  );
}