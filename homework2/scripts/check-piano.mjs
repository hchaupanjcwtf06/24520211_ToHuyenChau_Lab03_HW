
import assert from 'node:assert/strict';

import {
  PIANO_NOTES,
  WHITE_NOTES,
  BLACK_NOTES,
  midiToFrequency,
} from '../src/data/piano-notes.ts';

assert.equal(PIANO_NOTES.length, 88);
assert.equal(WHITE_NOTES.length, 52);
assert.equal(BLACK_NOTES.length, 36);

assert.equal(PIANO_NOTES[0].noteName, 'A0');
assert.equal(PIANO_NOTES[0].midi, 21);

assert.equal(PIANO_NOTES[87].noteName, 'C8');
assert.equal(PIANO_NOTES[87].midi, 108);

assert.equal(midiToFrequency(69), 440);

assert.ok(
  Math.abs(midiToFrequency(60) - 261.6256) < 0.001,
);

assert.equal(
  new Set(PIANO_NOTES.map((note) => note.midi)).size,
  88,
);

console.log('PASS: 88 piano keys');
console.log('PASS: 52 white / 36 black');
console.log('PASS: A0 (MIDI 21) through C8 (MIDI 108)');
console.log('PASS: MIDI frequency calculation');
console.log('PASS: no duplicate MIDI notes');
