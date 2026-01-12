import { describe, expect, it } from "bun:test";
import { wrapText, splitText } from "../core/primitives/wrap-text";

describe("wrapText", () => {
	it("wraps long text at word boundaries", () => {
		const result = wrapText("hello world foo", 10);
		expect(result).toEqual(["hello", "world foo"]);
	});

	it("breaks words longer than width", () => {
		const result = wrapText("abcdefghij", 4);
		expect(result).toEqual(["abcd", "efgh", "ij"]);
	});

	it("handles empty string", () => {
		const result = wrapText("", 10);
		expect(result).toEqual([""]);
	});

	it("handles width of 0", () => {
		const result = wrapText("hello", 0);
		expect(result).toEqual([]);
	});

	it("preserves single words shorter than width", () => {
		const result = wrapText("hi", 10);
		expect(result).toEqual(["hi"]);
	});
});

describe("splitText", () => {
	it("splits text at exact character boundaries", () => {
		const result = splitText("abcdefghij", 4);
		expect(result).toEqual(["abcd", "efgh", "ij"]);
	});

	it("handles text shorter than width", () => {
		const result = splitText("abc", 10);
		expect(result).toEqual(["abc"]);
	});

	it("handles empty string", () => {
		const result = splitText("", 10);
		expect(result).toEqual([""]);
	});

	it("handles exact width match", () => {
		const result = splitText("abcd", 4);
		expect(result).toEqual(["abcd"]);
	});
});
