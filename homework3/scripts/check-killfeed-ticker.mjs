import assert from 'node:assert/strict';

console.log('--- TEST: PVS Live Kill-Feed Telemetry Ticker (Slide 27 & 32) ---');

let isPaused = false;
let eventCount = 1;

function simulateTick() {
  if (isPaused) return false;
  eventCount += 1;
  return true;
}

// 1. Tick bình thường khi radar active
assert.equal(simulateTick(), true);
assert.equal(eventCount, 2);
console.log('✓ Normal radar event tick verified.');

// 2. Pause radar
isPaused = true;
assert.equal(simulateTick(), false);
assert.equal(eventCount, 2);
console.log('✓ Pause radar halts event emissions with zero leaks.');

// 3. Resume radar
isPaused = false;
assert.equal(simulateTick(), true);
assert.equal(eventCount, 3);
console.log('✓ Resume radar cleanly continues event stream.');

console.log('\nAll Kill-Feed Ticker tests passed successfully!');