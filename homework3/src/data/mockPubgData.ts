import type { SupplyItem, PvsTeamStats } from '../types/pubg';

export const INITIAL_SUPPLY_ITEMS: readonly SupplyItem[] = [
  {
    id: 'supply-pvs-vip-ticket',
    name: 'Vé VIP Chung Kết PVS 2026 (Ghế Sân Khấu)',
    type: 'TICKET',
    originalStock: 10,
    availableStock: 5,
    priceVnd: 250000,
    priceGCoin: 0,
  },
  {
    id: 'supply-gcoin-crate-1000',
    name: 'Hòm Tiếp Tế Quân Trang 1.000 G-Coin',
    type: 'GCOIN',
    originalStock: 50,
    availableStock: 12,
    priceVnd: 0,
    priceGCoin: 1000,
  },
  {
    id: 'supply-m416-pvs-skin',
    name: 'Skin Độc Quyền: M416 Ngọa Long PVS Champion',
    type: 'SKIN',
    originalStock: 5,
    availableStock: 1, // Dễ mô phỏng 409 Conflict khi bị tranh loot
    priceVnd: 450000,
    priceGCoin: 1800,
  },
] as const;

export const INITIAL_PVS_LEADERBOARD: readonly PvsTeamStats[] = [
  {
    rank: 1,
    teamId: 'ces',
    teamName: 'Cerberus Esports',
    tag: 'CES',
    wwcdCount: 5,
    placementPoints: 68,
    killPoints: 84,
    totalPoints: 152,
  },
  {
    rank: 2,
    teamId: 'te',
    teamName: 'The Expendables',
    tag: 'TE',
    wwcdCount: 4,
    placementPoints: 59,
    killPoints: 78,
    totalPoints: 137,
  },
  {
    rank: 3,
    teamId: 'ge',
    teamName: 'Genius Esports',
    tag: 'GE',
    wwcdCount: 2,
    placementPoints: 44,
    killPoints: 56,
    totalPoints: 100,
  },
  {
    rank: 4,
    teamId: 'agg',
    teamName: 'All Gamers Global',
    tag: 'AGG',
    wwcdCount: 1,
    placementPoints: 36,
    killPoints: 49,
    totalPoints: 85,
  },
] as const;