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

        // FIFO Voice Stealing: khi vượt quá maxVoices (8), ngắt nốt vào sớm nhất
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

        // Attack envelope: 10ms ramp tránh hiện tượng nổ click
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

        const now = this.ctx.currentTime;
        // Release envelope: hạ âm lượng mượt mà trước khi ngắt hẳn
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now);
        voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        voice.osc.stop(now + 0.05);
        setTimeout(() => {
            try {
                voice.osc.disconnect();
                voice.gain.disconnect();
            } catch {
                // Bỏ qua nếu node đã được ngắt kết nối trước đó
            }
        }, 60);

        this.voices.delete(midi);
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