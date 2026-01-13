import { describe, expect, it } from "bun:test";

function calculateCursor(cursorPos: number, width: number) {
	return {
		line: Math.floor(cursorPos / width),
		col: cursorPos % width,
	};
}

describe("TextInput cursor calculation", () => {
	it("cursor at start", () => {
		const { line, col } = calculateCursor(0, 20);
		expect(line).toBe(0);
		expect(col).toBe(0);
	});

	it("cursor in middle of first line", () => {
		const { line, col } = calculateCursor(10, 20);
		expect(line).toBe(0);
		expect(col).toBe(10);
	});

	it("cursor at end of first line", () => {
		const { line, col } = calculateCursor(19, 20);
		expect(line).toBe(0);
		expect(col).toBe(19);
	});

	it("cursor wraps to second line", () => {
		const { line, col } = calculateCursor(20, 20);
		expect(line).toBe(1);
		expect(col).toBe(0);
	});

	it("cursor in middle of second line", () => {
		const { line, col } = calculateCursor(25, 20);
		expect(line).toBe(1);
		expect(col).toBe(5);
	});

	it("cursor on third line", () => {
		const { line, col } = calculateCursor(45, 20);
		expect(line).toBe(2);
		expect(col).toBe(5);
	});

	it("handles narrow width", () => {
		const { line, col } = calculateCursor(7, 3);
		expect(line).toBe(2);
		expect(col).toBe(1);
	});
});
