
import { useState } from 'react';
import { DRUM_PADS } from '../data/drum-pads';
import type { DrumSoundId } from '../types/drum';
import { DrumPad } from './DrumPad';
import styles from './DrumKit.module.css';

export function DrumKit() {
  const [lastSelected, setLastSelected] =
    useState<DrumSoundId | null>(null);

  function handleTrigger(id: DrumSoundId) {
    // Temporary UI-only interaction.
    // Audio playback will be implemented in Phase 5.
    setLastSelected(id);
  }

  const selectedPad =
    DRUM_PADS.find((pad) => pad.id === lastSelected);

  return (
    <section
      className={styles.studio}
      aria-labelledby="studio-heading"
    >
      <header className={styles.heading}>
        <p className={styles.eyebrow}>INTERACTIVE DRUM MACHINE</p>
        <h2 id="studio-heading">DRUM STUDIO</h2>
        <p>
          Seven pads. One rhythm. Your own beat.
        </p>
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
                isPressed={false}
                onTrigger={handleTrigger}
              />
            </li>
          ))}
        </ul>
      </section>

      <p className={styles.status} role="status">
        {selectedPad
          ? `Preview: ${selectedPad.label} selected. Audio is not connected yet.`
          : 'Select a drum pad to preview its control.'}
      </p>

      <p className={styles.hint}>
        Keyboard shortcuts and sound playback
        will be enabled in the next phase.
      </p>
    </section>
  );
}
