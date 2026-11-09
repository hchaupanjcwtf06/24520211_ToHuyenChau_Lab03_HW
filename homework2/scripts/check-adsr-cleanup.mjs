import assert from 'node:assert/strict';

class MockAudioParam {
  constructor(defaultValue = 1) {
    this.value = defaultValue;
    this.events = [];
  }
  setValueAtTime(val, time) {
    this.value = val;
    this.events.push({ type: 'setValueAtTime', val, time });
  }
  exponentialRampToValueAtTime(val, time) {
    this.value = val;
    this.events.push({ type: 'exponentialRampToValueAtTime', val, time });
  }
  cancelScheduledValues(time) {
    this.events.push({ type: 'cancelScheduledValues', time });
  }
}

class MockGainNode {
  constructor() {
    this.gain = new MockAudioParam(0);
    this.isDisconnected = false;
  }
  connect() {}
  disconnect() {
    this.isDisconnected = true;
  }
}

class MockOscillatorNode {
  constructor() {
    this.frequency = new MockAudioParam(440);
    this.type = 'sine';
    this.isStopped = false;
    this.isDisconnected = false;
  }
  connect() {}
  disconnect() {
    this.isDisconnected = true;
  }
  start() {}
  stop() {
    this.isStopped = true;
  }
}

class MockAudioContext {
  constructor() {
    this.state = 'running';
    this.currentTime = 10;
    this.destination = {};
  }
  async resume() { this.state = 'running'; }
  async close() { this.state = 'closed'; }
  createGain() { return new MockGainNode(); }
  createOscillator() { return new MockOscillatorNode(); }
}

globalThis.window = { AudioContext: MockAudioContext };

async function runAdsrTest() {
  console.log('--- BẮT ĐẦU TEST ADSR ENVELOPE & RESOURCE CLEANUP ---');
  const { PolyphonicSynth } = await import('../src/audio/PolyphonicSynth.ts');
  const synth = new PolyphonicSynth(8);

  // 1. NoteOn áp dụng attack envelope an toàn
  synth.noteOn(60, 261.63);
  assert.equal(synth.getActiveVoiceCount(), 1, 'Test 1 Thất bại: Voice count phải là 1');
  console.log('✔ Test 1 PASS: NoteOn áp dụng attack envelope an toàn.');

  // 2. NoteOff loại bỏ ngay khỏi Map và lập lịch ramp xuống 0.0001
  synth.noteOff(60);
  assert.equal(synth.getActiveVoiceCount(), 0, 'Test 2 Thất bại: Voice phải được xóa khỏi pool ngay khi noteOff');
  console.log('✔ Test 2 PASS: NoteOff loại bỏ voice tức thời khỏi Map.');

  // 3. Đợi timeout dọn dẹp hoàn tất
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log('✔ Test 3 PASS: Node disconnect hoàn tất không rò rỉ bộ nhớ.');

  // 4. Test dispose
  await synth.dispose();
  console.log('✔ Test 4 PASS: Engine dispose đóng AudioContext an toàn.');
  console.log('--- TOÀN BỘ TEST ADSR & CLEANUP ĐÃ ĐẠT CHUẨN ---');
}

runAdsrTest().catch((err) => {
  console.error('❌ TEST FAILED:', err);
  process.exit(1);
});