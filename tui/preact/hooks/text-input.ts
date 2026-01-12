import type { Signal } from "@preact/signals-core";
import { inputManager, type KeyEvent } from "../../core/input";
import { getHookKey, hasCleanup, setCleanup } from "./signals";

interface UseTextInputOptions {
	value: Signal<string>;
	cursorPosition: Signal<number>;
	focused?: boolean;
	onChange?: (value: string) => void;
}

export function useTextInput(options: UseTextInputOptions) {
	const key = getHookKey("input-");

	if (!hasCleanup(key) && options.focused !== false) {
		const cleanup = inputManager.onKey((event: KeyEvent) => {
			if (!options.focused) return;

			const value = options.value.value;
			const cursor = options.cursorPosition.value;

			if (event.key === "backspace") {
				if (cursor > 0) {
					const newValue = value.slice(0, cursor - 1) + value.slice(cursor);
					options.value.value = newValue;
					options.cursorPosition.value = cursor - 1;
					options.onChange?.(newValue);
				}
			} else if (event.key === "delete" || (event.ctrl && event.key === "d")) {
				if (cursor < value.length) {
					const newValue = value.slice(0, cursor) + value.slice(cursor + 1);
					options.value.value = newValue;
					options.onChange?.(newValue);
				}
			} else if (event.key.length === 1 && !event.ctrl && !event.meta) {
				const newValue = value.slice(0, cursor) + event.key + value.slice(cursor);
				options.value.value = newValue;
				options.cursorPosition.value = cursor + 1;
				options.onChange?.(newValue);
			}
		});

		setCleanup(key, cleanup);
	}

	return {
		value: options.value,
		cursorPosition: options.cursorPosition,
	};
}
