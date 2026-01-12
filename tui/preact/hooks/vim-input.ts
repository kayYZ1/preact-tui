import type { Signal } from "@preact/signals-core";
import { inputManager, type KeyEvent } from "../../core/input";
import { getHookKey, hasCleanup, setCleanup } from "./signals";

export type VimMode = "NORMAL" | "INSERT";

interface UseVimInputOptions {
	value: Signal<string>;
	cursorPosition: Signal<number>;
	mode: Signal<VimMode>;
	focused?: boolean;
	onChange?: (value: string) => void;
	onModeChange?: (mode: VimMode) => void;
}

export function useVimInput(options: UseVimInputOptions) {
	const key = getHookKey("vim-input-");

	if (!hasCleanup(key) && options.focused !== false) {
		const cleanup = inputManager.onKey((event: KeyEvent) => {
			if (!options.focused) return;

			const value = options.value.value;
			const cursor = options.cursorPosition.value;
			const mode = options.mode.value;

			if (mode === "INSERT") {
				if (event.key === "escape") {
					options.mode.value = "NORMAL";
					options.onModeChange?.("NORMAL");
					if (cursor > 0) {
						options.cursorPosition.value = cursor - 1;
					}
					return;
				}

				if (event.key === "backspace") {
					if (cursor > 0) {
						const newValue = value.slice(0, cursor - 1) + value.slice(cursor);
						options.value.value = newValue;
						options.cursorPosition.value = cursor - 1;
						options.onChange?.(newValue);
					}
					return;
				}

				if (event.key.length === 1 && !event.ctrl && !event.meta) {
					const newValue = value.slice(0, cursor) + event.key + value.slice(cursor);
					options.value.value = newValue;
					options.cursorPosition.value = cursor + 1;
					options.onChange?.(newValue);
				}
				return;
			}

			if (mode === "NORMAL") {
				switch (event.key) {
					case "i":
						options.mode.value = "INSERT";
						options.onModeChange?.("INSERT");
						break;
					case "a":
						options.mode.value = "INSERT";
						options.onModeChange?.("INSERT");
						if (cursor < value.length) {
							options.cursorPosition.value = cursor + 1;
						}
						break;
					case "A":
						options.mode.value = "INSERT";
						options.onModeChange?.("INSERT");
						options.cursorPosition.value = value.length;
						break;
					case "I":
						options.mode.value = "INSERT";
						options.onModeChange?.("INSERT");
						options.cursorPosition.value = 0;
						break;
					case "h":
						if (cursor > 0) {
							options.cursorPosition.value = cursor - 1;
						}
						break;
					case "l":
						if (cursor < value.length - 1) {
							options.cursorPosition.value = cursor + 1;
						}
						break;
					case "0":
						options.cursorPosition.value = 0;
						break;
					case "$":
						options.cursorPosition.value = Math.max(0, value.length - 1);
						break;
					case "w": {
						const rest = value.slice(cursor);
						const match = rest.match(/^\s*\S*\s*/);
						if (match && match[0].length > 0) {
							const newPos = Math.min(cursor + match[0].length, value.length - 1);
							options.cursorPosition.value = Math.max(0, newPos);
						}
						break;
					}
					case "b": {
						const before = value.slice(0, cursor);
						const match = before.match(/\S+\s*$/);
						if (match) {
							options.cursorPosition.value = cursor - match[0].length;
						} else {
							options.cursorPosition.value = 0;
						}
						break;
					}
					case "x":
						if (cursor < value.length) {
							const newValue = value.slice(0, cursor) + value.slice(cursor + 1);
							options.value.value = newValue;
							options.onChange?.(newValue);
							if (cursor >= newValue.length && cursor > 0) {
								options.cursorPosition.value = cursor - 1;
							}
						}
						break;
				}
			}
		});

		setCleanup(key, cleanup);
	}

	return {
		value: options.value,
		cursorPosition: options.cursorPosition,
		mode: options.mode,
	};
}
