// Terminal element types
export type TerminalElement = {
  type: string;
  props: Record<string, any>;
  children: TerminalElement[];
  text?: string;
};

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

export { createTerminalElement };
