
import { useCallback, useState } from 'react';
import { DRUM_PADS } from '../data/drum-pads';
import { useDrumKeyboard } from '../hooks/useDrumKeyboard';
import type { DrumSoundId } from '../types/drum';
import { DrumPad } from './DrumPad';
import styles from './DrumKit.module.css';

export function DrumKit() {
  const [lastSelected, setLastSelected] =
    useState<DrumSoundId | null>(null);

  const handleTrigger = useCallback((id: DrumSoundId) => {
    // Phase 5 - Keyboard interaction only.
    // Audio will be connected in the next commit.
    setLastSelected(id);
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

      <p className={styles.status} role="status">
        {selectedPad
          ? `Triggered: ${selectedPad.label}. Audio is not connected yet.`
          : 'Press W, A, S, D, J, K or L to trigger a pad.'}
      </p>

      <p className={styles.hint}>
        Use your keyboard or click a pad.
        Multiple keys can be held at the same time.
      </p>
    </section>
  );
}
