import { useState, useEffect, useCallback, useRef } from 'react';
import type { AirdropTimerState } from '../types/pubg';

interface UsePubgAirdropTimerOptions {
  readonly warmupTargetEpochMs: number;
  readonly expireTargetEpochMs: number;
  readonly isLootedOut?: boolean;
}

function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function usePubgAirdropTimer({
  warmupTargetEpochMs,
  expireTargetEpochMs,
  isLootedOut = false,
}: UsePubgAirdropTimerOptions): AirdropTimerState {
  const calculateCurrentState = useCallback((): AirdropTimerState => {
    const now = Date.now();

    if (isLootedOut) {
      return {
        phase: 'LOOTED_OUT',
        remainingSeconds: 0,
        formattedTime: '00:00',
        isStale: false,
        targetEpochMs: expireTargetEpochMs,
      };
    }

    if (now < warmupTargetEpochMs) {
      const remaining = Math.max(0, Math.ceil((warmupTargetEpochMs - now) / 1000));
      return {
        phase: 'WARMUP',
        remainingSeconds: remaining,
        formattedTime: formatDuration(remaining),
        isStale: false,
        targetEpochMs: warmupTargetEpochMs,
      };
    }

    if (now < expireTargetEpochMs) {
      const remaining = Math.max(0, Math.ceil((expireTargetEpochMs - now) / 1000));
      return {
        phase: 'AIRDROP_LIVE',
        remainingSeconds: remaining,
        formattedTime: formatDuration(remaining),
        isStale: false,
        targetEpochMs: expireTargetEpochMs,
      };
    }

    return {
      phase: 'EXPIRED',
      remainingSeconds: 0,
      formattedTime: '00:00',
      isStale: false,
      targetEpochMs: expireTargetEpochMs,
    };
  }, [warmupTargetEpochMs, expireTargetEpochMs, isLootedOut]);

  const [timerState, setTimerState] = useState<AirdropTimerState>(calculateCurrentState);
  // Khởi tạo ref với null để đảm bảo hàm hook pure hoàn toàn khi render
  const lastTickTimeRef = useRef<number | null>(null);

  useEffect(() => {
    lastTickTimeRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const lastTick = lastTickTimeRef.current ?? now;
      const drift = Math.abs(now - lastTick - 1000);
      lastTickTimeRef.current = now;

      const next = calculateCurrentState();
      const isStale = drift > 250;
      setTimerState({
        ...next,
        isStale,
      });
    };

    const intervalId = window.setInterval(tick, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        lastTickTimeRef.current = Date.now();
        setTimerState(calculateCurrentState());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [calculateCurrentState]);

  return timerState;
}