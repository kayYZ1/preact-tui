import { effect, type Signal, signal } from "@preact/signals";
import { inputManager, type KeyEvent } from "../core/input";

const signalCache = new Map<string, Signal<unknown>>();
const effectCleanups = new Map<string, () => void>();

let componentId = 0;
let hookIndex = 0;

export function resetHooks() {
	componentId = 0;
	hookIndex = 0;
}

export function nextComponent() {
	componentId++;
	hookIndex = 0;
}

export function useSignal<T>(initialValue: T): Signal<T> {
	const key = `${componentId}-${hookIndex++}`;
	if (!signalCache.has(key)) {
		signalCache.set(key, signal(initialValue));
	}
	return signalCache.get(key) as Signal<T>;
}

export function useSignalEffect(fn: () => undefined | (() => void)): void {
	const key = `${componentId}-${hookIndex++}`;
	if (!effectCleanups.has(key)) {
		const cleanup = effect(() => {
			const result = fn();
			if (typeof result === "function") {
				return result;
			}
		});
		effectCleanups.set(key, cleanup);
	}
}

export function cleanupEffects() {
	for (const cleanup of effectCleanups.values()) {
		cleanup();
	}

	effectCleanups.clear();
	signalCache.clear();

	componentId = 0;
	hookIndex = 0;
}

export interface UseTextInputOptions {
	value: Signal<string>;
	cursorPosition: Signal<number>;
	focused?: boolean;
	onChange?: (value: string) => void;
}

export function useTextInput(options: UseTextInputOptions) {
	const key = `input-${componentId}-${hookIndex++}`;

	if (!effectCleanups.has(key) && options.focused !== false) {
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
			} else if (event.ctrl && event.key === "a") {
				options.cursorPosition.value = 0;
			} else if (event.ctrl && event.key === "e") {
				options.cursorPosition.value = value.length;
			} else if (event.key.length === 1 && !event.ctrl && !event.meta) {
				const newValue = value.slice(0, cursor) + event.key + value.slice(cursor);
				options.value.value = newValue;
				options.cursorPosition.value = cursor + 1;
				options.onChange?.(newValue);
			}
		});

		effectCleanups.set(key, cleanup);
	}

	return {
		value: options.value,
		cursorPosition: options.cursorPosition,
	};
}
