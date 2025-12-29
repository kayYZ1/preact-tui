import { expect, test, describe } from "bun:test";
import { formatText } from "./format-text";
import Y from "yoga-layout";

describe("formatText", () => {
	test("returns empty string for non-text instances", () => {
		const instance = {
			type: "box" as const,
			props: {},
			children: [],
			yogaNode: Y.Node.create(),
		};

		expect(formatText(instance)).toBe("");
		instance.yogaNode.free();
	});

	test("applies bold styling", () => {
		const instance = {
			type: "text" as const,
			props: { children: "Hello", bold: true },
			children: [],
			yogaNode: Y.Node.create(),
		};

		const result = formatText(instance);
		expect(result).toContain("\x1b[1m");
		expect(result).toContain("Hello");
		instance.yogaNode.free();
	});
});
