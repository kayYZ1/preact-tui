import Y from "yoga-layout";

export interface Cell {
  char: string;
  style: string;
}

export interface Position {
  x: number;
  y: number;
  text: string;
}

export interface RenderContext {
  parentX: number;
  parentY: number;
  renderInstance: (instance: Instance, parentX: number, parentY: number) => Position[];
}

export type ElementRenderer<T extends Instance = Instance> = (instance: T, context: RenderContext) => Position[];

export interface BaseProps {
  /** Child elements */
  children?: any;
}

export interface BoxProps extends BaseProps {
  /** Flex grow factor or boolean to enable flex */
  flex?: number | boolean;
  /** Direction of flex layout */
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  /** Space between child elements */
  gap?: number;
  /** Inner padding */
  padding?: number;
  /** Width of the element */
  width?: number;
  /** Height of the element */
  height?: number;
  /** Alignment along the main axis */
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
  /** Alignment along the cross axis */
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
  /** Whether flex items wrap */
  flexWrap?: "wrap" | "wrap-reverse" | "nowrap";
  /** Border of the element */
  border?: "straight" | "dash";
  /** Thickness of the border (default: 1) */
  borderWidth?: number;
  /** Color of the border */
  borderColor?: string;
}

export interface TextProps extends BaseProps {
  /** Text color */
  color?: string;
  /** Whether text is bold */
  bold?: boolean;
  /** Whether text is italic */
  italic?: boolean;
  /** Whether text is underlined */
  underline?: boolean;
  /** Whether text has strikethrough */
  strikethrough?: boolean;
}

export type Instance =
  | {
    /** Type of the instance */
    type: "box";
    /** Properties for the box */
    props: BoxProps;
    /** Child instances */
    children: Instance[];
    /** Yoga layout node */
    yogaNode: ReturnType<typeof Y.Node.create>;
  }
  | {
    /** Type of the instance */
    type: "text";
    /** Properties for the text */
    props: TextProps;
    /** Child instances */
    children: Instance[];
    /** Yoga layout node */
    yogaNode: ReturnType<typeof Y.Node.create>;
  };
