import { describe, expect, it } from "bun:test";
import { signal } from "@preact/signals-core";
import {
	deleteBackward,
	deleteForward,
	insertChar,
	moveCursor,
	setCursor,
	type TextState,
} from "../preact/hooks/text-utils";

function createState(value = "", cursor = 0): TextState {
	return {
		value: signal(value),
		cursorPosition: signal(cursor),
	};
}

describe("insertChar", () => {
	it("inserts at cursor position", () => {
		const state = createState("ac", 1);
		insertChar(state, "b");
		expect(state.value.value).toBe("abc");
		expect(state.cursorPosition.value).toBe(2);
	});

	it("inserts at start", () => {
		const state = createState("bc", 0);
		insertChar(state, "a");
		expect(state.value.value).toBe("abc");
		expect(state.cursorPosition.value).toBe(1);
	});

	it("inserts at end", () => {
		const state = createState("ab", 2);
		insertChar(state, "c");
		expect(state.value.value).toBe("abc");
		expect(state.cursorPosition.value).toBe(3);
	});
});

describe("deleteBackward", () => {
	it("deletes character before cursor", () => {
		const state = createState("abc", 2);
		const result = deleteBackward(state);
		expect(result).toBe("ac");
		expect(state.value.value).toBe("ac");
		expect(state.cursorPosition.value).toBe(1);
	});

	it("returns null at start of string", () => {
		const state = createState("abc", 0);
		const result = deleteBackward(state);
		expect(result).toBeNull();
		expect(state.value.value).toBe("abc");
	});
});

describe("deleteForward", () => {
	it("deletes character at cursor", () => {
		const state = createState("abc", 1);
		const result = deleteForward(state);
		expect(result).toBe("ac");
		expect(state.value.value).toBe("ac");
		expect(state.cursorPosition.value).toBe(1);
	});

	it("returns null at end of string", () => {
		const state = createState("abc", 3);
		const result = deleteForward(state);
		expect(result).toBeNull();
		expect(state.value.value).toBe("abc");
	});
});

describe("moveCursor", () => {
	it("moves cursor forward", () => {
		const state = createState("abc", 0);
		moveCursor(state, 2);
		expect(state.cursorPosition.value).toBe(2);
	});

	it("moves cursor backward", () => {
		const state = createState("abc", 2);
		moveCursor(state, -1);
		expect(state.cursorPosition.value).toBe(1);
	});

	it("clamps to start", () => {
		const state = createState("abc", 1);
		moveCursor(state, -5);
		expect(state.cursorPosition.value).toBe(0);
	});

	it("clamps to end", () => {
		const state = createState("abc", 1);
		moveCursor(state, 10);
		expect(state.cursorPosition.value).toBe(3);
	});
});

describe("setCursor", () => {
	it("sets cursor to position", () => {
		const state = createState("abc", 0);
		setCursor(state, 2);
		expect(state.cursorPosition.value).toBe(2);
	});

	it("clamps to bounds", () => {
		const state = createState("abc", 0);
		setCursor(state, 100);
		expect(state.cursorPosition.value).toBe(3);

		setCursor(state, -5);
		expect(state.cursorPosition.value).toBe(0);
	});
});
