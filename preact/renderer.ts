import { type VNode } from "preact";
import { effect } from "@preact/signals";
import Y from "yoga-layout";
import { Terminal } from "../core/terminal";
import type { Instance, Position, RenderContext } from "./src/types";
import { getRenderer } from "./renderers";
import { resetHooks, cleanupEffects } from "./hooks";

export class Renderer {
	terminal: Terminal;
	rootInstance: Instance | null = null;
	disposeEffect: (() => void) | null = null;

	constructor(terminal: Terminal) {
		this.terminal = terminal;
	}

	renderInstance(instance: Instance, parentX = 0, parentY = 0): Position[] {
		const context: RenderContext = {
			parentX,
			parentY,
			renderInstance: this.renderInstance.bind(this),
		};

		const renderer = getRenderer(instance.type);
		return renderer(instance, context);
	}

	freeYogaNodes(instance: Instance) {
		for (const child of instance.children) {
			this.freeYogaNodes(child);
		}
		instance.yogaNode.free();
	}

	createInstanceTree(vnode: VNode): Instance {
		if (typeof vnode.type === "function") {
			const childVNode = (vnode.type as any)(vnode.props);
			return this.createInstanceTree(childVNode);
		}

		const type = typeof vnode.type === "string" ? (vnode.type as "box" | "text") : "box";
		const instance: Instance = {
			type,
			props: vnode.props,
			children: [],
			yogaNode: Y.Node.create(),
		};

		if (instance.type === "text") {
			const text = instance.props.children || "";
			instance.yogaNode.setWidth(text.length);
			instance.yogaNode.setHeight(1);
		} else {
			if (instance.props.flex) {
				instance.yogaNode.setFlex(Number(instance.props.flex));
			}

			if (instance.props.flexDirection === "row") {
				instance.yogaNode.setFlexDirection(Y.FLEX_DIRECTION_ROW);
			} else if (instance.props.flexDirection === "column") {
				instance.yogaNode.setFlexDirection(Y.FLEX_DIRECTION_COLUMN);
			} else if (instance.props.flexDirection === "row-reverse") {
				instance.yogaNode.setFlexDirection(Y.FLEX_DIRECTION_ROW_REVERSE);
			} else if (instance.props.flexDirection === "column-reverse") {
				instance.yogaNode.setFlexDirection(Y.FLEX_DIRECTION_COLUMN_REVERSE);
			}

			if (instance.props.justifyContent) {
				switch (instance.props.justifyContent) {
					case "flex-start":
						instance.yogaNode.setJustifyContent(Y.JUSTIFY_FLEX_START);
						break;
					case "center":
						instance.yogaNode.setJustifyContent(Y.JUSTIFY_CENTER);
						break;
					case "flex-end":
						instance.yogaNode.setJustifyContent(Y.JUSTIFY_FLEX_END);
						break;
					case "space-between":
						instance.yogaNode.setJustifyContent(Y.JUSTIFY_SPACE_BETWEEN);
						break;
					case "space-around":
						instance.yogaNode.setJustifyContent(Y.JUSTIFY_SPACE_AROUND);
						break;
					case "space-evenly":
						instance.yogaNode.setJustifyContent(Y.JUSTIFY_SPACE_EVENLY);
						break;
				}
			}

			if (instance.props.alignItems) {
				switch (instance.props.alignItems) {
					case "flex-start":
						instance.yogaNode.setAlignItems(Y.ALIGN_FLEX_START);
						break;
					case "center":
						instance.yogaNode.setAlignItems(Y.ALIGN_CENTER);
						break;
					case "flex-end":
						instance.yogaNode.setAlignItems(Y.ALIGN_FLEX_END);
						break;
					case "stretch":
						instance.yogaNode.setAlignItems(Y.ALIGN_STRETCH);
						break;
					case "baseline":
						instance.yogaNode.setAlignItems(Y.ALIGN_BASELINE);
						break;
				}
			}

			if (instance.props.gap) {
				const isRowDirection =
					instance.props.flexDirection === "row" || instance.props.flexDirection === "row-reverse";
				const gutter = isRowDirection ? Y.GUTTER_COLUMN : Y.GUTTER_ROW;
				instance.yogaNode.setGap(gutter, instance.props.gap);
			}

			if (instance.props.padding) {
				instance.yogaNode.setPadding(Y.EDGE_ALL, instance.props.padding);
			}

			if (instance.props.width) instance.yogaNode.setWidth(instance.props.width);
			if (instance.props.height) instance.yogaNode.setHeight(instance.props.height);
		}

		const children = Array.isArray(vnode.props.children)
			? vnode.props.children
			: [vnode.props.children].filter(Boolean);
		for (const child of children) {
			if (typeof child === "string" || typeof child === "number") {
				const childInstance: Instance = {
					type: "text",
					props: { children: child.toString() },
					children: [],
					yogaNode: Y.Node.create(),
				};
				const text = childInstance.props.children;
				childInstance.yogaNode.setWidth(text.length);
				childInstance.yogaNode.setHeight(1);
				instance.children.push(childInstance);
				instance.yogaNode.insertChild(childInstance.yogaNode, instance.children.length - 1);
			} else if (child && typeof child === "object" && child.type) {
				const childInstance = this.createInstanceTree(child);
				instance.children.push(childInstance);
				instance.yogaNode.insertChild(childInstance.yogaNode, instance.children.length - 1);
			}
		}

		return instance;
	}

	commitRender(vnode: VNode) {
		if (this.rootInstance) {
			this.freeYogaNodes(this.rootInstance);
		}
		this.rootInstance = this.createInstanceTree(vnode);
		this.rootInstance.yogaNode.setWidth(this.terminal.width);
		this.rootInstance.yogaNode.setHeight(this.terminal.height);
		this.rootInstance.yogaNode.calculateLayout(this.terminal.width, this.terminal.height, Y.DIRECTION_LTR);
		const positions = this.renderInstance(this.rootInstance, 0, 0);
		this.terminal.render(positions);
	}

	render(createVNode: () => VNode) {
		this.disposeEffect = effect(() => {
			resetHooks();
			const vnode = createVNode();
			this.commitRender(vnode);
		});
	}

	unmount() {
		if (this.disposeEffect) {
			this.disposeEffect();
			this.disposeEffect = null;
		}
		if (this.rootInstance) {
			this.freeYogaNodes(this.rootInstance);
			this.rootInstance = null;
		}
		cleanupEffects();
		this.terminal.clear();
	}
}

export function render(createVNode: () => VNode, terminal: Terminal) {
	const renderer = new Renderer(terminal);
	renderer.render(createVNode);
	return {
		rerender: () => renderer.render(createVNode),
		unmount: () => renderer.unmount(),
	};
}

export function run(createVNode: () => VNode) {
	const terminal = new Terminal();
	const { unmount } = render(createVNode, terminal);

	process.on("SIGINT", () => {
		unmount();
		process.exit();
	});

	process.stdin.resume();

	return { unmount };
}
