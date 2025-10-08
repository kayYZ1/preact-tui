import { type VNode } from "preact";
import { Terminal } from "../core/terminal";
import { Colors, bold } from "../core/format";
import type { Instance } from "./src/types";

export class Renderer {
  terminal: Terminal;
  rootInstance: Instance | null = null;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
  }

  renderInstance(instance: Instance, offsetY = 0): string[] {
    let lines: string[] = [];

    if (instance.type === "text") {
      let text = instance.props.children || "";
      if (
        typeof instance.props.color === "string" &&
        Colors[instance.props.color as keyof typeof Colors]
      ) {
        text = Colors[instance.props.color as keyof typeof Colors](text);
      }
      if (instance.props.bold) text = bold(text);
      // Add more: underline, italic, etc.
      lines = [text.slice(0, this.terminal.width)]; // Truncate to terminal width
    } else if (instance.type === "box") {
      const direction = instance.props.flexDirection || "column";
      let currentRow = "";
      for (const child of instance.children) {
        const childLines = this.renderInstance(child, offsetY + lines.length);
        if (direction === "row") {
          // Concat horizontally, truncate if too wide
          if (!lines[0]) lines[0] = "";
          const remainingWidth = this.terminal.width - currentRow.length;
          const childText = childLines[0]?.slice(0, remainingWidth) || "";
          currentRow += childText;
          lines[0] = currentRow;
        } else {
          // Stack vertically
          lines.push(...childLines);
        }
      }
      // Apply padding if specified
      if (instance.props.padding) {
        const pad = " ".repeat(instance.props.padding);
        lines = lines.map((line) => pad + line);
      }
    }

    return lines;
  }

  createInstanceTree(vnode: VNode): Instance {
    const type =
      typeof vnode.type === "string" ? (vnode.type as "box" | "text") : "box";
    const instance: Instance = {
      type,
      props: vnode.props,
      children: [],
    };

    const children = Array.isArray(vnode.props.children)
      ? vnode.props.children
      : [vnode.props.children].filter(Boolean);
    for (const child of children) {
      if (typeof child === "string" || typeof child === "number") {
        instance.children.push({
          type: "text",
          props: { children: child.toString() },
          children: [],
        });
      } else if (child.type) {
        instance.children.push(this.createInstanceTree(child));
      }
    }

    return instance;
  }

  render(vnode: VNode) {
    this.rootInstance = this.createInstanceTree(vnode);
    const lines = this.renderInstance(this.rootInstance);
    this.terminal.render(lines);
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
