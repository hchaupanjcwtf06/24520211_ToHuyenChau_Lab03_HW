
import { useEffect, useState } from 'react';
import { DRUM_PAD_MAP } from '../data/drum-pads';
import type { DrumKeyCode, DrumSoundId } from '../types/drum';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;

  return (
    target.closest('input, textarea, select') !== null ||
    (target instanceof HTMLElement && target.isContentEditable) ||
    target.closest('[contenteditable="true"], [contenteditable=""]') !== null
  );
}

export function useDrumKeyboard(
  onTrigger: (id: DrumSoundId) => void
) {
  const [pressedCodes, setPressedCodes] =
    useState<ReadonlySet<DrumKeyCode>>(() => new Set());

  useEffect(() => {
    const heldCodes = new Set<DrumKeyCode>();

    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;

      const pad = DRUM_PAD_MAP.get(event.code as DrumKeyCode);

      if (!pad) return;

      if (event.repeat || heldCodes.has(pad.code)) return;

      event.preventDefault();

      heldCodes.add(pad.code);
      setPressedCodes(new Set(heldCodes));
      onTrigger(pad.id);
    }

    function handleKeyUp(event: KeyboardEvent) {
      const pad = DRUM_PAD_MAP.get(event.code as DrumKeyCode);

      if (!pad || !heldCodes.has(pad.code)) return;

      heldCodes.delete(pad.code);
      setPressedCodes(new Set(heldCodes));
    }

    function handleWindowBlur() {
      heldCodes.clear();
      setPressedCodes(new Set());
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [onTrigger]);

  return pressedCodes;
}
