import type { Signal } from "@preact/signals-core";

export interface TextState {
	value: Signal<string>;
	cursorPosition: Signal<number>;
}

export function insertChar(state: TextState, char: string) {
	const { value, cursorPosition } = state;
	const cursor = cursorPosition.value;
	const newValue = value.value.slice(0, cursor) + char + value.value.slice(cursor);
	value.value = newValue;
	cursorPosition.value = cursor + 1;
	return newValue;
}

export function deleteBackward(state: TextState): string | null {
	const { value, cursorPosition } = state;
	const cursor = cursorPosition.value;
	if (cursor <= 0) return null;

	const newValue = value.value.slice(0, cursor - 1) + value.value.slice(cursor);
	value.value = newValue;
	cursorPosition.value = cursor - 1;
	return newValue;
}

export function deleteForward(state: TextState): string | null {
	const { value, cursorPosition } = state;
	const cursor = cursorPosition.value;
	if (cursor >= value.value.length) return null;

	const newValue = value.value.slice(0, cursor) + value.value.slice(cursor + 1);
	value.value = newValue;
	return newValue;
}

export function moveCursor(state: TextState, delta: number) {
	const { value, cursorPosition } = state;
	const newPos = Math.max(0, Math.min(value.value.length, cursorPosition.value + delta));
	cursorPosition.value = newPos;
}

export function setCursor(state: TextState, position: number) {
	const { value, cursorPosition } = state;
	cursorPosition.value = Math.max(0, Math.min(value.value.length, position));
}
