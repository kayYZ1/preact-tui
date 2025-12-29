import { expect, test, describe, mock } from "bun:test";
import { Terminal } from "./terminal";

describe("Terminal", () => {
	test("creates with default dimensions", () => {
		const mockStdout = {
			write: mock(() => {}),
			columns: 80,
			rows: 24,
		};

		const terminal = new Terminal(mockStdout as any);

		expect(terminal.width).toBe(80);
		expect(terminal.height).toBe(24);
	});

	test("render writes positions to buffer", () => {
		const writes: string[] = [];
		const mockStdout = {
			write: (str: string) => writes.push(str),
			columns: 10,
			rows: 5,
		};

		const terminal = new Terminal(mockStdout as any);
		terminal.render([{ x: 0, y: 0, text: "Hi" }]);

		expect(writes.length).toBeGreaterThan(0);
	});
});
