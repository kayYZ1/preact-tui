import { describe, expect, it } from "bun:test";
import { Fragment, jsx, jsxs } from "../preact/jsx-runtime";

describe("jsx", () => {
	it("creates VNode with string type", () => {
		const node = jsx("box", { width: 10 });
		expect(node.type).toBe("box");
		expect(node.props.width).toBe(10);
	});

	it("creates VNode with function type", () => {
		const Component = (props: { name: string }) => jsx("text", { children: props.name });
		const node = jsx(Component, { name: "test" });
		expect(typeof node.type).toBe("function");
		expect(node.props.name).toBe("test");
	});

	it("handles children prop", () => {
		const node = jsx("box", { children: "hello" });
		expect(node.props.children).toBe("hello");
	});

	it("handles array children", () => {
		const children = [jsx("text", { children: "a" }), jsx("text", { children: "b" })];
		const node = jsxs("box", { children });
		expect(Array.isArray(node.props.children)).toBe(true);
		expect(node.props.children.length).toBe(2);
	});
});

describe("Fragment", () => {
	it("creates fragment VNode", () => {
		const node = Fragment({ children: jsx("text", { children: "hi" }) });
		expect(node.type).toBe("fragment");
		expect(node.props.children).toBeDefined();
	});
});
