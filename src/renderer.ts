import { VNode } from "preact";

// Terminal element types
type TerminalElement = {
  type: string;
  props: Record<string, any>;
  children: TerminalElement[];
  text?: string;
};

// Basic terminal renderer
class TerminalRenderer {
  private root: TerminalElement | null = null;

  constructor() {
    this.setupStdout();
  }

  private setupStdout() {
    // Hide cursor
    process.stdout.write("\x1b[?25l");

    // Clear screen
    process.stdout.write("\x1b[2J\x1b[H");

    // Handle exit
    const cleanup = () => {
      process.stdout.write("\x1b[?25h"); // Show cursor
      process.stdout.write("\x1b[2J\x1b[H"); // Clear screen and move to home
    };

    process.on("exit", cleanup);
    process.on("SIGINT", () => {
      cleanup();
      process.exit(0);
    });
  }

  render(element: TerminalElement) {
    this.root = element;
    this.paint();
  }

  private paint() {
    // Clear screen and move to home
    process.stdout.write("\x1b[2J\x1b[H");

    if (this.root) {
      this.renderElement(this.root, 0, 0);
    }
  }

  private renderElement(
    element: TerminalElement,
    row: number,
    col: number,
  ): number {
    let currentRow = row;

    if (element.text) {
      // Move cursor to position and write text
      process.stdout.write(`\x1b[${currentRow + 1};${col + 1}H${element.text}`);
      currentRow++;
    }

    for (const child of element.children) {
      currentRow = this.renderElement(child, currentRow, col);
    }

    return currentRow;
  }
}

// Create a Preact reconciler
let renderer: TerminalRenderer | null = null;

function createTerminalElement(vnode: any): TerminalElement {
  // Handle null/undefined
  if (vnode == null) {
    return {
      type: "empty",
      props: {},
      children: [],
    };
  }

  // Handle primitive values (strings, numbers, booleans)
  if (typeof vnode !== "object") {
    return {
      type: "text",
      props: {},
      children: [],
      text: String(vnode),
    };
  }

  // Handle function components - execute them
  if (typeof vnode.type === "function") {
    const result = vnode.type(vnode.props || {});
    return createTerminalElement(result);
  }

  const element: TerminalElement = {
    type: typeof vnode.type === "string" ? vnode.type : "component",
    props: vnode.props || {},
    children: [],
  };

  // Handle children
  const children = vnode.props?.children;
  if (children != null) {
    const childArray = Array.isArray(children) ? children : [children];
    element.children = childArray
      .filter((child) => child != null)
      .map((child) => createTerminalElement(child));
  }

  return element;
}

export function render(vnode: VNode) {
  if (!renderer) {
    renderer = new TerminalRenderer();
  }

  const terminalElement = createTerminalElement(vnode);
  renderer.render(terminalElement);
}
