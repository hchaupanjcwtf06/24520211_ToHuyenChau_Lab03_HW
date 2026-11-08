
import type { DrumSampleManifest } from './audio-contract';

const base = import.meta.env.BASE_URL;

export const DRUM_SAMPLES: DrumSampleManifest = {
  kick: `${base}samples/kick.wav`,
  snare: `${base}samples/snare.wav`,
  'closed-hihat': `${base}samples/closed-hihat.wav`,
  'open-hihat': `${base}samples/open-hihat.wav`,
  clap: `${base}samples/clap.wav`,
  tom: `${base}samples/tom.wav`,
  crash: `${base}samples/crash.wav`,
};
