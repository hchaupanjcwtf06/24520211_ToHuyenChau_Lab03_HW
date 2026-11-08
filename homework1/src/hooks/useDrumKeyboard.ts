
import { useEffect, useState } from 'react';
import { DRUM_PAD_MAP } from '../data/drum-pads';
import type { DrumKeyCode, DrumSoundId } from '../types/drum';

function shouldIgnoreKeyboard(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;

  // Never hijack typing or editing.
  if (
    target.closest(
      'input, textarea, select, [contenteditable], [role="textbox"]'
    )
  ) {
    return true;
  }

  // Preserve other interactive controls.
  // Our own drum pads may still use drum shortcuts.
  const control = target.closest(
    'button, a[href], [role="button"], [role="link"]'
  );

  return control !== null &&
    !control.hasAttribute('data-drum-pad');
}

export function useDrumKeyboard(
  onTrigger: (id: DrumSoundId) => void
) {
  const [pressedCodes, setPressedCodes] =
    useState<ReadonlySet<DrumKeyCode>>(() => new Set());

  useEffect(() => {
    const heldCodes = new Set<DrumKeyCode>();

    function resetPressed() {
      if (heldCodes.size === 0) return;

      heldCodes.clear();
      setPressedCodes(new Set());
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.isComposing) return;
      if (shouldIgnoreKeyboard(event.target)) return;

      const pad = DRUM_PAD_MAP.get(
        event.code as DrumKeyCode
      );

      if (!pad) return;
      if (event.repeat || heldCodes.has(pad.code)) return;

      event.preventDefault();

      heldCodes.add(pad.code);
      setPressedCodes(new Set(heldCodes));
      onTrigger(pad.id);
    }

    function handleKeyUp(event: KeyboardEvent) {
      const pad = DRUM_PAD_MAP.get(
        event.code as DrumKeyCode
      );

      if (!pad || !heldCodes.has(pad.code)) return;

      heldCodes.delete(pad.code);
      setPressedCodes(new Set(heldCodes));
    }

    function handleVisibilityChange() {
      if (document.hidden) resetPressed();
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', resetPressed);

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', resetPressed);

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, [onTrigger]);

  return pressedCodes;
}
