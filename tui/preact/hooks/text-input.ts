import type { Signal } from "@preact/signals-core";
import { inputManager, type KeyEvent } from "../../core/input";
import { getHookKey, hasCleanup, setCleanup } from "./signals";
import { deleteBackward, deleteForward, insertChar, type TextState } from "./text-utils";
import { handleEscape, handleNormalMode, type VimContext, type VimMode } from "./vim-bindings";

interface UseTextInputOptions {
	value: Signal<string>;
	cursorPosition: Signal<number>;
	focused?: boolean;
	onChange?: (value: string) => void;
	onSubmit?: (value: string) => void;
	/** If provided, enables vim mode with NORMAL/INSERT states */
	mode?: Signal<VimMode>;
	onModeChange?: (mode: VimMode) => void;
}

function handleInsertMode(event: KeyEvent, state: TextState, options: UseTextInputOptions): boolean {
	// Handle escape when vim mode is active
	if (options.mode && event.key === "escape") {
		return handleEscape({
			state,
			mode: options.mode,
			onModeChange: options.onModeChange,
		});
	}

	if (event.key === "enter") {
		options.onSubmit?.(state.value.value);
		return true;
	}

	if (event.key === "backspace") {
		const newValue = deleteBackward(state);
		if (newValue !== null) options.onChange?.(newValue);
		return true;
	}

	if (event.key === "delete" || (event.ctrl && event.key === "d")) {
		const newValue = deleteForward(state);
		if (newValue !== null) options.onChange?.(newValue);
		return true;
	}

	if (event.key.length === 1 && !event.ctrl && !event.meta) {
		const newValue = insertChar(state, event.key);
		options.onChange?.(newValue);
		return true;
	}

	return false;
}

export function useTextInput(options: UseTextInputOptions) {
  const key = getHookKey("input-");

  if (!hasCleanup(key) && options.focused !== false) {
    const state: TextState = { value: options.value, cursorPosition: options.cursorPosition };

    const cleanup = inputManager.onKey((event: KeyEvent) => {
      if (options.focused === false) return;

      // Vim mode: check current mode
      if (options.mode) {
        if (options.mode.value === "NORMAL") {
          const vimCtx: VimContext = {
            state,
            mode: options.mode,
            onChange: options.onChange,
            onModeChange: options.onModeChange,
          };
          handleNormalMode(event, vimCtx);
          return;
        }
      }

      // INSERT mode (or no vim mode)
      handleInsertMode(event, state, options);
    });

    setCleanup(key, cleanup);
  }

  return {
    value: options.value,
    cursorPosition: options.cursorPosition,
    mode: options.mode,
  };
}

export type { VimMode };
