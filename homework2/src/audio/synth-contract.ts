
export interface PolyphonicSynthContract {
    start(): Promise<void>;
    noteOn(midi: number, frequencyHz: number): void;
    noteOff(midi: number): void;
    stopAll(): void;
    getActiveVoiceCount(): number;
    dispose(): Promise<void>;
  }
  