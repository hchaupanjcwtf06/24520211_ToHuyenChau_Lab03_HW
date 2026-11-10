# Homework 3 - KRAFTON x PUBG Vietnam Championship & Airdrop Arena
## Task Decomposition & Work Breakdown Structure (WBS)

### Phase 1 - Architecture & Contract Specification
- [ ] T01: Define TypeScript contracts for AirdropTimer, ClaimItem, and Leaderboard.
- [ ] T02: Configure ESLint, TypeScript strict rules, and responsive root layout.
- [ ] T03: Set up deterministic mock data for PVS teams and supply drops.

### Phase 2 - Anti-Drift Timer Engine
- [ ] T04: Implement usePubgAirdropTimer hook with absolute targetEpochMs.
- [ ] T05: Bind document.visibilitychange event to instantly resync on tab focus.
- [ ] T06: Handle 4 timer lifecycle states: WARMUP, AIRDROP_LIVE, LOOTED_OUT, EXPIRED.
- [ ] T07: Create CLI test suite verifying anti-drift accuracy and tab refocus resync.

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