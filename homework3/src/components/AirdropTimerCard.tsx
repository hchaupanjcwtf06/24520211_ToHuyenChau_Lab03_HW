import type { AirdropTimerState } from '../types/pubg';
import styles from './AirdropTimerCard.module.css';

interface AirdropTimerCardProps {
  readonly timer: AirdropTimerState;
}

export function AirdropTimerCard({ timer }: AirdropTimerCardProps) {
  const getPhaseBadge = () => {
    switch (timer.phase) {
      case 'WARMUP':
        return <span className={`${styles.badge} ${styles.badgeWarmup}`}>Máy Bay Đang Thả Thính</span>;
      case 'AIRDROP_LIVE':
        return <span className={`${styles.badge} ${styles.badgeLive}`}>Thính Đã Tiếp Đất - Mở Hòm!</span>;
      case 'LOOTED_OUT':
        return <span className={`${styles.badge} ${styles.badgeLooted}`}>Đã Bị Loot Sạch</span>;
      case 'EXPIRED':
        return <span className={`${styles.badge} ${styles.badgeExpired}`}>Thùng Thính Hết Hạn</span>;
    }
  };

  return (
    <section className={styles.timerCard} aria-labelledby="airdrop-timer-heading">
      <div className={styles.header}>
        <h2 id="airdrop-timer-heading" className={styles.title}>
          Đồng Hồ Thính Khẩn Cấp (Anti-Drift)
        </h2>
        {getPhaseBadge()}
      </div>

      <div className={styles.displayArea}>
        <output
          className={styles.timeOutput}
          aria-live="polite"
          aria-atomic="true"
        >
          {timer.formattedTime}
        </output>
        <span className={styles.unitLabel}>
          {timer.phase === 'WARMUP' ? 'Thời gian đến khi thính rơi' : 'Thời gian tồn tại còn lại'}
        </span>
      </div>

      {timer.isStale && (
        <p className={styles.staleNotice} role="status">
          Phát hiện chuyển tab nền: Đồng hồ đã tự động tái đồng bộ mốc thời gian tuyệt đối.
        </p>
      )}
    </section>
  );
}