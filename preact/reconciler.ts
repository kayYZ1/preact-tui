import type { VNode } from "preact";
import Yoga from "yoga-layout";

type Instance = {
  type: "box" | "text";
  props: any;
  children: Instance[];
  yogaNode?: Yoga;
};
