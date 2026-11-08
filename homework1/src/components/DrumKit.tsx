
import { useCallback, useEffect, useRef, useState } from 'react';
import { DRUM_PADS } from '../data/drum-pads';
import { DRUM_SAMPLES } from '../audio/sample-manifest';
import { WebDrumAudioEngine } from '../audio/drum-audio-engine';
import { useDrumKeyboard } from '../hooks/useDrumKeyboard';
import type { DrumHit, DrumSoundId } from '../types/drum';
import { DrumPad } from './DrumPad';
import { HitHistory } from './HitHistory';
import styles from './DrumKit.module.css';
import { DecibelMeter } from './DecibelMeter';

type AudioStatus = 'idle' | 'loading' | 'ready' | 'error';

const MAX_HISTORY = 8;

export function DrumKit() {
  const [lastSelected, setLastSelected] =
    useState<DrumSoundId | null>(null);

  const [hits, setHits] = useState<DrumHit[]>([]);

  const [audioStatus, setAudioStatus] =
    useState<AudioStatus>('idle');

  const [audioError, setAudioError] = useState('');
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const engineRef = useRef<WebDrumAudioEngine | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const readyPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const engine = new WebDrumAudioEngine();
    const controller = new AbortController();

    engineRef.current = engine;
    controllerRef.current = controller;
    readyPromiseRef.current = null;

    return () => {
      controller.abort();
      readyPromiseRef.current = null;
      engineRef.current = null;
      controllerRef.current = null;
      void engine.dispose();
    };
  }, []);

  const handleTrigger = useCallback((id: DrumSoundId) => {
    const engine = engineRef.current;
    const controller = controllerRef.current;

    if (!engine || !controller || controller.signal.aborted) {
      return;
    }

    if (!readyPromiseRef.current) {
      setAudioStatus('loading');
      setAudioError('');

      readyPromiseRef.current = (async () => {
        await engine.start();
        await engine.loadSamples(
          DRUM_SAMPLES,
          controller.signal
        );
      })();
    }

    const play = async () => {
      try {
        await readyPromiseRef.current;

        if (controller.signal.aborted) return;

        engine.trigger(id);
        setAnalyser(engine.getAnalyser());

        const pad = DRUM_PADS.find((item) => item.id === id);

        if (pad) {
          const hit: DrumHit = {
            id: crypto.randomUUID(),
            padId: id,
            label: pad.label,
            occurredAtMs: Date.now(),
          };

          setHits((previous) =>
            [hit, ...previous].slice(0, MAX_HISTORY)
          );
        }

        setLastSelected(id);
        setAudioStatus('ready');
      } catch (error) {
        if (controller.signal.aborted) return;
        setAnalyser(null);

        const message =
          error instanceof Error
            ? error.message
            : 'Unknown audio error';

        setAudioError(message);
        setAudioStatus('error');
        readyPromiseRef.current = null;
      }
    };

    void play();
  }, []);

  const pressedCodes = useDrumKeyboard(handleTrigger);

  const selectedPad = DRUM_PADS.find(
    (pad) => pad.id === lastSelected
  );

  return (
    <section
      className={styles.studio}
      aria-labelledby="studio-heading"
    >
      <header className={styles.heading}>
        <p className={styles.eyebrow}>
          INTERACTIVE DRUM MACHINE
        </p>

        <h2 id="studio-heading">DRUM STUDIO</h2>
        <p>Seven pads. One rhythm. Your own beat.</p>
      </header>

      <section
        className={styles.padSection}
        aria-label="Drum pad controls"
      >
        <ul className={styles.padGrid}>
          {DRUM_PADS.map((pad) => (
            <li key={pad.id}>
              <DrumPad
                pad={pad}
                isPressed={pressedCodes.has(pad.code)}
                onTrigger={handleTrigger}
              />
            </li>
          ))}
        </ul>
      </section>

      <p className={styles.status}>
        {audioStatus === 'loading'
          ? 'Loading drum sounds...'
          : audioStatus === 'error'
            ? 'Audio unavailable. Press a pad to retry.'
            : selectedPad
              ? `Triggered: ${selectedPad.label}`
              : 'Press W, A, S, D, J, K or L.'}
      </p>

      {audioStatus === 'error' && (
        <p role="alert">
          Audio error: {audioError}
        </p>
      )}

      <p className={styles.hint}>
        Use your keyboard or click a pad.
        {audioStatus === 'ready'
          ? ' Audio engine ready.'
          : ' Audio starts after your first interaction.'}
      </p>
      <DecibelMeter analyser={analyser} />
      <HitHistory hits={hits} />
    </section>
  );
}
