
import { useEffect, useRef } from 'react';
import styles from './DecibelMeter.module.css';

interface DecibelMeterProps {
  readonly analyser: AnalyserNode | null;
}

const MIN_DB = -60;
const MAX_DB = 0;
const UPDATE_INTERVAL_MS = 80;

export function DecibelMeter({ analyser }: DecibelMeterProps) {
  const meterRef = useRef<HTMLMeterElement>(null);
  const valueRef = useRef<HTMLOutputElement>(null);

  useEffect(() => {
    const meter = meterRef.current;
    const output = valueRef.current;

    if (!analyser || !meter || !output) return;

    const samples = new Float32Array(analyser.fftSize);
    let frameId = 0;
    let previousTime = 0;

    const draw = (time: number) => {
      if (time - previousTime >= UPDATE_INTERVAL_MS) {
        previousTime = time;

        analyser.getFloatTimeDomainData(samples);

        let sumSquares = 0;

        for (let i = 0; i < samples.length; i++) {
          sumSquares += samples[i] * samples[i];
        }

        const rms = Math.sqrt(sumSquares / samples.length);

        const dbfs = rms > 0
          ? 20 * Math.log10(rms)
          : MIN_DB;

        const clamped = Math.max(
          MIN_DB,
          Math.min(MAX_DB, dbfs)
        );

        meter.value = clamped;
        output.textContent = `${clamped.toFixed(1)} dBFS`;
      }

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [analyser]);

  return (
    <section
      className={styles.panel}
      aria-labelledby="meter-heading"
    >
      <header className={styles.header}>
        <h3 id="meter-heading">LIVE AUDIO LEVEL</h3>
        <span className={styles.unit}>RMS / dBFS</span>
      </header>

      <output
        ref={valueRef}
        className={styles.reading}
        aria-live="off"
      >
        {analyser ? '-60.0 dBFS' : 'Audio inactive'}
      </output>

      <meter
        ref={meterRef}
        className={styles.meter}
        min={MIN_DB}
        max={MAX_DB}
        value={MIN_DB}
        aria-label="Audio level in dBFS"
      />

      <footer className={styles.scale}>
        <span>-60 dBFS</span>
        <span>0 dBFS</span>
      </footer>

      <p className={styles.description}>
        RMS audio level measured from the Web Audio signal.
        Silence is displayed at the -60 dBFS meter floor.
      </p>
    </section>
  );
}
