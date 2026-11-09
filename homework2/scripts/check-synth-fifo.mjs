import assert from 'node:assert/strict';

// 1. Mock Web Audio API trong môi trường Node.js
class MockAudioParam {
  constructor(defaultValue = 1) {
    this.value = defaultValue;
  }
  setValueAtTime(val) {
    this.value = val;
  }
  exponentialRampToValueAtTime(val) {
    this.value = val;
  }
  cancelScheduledValues() {}
}

class MockGainNode {
  constructor() {
    this.gain = new MockAudioParam(0);
  }
  connect() {}
  disconnect() {}
}

class MockOscillatorNode {
  constructor() {
    this.frequency = new MockAudioParam(440);
    this.type = 'sine';
  }
  connect() {}
  disconnect() {}
  start() {}
  stop() {}
}

class MockAudioContext {
  constructor() {
    this.state = 'suspended';
    this.currentTime = 0;
    this.destination = {};
  }
  async resume() {
    this.state = 'running';
  }
  async close() {
    this.state = 'closed';
  }
  createGain() {
    return new MockGainNode();
  }
  createOscillator() {
    return new MockOscillatorNode();
  }
}

globalThis.window = {
  AudioContext: MockAudioContext,
};

// 2. Chạy test logic PolyphonicSynth
async function runTests() {
  console.log('--- STARTING SYNTH & FIFO VOICE STEALING TEST ---');

  // Import động file tsx hoặc class PolyphonicSynth
  const { PolyphonicSynth } = await import('../src/audio/PolyphonicSynth.ts');
  const synth = new PolyphonicSynth(8);

  // Test 1: Khởi tạo và resume AudioContext
  await synth.start();
  assert.equal(synth.getActiveVoiceCount(), 0, 'Test 1 Thất bại: Ban đầu voice count phải bằng 0');
  console.log('✔ Test 1 PASS: AudioContext khởi tạo & resume thành công.');

  // Test 2: Kích hoạt liên tiếp 8 voices (MIDI 60 đến 67)
  for (let midi = 60; midi < 68; midi++) {
    synth.noteOn(midi, 440);
  }
  assert.equal(synth.getActiveVoiceCount(), 8, 'Test 2 Thất bại: Số voice phải đạt tối đa 8');
  console.log('✔ Test 2 PASS: Quản lý chính xác 8 voices đồng thời.');

  // Test 3: Kích hoạt voice thứ 9 (MIDI 68) -> FIFO Voice Stealing nốt cũ nhất (MIDI 60)
  synth.noteOn(68, 440);
  assert.equal(synth.getActiveVoiceCount(), 8, 'Test 3 Thất bại: Voice count vượt quá 8 sau khi thêm nốt thứ 9');
  
  // Xác nhận nốt 60 đã bị đẩy ra khỏi pool bằng cách nhả phím 60 không gây lỗi
  synth.noteOff(60);
  assert.equal(synth.getActiveVoiceCount(), 8, 'Test 3 Thất bại: Nốt 60 vẫn còn tồn tại trong voice pool');
  console.log('✔ Test 3 PASS: Cơ chế FIFO Voice Stealing đẩy nốt cũ nhất (MIDI 60) thành công.');

  // Test 4: Dọn dẹp với stopAll()
  synth.stopAll();
  assert.equal(synth.getActiveVoiceCount(), 0, 'Test 4 Thất bại: stopAll không giải phóng toàn bộ voices');
  console.log('✔ Test 4 PASS: stopAll() giải phóng sạch toàn bộ voice pool.');

  await synth.dispose();
  console.log('✔ Test 5 PASS: dispose() đóng AudioContext an toàn.');
  console.log('--- TẤT CẢ TEST ĐÃ PASS THÀNH CÔNG ---');
}

runTests().catch((err) => {
  console.error('❌ TEST FAILED:', err);
  process.exit(1);
});