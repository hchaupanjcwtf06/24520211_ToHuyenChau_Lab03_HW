import { useState, useEffect } from 'react';
import styles from './KillFeedTicker.module.css';

export interface KillFeedEvent {
  readonly id: string;
  readonly killerSquad: string;
  readonly killerName: string;
  readonly victimSquad: string;
  readonly victimName: string;
  readonly weapon: string;
  readonly isHeadshot: boolean;
  readonly timeAgoSec: number;
}

const MOCK_KILL_EVENTS: readonly Omit<KillFeedEvent, 'id' | 'timeAgoSec'>[] = [
  { killerSquad: 'CES', killerName: 'HaiSaki', victimSquad: 'TE', victimName: 'Tanx', weapon: 'Beryl M762', isHeadshot: true },
  { killerSquad: 'TE', killerName: 'Cloul', victimSquad: 'GE', victimName: 'Simon', weapon: 'M416', isHeadshot: false },
  { killerSquad: 'GE', killerName: 'Yutan', victimSquad: 'AGG', victimName: 'DuLong', weapon: 'AWM', isHeadshot: true },
  { killerSquad: 'CES', killerName: 'Taikonn', victimSquad: 'AGG', victimName: 'MeoU', weapon: 'Frag Grenade', isHeadshot: false },
  { killerSquad: 'TE', killerName: 'Tanx', victimSquad: 'CES', victimName: 'Himass', weapon: 'AUG A3', isHeadshot: true },
];

export function KillFeedTicker() {
  const [events, setEvents] = useState<readonly KillFeedEvent[]>([
    {
      id: 'initial-1',
      killerSquad: 'CES',
      killerName: 'HaiSaki',
      victimSquad: 'TE',
      victimName: 'Tanx',
      weapon: 'Beryl M762',
      isHeadshot: true,
      timeAgoSec: 2,
    },
  ]);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Hook auto-feed polling có cơ chế cleanup deterministic (Khử memory leak theo Slide 27)
  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    let eventIndex = 0;
    const intervalId = window.setInterval(() => {
      const template = MOCK_KILL_EVENTS[eventIndex % MOCK_KILL_EVENTS.length];
      const newEvent: KillFeedEvent = {
        ...template,
        id: crypto.randomUUID(),
        timeAgoSec: 1,
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 4)]);
      eventIndex += 1;
    }, 4000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused]);

  return (
    <aside className={styles.tickerContainer} aria-label="Bảng tin hạ gục trực tiếp">
      <header className={styles.header}>
        <div className={styles.titleWrap}>
          <span className={styles.liveDot} aria-hidden="true" />
          <h2 className={styles.title}>PVS Live Kill-Feed Radar</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsPaused(prev => !prev)}
          className={`${styles.pauseButton} ${isPaused ? styles.pausedActive : ''}`}
          aria-pressed={isPaused}
          aria-label={isPaused ? 'Tiếp tục nhận tín hiệu kill-feed' : 'Tạm dừng radar kill-feed'}
        >
          {isPaused ? '▶ Tiếp Tục Radar' : '⏸ Tạm Dừng Radar'}
        </button>
      </header>

      {/* role="log" cho stream log trực tiếp chuẩn WCAG A11y */}
      <output className={styles.feedList} role="log" aria-live="polite">
        {events.map(ev => (
          <div key={ev.id} className={styles.feedRow}>
            <span className={styles.killer}>
              [{ev.killerSquad}] {ev.killerName}
            </span>
            <span className={styles.weaponBadge}>
              {ev.weapon} {ev.isHeadshot && '💥 Headshot'}
            </span>
            <span className={styles.victim}>
              [{ev.victimSquad}] {ev.victimName}
            </span>
          </div>
        ))}
      </output>
    </aside>
  );
}