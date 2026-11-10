
# Bonus Exercise - 'Hẹn Hò Nhưng Không Yêu' State Machine
## Task Decomposition & Work Breakdown Structure (WBS)

### Phase 1 - FSM Contract & State Specification
- [ ] T01: Define RelationshipPhase FSM contract ('FRIENDS' | 'DATING_NO_LOVE' | 'OFFICIAL_LOVE' | 'GHOSTED_EXIT').
- [ ] T02: Model Asymmetric Effort Formula ('Em cố 100 lần < Ai đó 1 phần') with immutable signal log.
- [ ] T03: Write CLI test check-situationship-fsm.mjs to verify deterministic state transitions.

### Phase 2 - UI Assembly & Ghosting Cleanup
- [ ] T04: Implement 5-second 'Seen Không Rep' countdown timer with leak-free useEffect cleanup.
- [ ] T05: Build accessible SituationshipAnalyzer component with WCAG AA contrast and useId() labels.
- [ ] T06: Style responsive 375px mobile UI with zero horizontal overflow.
- [ ] T07: Run ESLint, production build, and finalize commits matching Slide 34.

---

## Progress Log
- Commit 1: feat(fsm): model HenHoKhongYeu state machine
- Commit 2: feat(ui): add derived red-flag meter & ghosting cleanup