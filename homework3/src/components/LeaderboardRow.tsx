import { memo } from 'react';
import type { PvsTeamStats } from '../types/pubg';
import styles from './LeaderboardTable.module.css';

interface LeaderboardRowProps {
  readonly team: PvsTeamStats;
  readonly isHighlighted?: boolean;
}

export const LeaderboardRow = memo(function LeaderboardRow({
  team,
  isHighlighted = false,
}: LeaderboardRowProps) {
  const isTop3 = team.rank <= 3;

  return (
    <tr
      className={`${styles.row} ${isHighlighted ? styles.highlightedRow : ''}`}
      data-rank={team.rank}
    >
      <td className={styles.rankCell}>
        <span className={`${styles.badge} ${isTop3 ? styles.topRankBadge : ''}`}>
          #{team.rank}
        </span>
      </td>
      <td className={styles.teamCell}>
        <div className={styles.teamInfo}>
          <span className={styles.teamTag}>[{team.tag}]</span>
          <span className={styles.teamName}>{team.teamName}</span>
        </div>
      </td>
      <td className={styles.numCell}>{team.wwcdCount}</td>
      <td className={styles.numCell}>{team.placementPoints}</td>
      <td className={styles.numCell}>{team.killPoints}</td>
      <td className={`${styles.numCell} ${styles.totalPointsCell}`}>
        <strong>{team.totalPoints}</strong>
      </td>
    </tr>
  );
});