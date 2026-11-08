
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const sampleRate = 22050;
const output = join(process.cwd(), 'public', 'samples');

mkdirSync(output, { recursive: true });

const sounds = {
  kick: 0.55,
  snare: 0.25,
  'closed-hihat': 0.12,
  'open-hihat': 0.65,
  clap: 0.28,
  tom: 0.48,
  crash: 1.2,
};

function generateSound(name, duration) {
  const count = Math.floor(sampleRate * duration);
  const pcm = Buffer.alloc(count * 2);

  let seed = 123456789;
  const noise = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 2147483648 - 1;
  };

  let phase = 0;

  for (let i = 0; i < count; i++) {
    const t = i / sampleRate;
    const x = t / duration;
    const n = noise();
    let signal = 0;

    if (name === 'kick') {
      const freq = 48 + 145 * Math.exp(-t * 30);
      phase += 2 * Math.PI * freq / sampleRate;
      signal = Math.sin(phase) * Math.exp(-t * 11);
    } else if (name === 'tom') {
      const freq = 85 + 110 * Math.exp(-t * 18);
      phase += 2 * Math.PI * freq / sampleRate;
      signal = Math.sin(phase) * Math.exp(-t * 8);
    } else if (name === 'snare') {
      signal = (
        n * 0.8 +
        Math.sin(2 * Math.PI * 180 * t) * 0.2
      ) * Math.exp(-t * 19);
    } else if (name === 'clap') {
      const burst =
        Math.exp(-t * 38) +
        0.6 * Math.exp(-Math.max(0, t - 0.035) * 48) *
        (t >= 0.035 ? 1 : 0) +
        0.35 * Math.exp(-Math.max(0, t - 0.07) * 40) *
        (t >= 0.07 ? 1 : 0);

      signal = n * burst * 0.5;
    } else if (name === 'closed-hihat') {
      signal = n * Math.exp(-t * 45);
    } else if (name === 'open-hihat') {
      signal = n * Math.exp(-t * 7);
    } else if (name === 'crash') {
      signal = n * Math.exp(-t * 3.2);
    }

    const fadeIn = Math.min(1, t * 1200);
    const fadeOut = Math.min(1, (1 - x) * 150);
    const value = Math.max(
      -1,
      Math.min(1, signal * 0.65 * fadeIn * fadeOut)
    );

    pcm.writeInt16LE(Math.round(value * 32767), i * 2);
  }

  const wav = Buffer.alloc(44 + pcm.length);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write('WAVE', 8);
  wav.write('fmt ', 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(pcm.length, 40);
  pcm.copy(wav, 44);

  return wav;
}

for (const [name, duration] of Object.entries(sounds)) {
  writeFileSync(
    join(output, `${name}.wav`),
    generateSound(name, duration)
  );

  console.log(`Generated: ${name}.wav`);
}

console.log('All 7 drum samples generated.');
