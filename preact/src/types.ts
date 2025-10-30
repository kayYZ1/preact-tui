export interface Instance {
	type: "box" | "text";
	props: any;
	children: Instance[];
	parent?: Instance;
	yogaNode?: any;
}

//ToDo: Add types for styling props
