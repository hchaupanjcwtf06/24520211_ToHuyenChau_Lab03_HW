import { useState, useMemo, useId, useCallback } from 'react';
import type { PvsTeamStats, LeaderboardSortField, SortDirection } from '../types/pubg';
import { LeaderboardRow } from './LeaderboardRow';
import styles from './LeaderboardTable.module.css';

interface LeaderboardTableProps {
  readonly teams: readonly PvsTeamStats[];
}

export function LeaderboardTable({ teams }: LeaderboardTableProps) {
  const searchInputId = useId();
  const sortSelectId = useId();
  const pinnedFilterId = useId();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<LeaderboardSortField>('totalPoints');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [pinnedSquadIds, setPinnedSquadIds] = useState<ReadonlySet<string>>(new Set(['te']));
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  const togglePin = useCallback((teamId: string) => {
    setPinnedSquadIds(prev => {
      const next = new Set(prev);
      if (next.has(teamId)) {
        next.delete(teamId);
      } else {
        next.add(teamId);
      }
      return next;
    });
  }, []);

  // Pure Derived State: Lọc và sắp xếp hoàn toàn trong render pass, zero useEffect
  const processedTeams = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = teams.filter(team => {
      const matchesSearch =
        team.teamName.toLowerCase().includes(normalizedQuery) ||
        team.tag.toLowerCase().includes(normalizedQuery);
      const matchesPinned = showPinnedOnly ? pinnedSquadIds.has(team.teamId) : true;
      return matchesSearch && matchesPinned;
    });

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'rank') {
        comparison = a.rank - b.rank;
      } else if (sortField === 'totalPoints') {
        comparison = a.totalPoints - b.totalPoints;
      } else if (sortField === 'killPoints') {
        comparison = a.killPoints - b.killPoints;
      } else if (sortField === 'wwcdCount') {
        comparison = a.wwcdCount - b.wwcdCount;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [teams, searchQuery, sortField, sortDirection, pinnedSquadIds, showPinnedOnly]);

  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <section className={styles.leaderboardSection} aria-labelledby="leaderboard-heading">
      <div className={styles.headerRow}>
        <h2 id="leaderboard-heading" className={styles.title}>
          Bảng Xếp Hạng PUBG Vietnam Series 2026
        </h2>
        <span className={styles.metaBadge}>Vòng Chung Kết Trực Tiếp</span>
      </div>

      <fieldset className={styles.toolbar}>
        <legend className={styles.srOnly}>Bộ lọc bảng xếp hạng</legend>

        <div className={styles.controlGroup}>
          <label htmlFor={searchInputId} className={styles.label}>
            Tìm đội tuyển:
          </label>
          <input
            id={searchInputId}
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Nhập tên đội hoặc TAG (CES, TE...)"
            className={styles.searchInput}
          />
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor={sortSelectId} className={styles.label}>
            Sắp xếp theo:
          </label>
          <select
            id={sortSelectId}
            value={sortField}
            onChange={e => setSortField(e.target.value as LeaderboardSortField)}
            className={styles.select}
          >
            <option value="totalPoints">Tổng Điểm</option>
            <option value="killPoints">Điểm Hạ Gục (Kill Points)</option>
            <option value="wwcdCount">Số Trận Thắng (WWCD)</option>
            <option value="rank">Hạng Chính Thức</option>
          </select>

          <button
            type="button"
            onClick={toggleSortDirection}
            className={styles.directionButton}
            aria-label={`Thứ tự: ${sortDirection === 'desc' ? 'Giảm dần' : 'Tăng dần'}`}
          >
            {sortDirection === 'desc' ? '↓ Giảm dần' : '↑ Tăng dần'}
          </button>
        </div>

        <div className={styles.checkboxGroup}>
          <input
            id={pinnedFilterId}
            type="checkbox"
            checked={showPinnedOnly}
            onChange={e => setShowPinnedOnly(e.target.checked)}
            className={styles.checkbox}
          />
          <label htmlFor={pinnedFilterId} className={styles.checkboxLabel}>
            ⭐ Chỉ hiện đội đã ghim ({pinnedSquadIds.size})
          </label>
        </div>
      </fieldset>

      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>
            Bảng thống kê điểm số và số trận thắng của các đội tuyển PVS
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.thPin} aria-label="Ghim">★</th>
              <th scope="col" className={styles.thRank}>Hạng</th>
              <th scope="col" className={styles.thTeam}>Đội Tuyển</th>
              <th scope="col" className={styles.thNum}>WWCD</th>
              <th scope="col" className={styles.thNum}>Điểm Hạng</th>
              <th scope="col" className={styles.thNum}>Điểm Kill</th>
              <th scope="col" className={styles.thNum}>Tổng Điểm</th>
            </tr>
          </thead>
          <tbody>
            {processedTeams.length > 0 ? (
              processedTeams.map(team => (
                <LeaderboardRow
                  key={team.teamId}
                  team={team}
                  isHighlighted={searchQuery.trim().length > 0}
                  isPinned={pinnedSquadIds.has(team.teamId)}
                  onTogglePin={togglePin}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.emptyCell}>
                  Không tìm thấy đội tuyển phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}