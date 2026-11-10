import assert from 'node:assert/strict';

console.log('--- TEST 1: Anti-Drift Mathematical Determinism ---');
const now = Date.now();
const warmupTarget = now + 15_000;
const expireTarget = now + 45_000;

function computeState(currentTime, isLooted = false) {
  if (isLooted) {
    return { phase: 'LOOTED_OUT', remaining: 0 };
  }
  if (currentTime < warmupTarget) {
    return {
      phase: 'WARMUP',
      remaining: Math.max(0, Math.ceil((warmupTarget - currentTime) / 1000)),
    };
  }
  if (currentTime < expireTarget) {
    return {
      phase: 'AIRDROP_LIVE',
      remaining: Math.max(0, Math.ceil((expireTarget - currentTime) / 1000)),
    };
  }
  return { phase: 'EXPIRED', remaining: 0 };
}

// 1. Kiểm tra pha WARMUP
const stateWarmup = computeState(now);
assert.equal(stateWarmup.phase, 'WARMUP');
assert.equal(stateWarmup.remaining, 15);
console.log('✓ WARMUP state initialized accurately at 15s.');

// 2. Giả lập tua nhanh 16 giây (vượt qua WARMUP vào AIRDROP_LIVE)
const stateLive = computeState(now + 16_000);
assert.equal(stateLive.phase, 'AIRDROP_LIVE');
assert.equal(stateLive.remaining, 29);
console.log('✓ AIRDROP_LIVE phase entered with zero accumulated drift.');

// 3. Giả lập hết sạch hàng (LOOTED_OUT)
const stateLooted = computeState(now + 20_000, true);
assert.equal(stateLooted.phase, 'LOOTED_OUT');
assert.equal(stateLooted.remaining, 0);
console.log('✓ LOOTED_OUT phase prioritized immediately.');

// 4. Giả lập hết hạn (EXPIRED)
const stateExpired = computeState(now + 50_000, false);
assert.equal(stateExpired.phase, 'EXPIRED');
assert.equal(stateExpired.remaining, 0);
console.log('✓ EXPIRED phase triggered after expiration timestamp.');

console.log('\nAll Airdrop Anti-Drift Timer tests passed successfully!');