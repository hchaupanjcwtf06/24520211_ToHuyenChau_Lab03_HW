
import type { DrumHit } from '../types/drum';
import styles from './HitHistory.module.css';

interface HitHistoryProps {
  readonly hits: readonly DrumHit[];
}

export function HitHistory({ hits }: HitHistoryProps) {
  const latest = hits[0];

  return (
    <section
      className={styles.history}
      aria-labelledby="history-heading"
    >
      <header className={styles.header}>
        <h3 id="history-heading">HIT HISTORY</h3>
        <span className={styles.count}>
          {hits.length} recent hits
        </span>
      </header>

      <output
        className={styles.announcement}
        aria-live="polite"
        aria-atomic="true"
      >
        {latest
          ? `Played ${latest.label}.`
          : 'No drum hits yet.'}
      </output>

      {hits.length === 0 ? (
        <p className={styles.empty}>
          Your beat history will appear here.
        </p>
      ) : (
        <ol className={styles.list} aria-label="Recent drum hits">
          {hits.map((hit) => (
            <li className={styles.item} key={hit.id}>
              <span className={styles.hitName}>
                {hit.label}
              </span>
              <time
                className={styles.time}
                dateTime={new Date(hit.occurredAtMs).toISOString()}
              >
                {new Date(hit.occurredAtMs).toLocaleTimeString(
                  'en-US',
                  { hour12: false }
                )}
              </time>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
