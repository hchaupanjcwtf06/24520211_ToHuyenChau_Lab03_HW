import { useMemo } from 'react';
import { usePubgAirdropTimer } from './hooks/usePubgAirdropTimer';
import { KillFeedTicker } from './components/KillFeedTicker';
import { useOptimisticClaim } from './hooks/useOptimisticClaim';
import { AirdropTimerCard } from './components/AirdropTimerCard';
import { ClaimStation } from './components/ClaimStation';
import { LeaderboardTable } from './components/LeaderboardTable';
import { INITIAL_SUPPLY_ITEMS, INITIAL_PVS_LEADERBOARD } from './data/mockPubgData';
import './App.css';

// Khởi tạo mốc thời gian ở module scope (chạy 1 lần khi trang được nạp, đảm bảo purity cho React 19)
const INITIAL_NOW = Date.now();
const TIMER_TARGETS = {
  warmupTargetEpochMs: INITIAL_NOW + 20_000, // 20 giây chuẩn bị
  expireTargetEpochMs: INITIAL_NOW + 180_000, // 3 phút hoạt động
} as const;

export default function App() {
  const claimEngine = useOptimisticClaim({
    initialItems: INITIAL_SUPPLY_ITEMS,
  });

  const isAllLooted = useMemo(() => {
    return claimEngine.items.every(item => item.availableStock <= 0);
  }, [claimEngine.items]);

  const airdropTimer = usePubgAirdropTimer({
    warmupTargetEpochMs: TIMER_TARGETS.warmupTargetEpochMs,
    expireTargetEpochMs: TIMER_TARGETS.expireTargetEpochMs,
    isLootedOut: isAllLooted,
  });

  return (
    <div className="pubg-app-container">
      <header className="pubg-header">
        <div className="brand-badge">KRAFTON × PUBG VIETNAM</div>
        <h1 className="main-title">PVS 2026 Grand Finals & Airdrop Arena</h1>
        <p className="subtitle">
          Theo dõi trực tiếp bảng xếp hạng và cướp thùng thính quân trang trong thời gian thực
        </p>
      </header>

      <main className="pubg-main-content">
        <AirdropTimerCard timer={airdropTimer} />
        <KillFeedTicker />
        <ClaimStation
          items={claimEngine.items}
          claimingId={claimEngine.claimingId}
          transactionStatus={claimEngine.transactionStatus}
          errorMessage={claimEngine.errorMessage}
          isAirdropActive={airdropTimer.phase === 'AIRDROP_LIVE'}
          onClaim={claimEngine.claimItem}
          onClearError={claimEngine.clearError}
        />

        <LeaderboardTable teams={INITIAL_PVS_LEADERBOARD} />
      </main>

      <footer className="pubg-footer">
        <p>Lab 03 - Web Development Course &bull; KRAFTON & PUBG Esports Vietnam</p>
      </footer>
    </div>
  );
}