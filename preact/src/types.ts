import type { VNode } from "preact";

export interface Instance {
  type: "box" | "text";
  props: any;
  children: Instance[];
  parent?: Instance;
  yogaNode?: any;
}
