# Homework 3 - KRAFTON x PUBG Vietnam Championship & Airdrop Arena
## Task Decomposition & Work Breakdown Structure (WBS)

### Phase 1 - Architecture & Contract Specification
- [x] T01: Define TypeScript contracts for AirdropTimer, ClaimItem, and Leaderboard.
- [x] T02: Configure ESLint, TypeScript strict rules, and responsive root layout.
- [x] T03: Set up deterministic mock data for PVS teams and supply drops.

### Phase 2 - Anti-Drift Timer Engine
- [x] T04: Implement usePubgAirdropTimer hook with absolute targetEpochMs.
- [x] T05: Bind document.visibilitychange event to instantly resync on tab focus.
- [x] T06: Handle 4 timer lifecycle states: WARMUP, AIRDROP_LIVE, LOOTED_OUT, EXPIRED.
- [x] T07: Create CLI test suite verifying anti-drift accuracy and tab refocus resync.

### Phase 3 - Optimistic Claim Engine & 409 Conflict Rollback
- [ ] T08: Implement useOptimisticClaim hook with immediate local quantity decrement.
- [ ] T09: Format currency with Intl.NumberFormat('vi-VN') for VND and G-Coin.
- [ ] T10: Add idempotency lock to prevent double-click race conditions.
- [ ] T11: Implement 409 Conflict server error simulation and automatic state rollback.
- [ ] T12: Render accessible live alert (<section role="alert">) on 409 failure.
- [ ] T13: Create CLI verification script for optimistic update and rollback logic.

### Phase 4 - PVS Leaderboard & Derived Filter State
- [ ] T14: Implement LeaderboardTable component with semantic W3C table markup.
- [ ] T15: Implement pure derived sorting (WWCD, Placement Points, Kill Points) without useEffect sync.
- [ ] T16: Add kill-feed search filter using normalized string queries.
- [ ] T17: Verify render isolation with React.memo for leaderboard row items.

### Phase 5 - UI Assembly & Component Integration
- [ ] T18: Build AirdropTimerCard component with military HUD styling.
- [ ] T19: Build ClaimStation component integrating optimistic transactions.
- [ ] T20: Assemble root App.tsx layout connecting Timer, ClaimStation, and Leaderboard.

### Phase 6 - Accessibility & Responsive Design
- [ ] T21: Verify WCAG 2.2 AA semantics, ARIA live regions, and tab order.
- [ ] T22: Verify zero-overflow responsive layout at 375px mobile viewport.
- [ ] T23: Audit with Google Lighthouse (Target: 100/100 Accessibility).

### Phase 7 - Quality Gate & AI Audit
- [ ] T24: Audit AI failures and document 3 forensic cases in AI_FAILURE_AUDIT.md.
- [ ] T25: Run lint and production build with zero warnings.
- [ ] T26: Final Git log inspection and submission verification.

---

## Progress Log

### Commit 29 - HW3 Setup, TypeScript Contracts & Initial Mock Data
Status: Pending.

### Commit 30 - Define PUBG Domain Contracts & Deterministic Mock Data
Status: Completed.

Scope:
- Defined immutable TypeScript interfaces for AirdropTimerState, SupplyItem, and PvsTeamStats.
- Created deterministic mock datasets for PVS teams (CES, TE, GE, AGG) and airdrop loot crates.
- Verified zero type mismatches in TypeScript build.

Next:
- Commit 31: Implement Anti-Drift Airdrop Countdown Engine with visibilitychange resync (T04, T05, T06, T07).

### Commit 31 - Implement Anti-Drift Airdrop Countdown Engine
Status: Completed.

Scope:
- Built usePubgAirdropTimer utilizing absolute target epoch timestamps to eliminate setInterval drift.
- Integrated document.visibilitychange listener to resync countdown state immediately on tab focus.
- Modeled 4 explicit lifecycle phases: WARMUP, AIRDROP_LIVE, LOOTED_OUT, EXPIRED.
- Created check-airdrop-timer.mjs CLI test verifying mathematical accuracy across simulated time shifts.

Verification:
- [x] CLI script passes all 4 phase transition checks.
- [x] ESLint passes without warnings.
- [x] Production build passes.

Next:
- Commit 32: Implement Optimistic Claim Hook with 409 Conflict Rollback (T08-T13).

