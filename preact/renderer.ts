import { type VNode } from "preact";
import { Terminal } from "../core/terminal";
import type { Instance } from "./src/types";
import Y from "yoga-layout";
import { renderText } from "./renderers/text";
import { renderBox } from "./renderers/box";

export class Renderer {
  terminal: Terminal;
  rootInstance: Instance | null = null;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
  }

  renderInstance(
    instance: Instance,
  ): Array<{ x: number; y: number; text: string }> {
    if (instance.type === "text") {
      return renderText(instance);
    } else {
      return renderBox(instance, this.renderInstance.bind(this));
    }
  }

  createInstanceTree(vnode: VNode): Instance {
    if (typeof vnode.type === "function") {
      const childVNode = (vnode.type as any)(vnode.props);
      return this.createInstanceTree(childVNode);
    }

    const type =
      typeof vnode.type === "string" ? (vnode.type as "box" | "text") : "box";
    const instance: Instance = {
      type,
      props: vnode.props,
      children: [],
    };

    instance.yogaNode = Y.Node.create();

    if (type === "text") {
      const text = instance.props.children || "";
      instance.yogaNode.setWidth(text.length);
      instance.yogaNode.setHeight(1);
    } else {
      if (instance.props.flexDirection === "row") {
        instance.yogaNode.setFlexDirection(0); // ROW
      } else {
        instance.yogaNode.setFlexDirection(1); // COLUMN
      }
      if (instance.props.padding) {
        instance.yogaNode.setPadding(Y.EDGE_ALL, instance.props.padding);
      }
      if (instance.props.width)
        instance.yogaNode.setWidth(instance.props.width);
      if (instance.props.height)
        instance.yogaNode.setHeight(instance.props.height);
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
        };
        childInstance.yogaNode = Y.Node.create();
        const text = childInstance.props.children;
        childInstance.yogaNode.setWidth(text.length);
        childInstance.yogaNode.setHeight(1);
        instance.children.push(childInstance);
        instance.yogaNode.insertChild(
          childInstance.yogaNode,
          instance.children.length - 1,
        );
      } else if (child && typeof child === "object" && child.type) {
        const childInstance = this.createInstanceTree(child);
        instance.children.push(childInstance);
        instance.yogaNode.insertChild(
          childInstance.yogaNode,
          instance.children.length - 1,
        );
      }
    }

    return instance;
  }

  render(vnode: VNode) {
    this.rootInstance = this.createInstanceTree(vnode);
    this.rootInstance.yogaNode.setWidth(this.terminal.width);
    this.rootInstance.yogaNode.setHeight(this.terminal.height);
    this.rootInstance.yogaNode.calculateLayout(
      this.terminal.width,
      this.terminal.height,
      Y.DIRECTION_LTR,
    );
    const positions = this.renderInstance(this.rootInstance);
    this.terminal.render(positions);
  }
}

export function render(vnode: VNode, terminal: Terminal) {
  const renderer = new Renderer(terminal);
  renderer.render(vnode);
  return {
    rerender: (newVNode: VNode) => renderer.render(newVNode),
    unmount: () => terminal.clear(),
  };
}
