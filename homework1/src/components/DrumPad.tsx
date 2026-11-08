
import type { DrumPadProps } from '../types/drum';
import styles from './DrumPad.module.css';

export function DrumPad({
  pad,
  isPressed,
  onTrigger,
}: DrumPadProps) {
  return (
    <button
      type="button"
      className={styles.pad}
      aria-label={`${pad.label}, keyboard ${pad.keyLabel}`}
      aria-pressed={isPressed}
      data-pressed={isPressed}
      onClick={() => onTrigger(pad.id)}
    >
      <kbd className={styles.key}>{pad.keyLabel}</kbd>
      <span className={styles.name}>{pad.label}</span>
    </button>
  );
}
