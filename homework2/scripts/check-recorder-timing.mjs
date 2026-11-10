import assert from 'node:assert/strict';

function testRecorderLogic() {
  console.log('--- STARTING NOTE EVENT RECORDING & TIMING TEST ---');

  const recordedNotes = [];
  const activeStarts = new Map();
  let lastEventTime = 1000; // Mock timestamp ban đầu

  // Mock hàm recordNoteOn
  function onNoteOn(midi, freq, now) {
    const delta = Math.max(0, Math.round(now - lastEventTime));
    activeStarts.set(midi, now);
    activeStarts.set(-midi, delta);
    lastEventTime = now;
  }

  // Mock hàm recordNoteOff
  function onNoteOff(midi, freq, now) {
    const startTime = activeStarts.get(midi);
    assert.notEqual(startTime, undefined, 'Phải có startTime tương ứng');
    const durationMs = Math.max(10, Math.round(now - startTime));
    const deltaMs = activeStarts.get(-midi);

    activeStarts.delete(midi);
    activeStarts.delete(-midi);

    recordedNotes.push({ midi, freqHz: freq, durationMs, deltaMs });
  }

  // Giả lập kịch bản:
  // 1. Nhấn C4 (MIDI 60) tại t = 1200ms -> deltaMs = 200ms
  onNoteOn(60, 261.63, 1200);

  // 2. Nhả C4 tại t = 1500ms -> durationMs = 300ms
  onNoteOff(60, 261.63, 1500);

  // 3. Nhấn D4 (MIDI 62) tại t = 1800ms -> deltaMs = 600ms (1800 - 1200)
  onNoteOn(62, 293.66, 1800);

  // 4. Nhả D4 tại t = 2000ms -> durationMs = 200ms
  onNoteOff(62, 293.66, 2000);

  // Kiểm tra tính toàn vẹn của kết quả
  assert.equal(recordedNotes.length, 2, 'Phải ghi nhận đủ 2 nốt');

  assert.equal(recordedNotes[0].midi, 60);
  assert.equal(recordedNotes[0].deltaMs, 200);
  assert.equal(recordedNotes[0].durationMs, 300);
  console.log('✔ Test 1 PASS: Nốt đầu tiên tính đúng deltaMs (200ms) và durationMs (300ms).');

  assert.equal(recordedNotes[1].midi, 62);
  assert.equal(recordedNotes[1].deltaMs, 600);
  assert.equal(recordedNotes[1].durationMs, 200);
  console.log('✔ Test 2 PASS: Nốt thứ hai ghi nhận đúng khoảng cách thời gian FIFO.');

  console.log('--- TOÀN BỘ TEST RECORDING & TIMING ĐÃ PASS ---');
}

testRecorderLogic();