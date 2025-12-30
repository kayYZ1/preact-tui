import { effect, type Signal, signal } from "@preact/signals";

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
