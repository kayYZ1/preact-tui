import { assertEquals } from "@std/assert";

function calculateCursor(cursorPos: number, width: number) {
	return {
		line: Math.floor(cursorPos / width),
		col: cursorPos % width,
	};
}

Deno.test("TextInput cursor calculation - cursor at start", () => {
	const { line, col } = calculateCursor(0, 20);
	assertEquals(line, 0);
	assertEquals(col, 0);
});

Deno.test("TextInput cursor calculation - cursor in middle of first line", () => {
	const { line, col } = calculateCursor(10, 20);
	assertEquals(line, 0);
	assertEquals(col, 10);
});

Deno.test("TextInput cursor calculation - cursor at end of first line", () => {
	const { line, col } = calculateCursor(19, 20);
	assertEquals(line, 0);
	assertEquals(col, 19);
});

Deno.test("TextInput cursor calculation - cursor wraps to second line", () => {
	const { line, col } = calculateCursor(20, 20);
	assertEquals(line, 1);
	assertEquals(col, 0);
});

Deno.test("TextInput cursor calculation - cursor in middle of second line", () => {
	const { line, col } = calculateCursor(25, 20);
	assertEquals(line, 1);
	assertEquals(col, 5);
});

Deno.test("TextInput cursor calculation - cursor on third line", () => {
	const { line, col } = calculateCursor(45, 20);
	assertEquals(line, 2);
	assertEquals(col, 5);
});

Deno.test("TextInput cursor calculation - handles narrow width", () => {
	const { line, col } = calculateCursor(7, 3);
	assertEquals(line, 2);
	assertEquals(col, 1);
});
