import assert from 'node:assert/strict';

function abortableSleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error('AbortError'));
      return;
    }
    const timer = setTimeout(() => {
      resolve();
    }, ms);

    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new Error('AbortError'));
      },
      { once: true }
    );
  });
}

async function runPlayback(notes, speed, signal, eventsLog) {
  for (const note of notes) {
    if (signal.aborted) break;
    const scaledDelta = note.deltaMs / speed;
    if (scaledDelta > 0) {
      await abortableSleep(scaledDelta, signal);
    }
    eventsLog.push(`ON_${note.midi}`);
    const scaledDuration = note.durationMs / speed;
    await abortableSleep(scaledDuration, signal);
    eventsLog.push(`OFF_${note.midi}`);
  }
}

async function testPlayback() {
  console.log('--- STARTING PLAYBACK & ABORTCONTROLLER TESTS ---');

  const sampleNotes = [
    { midi: 60, freqHz: 261.63, deltaMs: 50, durationMs: 50 },
    { midi: 64, freqHz: 329.63, deltaMs: 50, durationMs: 50 },
    { midi: 67, freqHz: 392.0, deltaMs: 50, durationMs: 50 },
  ];

  // Test 1: FIFO playback ở tốc độ 1x
  {
    const events = [];
    const controller = new AbortController();
    await runPlayback(sampleNotes, 1, controller.signal, events);

    assert.deepEqual(
      events,
      ['ON_60', 'OFF_60', 'ON_64', 'OFF_64', 'ON_67', 'OFF_67'],
      'Các nốt phải phát đúng thứ tự FIFO'
    );
    console.log('✔ Test 1 PASS: Phát lại theo đúng thứ tự FIFO ở tốc độ 1x.');
  }

  // Test 2: Hủy tức thời bằng AbortController
  {
    const events = [];
    const controller = new AbortController();

    const playbackPromise = runPlayback(sampleNotes, 1, controller.signal, events).catch(
      (err) => err.message
    );

    // Hủy sau 70ms (khi nốt 1 đã bật nhưng nốt 2 chưa kịp chạy xong)
    setTimeout(() => {
      controller.abort();
    }, 70);

    await playbackPromise;

    assert.ok(
      !events.includes('ON_67'),
      'Nốt thứ 3 không được phép phát sau khi đã gọi abort()'
    );
    console.log('✔ Test 2 PASS: AbortController ngắt luồng phát lại tức thì.');
  }

  // Test 3: Co giãn thời gian theo tốc độ 2x
  {
    const controller = new AbortController();
    const start = Date.now();
    const events = [];
    await runPlayback([{ midi: 60, freqHz: 261.63, deltaMs: 0, durationMs: 60 }], 2, controller.signal, events);
    const elapsed = Date.now() - start;

    // Ở tốc độ 2x, 60ms duration chạy trong khoảng 30ms (+-15ms sai số timer nodejs)
    assert.ok(elapsed < 50, `Tốc độ 2x phải rút ngắn thời gian phát (thực tế: ${elapsed}ms)`);
    console.log('✔ Test 3 PASS: Tốc độ 2x co giãn thời gian phát chính xác.');
  }

  console.log('--- TOÀN BỘ TEST PLAYBACK & ABORTCONTROLLER ĐÃ ĐẠT CHUẨN ---');
}

testPlayback();