import { useReducer, useState, useEffect, useId, useMemo } from 'react';
import type { EffortSignal } from '../types/situationship';
import { situationshipReducer } from '../reducers/situationshipReducer';
import styles from './SituationshipAnalyzer.module.css';

const INITIAL_SIGNALS: readonly EffortSignal[] = [
  { id: 'sig-1', actor: 'EM', description: 'Chủ động quan tâm, gửi tin nhắn mỗi sáng (100 lần)', timestamp: 1 },
  { id: 'sig-2', actor: 'AI_DO', description: 'Thả 1 icon vu vơ trên story', timestamp: 2 },
];

export function SituationshipAnalyzer() {
  const myTriesId = useId();
  const rivalTriesId = useId();

  // 1. Core State Machine với useReducer & Transition Guard (Slide 33)
  const [phase, dispatchPhase] = useReducer(situationshipReducer, 'DATING_NO_LOVE');
  const [myTries, setMyTries] = useState<number>(100);
  const [rivalTries, setRivalTries] = useState<number>(1);
  const [signals, setSignals] = useState<readonly EffortSignal[]>(INITIAL_SIGNALS);
  const [ghostingCountdown, setGhostingCountdown] = useState<number>(5);

  // 2. Pure Derived State: Asymmetric Effort & Red-Flag (Slide 33)
  const myImpact = useMemo(() => Math.round(myTries * 0.1 * 10) / 10, [myTries]);
  const rivalImpact = useMemo(() => Math.round(rivalTries * 50.0 * 10) / 10, [rivalTries]);
  const isRedFlag = phase === 'DATING_NO_LOVE' && myImpact < rivalImpact;

  // 3. 'Seen Không Rep' Ghosting Countdown & Cleanup (Slide 34)
  useEffect(() => {
    if (phase !== 'DATING_NO_LOVE') {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setGhostingCountdown(prev => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          dispatchPhase({ type: 'TRIGGER_GHOSTED' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [phase, myTries]);

  const handleAddMyEffort = () => {
    setMyTries(prev => prev + 10);
    setGhostingCountdown(5);
    setSignals(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        actor: 'EM',
        description: 'Tiếp tục chủ động nhắn tin hồi hộp chờ đợi...',
        timestamp: Date.now(),
      },
    ]);
  };

  const handleAddRivalEffort = () => {
    setRivalTries(prev => prev + 1);
    setSignals(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        actor: 'AI_DO',
        description: 'Ai đó chỉ cần xuất hiện mỉm cười một phần...',
        timestamp: Date.now(),
      },
    ]);
  };

  const handleReset = () => {
    dispatchPhase({ type: 'RESET_TO_DATING' });
    setMyTries(100);
    setRivalTries(1);
    setGhostingCountdown(5);
  };

  return (
    <article className={styles.analyzerCard} aria-labelledby="fsm-analyzer-title">
      <header className={styles.header}>
        <span className={styles.tagline}>V-POP FINITE STATE MACHINE (WENDY THẢO)</span>
        <h2 id="fsm-analyzer-title" className={styles.title}>
          &apos;Hẹn Hò Nhưng Không Yêu&apos; Situationship Analyzer
        </h2>
        <div className={styles.phaseIndicator}>
          Trạng thái hiện tại:{' '}
          <span className={`${styles.phaseBadge} ${styles[phase]}`}>
            {phase === 'FRIENDS' && 'Bạn Bè Thuần Túy'}
            {phase === 'DATING_NO_LOVE' && 'Mập Mờ (Hẹn Hò Không Yêu)'}
            {phase === 'OFFICIAL_LOVE' && 'Chính Thức Yêu Đương'}
            {phase === 'GHOSTED_EXIT' && 'Đã Rút Lui (Giải Phóng Bộ Nhớ)'}
          </span>
        </div>
      </header>

      {/* Screen-reader Live Status Announcement (Slide 33) */}
      <output className={styles.liveStatus} role="status" aria-live="polite">
        {isRedFlag
          ? `[CẢNH BÁO RED-FLAG] Điểm nỗ lực của bạn (${myImpact}) thua xa ai đó (${rivalImpact})! Tự động giải phóng bộ nhớ sau ${ghostingCountdown}s!`
          : phase === 'GHOSTED_EXIT'
          ? 'Đã tự giải thoát: Mối quan hệ mập mờ đã được Unbind & Thu gom rác (GC)!'
          : 'Trạng thái quan hệ đang ở mức ổn định.'}
      </output>

      {phase !== 'GHOSTED_EXIT' ? (
        <div className={styles.bodyGrid}>
          <fieldset className={styles.controlsFieldset}>
            <legend className={styles.srOnly}>Điều chỉnh chỉ số nỗ lực đôi bên</legend>

            <div className={styles.controlRow}>
              <label htmlFor={myTriesId} className={styles.controlLabel}>
                Em cố gắng (Số lần): <strong>{myTries}</strong>
              </label>
              <input
                id={myTriesId}
                type="range"
                min="0"
                max="500"
                step="10"
                value={myTries}
                onChange={e => {
                  setMyTries(e.target.valueAsNumber || 0);
                  setGhostingCountdown(5);
                }}
                className={styles.rangeInput}
              />
              <span className={styles.impactScore}>
                Trọng số (0.1x): <strong>{myImpact} điểm</strong>
              </span>
            </div>

            <div className={styles.controlRow}>
              <label htmlFor={rivalTriesId} className={styles.controlLabel}>
                Ai đó nỗ lực (Số lần): <strong>{rivalTries}</strong>
              </label>
              <input
                id={rivalTriesId}
                type="range"
                min="0"
                max="10"
                step="1"
                value={rivalTries}
                onChange={e => setRivalTries(e.target.valueAsNumber || 0)}
                className={styles.rangeInput}
              />
              <span className={styles.impactScore}>
                Trọng số (50.0x): <strong>{rivalImpact} điểm</strong>
              </span>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={handleAddMyEffort}
                className={styles.btnSecondary}
              >
                +10 Lần Cố Gắng (Em)
              </button>
              <button
                type="button"
                onClick={handleAddRivalEffort}
                className={styles.btnSecondary}
              >
                +1 Lần Xuất Hiện (Ai Đó)
              </button>
              <button
                type="button"
                onClick={() => dispatchPhase({ type: 'TRIGGER_GHOSTED' })}
                className={styles.btnDanger}
              >
                Unbind & Free Memory (Dừng Lại)
              </button>
            </div>
          </fieldset>

          <section className={styles.logSection} aria-label="Nhật ký tương tác">
            <h3 className={styles.logTitle}>Nhật Ký Tín Hiệu Nỗ Lực</h3>
            <ul className={styles.logList}>
              {signals.map(s => (
                <li key={s.id} className={styles.logItem}>
                  <strong className={s.actor === 'EM' ? styles.actorEm : styles.actorRival}>
                    [{s.actor === 'EM' ? 'EM' : 'AI ĐÓ'}]:
                  </strong>{' '}
                  {s.description}
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <div className={styles.exitBox}>
          <p className={styles.exitMessage}>
            &ldquo;Hẹn hò nhưng không yêu, chắc em là kẻ mất trí...&rdquo; &rarr; <strong>Đã Thoát Khỏi Situationship.</strong>
          </p>
          <button
            type="button"
            onClick={handleReset}
            className={styles.btnReset}
          >
            Tái Khởi Động Trái Tim (Reset FSM)
          </button>
        </div>
      )}
    </article>
  );
}