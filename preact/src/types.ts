import Y from "yoga-layout";

export interface BaseProps {
	children?: any;
}

export interface BoxProps extends BaseProps {
	flex?: number | boolean;
	flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
	gap?: number;
	padding?: number;
	width?: number;
	height?: number;
	justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
	alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
	flexWrap?: "wrap" | "wrap-reverse" | "nowrap";
}

export interface TextProps extends BaseProps {
	color?: string;
	bold?: boolean;
	italic?: boolean;
}

export type ComponentProps = BoxProps | TextProps;

export interface Instance {
	type: "box" | "text";
	props: ComponentProps;
	children: Instance[];
	yogaNode: ReturnType<typeof Y.Node.create>;
}
