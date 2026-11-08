
import type {
    DrumAudioEngine,
    DrumSampleManifest,
  } from './audio-contract';
  
  import type { DrumSoundId } from '../types/drum';
  
  /**
   * Polyphonic Web Audio Engine.
   *
   * Each drum hit owns an independent AudioBufferSourceNode.
   * Active sources are tracked and cleaned up explicitly.
   */
  export class WebDrumAudioEngine implements DrumAudioEngine {
    private context: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private gain: GainNode | null = null;
  
    private readonly buffers = new Map<DrumSoundId, AudioBuffer>();
    private readonly activeSources = new Set<AudioBufferSourceNode>();
  
    private disposed = false;
  
    /**
     * Initialize or resume the Web Audio graph.
     * Must be called from a user-initiated interaction.
     */
    async start(): Promise<void> {
      this.ensureAvailable();
  
      if (!this.context) {
        const context = new AudioContext();
  
        const gain = context.createGain();
        gain.gain.value = 0.65;
  
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.78;
  
        // All drum voices share this output graph.
        gain.connect(analyser);
        analyser.connect(context.destination);
  
        this.context = context;
        this.gain = gain;
        this.analyser = analyser;
      }
  
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }
  
      this.ensureAvailable();
    }
  
    /**
     * Fetch and decode samples.
     * The shared buffer map is updated only after all samples load.
     */
    async loadSamples(
      manifest: DrumSampleManifest,
      signal: AbortSignal,
    ): Promise<void> {
      this.ensureAvailable();
  
      if (signal.aborted) {
        throw new DOMException('Loading cancelled', 'AbortError');
      }
  
      if (!this.context) {
        throw new Error('Start the audio engine before loading samples');
      }
  
      const context = this.context;
  
      const entries = Object.entries(manifest) as [
        DrumSoundId,
        string,
      ][];
  
      const loaded = await Promise.all(
        entries.map(async ([id, url]) => {
          const response = await fetch(url, { signal });
  
          if (!response.ok) {
            throw new Error(
              `Failed to load ${id}: HTTP ${response.status}`,
            );
          }
  
          const bytes = await response.arrayBuffer();
  
          if (signal.aborted) {
            throw new DOMException('Loading cancelled', 'AbortError');
          }
  
          const buffer = await context.decodeAudioData(bytes);
  
          if (signal.aborted) {
            throw new DOMException('Loading cancelled', 'AbortError');
          }
  
          return [id, buffer] as const;
        }),
      );
  
      this.ensureAvailable();
  
      if (signal.aborted) {
        throw new DOMException('Loading cancelled', 'AbortError');
      }
  
      for (const [id, buffer] of loaded) {
        this.buffers.set(id, buffer);
      }
    }
  
    /**
     * Play a single drum hit without stopping other voices.
     */
    trigger(soundId: DrumSoundId): void {
      this.ensureAvailable();
  
      if (!this.context || !this.gain) {
        throw new Error('Audio engine is not initialized');
      }
  
      if (this.context.state !== 'running') {
        throw new Error('Audio context is not running');
      }
  
      const buffer = this.buffers.get(soundId);
  
      if (!buffer) {
        throw new Error(`Audio sample is not loaded: ${soundId}`);
      }
  
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.gain);
  
      const release = () => {
        source.onended = null;
        source.disconnect();
        this.activeSources.delete(source);
      };
  
      source.onended = release;
      this.activeSources.add(source);
  
      try {
        source.start();
      } catch (error) {
        release();
        throw error;
      }
    }
  
    getAnalyser(): AnalyserNode | null {
      return this.analyser;
    }
  
    /**
     * Stop tracked voices and close the audio context.
     */
    async dispose(): Promise<void> {
      if (this.disposed) return;
  
      this.disposed = true;
  
      for (const source of this.activeSources) {
        source.onended = null;
  
        try {
          source.stop();
        } catch {
          // The source may already have stopped.
        }
  
        source.disconnect();
      }
  
      this.activeSources.clear();
      this.buffers.clear();
  
      this.gain?.disconnect();
      this.analyser?.disconnect();
  
      const context = this.context;
  
      this.context = null;
      this.gain = null;
      this.analyser = null;
  
      if (context && context.state !== 'closed') {
        await context.close();
      }
    }
  
    private ensureAvailable(): void {
      if (this.disposed) {
        throw new Error('Audio engine has been disposed');
      }
    }
  }
  