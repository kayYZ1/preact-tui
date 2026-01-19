import { effect } from "@preact/signals-core";
import Y from "yoga-layout";
import { inputManager } from "../core/input";
import { wrapText } from "../core/primitives/wrap-text";
import { Terminal } from "../core/terminal";
import { getElement } from "./elements";
import { clearPendingCursor, getPendingCursor } from "./elements/text-input";
import { cleanupEffects, nextComponent, resetHooks } from "./hooks/signals";
import type { VNode } from "./jsx-runtime";
import type { Instance, Position, RenderContext } from "./types/index";

const FLEX_DIRECTION_MAP = {
	row: Y.FLEX_DIRECTION_ROW,
	column: Y.FLEX_DIRECTION_COLUMN,
	"row-reverse": Y.FLEX_DIRECTION_ROW_REVERSE,
	"column-reverse": Y.FLEX_DIRECTION_COLUMN_REVERSE,
} as const;

const JUSTIFY_CONTENT_MAP = {
	"flex-start": Y.JUSTIFY_FLEX_START,
	center: Y.JUSTIFY_CENTER,
	"flex-end": Y.JUSTIFY_FLEX_END,
	"space-between": Y.JUSTIFY_SPACE_BETWEEN,
	"space-around": Y.JUSTIFY_SPACE_AROUND,
	"space-evenly": Y.JUSTIFY_SPACE_EVENLY,
} as const;

const ALIGN_ITEMS_MAP = {
	"flex-start": Y.ALIGN_FLEX_START,
	center: Y.ALIGN_CENTER,
	"flex-end": Y.ALIGN_FLEX_END,
	stretch: Y.ALIGN_STRETCH,
	baseline: Y.ALIGN_BASELINE,
} as const;

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

		const element = getElement(instance.type);
		return element(instance, context);
	}

	freeYogaNodes(instance: Instance) {
		for (const child of instance.children) {
			this.freeYogaNodes(child);
		}
		instance.yogaNode.free();
	}

	applyBoxLayout(instance: Extract<Instance, { type: "box" }>) {
		const { yogaNode, props } = instance;
		if (props.flex) yogaNode.setFlex(Number(props.flex));
		if (props.flexDirection) yogaNode.setFlexDirection(FLEX_DIRECTION_MAP[props.flexDirection]);
		if (props.justifyContent) yogaNode.setJustifyContent(JUSTIFY_CONTENT_MAP[props.justifyContent]);
		if (props.alignItems) yogaNode.setAlignItems(ALIGN_ITEMS_MAP[props.alignItems]);
		if (props.gap) {
			const isRow = props.flexDirection === "row" || props.flexDirection === "row-reverse";
			yogaNode.setGap(isRow ? Y.GUTTER_COLUMN : Y.GUTTER_ROW, props.gap);
		}
		if (props.padding) yogaNode.setPadding(Y.EDGE_ALL, props.padding);
		if (props.height) yogaNode.setHeight(props.height);
		if (props.width) yogaNode.setWidth(props.width);
		if (props.border) yogaNode.setBorder(Y.EDGE_ALL, 1);
	}

	applyTextLayout(instance: Extract<Instance, { type: "text" }>) {
		const text = instance.props.children || "";
		const width = instance.props.width;
		const height = instance.props.height;

		if (width) {
			const lines = wrapText(text, width);
			instance.yogaNode.setWidth(width);
			instance.yogaNode.setHeight(Math.min(lines.length, height || Infinity));
		} else if (height) {
			instance.yogaNode.setHeight(height);
		}
	}

	applyTextInputLayout(instance: Extract<Instance, { type: "textInput" }>) {
		if (instance.props.width) {
			instance.yogaNode.setWidth(instance.props.width);
		}

		const height = instance.props.height;
		if (height !== undefined) {
			instance.yogaNode.setHeight(height);
		} else {
			instance.yogaNode.setMeasureFunc((width) => {
				const value = instance.props.value || instance.props.placeholder || "";
				const lines = wrapText(value, Math.floor(width));
				return { width, height: Math.max(1, lines.length) };
			});
		}
	}

	createInstanceTree(vnode: VNode): Instance {
		if (typeof vnode.type === "function") {
			nextComponent();
			const childVNode = (vnode.type as any)(vnode.props);
			return this.createInstanceTree(childVNode);
		}

		const type = typeof vnode.type === "string" ? vnode.type : "box";
		const instance = {
			type,
			props: vnode.props,
			children: [] as Instance[],
			yogaNode: Y.Node.create(),
		} as Instance;

		switch (instance.type) {
			case "text":
				this.applyTextLayout(instance);
				break;
			case "textInput":
				this.applyTextInputLayout(instance);
				break;
			case "box":
				this.applyBoxLayout(instance);
				break;
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
		clearPendingCursor();
		this.rootInstance = this.createInstanceTree(vnode);
		this.rootInstance.yogaNode.setWidth(this.terminal.width);
		this.rootInstance.yogaNode.setHeight(this.terminal.height);
		this.rootInstance.yogaNode.calculateLayout(this.terminal.width, this.terminal.height, Y.DIRECTION_LTR);
		const positions = this.renderInstance(this.rootInstance, 0, 0);
		this.terminal.render(positions);

		const cursor = getPendingCursor();
		if (cursor?.visible) {
			this.terminal.setCursorPosition(cursor.x, cursor.y);
			this.terminal.showCursor();
		} else {
			this.terminal.hideCursor();
		}
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

	inputManager.start();

	const cleanup = inputManager.onKey((event: { key: string; ctrl: boolean }) => {
		if (event.ctrl && event.key === "c") {
			cleanup();
			inputManager.stop();
			unmount();
			process.exit();
		}
	});

	return {
		unmount: () => {
			cleanup();
			inputManager.stop();
			unmount();
		},
		terminal,
	};
}
