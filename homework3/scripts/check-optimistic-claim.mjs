import assert from 'node:assert/strict';

console.log('--- TEST: Optimistic Claim & 409 Conflict Rollback ---');

const initialItems = [
  { id: 'item-ticket', name: 'PVS Ticket', availableStock: 5 },
  { id: 'item-skin', name: 'M416 Skin', availableStock: 1 },
];

// Giả lập logic của useOptimisticClaim
class OptimisticClaimEngine {
  constructor(items) {
    this.items = JSON.parse(JSON.stringify(items));
    this.snapshot = this.items;
    this.isClaiming = false;
  }

  async claim(itemId, simulateConflict = false) {
    if (this.isClaiming) return { success: false, reason: 'IDEMPOTENCY_LOCKED' };

    const target = this.items.find(i => i.id === itemId);
    if (!target || target.availableStock <= 0) return { success: false, reason: 'OUT_OF_STOCK' };

    this.isClaiming = true;
    this.snapshot = JSON.parse(JSON.stringify(this.items));

    // 1. Optimistic Update
    target.availableStock -= 1;

    // 2. Simulating Network
    await new Promise(r => setTimeout(r, 10));

    // 3. Conflict Handling
    if (simulateConflict) {
      // Rollback
      this.items = this.snapshot;
      this.isClaiming = false;
      return { success: false, status: 409, message: 'Conflict: Looted by rival team!' };
    }

    this.isClaiming = false;
    return { success: true, status: 200 };
  }
}

const engine = new OptimisticClaimEngine(initialItems);

// Test 1: Optimistic claim thành công (200 OK)
const claim1Promise = engine.claim('item-ticket', false);
// Ngay lập tức kiểm tra tồn kho (phải bị trừ lạc quan từ 5 xuống 4)
assert.equal(engine.items.find(i => i.id === 'item-ticket').availableStock, 4);
console.log('✓ Optimistic state applied immediately (Stock decremented 5 -> 4).');

const claim1Result = await claim1Promise;
assert.equal(claim1Result.success, true);
assert.equal(engine.items.find(i => i.id === 'item-ticket').availableStock, 4);
console.log('✓ Claim completed with 200 OK, stock retained at 4.');

// Test 2: Idempotency lock (chặn click trùng lặp khi đang xử lý)
const longClaimPromise = engine.claim('item-ticket', false);
const spamClaimResult = await engine.claim('item-ticket', false);
assert.equal(spamClaimResult.reason, 'IDEMPOTENCY_LOCKED');
console.log('✓ Idempotency lock successfully rejected concurrent double-click.');
await longClaimPromise;

// Test 3: 409 Conflict Rollback
const skinBefore = engine.items.find(i => i.id === 'item-skin').availableStock;
assert.equal(skinBefore, 1);

const conflictResult = await engine.claim('item-skin', true);
assert.equal(conflictResult.status, 409);
// Xác nhận kho đã được hoàn tác về 1 thay vì bị kẹt ở 0
assert.equal(engine.items.find(i => i.id === 'item-skin').availableStock, 1);
console.log('✓ 409 Conflict caught: State cleanly rolled back to original stock (1).');

console.log('\nAll Optimistic Claim & 409 Conflict tests passed successfully!');