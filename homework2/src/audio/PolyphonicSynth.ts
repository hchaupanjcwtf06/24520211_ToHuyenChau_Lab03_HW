import type { PolyphonicSynthContract } from './synth-contract';

interface ActiveVoice {
  readonly osc: OscillatorNode;
  readonly gain: GainNode;
}

export class PolyphonicSynth implements PolyphonicSynthContract {
  private ctx: AudioContext | null = null;
  private readonly maxVoices: number;
  private readonly voices = new Map<number, ActiveVoice>();

  constructor(maxVoices = 8) {
    this.maxVoices = maxVoices;
  }

  public async start(): Promise<void> {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public noteOn(midi: number, frequencyHz: number): void {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    if (this.voices.has(midi)) return;

    // FIFO Voice Stealing: khi đạt 8 voices, ngắt nốt cũ nhất
    if (this.voices.size >= this.maxVoices) {
      const oldestMidi = this.voices.keys().next().value;
      if (oldestMidi !== undefined) {
        this.noteOff(oldestMidi);
      }
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequencyHz, now);

    // Attack envelope: 10ms ramp chống tiếng click
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.01);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);

    this.voices.set(midi, { osc, gain });
  }

  public noteOff(midi: number): void {
    const voice = this.voices.get(midi);
    if (!voice || !this.ctx) return;

    // Xóa ngay khỏi pool để giải phóng slot voice cho phím kế tiếp
    this.voices.delete(midi);

    const now = this.ctx.currentTime;
    const releaseDuration = 0.05; // 50ms release mượt mà

    // Chốt giá trị hiện tại trước khi ramp để chống gián đoạn biên độ (pop sound)
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + releaseDuration);

    voice.osc.stop(now + releaseDuration);

    // Ngắt kết nối hoàn toàn khỏi audio graph để Garbage Collector giải phóng bộ nhớ
    setTimeout(() => {
      try {
        voice.osc.disconnect();
        voice.gain.disconnect();
      } catch {
        // Node có thể đã được ngắt kết nối an toàn trước đó
      }
    }, (releaseDuration * 1000) + 20);
  }

  public stopAll(): void {
    const activeMidis = Array.from(this.voices.keys());
    for (const midi of activeMidis) {
      this.noteOff(midi);
    }
  }

  public getActiveVoiceCount(): number {
    return this.voices.size;
  }

  public async dispose(): Promise<void> {
    this.stopAll();
    if (this.ctx && this.ctx.state !== 'closed') {
      await this.ctx.close();
      this.ctx = null;
    }
  }
}