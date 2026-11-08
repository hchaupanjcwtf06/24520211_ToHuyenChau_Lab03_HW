
import type { DrumSoundId } from '../types/drum';

/** Maps each drum sound to its audio asset URL. */
export type DrumSampleManifest = Readonly<
  Record<DrumSoundId, string>
>;

/**
 * Contract for a polyphonic Web Audio engine.
 *
 * This file defines the expected behavior.
 * The implementation will be added later.
 */
export interface DrumAudioEngine {
  /** Initialize or resume audio after user interaction. */
  start(): Promise<void>;

  /** Fetch and decode samples before playback. */
  loadSamples(
    manifest: DrumSampleManifest,
    signal: AbortSignal
  ): Promise<void>;

  /** Trigger one independent drum voice. */
  trigger(soundId: DrumSoundId): void;

  /** Expose the analyser for visualization. */
  getAnalyser(): AnalyserNode | null;

  /** Stop voices and release owned audio resources. */
  dispose(): Promise<void>;
}
