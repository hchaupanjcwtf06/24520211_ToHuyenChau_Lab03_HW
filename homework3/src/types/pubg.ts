/**
 * 4 trạng thái vòng đời của thùng thính Airdrop
 */
export type AirdropPhase = 'WARMUP' | 'AIRDROP_LIVE' | 'LOOTED_OUT' | 'EXPIRED';

/**
 * Dữ liệu trạng thái xuất ra từ usePubgAirdropTimer hook
 */
export interface AirdropTimerState {
  readonly phase: AirdropPhase;
  readonly remainingSeconds: number;
  readonly formattedTime: string;
  readonly isStale: boolean;
  readonly targetEpochMs: number;
}

/**
 * Trạng thái giao dịch khi người dùng ấn nút Nhận (Claim)
 */
export type ClaimTransactionStatus = 'idle' | 'claiming' | 'success' | 'conflict_error';

/**
 * Vật phẩm quà tặng hoặc vé sự kiện PVS
 */
export interface SupplyItem {
  readonly id: string;
  readonly name: string;
  readonly type: 'TICKET' | 'GCOIN' | 'SKIN';
  readonly originalStock: number;
  readonly availableStock: number;
  readonly priceVnd: number;
  readonly priceGCoin: number;
  readonly imageUrl?: string;
}

/**
 * Thông số thi đấu của các đội tuyển PUBG Vietnam Series (PVS)
 */
export interface PvsTeamStats {
  readonly rank: number;
  readonly teamId: string;
  readonly teamName: string;
  readonly tag: string;
  readonly wwcdCount: number;
  readonly placementPoints: number;
  readonly killPoints: number;
  readonly totalPoints: number;
}

/**
 * Tiêu chí sắp xếp bảng xếp hạng
 */
export type LeaderboardSortField = 'rank' | 'totalPoints' | 'killPoints' | 'wwcdCount';
export type SortDirection = 'asc' | 'desc';